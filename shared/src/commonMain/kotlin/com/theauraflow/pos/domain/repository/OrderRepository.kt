package com.theauraflow.pos.domain.repository

import com.theauraflow.pos.domain.model.Order
import com.theauraflow.pos.domain.model.OrderStatus
import com.theauraflow.pos.domain.model.PaymentMethod
import kotlinx.coroutines.flow.Flow

/**
 * Repository interface for order/transaction operations.
 *
 * Manages order creation, retrieval, and history.
 */
interface OrderRepository {

    /**
     * Create a new order from current cart.
     *
     * @param customerId Optional customer ID
     * @param paymentMethod Payment method used
     * @param amountPaid Amount paid by customer (for cash payments)
     * @param notes Optional order notes
     * @return Result with created order or error
     */
    suspend fun createOrder(
        customerId: String? = null,
        paymentMethod: PaymentMethod,
        amountPaid: Double? = null,
        notes: String? = null
    ): Result<Order>

    /**
     * Get an order by ID.
     *
     * @param orderId Order ID
     * @return Result with order or error
     */
    suspend fun getOrderById(orderId: String): Result<Order>

    /**
     * Get orders with optional filters.
     *
     * @param customerId Optional filter by customer
     * @param status Optional filter by status
     * @param startDate Optional start date filter (timestamp)
     * @param endDate Optional end date filter (timestamp)
     * @param limit Maximum number of orders to return
     * @return Result with list of orders or error
     */
    suspend fun getOrders(
        customerId: String? = null,
        status: OrderStatus? = null,
        startDate: Long? = null,
        endDate: Long? = null,
        limit: Int = 50
    ): Result<List<Order>>

    /**
     * Observe orders as a Flow.
     *
     * @return Flow emitting list of orders
     */
    fun observeOrders(): Flow<List<Order>>

    /**
     * Get today's orders.
     *
     * @return Result with today's orders or error
     */
    suspend fun getTodaysOrders(): Result<List<Order>>

    /**
     * Cancel an order.
     * Requires manager/admin permissions.
     *
     * @param orderId Order ID
     * @param reason Cancellation reason
     * @return Result with updated order or error
     */
    suspend fun cancelOrder(orderId: String, reason: String): Result<Order>

    /**
     * Refund an order.
     * Requires manager/admin permissions.
     *
     * @param orderId Order ID
     * @param amount Amount to refund (partial or full)
     * @param reason Refund reason
     * @return Result with updated order or error
     */
    suspend fun refundOrder(
        orderId: String,
        amount: Double,
        reason: String
    ): Result<Order>

    /**
     * Get order statistics for a date range.
     *
     * @param startDate Start date timestamp
     * @param endDate End date timestamp
     * @return Result with order statistics or error
     */
    suspend fun getOrderStatistics(
        startDate: Long,
        endDate: Long
    ): Result<OrderStatistics>

    /**
     * Sync orders with server.
     *
     * @return Result with success or error
     */
    suspend fun syncOrders(): Result<Unit>
}

/**
 * Data class representing order statistics.
 */
data class OrderStatistics(
    val totalOrders: Int,
    val totalRevenue: Double,
    val averageOrderValue: Double,
    val totalItemsSold: Int,
    val ordersByPaymentMethod: Map<PaymentMethod, Int>
)
