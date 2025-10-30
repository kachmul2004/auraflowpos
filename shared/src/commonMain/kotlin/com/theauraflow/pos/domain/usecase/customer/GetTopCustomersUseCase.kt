package com.theauraflow.pos.domain.usecase.customer

import com.theauraflow.pos.domain.model.Customer
import com.theauraflow.pos.domain.repository.CustomerRepository

/**
 * Use case for retrieving top customers by total spent
 *
 * Useful for:
 * - Loyalty program rewards
 * - Marketing campaigns
 * - Customer analytics
 */
class GetTopCustomersUseCase(
    private val customerRepository: CustomerRepository
) {
    /**
     * Gets top customers by total spent
     *
     * @param limit Maximum number of customers to return (default: 10)
     * @return Result with list of top customers or error
     */
    suspend operator fun invoke(limit: Int = 10): Result<List<Customer>> {
        // Validate limit
        if (limit < 1) {
            return Result.failure(
                IllegalArgumentException("Limit must be at least 1")
            )
        }

        // Get top customers
        return customerRepository.getTopCustomers(limit)
    }
}