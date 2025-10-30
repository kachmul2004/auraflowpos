package com.theauraflow.pos.data.remote.api

import com.theauraflow.pos.data.remote.dto.CustomerDto
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.request.delete
import io.ktor.client.request.get
import io.ktor.client.request.parameter
import io.ktor.client.request.post
import io.ktor.client.request.put
import io.ktor.client.request.setBody

/**
 * API client for customer-related endpoints.
 */
class CustomerApiClient(
    private val client: HttpClient
) {
    /**
     * Get all customers.
     */
    suspend fun getCustomers(): List<CustomerDto> {
        return client.get("api/customers").body()
    }

    /**
     * Get a customer by ID.
     */
    suspend fun getCustomerById(id: String): CustomerDto {
        return client.get("api/customers/$id").body()
    }

    /**
     * Search customers by query.
     */
    suspend fun searchCustomers(query: String): List<CustomerDto> {
        return client.get("api/customers/search") {
            parameter("q", query)
        }.body()
    }

    /**
     * Create a new customer.
     */
    suspend fun createCustomer(customer: CustomerDto): CustomerDto {
        return client.post("api/customers") {
            setBody(customer)
        }.body()
    }

    /**
     * Update an existing customer.
     */
    suspend fun updateCustomer(id: String, customer: CustomerDto): CustomerDto {
        return client.put("api/customers/$id") {
            setBody(customer)
        }.body()
    }

    /**
     * Delete a customer.
     */
    suspend fun deleteCustomer(id: String) {
        client.delete("api/customers/$id")
    }

    /**
     * Add loyalty points to a customer.
     */
    suspend fun addLoyaltyPoints(customerId: String, points: Int): CustomerDto {
        return client.put("api/customers/$customerId/loyalty/add") {
            setBody(mapOf("points" to points))
        }.body()
    }

    /**
     * Redeem loyalty points from a customer.
     */
    suspend fun redeemLoyaltyPoints(customerId: String, points: Int): CustomerDto {
        return client.put("api/customers/$customerId/loyalty/redeem") {
            setBody(mapOf("points" to points))
        }.body()
    }

    /**
     * Get top customers by total spent.
     */
    suspend fun getTopCustomers(limit: Int = 10): List<CustomerDto> {
        return client.get("api/customers/top") {
            parameter("limit", limit)
        }.body()
    }
}