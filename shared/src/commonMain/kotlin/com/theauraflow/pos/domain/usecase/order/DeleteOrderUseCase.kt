package com.theauraflow.pos.domain.usecase.order

import com.theauraflow.pos.domain.repository.OrderRepository

/**
 * Use case for deleting orders.
 * Should only be used by super admins with proper authorization.
 */
class DeleteOrderUseCase(
    private val orderRepository: OrderRepository
) {
    suspend operator fun invoke(
        orderId: String,
        userId: String,
        userName: String,
        reason: String
    ): Result<Unit> {
        return try {
            // Log deletion in audit trail
            println("Order $orderId deleted by $userName (ID: $userId). Reason: $reason")

            // Delete the order
            orderRepository.deleteOrder(orderId)

            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
