package com.theauraflow.pos.presentation.viewmodel

import com.theauraflow.pos.domain.model.CartItem
import com.theauraflow.pos.domain.model.Discount
import com.theauraflow.pos.domain.model.Modifier
import com.theauraflow.pos.domain.model.Product
import com.theauraflow.pos.domain.repository.CartRepository
import com.theauraflow.pos.domain.repository.CartTotals
import com.theauraflow.pos.domain.usecase.cart.AddToCartUseCase
import com.theauraflow.pos.domain.usecase.cart.ApplyDiscountUseCase
import com.theauraflow.pos.domain.usecase.cart.ClearCartUseCase
import com.theauraflow.pos.domain.usecase.cart.GetCartTotalsUseCase
import com.theauraflow.pos.domain.usecase.cart.HoldCartUseCase
import com.theauraflow.pos.domain.usecase.cart.RemoveFromCartUseCase
import com.theauraflow.pos.domain.usecase.cart.RetrieveCartUseCase
import com.theauraflow.pos.domain.usecase.cart.UpdateCartItemUseCase
import com.theauraflow.pos.presentation.base.UiState
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

/**
 * UI state for cart display
 */
data class CartUiState(
    val items: List<CartItem> = emptyList(),
    val subtotal: Double = 0.0,
    val tax: Double = 0.0,
    val discount: Double = 0.0,
    val total: Double = 0.0,
    val itemCount: Int = 0
)

/**
 * ViewModel for shopping cart management.
 */
class CartViewModel(
    private val cartRepository: CartRepository,
    private val addToCartUseCase: AddToCartUseCase,
    private val updateCartItemUseCase: UpdateCartItemUseCase,
    private val removeFromCartUseCase: RemoveFromCartUseCase,
    private val clearCartUseCase: ClearCartUseCase,
    private val applyDiscountUseCase: ApplyDiscountUseCase,
    private val getCartTotalsUseCase: GetCartTotalsUseCase,
    private val holdCartUseCase: HoldCartUseCase,
    private val retrieveCartUseCase: RetrieveCartUseCase,
    private val viewModelScope: CoroutineScope
) {
    private val _cartState = MutableStateFlow<UiState<CartUiState>>(UiState.Success(CartUiState()))
    val cartState: StateFlow<UiState<CartUiState>> = _cartState.asStateFlow()

    private val _message = MutableStateFlow<String?>(null)
    val message: StateFlow<String?> = _message.asStateFlow()

    /**
     * Add product to cart.
     */
    fun addToCart(product: Product, quantity: Int = 1, modifiers: List<Modifier> = emptyList()) {
        viewModelScope.launch(Dispatchers.Default) {
            addToCartUseCase(product, quantity, modifiers)
                .onSuccess {
                    _message.value = "${product.name} added to cart"
                    updateCartState()
                }
                .onFailure { error ->
                    _message.value = error.message ?: "Failed to add to cart"
                }
        }
    }

    /**
     * Update cart item quantity.
     */
    fun updateQuantity(cartItemId: String, quantity: Int) {
        if (quantity <= 0) {
            removeFromCart(cartItemId)
            return
        }

        viewModelScope.launch(Dispatchers.Default) {
            updateCartItemUseCase(cartItemId, quantity)
                .onSuccess {
                    updateCartState()
                }
                .onFailure { error ->
                    _message.value = error.message ?: "Failed to update quantity"
                }
        }
    }

    /**
     * Remove item from cart.
     */
    fun removeFromCart(cartItemId: String) {
        viewModelScope.launch(Dispatchers.Default) {
            removeFromCartUseCase(cartItemId)
                .onSuccess {
                    _message.value = "Item removed from cart"
                    updateCartState()
                }
                .onFailure { error ->
                    _message.value = error.message ?: "Failed to remove item"
                }
        }
    }

    /**
     * Clear entire cart.
     */
    fun clearCart() {
        viewModelScope.launch(Dispatchers.Default) {
            clearCartUseCase()
                .onSuccess {
                    _message.value = "Cart cleared"
                    _cartState.value = UiState.Success(CartUiState())
                }
                .onFailure { error ->
                    _message.value = error.message ?: "Failed to clear cart"
                }
        }
    }

    /**
     * Apply discount to cart item.
     */
    fun applyDiscount(cartItemId: String, discount: Discount) {
        viewModelScope.launch(Dispatchers.Default) {
            applyDiscountUseCase(cartItemId, discount)
                .onSuccess {
                    _message.value = "Discount applied"
                    updateCartState()
                }
                .onFailure { error ->
                    _message.value = error.message ?: "Failed to apply discount"
                }
        }
    }

    /**
     * Hold current cart.
     */
    fun holdCart(name: String? = null) {
        viewModelScope.launch(Dispatchers.Default) {
            holdCartUseCase(name)
                .onSuccess { cartId ->
                    _message.value = "Cart saved: $cartId"
                    _cartState.value = UiState.Success(CartUiState())
                }
                .onFailure { error ->
                    _message.value = error.message ?: "Failed to hold cart"
                }
        }
    }

    /**
     * Retrieve held cart.
     */
    fun retrieveCart(cartId: String) {
        viewModelScope.launch(Dispatchers.Default) {
            retrieveCartUseCase(cartId)
                .onSuccess {
                    _message.value = "Cart retrieved"
                    updateCartState()
                }
                .onFailure { error ->
                    _message.value = error.message ?: "Failed to retrieve cart"
                }
        }
    }

    /**
     * Update cart state.
     */
    private fun updateCartState() {
        viewModelScope.launch(Dispatchers.Default) {
            // Get both cart items and totals
            val cartResult = kotlin.runCatching {
                val items = cartRepository.getCart().getOrNull() ?: emptyList()
                val totals = getCartTotalsUseCase().getOrNull()
                items to totals
            }

            cartResult.onSuccess { (items, totals) ->
                if (totals != null) {
                    _cartState.value = UiState.Success(
                        CartUiState(
                            items = items,
                            subtotal = totals.subtotal,
                            tax = totals.tax,
                            discount = totals.discount,
                            total = totals.total,
                            itemCount = totals.itemCount
                        )
                    )
                } else {
                    _cartState.value = UiState.Success(CartUiState(items = items))
                }
            }.onFailure {
                _cartState.value = UiState.Success(CartUiState())
            }
        }
    }

    /**
     * Clear message.
     */
    fun clearMessage() {
        _message.value = null
    }

    init {
        updateCartState()
    }
}