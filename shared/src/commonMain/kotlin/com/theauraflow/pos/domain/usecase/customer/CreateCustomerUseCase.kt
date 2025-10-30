package com.theauraflow.pos.domain.usecase.customer

import com.theauraflow.pos.domain.model.Customer
import com.theauraflow.pos.domain.repository.CustomerRepository

/**
 * Use case for creating a new customer
 *
 * Business Rules:
 * - Name is required
 * - Email must be valid format if provided
 * - Phone must be valid format if provided
 * - Email or phone must be unique
 */
class CreateCustomerUseCase(
    private val customerRepository: CustomerRepository
) {
    /**
     * Creates a new customer
     *
     * @param customer The customer to create
     * @return Result with created customer or validation error
     */
    suspend operator fun invoke(customer: Customer): Result<Customer> {
        // Validate name
        if (customer.name.isBlank()) {
            return Result.failure(
                IllegalArgumentException("Customer name is required")
            )
        }

        // Validate email format if provided
        if (customer.email != null && !isValidEmail(customer.email)) {
            return Result.failure(
                IllegalArgumentException("Invalid email format")
            )
        }

        // Validate phone format if provided
        if (customer.phone != null && !isValidPhone(customer.phone)) {
            return Result.failure(
                IllegalArgumentException("Invalid phone format")
            )
        }

        // Validate at least one contact method
        if (customer.email == null && customer.phone == null) {
            return Result.failure(
                IllegalArgumentException("Email or phone is required")
            )
        }

        // Create customer
        return customerRepository.createCustomer(customer)
    }

    /**
     * Simple email validation
     */
    private fun isValidEmail(email: String): Boolean {
        return email.contains("@") && email.contains(".")
    }

    /**
     * Simple phone validation (digits only, 10-15 chars)
     */
    private fun isValidPhone(phone: String): Boolean {
        val digits = phone.filter { it.isDigit() }
        return digits.length in 10..15
    }
}