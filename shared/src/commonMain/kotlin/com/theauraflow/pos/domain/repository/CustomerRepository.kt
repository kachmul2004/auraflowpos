package com.theauraflow.pos.domain.repository

import com.theauraflow.pos.domain.model.Customer
import kotlinx.coroutines.flow.Flow

/**
 * Repository interface for customer data operations.
 *
 * Manages customer information and loyalty points.
 */
interface CustomerRepository {

    /**
     * Get all customers.
     *
     * @return Result with list of customers or error
     */
    suspend fun getCustomers(): Result<List<Customer>>

    /**
     * Get a customer by ID.
     *
     * @param id Customer ID
     * @return Result with customer or error
     */
    suspend fun getCustomerById(id: String): Result<Customer>

    /**
     * Search customers by name, email, or phone.
     *
     * @param query Search query
     * @return Result with matching customers or error
     */
    suspend fun searchCustomers(query: String): Result<List<Customer>>

    /**
     * Observe customers as a Flow.
     *
     * @return Flow emitting list of customers
     */
    fun observeCustomers(): Flow<List<Customer>>

    /**
     * Create a new customer.
     *
     * @param customer Customer to create
     * @return Result with created customer or error
     */
    suspend fun createCustomer(customer: Customer): Result<Customer>

    /**
     * Update an existing customer.
     *
     * @param customer Customer to update
     * @return Result with updated customer or error
     */
    suspend fun updateCustomer(customer: Customer): Result<Customer>

    /**
     * Delete a customer.
     *
     * @param id Customer ID
     * @return Result with success or error
     */
    suspend fun deleteCustomer(id: String): Result<Unit>

    /**
     * Add loyalty points to a customer.
     *
     * @param customerId Customer ID
     * @param points Points to add
     * @return Result with updated customer or error
     */
    suspend fun addLoyaltyPoints(customerId: String, points: Int): Result<Customer>

    /**
     * Redeem loyalty points from a customer.
     *
     * @param customerId Customer ID
     * @param points Points to redeem
     * @return Result with updated customer or error
     */
    suspend fun redeemLoyaltyPoints(customerId: String, points: Int): Result<Customer>

    /**
     * Get top customers by total spent.
     *
     * @param limit Maximum number of customers to return
     * @return Result with top customers or error
     */
    suspend fun getTopCustomers(limit: Int = 10): Result<List<Customer>>

    /**
     * Refresh customers from remote source.
     *
     * @return Result with success or error
     */
    suspend fun refreshCustomers(): Result<Unit>
}
