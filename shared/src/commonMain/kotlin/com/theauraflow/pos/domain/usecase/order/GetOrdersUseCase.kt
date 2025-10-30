package com.theauraflow.pos.domain.usecase.order

import com.theauraflow.pos.domain.model.Order
import com.theauraflow.pos.domain.model.OrderStatus
import com.theauraflow.pos.domain.repository.OrderRepository

/**
 * Use case for retrieving orders with various filters.
 *
 * Business logic:
 * - Provides convenient filtering methods
 * - Sorts orders by date (newest first)
 */
class GetOrdersUseCase(
    private val orderRepository: OrderRepository
) {
    /**
     * Get all orders (with optional limit).
     */
    suspend operator fun invoke(limit: Int = 50): Result<List<Order>> {
        return orderRepository.getOrders(limit = limit)
            .map { orders ->
                orders.sortedByDescending { it.createdAt }
            }
    }

    /**
     * Get orders for a specific customer.
     */
    suspend fun forCustomer(customerId: String, limit: Int = 50): Result<List<Order>> {
        return orderRepository.getOrders(customerId = customerId, limit = limit)
            .map { orders ->
                orders.sortedByDescending { it.createdAt }
            }
    }

    /**
     * Get today's orders.
     */
    suspend fun today(): Result<List<Order>> {
        return orderRepository.getTodaysOrders()
            .map { orders ->
                orders.sortedByDescending { it.createdAt }
            }
    }

    /**
     * Get orders by status.
     */
    suspend fun byStatus(status: OrderStatus, limit: Int = 50): Result<List<Order>> {
        return orderRepository.getOrders(status = status, limit = limit)
            .map { orders ->
                orders.sortedByDescending { it.createdAt }
            }
    }

    /**
     * Get orders for a date range.
     */
    suspend fun forDateRange(
        startDate: Long,
        endDate: Long,
        limit: Int = 100
    ): Result<List<Order>> {
        return orderRepository.getOrders(
            startDate = startDate,
            endDate = endDate,
            limit = limit
        ).map { orders ->
            orders.sortedByDescending { it.createdAt }
        }
    }
}
