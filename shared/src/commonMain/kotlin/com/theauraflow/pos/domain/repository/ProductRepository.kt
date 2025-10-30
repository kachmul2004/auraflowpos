package com.theauraflow.pos.domain.repository

import com.theauraflow.pos.domain.model.Product
import kotlinx.coroutines.flow.Flow

/**
 * Repository interface for product data operations.
 *
 * This follows the Repository pattern from Clean Architecture.
 * Implementations will handle data from remote API and local database.
 */
interface ProductRepository {

    /**
     * Get all products.
     *
     * @return Result with list of products or error
     */
    suspend fun getProducts(): Result<List<Product>>

    /**
     * Get a product by ID.
     *
     * @param id Product ID
     * @return Result with product or error
     */
    suspend fun getProductById(id: String): Result<Product>

    /**
     * Search products by name or SKU.
     *
     * @param query Search query
     * @return Result with matching products or error
     */
    suspend fun searchProducts(query: String): Result<List<Product>>

    /**
     * Get products by category.
     *
     * @param categoryId Category ID
     * @return Result with products in category or error
     */
    suspend fun getProductsByCategory(categoryId: String): Result<List<Product>>

    /**
     * Observe products as a Flow.
     * Useful for reactive UI updates.
     *
     * @return Flow emitting list of products
     */
    fun observeProducts(): Flow<List<Product>>

    /**
     * Observe a single product by ID.
     *
     * @param id Product ID
     * @return Flow emitting product updates
     */
    fun observeProduct(id: String): Flow<Product?>

    /**
     * Create a new product.
     * Requires admin/manager permissions.
     *
     * @param product Product to create
     * @return Result with created product or error
     */
    suspend fun createProduct(product: Product): Result<Product>

    /**
     * Update an existing product.
     * Requires admin/manager permissions.
     *
     * @param product Product to update
     * @return Result with updated product or error
     */
    suspend fun updateProduct(product: Product): Result<Product>

    /**
     * Delete a product.
     * Requires admin/manager permissions.
     *
     * @param id Product ID
     * @return Result with success or error
     */
    suspend fun deleteProduct(id: String): Result<Unit>

    /**
     * Refresh products from remote source.
     * Forces a sync with the server.
     *
     * @return Result with success or error
     */
    suspend fun refreshProducts(): Result<Unit>
}
