package com.auraflow.pos.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.auraflow.pos.core.Constants
import com.auraflow.pos.core.ErrorMessages
import com.auraflow.pos.core.SuccessMessages
import com.auraflow.pos.data.models.*
import com.auraflow.pos.data.repository.POSRepository
import com.auraflow.pos.domain.subscription.SubscriptionManager
import com.auraflow.pos.domain.usecase.CartUseCases
import com.auraflow.pos.domain.usecase.OrderUseCases
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

/**
 * Main ViewModel for POS operations
 * Manages state and business logic for the POS screen
 */
class POSViewModel(
    private val repository: POSRepository,
    private val cartUseCases: CartUseCases,
    private val orderUseCases: OrderUseCases,
    private val subscriptionManager: SubscriptionManager
) : ViewModel() {
    
    // ============================================================================
    // STATE
    // ============================================================================
    
    val products = repository.products
    val cart = repository.cart
    val currentUser = repository.currentUser
    val businessProfile = repository.businessProfile
    val orderType = repository.orderType
    val discount = repository.discount
    
    private val _selectedCategory = MutableStateFlow("all")
    val selectedCategory: StateFlow<String> = _selectedCategory.asStateFlow()
    
    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()
    
    private val _uiState = MutableStateFlow<POSUiState>(POSUiState.Idle)
    val uiState: StateFlow<POSUiState> = _uiState.asStateFlow()
    
    private val _snackbarMessage = MutableSharedFlow<String>()
    val snackbarMessage: SharedFlow<String> = _snackbarMessage.asSharedFlow()
    
    // ============================================================================
    // COMPUTED PROPERTIES
    // ============================================================================
    
    val filteredProducts: StateFlow<List<Product>> = combine(
        products,
        _selectedCategory,
        _searchQuery
    ) { productList, category, query ->
        var filtered = if (category == "all") {
            productList
        } else {
            productList.filter { it.category == category }
        }
        
        if (query.length >= Constants.SEARCH_MIN_CHARS) {
            filtered = filtered.filter { product ->
                product.name.contains(query, ignoreCase = true) ||
                product.sku?.contains(query, ignoreCase = true) == true ||
                product.barcode?.contains(query, ignoreCase = true) == true
            }
        }
        
        filtered
    }.stateIn(
        viewModelScope,
        SharingStarted.WhileSubscribed(5000),
        emptyList()
    )
    
    val cartSummary: StateFlow<CartSummary> = combine(
        cart,
        discount,
        businessProfile
    ) { items, cartDiscount, profile ->
        val subtotal = items.sumOf { it.totalPrice }
        
        val discountAmount = when (cartDiscount?.type) {
            DiscountType.PERCENTAGE -> subtotal * (cartDiscount.value / 100)
            DiscountType.FIXED -> cartDiscount.value
            else -> 0.0
        }
        
        val taxableAmount = subtotal - discountAmount
        val tax = taxableAmount * profile.taxRate
        val total = taxableAmount + tax
        
        CartSummary(
            itemCount = items.sumOf { it.quantity },
            subtotal = subtotal,
            discount = discountAmount,
            tax = tax,
            total = total
        )
    }.stateIn(
        viewModelScope,
        SharingStarted.WhileSubscribed(5000),
        CartSummary()
    )
    
    // ============================================================================
    // ACTIONS - PRODUCT SELECTION
    // ============================================================================
    
    fun selectCategory(category: String) {
        _selectedCategory.value = category
    }
    
    fun setSearchQuery(query: String) {
        _searchQuery.value = query
    }
    
    fun clearSearch() {
        _searchQuery.value = ""
    }
    
    // ============================================================================
    // ACTIONS - CART
    // ============================================================================
    
    fun addToCart(product: Product, quantity: Int = 1) {
        viewModelScope.launch {
            cartUseCases.addProductToCart(product, quantity)
                .onSuccess {
                    _snackbarMessage.emit("${product.name} added to cart")
                }
                .onFailure { error ->
                    _snackbarMessage.emit(error.message ?: ErrorMessages.GENERIC_ERROR)
                }
        }
    }
    
    fun addCustomItemToCart(cartItem: CartItem) {
        viewModelScope.launch {
            cartUseCases.addItemToCart(cartItem)
                .onSuccess {
                    _snackbarMessage.emit("Item added to cart")
                }
                .onFailure { error ->
                    _snackbarMessage.emit(error.message ?: ErrorMessages.GENERIC_ERROR)
                }
        }
    }
    
    fun updateQuantity(itemId: String, quantity: Int) {
        viewModelScope.launch {
            cartUseCases.updateItemQuantity(itemId, quantity)
        }
    }
    
    fun removeFromCart(itemId: String) {
        viewModelScope.launch {
            cartUseCases.removeItemFromCart(itemId)
            _snackbarMessage.emit("Item removed from cart")
        }
    }
    
    fun clearCart() {
        viewModelScope.launch {
            cartUseCases.clearCart()
            _snackbarMessage.emit("Cart cleared")
        }
    }
    
    // ============================================================================
    // ACTIONS - ORDER
    // ============================================================================
    
    fun setOrderType(type: OrderType) {
        cartUseCases.setOrderType(type)
    }
    
    fun applyDiscount(discount: ItemDiscount) {
        viewModelScope.launch {
            cartUseCases.applyDiscount(discount)
                .onSuccess {
                    _snackbarMessage.emit("Discount applied")
                }
                .onFailure { error ->
                    _snackbarMessage.emit(error.message ?: ErrorMessages.GENERIC_ERROR)
                }
        }
    }
    
    fun removeDiscount() {
        cartUseCases.removeDiscount()
    }
    
    fun createOrder(
        paymentMethods: List<PaymentMethod>,
        tip: Double = 0.0,
        customer: Customer? = null,
        notes: String? = null
    ) {
        viewModelScope.launch {
            _uiState.value = POSUiState.Processing
            
            orderUseCases.createOrder(paymentMethods, tip, customer, notes)
                .onSuccess { order ->
                    _uiState.value = POSUiState.OrderCompleted(order)
                    _snackbarMessage.emit(SuccessMessages.ORDER_CREATED)
                }
                .onFailure { error ->
                    _uiState.value = POSUiState.Error(error.message ?: ErrorMessages.GENERIC_ERROR)
                    _snackbarMessage.emit(error.message ?: ErrorMessages.GENERIC_ERROR)
                }
        }
    }
    
    fun holdOrder(customer: Customer? = null, notes: String? = null) {
        viewModelScope.launch {
            orderUseCases.holdOrder(customer, notes)
                .onSuccess {
                    _snackbarMessage.emit(SuccessMessages.ORDER_HELD)
                }
                .onFailure { error ->
                    _snackbarMessage.emit(error.message ?: ErrorMessages.GENERIC_ERROR)
                }
        }
    }
    
    fun resetUiState() {
        _uiState.value = POSUiState.Idle
    }
    
    // ============================================================================
    // ACTIONS - SUBSCRIPTION
    // ============================================================================
    
    fun hasFeature(feature: String): Boolean {
        return subscriptionManager.hasFeature(feature)
    }
    
    fun getOrderTypes(): List<String> {
        return subscriptionManager.getOrderTypesForIndustry()
    }
}

// ============================================================================
// UI STATE
// ============================================================================

sealed class POSUiState {
    object Idle : POSUiState()
    object Processing : POSUiState()
    data class OrderCompleted(val order: Order) : POSUiState()
    data class Error(val message: String) : POSUiState()
}

data class CartSummary(
    val itemCount: Int = 0,
    val subtotal: Double = 0.0,
    val discount: Double = 0.0,
    val tax: Double = 0.0,
    val total: Double = 0.0
)
