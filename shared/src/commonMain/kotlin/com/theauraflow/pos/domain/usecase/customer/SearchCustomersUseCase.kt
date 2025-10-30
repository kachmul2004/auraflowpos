package com.theauraflow.pos.domain.usecase.customer

import com.theauraflow.pos.domain.model.Customer
import com.theauraflow.pos.domain.repository.CustomerRepository

/**
 * Use case for searching customers.
 *
 * Business logic:
 * - Minimum query length of 2 characters
 * - Only searches active customers
 * - Returns results sorted by name
 */
class SearchCustomersUseCase(
    private val customerRepository: CustomerRepository
) {
    suspend operator fun invoke(query: String): Result<List<Customer>> {
        // Validate query length
        if (query.trim().length < 2) {
            return Result.success(emptyList())
        }

        return customerRepository.searchCustomers(query.trim())
            .map { customers ->
                customers
                    .filter { it.isActive }
                    .sortedWith(
                        compareBy(
                            // Exact name matches first
                            { !it.name.equals(query, ignoreCase = true) },
                            // Then starts with query
                            { !it.name.startsWith(query, ignoreCase = true) },
                            // Then alphabetically
                            { it.name }
                        )
                    )
            }
    }
}
