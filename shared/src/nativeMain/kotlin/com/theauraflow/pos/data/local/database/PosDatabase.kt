package com.theauraflow.pos.data.local.database

import com.theauraflow.pos.data.local.entity.*
import kotlinx.coroutines.flow.Flow

/**
 * Common database interface for all platforms.
 *
 * This abstraction layer ensures easy migration when Room supports Wasm.
 *
 * Implementations:
 * - Android/iOS/Desktop: RoomDatabaseImpl (using Room)
 * - Web/Wasm: IndexedDBDatabaseImpl (using IndexedDB)
 *
 * When Room for Wasm becomes stable, we only need to change the platform-specific
 * builder to use Room instead of IndexedDB - no repository changes needed!
 */
interface PosDatabase {
    // Product operations
    suspend fun insertProduct(product: ProductEntity)
    suspend fun insertProducts(products: List<ProductEntity>)
    suspend fun updateProduct(product: ProductEntity)
    suspend fun deleteProduct(product: ProductEntity)
    suspend fun getProductById(id: String): ProductEntity?
    suspend fun getAllProducts(): List<ProductEntity>
    suspend fun getProductsByCategory(categoryId: String): List<ProductEntity>
    fun observeAllProducts(): Flow<List<ProductEntity>>
    fun observeProductsByCategory(categoryId: String): Flow<List<ProductEntity>>
    suspend fun searchProducts(query: String): List<ProductEntity>

    // Product Variation operations
    suspend fun insertVariation(variation: ProductVariationEntity)
    suspend fun insertVariations(variations: List<ProductVariationEntity>)
    suspend fun getVariationsByProductId(productId: String): List<ProductVariationEntity>
    suspend fun deleteVariationsByProductId(productId: String)

    // Modifier operations
    suspend fun insertModifier(modifier: ModifierEntity)
    suspend fun insertModifiers(modifiers: List<ModifierEntity>)
    suspend fun getAllModifiers(): List<ModifierEntity>
    suspend fun getModifiersByGroupId(groupId: String): List<ModifierEntity>
    fun observeAllModifiers(): Flow<List<ModifierEntity>>

    // Category operations
    suspend fun insertCategory(category: CategoryEntity)
    suspend fun insertCategories(categories: List<CategoryEntity>)
    suspend fun updateCategory(category: CategoryEntity)
    suspend fun deleteCategory(category: CategoryEntity)
    suspend fun getCategoryById(id: String): CategoryEntity?
    suspend fun getAllCategories(): List<CategoryEntity>
    fun observeAllCategories(): Flow<List<CategoryEntity>>

    // Order operations
    suspend fun insertOrder(order: OrderEntity): Long
    suspend fun updateOrder(order: OrderEntity)
    suspend fun getOrderById(id: String): OrderEntity?
    suspend fun getAllOrders(): List<OrderEntity>
    suspend fun getOrdersByDateRange(startDate: Long, endDate: Long): List<OrderEntity>
    fun observeAllOrders(): Flow<List<OrderEntity>>

    // Order Item operations
    suspend fun insertOrderItems(items: List<OrderItemEntity>)
    suspend fun getOrderItemsByOrderId(orderId: String): List<OrderItemEntity>

    // Customer operations
    suspend fun insertCustomer(customer: CustomerEntity)
    suspend fun updateCustomer(customer: CustomerEntity)
    suspend fun deleteCustomer(customer: CustomerEntity)
    suspend fun getCustomerById(id: String): CustomerEntity?
    suspend fun getAllCustomers(): List<CustomerEntity>
    suspend fun searchCustomers(query: String): List<CustomerEntity>
    fun observeAllCustomers(): Flow<List<CustomerEntity>>

    // User operations
    suspend fun insertUser(user: UserEntity)
    suspend fun updateUser(user: UserEntity)
    suspend fun getUserById(id: String): UserEntity?
    suspend fun getUserByEmail(email: String): UserEntity?
    suspend fun getAllUsers(): List<UserEntity>

    // Transaction support
    suspend fun <R> withTransaction(block: suspend () -> R): R

    // Database maintenance
    suspend fun clearAllData()
    suspend fun close()
}
