package com.theauraflow.pos.domain.usecase.customer

import com.theauraflow.pos.domain.model.Customer
import com.theauraflow.pos.domain.repository.CustomerRepository

/**
 * Use case for updating customer loyalty points
 *
 * Business Rules:
 * - Points can be added (earned) or subtracted (redeemed)
 * - Cannot result in negative points
 */
class UpdateLoyaltyPointsUseCase(
    private val customerRepository: CustomerRepository
) {
    /**
     * Updates a customer's loyalty points
     *
     * @param customerId The customer's ID
     * @param pointsDelta The points to add (positive) or redeem (negative)
     * @return Result with updated customer or error
     */
    suspend operator fun invoke(
        customerId: String,
        pointsDelta: Int
    ): Result<Customer> {
        return if (pointsDelta >= 0) {
            // Add points
            customerRepository.addLoyaltyPoints(customerId, pointsDelta)
        } else {
            // Redeem points (convert negative to positive)
            customerRepository.redeemLoyaltyPoints(customerId, -pointsDelta)
        }
    }
}