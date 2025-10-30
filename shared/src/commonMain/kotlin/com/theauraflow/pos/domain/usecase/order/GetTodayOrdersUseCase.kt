package com.theauraflow.pos.domain.usecase.order

import com.theauraflow.pos.domain.model.Order
import com.theauraflow.pos.domain.repository.OrderRepository
import kotlinx.coroutines.flow.Flow

/**
 * Use case for retrieving today's orders in real-time
 *
 * Returns a Flow for reactive updates as new orders come in
 */
class GetTodayOrdersUseCase(
    private val orderRepository: OrderRepository
) {
    /**
     * Gets today's orders
     *
     * @return Result with list of today's orders or error
     */
    suspend operator fun invoke(): Result<List<Order>> {
        return orderRepository.getTodaysOrders()
    }
}