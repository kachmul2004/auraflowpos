package com.theauraflow.pos.domain.usecase.order

import com.theauraflow.pos.domain.repository.OrderRepository
import com.theauraflow.pos.domain.repository.OrderStatistics

/**
 * Use case for retrieving order statistics for a date range
 *
 * Provides analytics like:
 * - Total orders and revenue
 * - Average order value
 * - Items sold
 * - Payment method breakdown
 */
class GetOrderStatisticsUseCase(
    private val orderRepository: OrderRepository
) {
    /**
     * Gets order statistics for a date range
     *
     * @param startDate Start date timestamp (milliseconds)
     * @param endDate End date timestamp (milliseconds)
     * @return Result with order statistics or error
     */
    suspend operator fun invoke(
        startDate: Long,
        endDate: Long
    ): Result<OrderStatistics> {
        // Validate date range
        if (startDate > endDate) {
            return Result.failure(
                IllegalArgumentException("Start date cannot be after end date")
            )
        }

        // Get statistics
        return orderRepository.getOrderStatistics(startDate, endDate)
    }
}