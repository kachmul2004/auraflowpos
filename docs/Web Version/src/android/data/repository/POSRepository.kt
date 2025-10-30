package com.auraflow.pos.data.repository

import com.auraflow.pos.data.models.*
import com.auraflow.pos.data.SampleData
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import java.time.LocalDateTime

/**
 * Repository for managing POS data and business logic
 * In a production app, this would interface with a database and/or API
 */
class POSRepository {
    
    // State flows for reactive data
    private val _products = MutableStateFlow(SampleData.products)
    val products: StateFlow<List<Product>> = _products.asStateFlow()
    
    private val _cart = MutableStateFlow<List<CartItem>>(emptyList())
    val cart: StateFlow<List<CartItem>> = _cart.asStateFlow()
    
    private val _orders = MutableStateFlow<List<Order>>(emptyList())
    val orders: StateFlow<List<Order>> = _orders.asStateFlow()
    
    private val _heldOrders = MutableStateFlow<List<HeldOrder>>(emptyList())
    val heldOrders: StateFlow<List<HeldOrder>> = _heldOrders.asStateFlow()
    
    private val _customers = MutableStateFlow(SampleData.customers)
    val customers: StateFlow<List<Customer>> = _customers.asStateFlow()
    
    private val _currentUser = MutableStateFlow<User?>(null)
    val currentUser: StateFlow<User?> = _currentUser.asStateFlow()
    
    private val _currentShift = MutableStateFlow<Shift?>(null)
    val currentShift: StateFlow<Shift?> = _currentShift.asStateFlow()
    
    private val _businessProfile = MutableStateFlow(SampleData.businessProfile)
    val businessProfile: StateFlow<BusinessProfile> = _businessProfile.asStateFlow()
    
    private val _orderType = MutableStateFlow(OrderType.DINE_IN)
    val orderType: StateFlow<OrderType> = _orderType.asStateFlow()
    
    private val _discount = MutableStateFlow<ItemDiscount?>(null)
    val discount: StateFlow<ItemDiscount?> = _discount.asStateFlow()
    
    private val _giftCards = MutableStateFlow(SampleData.giftCards)
    val giftCards: StateFlow<List<GiftCard>> = _giftCards.asStateFlow()
    
    // ============================================================================
    // CART OPERATIONS
    // ============================================================================
    
    fun addToCart(product: Product, quantity: Int = 1) {
        val newItem = CartItem(product = product, quantity = quantity)
        _cart.update { it + newItem }
    }
    
    fun addToCart(cartItem: CartItem) {
        _cart.update { it + cartItem }
    }
    
    fun updateCartItem(itemId: String, updater: (CartItem) -> CartItem) {
        _cart.update { items ->
            items.map { if (it.id == itemId) updater(it) else it }
        }
    }
    
    fun removeFromCart(itemId: String) {
        _cart.update { it.filter { item -> item.id != itemId } }
    }
    
    fun updateQuantity(itemId: String, quantity: Int) {
        if (quantity <= 0) {
            removeFromCart(itemId)
        } else {
            updateCartItem(itemId) { it.copy(quantity = quantity) }
        }
    }
    
    fun clearCart() {
        _cart.value = emptyList()
        _discount.value = null
    }
    
    fun setOrderType(type: OrderType) {
        _orderType.value = type
    }
    
    fun setDiscount(discount: ItemDiscount?) {
        _discount.value = discount
    }
    
    // ============================================================================
    // ORDER OPERATIONS
    // ============================================================================
    
    fun createOrder(
        paymentMethods: List<PaymentMethod>,
        tip: Double = 0.0,
        customer: Customer? = null,
        notes: String? = null
    ): Order? {
        if (_cart.value.isEmpty()) return null
        
        val items = _cart.value
        val subtotal = items.sumOf { it.totalPrice }
        
        val discountAmount = when (_discount.value?.type) {
            DiscountType.PERCENTAGE -> subtotal * (_discount.value!!.value / 100)
            DiscountType.FIXED -> _discount.value!!.value
            else -> 0.0
        }
        
        val taxableAmount = subtotal - discountAmount
        val tax = taxableAmount * _businessProfile.value.taxRate
        val total = taxableAmount + tax + tip
        
        val orderNumber = generateOrderNumber()
        
        val order = Order(
            orderNumber = orderNumber,
            items = items,
            subtotal = subtotal,
            discount = discountAmount,
            tax = tax,
            tip = tip,
            total = total,
            paymentMethods = paymentMethods,
            status = OrderStatus.COMPLETED,
            orderType = _orderType.value,
            customer = customer,
            employee = _currentUser.value,
            notes = notes
        )
        
        _orders.update { it + order }
        
        // Update shift totals
        _currentShift.value?.let { shift ->
            _currentShift.value = shift.copy(
                totalSales = shift.totalSales + total,
                transactions = shift.transactions + 1
            )
        }
        
        clearCart()
        return order
    }
    
