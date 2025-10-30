package com.theauraflow.pos.data.repository

import com.theauraflow.pos.data.remote.api.OrderApiClient
import com.theauraflow.pos.data.remote.dto.toDomain
import com.theauraflow.pos.data.remote.dto.toDto
import com.theauraflow.pos.domain.model.Order
import com.theauraflow.pos.domain.model.OrderStatus
import com.theauraflow.pos.domain.model.PaymentMethod
import com.theauraflow.pos.domain.repository.OrderRepository
import com.theauraflow.pos.domain.repository.OrderStatistics
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow

/**
 * Implementation of OrderRepository.
 */
class OrderRepositoryImpl(
    private val orderApiClient: OrderApiClient
) : OrderRepository {

    private val _ordersCache = MutableStateFlow<List<Order>>(emptyList())

    override suspend fun createOrder(
        customerId: String?,
        paymentMethod: PaymentMethod,
        amountPaid: Double?,
        notes: String?
    ): Result<Order> {
        return try {
            // Note: In real implementation, this would get items from CartRepository
            // For now, this is a placeholder that expects the full order to be passed
            // You'll need to adjust based on your actual flow

            Result.failure(NotImplementedError("createOrder needs cart integration"))
        } catch (e: Exception) {
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
            Result.success(orders)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun cancelOrder(orderId: String, reason: String): Result<Order> {
        return try {
            val dto = orderApiClient.cancelOrder(orderId, reason)
            val updated = dto.toDomain()

            // Update cache
            _ordersCache.value = _ordersCache.value.map {
                if (it.id == updated.id) updated else it
            }

            Result.success(updated)
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
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}