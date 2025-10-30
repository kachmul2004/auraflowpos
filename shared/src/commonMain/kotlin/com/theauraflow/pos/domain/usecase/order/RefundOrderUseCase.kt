package com.theauraflow.pos.domain.usecase.order

import com.theauraflow.pos.domain.model.Order
import com.theauraflow.pos.domain.repository.OrderRepository

/**
 * Use case for processing order refunds
 *
 * Business Rules:
 * - Only completed orders can be refunded
 * - Refund amount cannot exceed order total
 * - Requires manager/admin authorization
 * - Updates customer loyalty points if applicable
 */
class RefundOrderUseCase(
    private val orderRepository: OrderRepository
) {
    /**
     * Processes a refund for an order
     *
     * @param orderId The ID of the order to refund
     * @param amount The amount to refund (partial or full)
     * @param reason The reason for the refund
     * @return Result with updated order or validation error
     */
    suspend operator fun invoke(
        orderId: String,
        amount: Double,
        reason: String
    ): Result<Order> {
        // Validate refund amount is positive
        if (amount <= 0) {
            return Result.failure(
                IllegalArgumentException("Refund amount must be positive")
            )
        }

        // Validate reason is provided
        if (reason.isBlank()) {
            return Result.failure(
                IllegalArgumentException("Refund reason is required")
            )
        }

        // Get the order to validate refund amount
        val order = orderRepository.getOrderById(orderId).getOrElse {
            return Result.failure(it)
        }

        // Validate refund amount doesn't exceed order total
        if (amount > order.total) {
            return Result.failure(
                IllegalArgumentException(
                    "Refund amount ($amount) cannot exceed order total (${order.total})"
                )
            )
        }

        // Process refund
        return orderRepository.refundOrder(orderId, amount, reason)
    }
}