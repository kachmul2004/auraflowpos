package com.theauraflow.pos.domain.usecase.customer

import com.theauraflow.pos.domain.model.Customer
import com.theauraflow.pos.domain.repository.CustomerRepository

/**
 * Use case for retrieving a customer by their ID
 */
class GetCustomerUseCase(
    private val customerRepository: CustomerRepository
) {
    /**
     * Gets a customer by ID
     *
     * @param customerId The customer's unique identifier
     * @return Result with Customer or error if not found
     */
    suspend operator fun invoke(customerId: String): Result<Customer> {
        return customerRepository.getCustomerById(customerId)
    }
}