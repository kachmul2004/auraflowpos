package com.theauraflow.pos.data.repository

import com.theauraflow.pos.domain.model.Customer
import com.theauraflow.pos.domain.repository.CustomerRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow

class MockCustomerRepository : CustomerRepository {
    private val mockCustomers = listOf(
        Customer(
            id = "1",
            name = "Sarah Johnson",
            email = "sarah.johnson@email.com",
            phone = "(555) 234-5678",
            address = "123 Main Street",
            loyaltyPoints = 45,
            totalSpent = 1250.75,
            orderCount = 28
        ),
        Customer(
            id = "2",
            name = "Michael Chen",
            email = "michael.chen@email.com",
            phone = "(555) 345-6789",
            address = "456 Oak Avenue",
            loyaltyPoints = 0,
            totalSpent = 3420.50,
            orderCount = 45
        ),
        Customer(
            id = "3",
            name = "Emily Rodriguez",
            email = "emily.rodriguez@email.com",
            phone = "(555) 456-7890",
            address = "789 Elm Street",
            loyaltyPoints = 5,
            totalSpent = 875.25,
            orderCount = 15
        ),
        Customer(
            id = "4",
            name = "David Thompson",
            email = "david.t@email.com",
            phone = "(555) 567-8901",
            address = "321 Pine Road",
            loyaltyPoints = 25,
            totalSpent = 5680.00,
            orderCount = 89
        ),
        Customer(
            id = "5",
            name = "Jessica Martinez",
            email = "j.martinez@email.com",
            phone = "(555) 678-9012",
            address = "654 Maple Drive",
            loyaltyPoints = 2,
            totalSpent = 435.60,
            orderCount = 8
        ),
        Customer(
            id = "6",
            name = "Robert Anderson",
            email = "r.anderson@email.com",
            phone = "(555) 789-0123",
            address = null,
            loyaltyPoints = 0,
            totalSpent = 125.50,
            orderCount = 2
        )
    )
    private val _customers = MutableStateFlow(mockCustomers)

    override fun observeCustomers(): Flow<List<Customer>> = _customers.asStateFlow()

    override suspend fun getCustomers(): Result<List<Customer>> = Result.success(mockCustomers)
    override suspend fun getCustomerById(id: String): Result<Customer> =
        mockCustomers.find { it.id == id }?.let { Result.success(it) } ?: Result.failure(
            NoSuchElementException("Customer $id not found")
        )

    override suspend fun searchCustomers(query: String): Result<List<Customer>> =
        Result.success(mockCustomers.filter {
            it.name.contains(
                query,
                ignoreCase = true
            ) || it.email?.contains(query, ignoreCase = true) == true
        })

    override suspend fun createCustomer(customer: Customer): Result<Customer> =
        Result.failure(NotImplementedError("Mock only"))

    override suspend fun updateCustomer(customer: Customer): Result<Customer> =
        Result.failure(NotImplementedError("Mock only"))

    override suspend fun deleteCustomer(id: String): Result<Unit> =
        Result.failure(NotImplementedError("Mock only"))

    override suspend fun refreshCustomers(): Result<Unit> = Result.success(Unit)

    override suspend fun addLoyaltyPoints(customerId: String, points: Int): Result<Customer> =
        Result.failure(NotImplementedError("Mock only"))

    override suspend fun redeemLoyaltyPoints(customerId: String, points: Int): Result<Customer> =
        Result.failure(NotImplementedError("Mock only"))

    override suspend fun getTopCustomers(limit: Int): Result<List<Customer>> =
        Result.success(mockCustomers.take(limit))
}
