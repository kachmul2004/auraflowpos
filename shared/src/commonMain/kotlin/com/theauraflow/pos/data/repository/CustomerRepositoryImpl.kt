package com.theauraflow.pos.data.repository

import com.theauraflow.pos.data.remote.api.CustomerApiClient
import com.theauraflow.pos.data.remote.dto.toDomain
import com.theauraflow.pos.data.remote.dto.toDto
import com.theauraflow.pos.domain.model.Customer
import com.theauraflow.pos.domain.repository.CustomerRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow

/**
 * Implementation of CustomerRepository.
 */
class CustomerRepositoryImpl(
    private val apiClient: CustomerApiClient
) : CustomerRepository {

    private val _customersCache = MutableStateFlow<List<Customer>>(emptyList())

    override suspend fun getCustomers(): Result<List<Customer>> {
        return try {
            val dtos = apiClient.getCustomers()
            val customers = dtos.map { it.toDomain() }
            _customersCache.value = customers
            Result.success(customers)
        } catch (e: Exception) {
            if (_customersCache.value.isNotEmpty()) {
                Result.success(_customersCache.value)
            } else {
                Result.failure(e)
            }
        }
    }

    override suspend fun getCustomerById(id: String): Result<Customer> {
        return try {
            // Check cache first
            _customersCache.value.find { it.id == id }?.let {
                return Result.success(it)
            }

            // Fetch from API
            val dto = apiClient.getCustomerById(id)
            val customer = dto.toDomain()

            // Update cache
            _customersCache.value = _customersCache.value + customer

            Result.success(customer)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun searchCustomers(query: String): Result<List<Customer>> {
        return try {
            val dtos = apiClient.searchCustomers(query)
            val customers = dtos.map { it.toDomain() }
            Result.success(customers)
        } catch (e: Exception) {
            // Fallback to local search
            val cached = _customersCache.value.filter {
                it.name.contains(query, ignoreCase = true) ||
                        it.email?.contains(query, ignoreCase = true) == true ||
                        it.phone?.contains(query, ignoreCase = true) == true
            }
            Result.success(cached)
        }
    }

    override fun observeCustomers(): Flow<List<Customer>> {
        return _customersCache.asStateFlow()
    }

    override suspend fun createCustomer(customer: Customer): Result<Customer> {
        return try {
            val dto = apiClient.createCustomer(customer.toDto())
            val created = dto.toDomain()

            // Update cache
            _customersCache.value = _customersCache.value + created

            Result.success(created)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun updateCustomer(customer: Customer): Result<Customer> {
        return try {
            val dto = apiClient.updateCustomer(customer.id, customer.toDto())
            val updated = dto.toDomain()

            // Update cache
            _customersCache.value = _customersCache.value.map {
                if (it.id == updated.id) updated else it
            }

            Result.success(updated)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun deleteCustomer(id: String): Result<Unit> {
        return try {
            apiClient.deleteCustomer(id)

            // Remove from cache
            _customersCache.value = _customersCache.value.filter { it.id != id }

            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun addLoyaltyPoints(customerId: String, points: Int): Result<Customer> {
        return try {
            val dto = apiClient.addLoyaltyPoints(customerId, points)
            val updated = dto.toDomain()

            // Update cache
            _customersCache.value = _customersCache.value.map {
                if (it.id == updated.id) updated else it
            }

            Result.success(updated)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun redeemLoyaltyPoints(customerId: String, points: Int): Result<Customer> {
        return try {
            val dto = apiClient.redeemLoyaltyPoints(customerId, points)
            val updated = dto.toDomain()

            // Update cache
            _customersCache.value = _customersCache.value.map {
                if (it.id == updated.id) updated else it
            }

            Result.success(updated)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getTopCustomers(limit: Int): Result<List<Customer>> {
        return try {
            val dtos = apiClient.getTopCustomers(limit)
            val customers = dtos.map { it.toDomain() }
            Result.success(customers)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun refreshCustomers(): Result<Unit> {
        return try {
            val dtos = apiClient.getCustomers()
            val customers = dtos.map { it.toDomain() }
            _customersCache.value = customers
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}