package com.theauraflow.pos.data.local

import com.theauraflow.pos.domain.model.*
import kotlinx.coroutines.flow.Flow

/**
 * Simplified storage interface for web platforms.
 *
 * This is a simpler alternative to PosDatabase for platforms that don't support Room.
 * Works directly with domain models instead of entities.
 *
 * Implementations:
 * - JS/WasmJS: IndexedDB
 * - Can also use in-memory for testing
 */
interface WebStorage {

    // Product operations
    suspend fun saveProduct(product: Product)
    suspend fun saveProducts(products: List<Product>)
    suspend fun getProduct(id: String): Product?
    suspend fun getAllProducts(): List<Product>
    suspend fun deleteProduct(id: String)
    fun observeProducts(): Flow<List<Product>>

    // Category operations
    suspend fun saveCategory(category: Category)
    suspend fun getCategory(id: String): Category?
    suspend fun getAllCategories(): List<Category>
    suspend fun deleteCategory(id: String)
    fun observeCategories(): Flow<List<Category>>

    // Order operations
    suspend fun saveOrder(order: Order)
    suspend fun getOrder(id: String): Order?
    suspend fun getAllOrders(): List<Order>
    fun observeOrders(): Flow<List<Order>>

    // Customer operations
    suspend fun saveCustomer(customer: Customer)
    suspend fun getCustomer(id: String): Customer?
    suspend fun getAllCustomers(): List<Customer>
    suspend fun deleteCustomer(id: String)
    fun observeCustomers(): Flow<List<Customer>>

    // User operations
    suspend fun saveUser(user: User)
    suspend fun getUser(id: String): User?
    suspend fun getUserByEmail(email: String): User?
    suspend fun getAllUsers(): List<User>

    // Clear all data
    suspend fun clearAll()
}