    fun holdOrder(customer: Customer? = null, notes: String? = null) {
        if (_cart.value.isEmpty()) return
        
        val heldOrder = HeldOrder(
            items = _cart.value,
            customer = customer,
            notes = notes
        )
        
        _heldOrders.update { it + heldOrder }
        clearCart()
    }
    
    fun recallHeldOrder(heldOrderId: String) {
        val heldOrder = _heldOrders.value.find { it.id == heldOrderId } ?: return
        _cart.value = heldOrder.items
        _heldOrders.update { it.filter { order -> order.id != heldOrderId } }
    }
    
    fun deleteHeldOrder(heldOrderId: String) {
        _heldOrders.update { it.filter { it.id != heldOrderId } }
    }
    
    private fun generateOrderNumber(): String {
        val count = _orders.value.size + 1
        return "ORD${count.toString().padStart(6, '0')}"
    }
    
    // ============================================================================
    // USER OPERATIONS
    // ============================================================================
    
    fun login(pin: String): User? {
        val user = SampleData.users.find { it.pin == pin && it.isActive }
        _currentUser.value = user
        return user
    }
    
    fun logout() {
        _currentUser.value = null
    }
    
    // ============================================================================
    // SHIFT OPERATIONS
    // ============================================================================
    
    fun clockIn(user: User, startingCash: Double = 0.0) {
        val shift = Shift(
            userId = user.id,
            userName = user.name,
            clockIn = LocalDateTime.now(),
            startingCash = startingCash
        )
        _currentShift.value = shift
    }
    
    fun clockOut(endingCash: Double) {
        _currentShift.value?.let { shift ->
            val completedShift = shift.copy(
                clockOut = LocalDateTime.now(),
                endingCash = endingCash
            )
            _currentShift.value = null
            // In production, save to database
        }
    }
    
    // ============================================================================
    // GIFT CARD OPERATIONS
    // ============================================================================
    
    fun checkGiftCardBalance(number: String): Double {
        return _giftCards.value.find { it.number == number && it.isActive }?.balance ?: 0.0
    }
    
    fun redeemGiftCard(number: String, amount: Double): Boolean {
        val cardIndex = _giftCards.value.indexOfFirst { it.number == number }
        if (cardIndex == -1) return false
        
        val card = _giftCards.value[cardIndex]
        if (!card.isActive || card.balance < amount) return false
        
        _giftCards.update { cards ->
            cards.toMutableList().apply {
                this[cardIndex] = card.copy(balance = card.balance - amount)
            }
        }
        
        return true
    }
    
    // ============================================================================
    // PRODUCT OPERATIONS
    // ============================================================================
    
    fun getProductsByCategory(category: String): List<Product> {
        return if (category == "all") {
            _products.value
        } else {
            _products.value.filter { it.category == category }
        }
    }
    
    fun searchProducts(query: String): List<Product> {
        return _products.value.filter {
            it.name.contains(query, ignoreCase = true) ||
            it.sku?.contains(query, ignoreCase = true) == true ||
            it.barcode?.contains(query, ignoreCase = true) == true
        }
    }
    
    fun getProductByBarcode(barcode: String): Product? {
        return _products.value.find { it.barcode == barcode }
    }
    
    // ============================================================================
    // CUSTOMER OPERATIONS
    // ============================================================================
    
    fun addCustomer(customer: Customer) {
        _customers.update { it + customer }
    }
    
    fun updateCustomer(customerId: String, updater: (Customer) -> Customer) {
        _customers.update { customers ->
            customers.map { if (it.id == customerId) updater(it) else it }
        }
    }
    
    fun searchCustomers(query: String): List<Customer> {
        return _customers.value.filter {
            it.name.contains(query, ignoreCase = true) ||
            it.email?.contains(query, ignoreCase = true) == true ||
            it.phone?.contains(query, ignoreCase = true) == true
        }
    }
    
    // ============================================================================
    // ANALYTICS
    // ============================================================================
    
    fun getTodaysSales(): Double {
        val today = LocalDateTime.now().toLocalDate()
        return _orders.value
            .filter { it.timestamp.toLocalDate() == today }
            .sumOf { it.total }
    }
    
    fun getTodaysTransactionCount(): Int {
        val today = LocalDateTime.now().toLocalDate()
        return _orders.value.count { it.timestamp.toLocalDate() == today }
    }
    
    fun getOrdersByType(): Map<OrderType, Int> {
        return _orders.value.groupingBy { it.orderType }.eachCount()
    }
    
    fun getTopSellingProducts(limit: Int = 5): List<Pair<Product, Int>> {
        val productCounts = mutableMapOf<String, Int>()
        
        _orders.value.forEach { order ->
            order.items.forEach { item ->
                val count = productCounts.getOrDefault(item.product.id, 0)
                productCounts[item.product.id] = count + item.quantity
            }
        }
        
        return productCounts
            .entries
            .sortedByDescending { it.value }
            .take(limit)
            .mapNotNull { entry ->
                _products.value.find { it.id == entry.key }?.let { it to entry.value }
            }
    }
}
