package com.theauraflow.pos.data.repository

import com.theauraflow.pos.data.remote.api.OrderApiClient
import com.theauraflow.pos.data.remote.dto.toDomain
import com.theauraflow.pos.data.remote.dto.toDto
import com.theauraflow.pos.domain.model.Order
import com.theauraflow.pos.domain.model.OrderStatus
import com.theauraflow.pos.domain.model.PaymentMethod
import com.theauraflow.pos.domain.model.PaymentStatus
import com.theauraflow.pos.domain.repository.CartRepository
import com.theauraflow.pos.domain.repository.OrderRepository
import com.theauraflow.pos.domain.repository.OrderStatistics
import com.theauraflow.pos.data.local.LocalStorage
import com.theauraflow.pos.util.currentTimeMillis
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.GlobalScope
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

/**
 * Implementation of OrderRepository with LocalStorage for persistence.
 */
class OrderRepositoryImpl(
    private val orderApiClient: OrderApiClient,
    private val cartRepository: CartRepository,
    private val localStorage: LocalStorage
) : OrderRepository {

    private val _ordersCache = MutableStateFlow<List<Order>>(emptyList())
    private var orderCounter = 1000 // Start from 1000 for order numbers

    private val json = Json {
        ignoreUnknownKeys = true
        prettyPrint = false
    }

    companion object {
        private const val ORDERS_KEY = "orders"
    }

    init {
        // Load orders from storage on init - use GlobalScope to ensure it runs
        println("🏗️ OrderRepositoryImpl: Initializing...")
        GlobalScope.launch(kotlinx.coroutines.Dispatchers.Default) {
            println("📂 DEBUG: Loading orders from storage (init)...")
            loadOrdersFromStorage()
            println("📂 DEBUG: Init complete. Loaded ${_ordersCache.value.size} orders")

            // Emit the loaded orders to the flow immediately
            if (_ordersCache.value.isNotEmpty()) {
                println("📡 DEBUG: Emitting ${_ordersCache.value.size} orders to observers")
            }
        }
    }

    private suspend fun loadOrdersFromStorage() {
        try {
            println("🔍 DEBUG: Reading from localStorage...")
            val jsonString = localStorage.getString(ORDERS_KEY)
            println("🔍 DEBUG: Got JSON: ${jsonString?.take(100)}")

            if (jsonString != null) {
                println("🔍 DEBUG: Deserializing JSON...")
                val orders = json.decodeFromString<List<Order>>(jsonString)
                println("✅ DEBUG: Deserialized ${orders.size} orders")

                _ordersCache.value = orders

                // Update counter to avoid order number collisions
                val maxOrderNumber = orders.mapNotNull {
                    it.orderNumber.substringAfter("ORD-").toIntOrNull()
                }.maxOrNull() ?: 999
                orderCounter = maxOrderNumber + 1

                println("✅ DEBUG: Loaded ${orders.size} orders from storage")
                orders.forEach { order ->
                    println("   - ${order.orderNumber}: ${order.items.size} items, $${order.total}")
                }
            } else {
                println("ℹ️ DEBUG: No orders in storage yet")
            }
        } catch (e: Exception) {
            // If loading fails, start fresh
            println("❌ Failed to load orders: ${e.message}")
            e.printStackTrace()
        }
    }

    private suspend fun saveOrdersToStorage() {
        try {
            val jsonString = json.encodeToString(_ordersCache.value)
            localStorage.saveString(ORDERS_KEY, jsonString)
        } catch (e: Exception) {
            println("Failed to save orders: ${e.message}")
        }
    }

    override suspend fun createOrder(
        customerId: String?,
        paymentMethod: PaymentMethod,
        amountPaid: Double?,
        notes: String?
    ): Result<Order> {
        return try {
            println("🏁 OrderRepository.createOrder() - START")

            // Get current cart items and totals
            val cartItems = cartRepository.getCart().getOrThrow()
            println("🛒 Cart has ${cartItems.size} items:")
            cartItems.forEach { item ->
                println("   - ${item.product.name} x${item.quantity} = $${item.total}")
            }

            val totals = cartRepository.getCartTotals().getOrThrow()
            println("💰 Cart totals: subtotal=$${totals.subtotal}, tax=$${totals.tax}, total=$${totals.total}")

            // Create order with actual cart data
            val orderNumber = "ORD-${orderCounter++}"
            val now = currentTimeMillis()

            val order = Order(
                id = "local-${kotlin.random.Random.nextInt(10000, 99999)}",
                orderNumber = orderNumber,
                customerId = customerId,
                items = cartItems, // Real cart items!
                subtotal = totals.subtotal,
                discount = totals.discount,
                tax = totals.tax,
                total = totals.total,
                orderStatus = OrderStatus.COMPLETED,
                paymentMethod = paymentMethod,
                paymentStatus = PaymentStatus.PAID,
                notes = notes,
                createdAt = now,
                completedAt = now
            )

            println("✅ Order created: ${order.orderNumber}")
            println("   Items: ${order.items.size}")
            order.items.forEach { item ->
                println("   - ${item.product.name} x${item.quantity}")
            }
            println("   Total: $${order.total}")

            // Add to cache
            _ordersCache.value = listOf(order) + _ordersCache.value
            println("📦 Added to cache. Cache now has ${_ordersCache.value.size} orders")

            // Persist to storage
            println("💾 Saving to storage...")
            saveOrdersToStorage()
            println("✅ Saved to storage successfully")

            Result.success(order)
        } catch (e: Exception) {
            println("❌ Order creation failed: ${e.message}")
            e.printStackTrace()
            Result.failure(e)
        }
    }

    override suspend fun getOrderById(orderId: String): Result<Order> {
        return try {
            // Check cache first
            _ordersCache.value.find { it.id == orderId }?.let {
                return Result.success(it)
            }

            // Fetch from API
            val dto = orderApiClient.getOrderById(orderId)
            val order = dto.toDomain()

            // Update cache
            _ordersCache.value = _ordersCache.value + order

            Result.success(order)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getOrders(
        customerId: String?,
        status: OrderStatus?,
        startDate: Long?,
        endDate: Long?,
        limit: Int
    ): Result<List<Order>> {
        return try {
            val dtos = orderApiClient.getOrders(
                customerId = customerId,
                status = status?.name?.lowercase(),
                startDate = startDate,
                endDate = endDate,
                limit = limit
            )
            val orders = dtos.map { it.toDomain() }

            // Update cache with latest orders
            _ordersCache.value = orders

            // Persist to storage
            saveOrdersToStorage()

            Result.success(orders)
        } catch (e: Exception) {
            if (_ordersCache.value.isNotEmpty()) {
                // Apply filters to cached data
                var filtered = _ordersCache.value

                customerId?.let { id ->
                    filtered = filtered.filter { it.customerId == id }
                }
                status?.let { s ->
                    filtered = filtered.filter { it.orderStatus == s }
                }

                Result.success(filtered.take(limit))
            } else {
                Result.failure(e)
            }
        }
    }

    override fun observeOrders(): Flow<List<Order>> {
        return _ordersCache.asStateFlow()
    }

    override suspend fun getTodaysOrders(): Result<List<Order>> {
        return try {
            val dtos = orderApiClient.getTodaysOrders()
            val orders = dtos.map { it.toDomain() }

            // Update cache with latest orders
            _ordersCache.value = orders

            // Persist to storage
            saveOrdersToStorage()

            Result.success(orders)
        } catch (e: Exception) {
            if (_ordersCache.value.isNotEmpty()) {
                val now = currentTimeMillis()
                val todayOrders = _ordersCache.value.filter { it.createdAt >= now - 86400000 }
                Result.success(todayOrders)
            } else {
                Result.failure(e)
            }
        }
    }

    override suspend fun cancelOrder(orderId: String, reason: String): Result<Order> {
        return try {
            // Try API call first
            try {
                val dto = orderApiClient.cancelOrder(orderId, reason)
                val updated = dto.toDomain()

                // Update cache with API response
                _ordersCache.value = _ordersCache.value.map {
                    if (it.id == updated.id) updated else it
                }

                // Persist to storage
                saveOrdersToStorage()

                return Result.success(updated)
            } catch (apiError: Exception) {
                // Fallback: Update order status locally if API fails
                val order = _ordersCache.value.find { it.id == orderId }
                if (order != null) {
                    val cancelledOrder = order.copy(
                        orderStatus = OrderStatus.CANCELLED,
                        paymentStatus = PaymentStatus.REFUNDED
                    )
                    _ordersCache.value = _ordersCache.value.map {
                        if (it.id == orderId) cancelledOrder else it
                    }
                    saveOrdersToStorage()
                    Result.success(cancelledOrder)
                } else {
                    Result.failure(apiError)
                }
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun deleteOrder(orderId: String): Result<Unit> {
        return try {
            // Remove from cache
            _ordersCache.value = _ordersCache.value.filter { it.id != orderId }

            // Persist to storage
            saveOrdersToStorage()

            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun refundOrder(
        orderId: String,
        amount: Double,
        reason: String
    ): Result<Order> {
        return try {
            val dto = orderApiClient.refundOrder(orderId, amount, reason)
            val updated = dto.toDomain()

            // Update cache
            _ordersCache.value = _ordersCache.value.map {
                if (it.id == updated.id) updated else it
            }

            // Persist to storage
            saveOrdersToStorage()

            Result.success(updated)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getOrderStatistics(
        startDate: Long,
        endDate: Long
    ): Result<OrderStatistics> {
        return try {
            val dto = orderApiClient.getOrderStatistics(startDate, endDate)

            // Convert string keys to PaymentMethod enum
            val ordersByPaymentMethod = dto.ordersByPaymentMethod.mapKeys {
                PaymentMethod.valueOf(it.key.uppercase())
            }

            val statistics = OrderStatistics(
                totalOrders = dto.totalOrders,
                totalRevenue = dto.totalRevenue,
                averageOrderValue = dto.averageOrderValue,
                totalItemsSold = dto.totalItemsSold,
                ordersByPaymentMethod = ordersByPaymentMethod
            )

            Result.success(statistics)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun syncOrders(): Result<Unit> {
        return try {
            // Fetch all orders and update cache
            val dtos = orderApiClient.getOrders()
            val orders = dtos.map { it.toDomain() }
            _ordersCache.value = orders

            // Persist to storage
            saveOrdersToStorage()

            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}