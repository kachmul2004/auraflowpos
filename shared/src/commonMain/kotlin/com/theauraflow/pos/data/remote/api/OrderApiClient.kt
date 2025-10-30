package com.theauraflow.pos.data.remote.api

import com.theauraflow.pos.data.remote.dto.OrderDto
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.request.get
import io.ktor.client.request.parameter
import io.ktor.client.request.post
import io.ktor.client.request.put
import io.ktor.client.request.setBody

/**
 * API client for order-related endpoints.
 */
class OrderApiClient(
    private val client: HttpClient
) {
    /**
     * Create a new order.
     */
    suspend fun createOrder(order: OrderDto): OrderDto {
        return client.post("api/orders") {
            setBody(order)
        }.body()
    }

    /**
     * Get an order by ID.
     */
    suspend fun getOrderById(id: String): OrderDto {
        return client.get("api/orders/$id").body()
    }

    /**
     * Get orders with optional filters.
     */
    suspend fun getOrders(
        customerId: String? = null,
        status: String? = null,
        startDate: Long? = null,
        endDate: Long? = null,
        limit: Int = 50
    ): List<OrderDto> {
        return client.get("api/orders") {
            customerId?.let { parameter("customer_id", it) }
            status?.let { parameter("status", it) }
            startDate?.let { parameter("start_date", it) }
            endDate?.let { parameter("end_date", it) }
            parameter("limit", limit)
        }.body()
    }

    /**
     * Get today's orders.
     */
    suspend fun getTodaysOrders(): List<OrderDto> {
        return client.get("api/orders/today").body()
    }

    /**
     * Cancel an order.
     */
    suspend fun cancelOrder(id: String, reason: String): OrderDto {
        return client.put("api/orders/$id/cancel") {
            setBody(mapOf("reason" to reason))
        }.body()
    }

    /**
     * Refund an order.
     */
    suspend fun refundOrder(id: String, amount: Double, reason: String): OrderDto {
        return client.put("api/orders/$id/refund") {
            setBody(
                mapOf(
                    "amount" to amount,
                    "reason" to reason
                )
            )
        }.body()
    }

    /**
     * Get order statistics for a date range.
     */
    suspend fun getOrderStatistics(startDate: Long, endDate: Long): OrderStatisticsDto {
        return client.get("api/orders/statistics") {
            parameter("start_date", startDate)
            parameter("end_date", endDate)
        }.body()
    }
}

/**
 * DTO for order statistics response.
 */
@kotlinx.serialization.Serializable
data class OrderStatisticsDto(
    @kotlinx.serialization.SerialName("total_orders") val totalOrders: Int,
    @kotlinx.serialization.SerialName("total_revenue") val totalRevenue: Double,
    @kotlinx.serialization.SerialName("average_order_value") val averageOrderValue: Double,
    @kotlinx.serialization.SerialName("total_items_sold") val totalItemsSold: Int,
    @kotlinx.serialization.SerialName("orders_by_payment_method") val ordersByPaymentMethod: Map<String, Int>
)