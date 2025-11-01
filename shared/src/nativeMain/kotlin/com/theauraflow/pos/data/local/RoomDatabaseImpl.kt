package com.theauraflow.pos.data.local

import androidx.room.immediateTransaction
import androidx.room.useReaderConnection
import androidx.room.useWriterConnection
import com.theauraflow.pos.data.local.database.PosDatabase
import com.theauraflow.pos.data.local.entity.*
import kotlinx.coroutines.flow.Flow

/**
 * Room implementation of PosDatabase interface.
 *
 * This implementation is used on Android, iOS, and Desktop platforms.
 * It delegates all operations to the respective Room DAOs.
 */
class RoomDatabaseImpl(
    private val database: AppDatabase
) : PosDatabase {

    // ==================== Product Operations ====================

    override suspend fun insertProduct(product: ProductEntity) {
        database.productDao().insert(product)
    }

    override suspend fun insertProducts(products: List<ProductEntity>) {
        database.productDao().insertAll(products)
    }

    override suspend fun updateProduct(product: ProductEntity) {
        database.productDao().update(product)
    }

    override suspend fun deleteProduct(product: ProductEntity) {
        database.productDao().delete(product)
    }

    override suspend fun getProductById(id: String): ProductEntity? {
        return database.productDao().getById(id)
    }

    override suspend fun getAllProducts(): List<ProductEntity> {
        return database.productDao().getAll()
    }

    override suspend fun getProductsByCategory(categoryId: String): List<ProductEntity> {
        return database.productDao().getByCategory(categoryId)
    }

    override fun observeAllProducts(): Flow<List<ProductEntity>> {
        return database.productDao().observeAll()
    }

    override fun observeProductsByCategory(categoryId: String): Flow<List<ProductEntity>> {
        return database.productDao().observeByCategory(categoryId)
    }

    override suspend fun searchProducts(query: String): List<ProductEntity> {
        return database.productDao().search(query)
    }

    // ==================== Product Variation Operations ====================

    override suspend fun insertVariation(variation: ProductVariationEntity) {
        database.productVariationDao().insert(variation)
    }

    override suspend fun insertVariations(variations: List<ProductVariationEntity>) {
        database.productVariationDao().insertAll(variations)
    }

    override suspend fun getVariationsByProductId(productId: String): List<ProductVariationEntity> {
        return database.productVariationDao().getByProductId(productId)
    }

    override suspend fun deleteVariationsByProductId(productId: String) {
        database.productVariationDao().deleteByProductId(productId)
    }

    // ==================== Modifier Operations ====================

    override suspend fun insertModifier(modifier: ModifierEntity) {
        database.modifierDao().insert(modifier)
    }

    override suspend fun insertModifiers(modifiers: List<ModifierEntity>) {
        database.modifierDao().insertAll(modifiers)
    }

    override suspend fun getAllModifiers(): List<ModifierEntity> {
        return database.modifierDao().getAll()
    }

    override suspend fun getModifiersByGroupId(groupId: String): List<ModifierEntity> {
        return database.modifierDao().getByGroupId(groupId)
    }

    override fun observeAllModifiers(): Flow<List<ModifierEntity>> {
        return database.modifierDao().observeAll()
    }

    // ==================== Category Operations ====================

    override suspend fun insertCategory(category: CategoryEntity) {
        database.categoryDao().insert(category)
    }

    override suspend fun insertCategories(categories: List<CategoryEntity>) {
        database.categoryDao().insertAll(categories)
    }

    override suspend fun updateCategory(category: CategoryEntity) {
        database.categoryDao().update(category)
    }

    override suspend fun deleteCategory(category: CategoryEntity) {
        database.categoryDao().delete(category)
    }

    override suspend fun getCategoryById(id: String): CategoryEntity? {
        return database.categoryDao().getById(id)
    }

    override suspend fun getAllCategories(): List<CategoryEntity> {
        return database.categoryDao().getAll()
    }

    override fun observeAllCategories(): Flow<List<CategoryEntity>> {
        return database.categoryDao().observeAll()
    }

    // ==================== Order Operations ====================

    override suspend fun insertOrder(order: OrderEntity): Long {
        database.orderDao().insert(order)
        // Room returns void for insert, we return 0 as placeholder
        // In real implementation, we'd need to query the inserted order
        return 0L
    }

    override suspend fun updateOrder(order: OrderEntity) {
        database.orderDao().update(order)
    }

    override suspend fun getOrderById(id: String): OrderEntity? {
        return database.orderDao().getById(id)
    }

    override suspend fun getAllOrders(): List<OrderEntity> {
        return database.orderDao().getAll()
    }

    override suspend fun getOrdersByDateRange(startDate: Long, endDate: Long): List<OrderEntity> {
        return database.orderDao().getByDateRange(startDate, endDate)
    }

    override fun observeAllOrders(): Flow<List<OrderEntity>> {
        return database.orderDao().observeAll()
    }

    // ==================== Order Item Operations ====================

    override suspend fun insertOrderItems(items: List<OrderItemEntity>) {
        database.orderItemDao().insertAll(items)
    }

    override suspend fun getOrderItemsByOrderId(orderId: String): List<OrderItemEntity> {
        return database.orderItemDao().getByOrderId(orderId)
    }

    // ==================== Customer Operations ====================

    override suspend fun insertCustomer(customer: CustomerEntity) {
        database.customerDao().insert(customer)
    }

    override suspend fun updateCustomer(customer: CustomerEntity) {
        database.customerDao().update(customer)
    }

    override suspend fun deleteCustomer(customer: CustomerEntity) {
        database.customerDao().delete(customer)
    }

    override suspend fun getCustomerById(id: String): CustomerEntity? {
        return database.customerDao().getById(id)
    }

    override suspend fun getAllCustomers(): List<CustomerEntity> {
        return database.customerDao().getAll()
    }

    override suspend fun searchCustomers(query: String): List<CustomerEntity> {
        return database.customerDao().search(query)
    }

    override fun observeAllCustomers(): Flow<List<CustomerEntity>> {
        return database.customerDao().observeAll()
    }

    // ==================== User Operations ====================

    override suspend fun insertUser(user: UserEntity) {
        database.userDao().insert(user)
    }

    override suspend fun updateUser(user: UserEntity) {
        database.userDao().update(user)
    }

    override suspend fun getUserById(id: String): UserEntity? {
        return database.userDao().getById(id)
    }

    override suspend fun getUserByEmail(email: String): UserEntity? {
        return database.userDao().getByEmail(email)
    }

    override suspend fun getAllUsers(): List<UserEntity> {
        return database.userDao().getAll()
    }

    // ==================== Transaction Support ====================

    override suspend fun <R> withTransaction(block: suspend () -> R): R {
        return database.useWriterConnection { transactor ->
            transactor.immediateTransaction {
                block()
            }
        }
    }

    // ==================== Database Maintenance ====================

    override suspend fun clearAllData() {
        database.useWriterConnection { transactor ->
            transactor.immediateTransaction {
                // Delete all data from all tables
                database.productDao().deleteAll()
                database.productVariationDao().deleteAll()
                database.modifierDao().deleteAll()
                database.categoryDao().deleteAll()
                database.orderItemDao().deleteAll()
                database.orderDao().deleteAll()
                database.customerDao().deleteAll()
                database.userDao().deleteAll()
            }
        }
    }

    override suspend fun close() {
        database.close()
    }
}
