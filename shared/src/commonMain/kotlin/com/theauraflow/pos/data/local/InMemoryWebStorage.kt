package com.theauraflow.pos.data.local

import com.theauraflow.pos.domain.model.*
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow

/**
 * In-memory implementation of WebStorage.
 *
 * This is used as a fallback for web platforms until IndexedDB is implemented.
 * Data is lost when the page is refreshed.
 */
class InMemoryWebStorage : WebStorage {

    private val products = mutableMapOf<String, Product>()
    private val categories = mutableMapOf<String, Category>()
    private val orders = mutableMapOf<String, Order>()
    private val customers = mutableMapOf<String, Customer>()
    private val users = mutableMapOf<String, User>()

    private val productsFlow = MutableStateFlow<List<Product>>(emptyList())
    private val categoriesFlow = MutableStateFlow<List<Category>>(emptyList())
    private val ordersFlow = MutableStateFlow<List<Order>>(emptyList())
    private val customersFlow = MutableStateFlow<List<Customer>>(emptyList())

    // Product operations
    override suspend fun saveProduct(product: Product) {
        products[product.id] = product
        productsFlow.value = products.values.toList()
    }

    override suspend fun saveProducts(products: List<Product>) {
        products.forEach { this.products[it.id] = it }
        productsFlow.value = this.products.values.toList()
    }

    override suspend fun getProduct(id: String): Product? {
        return products[id]
    }

    override suspend fun getAllProducts(): List<Product> {
        return products.values.toList()
    }

    override suspend fun deleteProduct(id: String) {
        products.remove(id)
        productsFlow.value = products.values.toList()
    }

    override fun observeProducts(): Flow<List<Product>> {
        return productsFlow
    }

    // Category operations
    override suspend fun saveCategory(category: Category) {
        categories[category.id] = category
        categoriesFlow.value = categories.values.toList()
    }

    override suspend fun getCategory(id: String): Category? {
        return categories[id]
    }

    override suspend fun getAllCategories(): List<Category> {
        return categories.values.toList()
    }

    override suspend fun deleteCategory(id: String) {
        categories.remove(id)
        categoriesFlow.value = categories.values.toList()
    }

    override fun observeCategories(): Flow<List<Category>> {
        return categoriesFlow
    }

    // Order operations
    override suspend fun saveOrder(order: Order) {
        orders[order.id] = order
        ordersFlow.value = orders.values.toList()
    }

    override suspend fun getOrder(id: String): Order? {
        return orders[id]
    }

    override suspend fun getAllOrders(): List<Order> {
        return orders.values.toList()
    }

    override fun observeOrders(): Flow<List<Order>> {
        return ordersFlow
    }

    // Customer operations
    override suspend fun saveCustomer(customer: Customer) {
        customers[customer.id] = customer
        customersFlow.value = customers.values.toList()
    }

    override suspend fun getCustomer(id: String): Customer? {
        return customers[id]
    }

    override suspend fun getAllCustomers(): List<Customer> {
        return customers.values.toList()
    }

    override suspend fun deleteCustomer(id: String) {
        customers.remove(id)
        customersFlow.value = customers.values.toList()
    }

    override fun observeCustomers(): Flow<List<Customer>> {
        return customersFlow
    }

    // User operations
    override suspend fun saveUser(user: User) {
        users[user.id] = user
    }

    override suspend fun getUser(id: String): User? {
        return users[id]
    }

    override suspend fun getUserByEmail(email: String): User? {
        return users.values.find { it.email == email }
    }

    override suspend fun getAllUsers(): List<User> {
        return users.values.toList()
    }

    // Clear all data
    override suspend fun clearAll() {
        products.clear()
        categories.clear()
        orders.clear()
        customers.clear()
        users.clear()

        productsFlow.value = emptyList()
        categoriesFlow.value = emptyList()
        ordersFlow.value = emptyList()
        customersFlow.value = emptyList()
    }
}
