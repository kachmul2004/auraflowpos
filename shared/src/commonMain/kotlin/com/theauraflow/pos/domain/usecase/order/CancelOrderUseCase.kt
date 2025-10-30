package com.theauraflow.pos.domain.usecase.order

import com.theauraflow.pos.domain.model.Order
import com.theauraflow.pos.domain.repository.OrderRepository

/**
 * Use case for canceling an order
 *
 * Business Rules:
 * - Only pending or preparing orders can be canceled
 * - Completed orders must be refunded instead
 * - Requires authorization for certain statuses
 */
class CancelOrderUseCase(
    private val orderRepository: OrderRepository
) {
    /**
     * Cancels an order
     *
     * @param orderId The ID of the order to cancel
     * @param reason Cancellation reason
     * @return Result with updated order or validation error
     */
    suspend operator fun invoke(
        orderId: String,
        reason: String
    ): Result<Order> {
        return orderRepository.cancelOrder(orderId, reason)
    }
}