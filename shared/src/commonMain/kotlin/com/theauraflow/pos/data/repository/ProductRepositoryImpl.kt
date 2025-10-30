package com.theauraflow.pos.data.repository

import com.theauraflow.pos.data.remote.api.ProductApiClient
import com.theauraflow.pos.data.remote.dto.toDomain
import com.theauraflow.pos.data.remote.dto.toDto
import com.theauraflow.pos.domain.model.Product
import com.theauraflow.pos.domain.repository.ProductRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.map

/**
 * Implementation of ProductRepository with offline-first approach.
 *
 * Strategy:
 * - In-memory cache for quick access
 * - Fetch from API and update cache
 * - Emit changes through Flow for reactive UI
 */
class ProductRepositoryImpl(
    private val apiClient: ProductApiClient
) : ProductRepository {

    // In-memory cache
    private val _productsCache = MutableStateFlow<List<Product>>(emptyList())

    override fun observeProducts(): Flow<List<Product>> {
        return _productsCache.asStateFlow()
    }

    override fun observeProduct(id: String): Flow<Product?> {
        return _productsCache.map { products ->
            products.find { it.id == id }
        }
    }

    override suspend fun getProducts(): Result<List<Product>> {
        return try {
            val dtos = apiClient.getProducts()
            val products = dtos.map { it.toDomain() }
            _productsCache.value = products
            Result.success(products)
        } catch (e: Exception) {
            // Return cached data on error
            if (_productsCache.value.isNotEmpty()) {
                Result.success(_productsCache.value)
            } else {
                Result.failure(e)
            }
        }
    }

    override suspend fun getProductById(id: String): Result<Product> {
        return try {
            // Check cache first
            _productsCache.value.find { it.id == id }?.let {
                return Result.success(it)
            }

            // Fetch from API
            val dto = apiClient.getProductById(id)
            val product = dto.toDomain()

            // Update cache
            _productsCache.value = _productsCache.value + product

            Result.success(product)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun searchProducts(query: String): Result<List<Product>> {
        return try {
            val dtos = apiClient.searchProducts(query)
            val products = dtos.map { it.toDomain() }
            Result.success(products)
        } catch (e: Exception) {
            // Fallback to local search in cache
            val cached = _productsCache.value.filter {
                it.name.contains(query, ignoreCase = true) ||
                        it.description?.contains(query, ignoreCase = true) == true ||
                        it.sku?.contains(query, ignoreCase = true) == true
            }
            Result.success(cached)
        }
    }

    override suspend fun getProductsByCategory(categoryId: String): Result<List<Product>> {
        return try {
            val dtos = apiClient.getProductsByCategory(categoryId)
            val products = dtos.map { it.toDomain() }
            Result.success(products)
        } catch (e: Exception) {
            // Fallback to cache
            val cached = _productsCache.value.filter { it.categoryId == categoryId }
            Result.success(cached)
        }
    }

    override suspend fun createProduct(product: Product): Result<Product> {
        return try {
            val dto = apiClient.createProduct(product.toDto())
            val created = dto.toDomain()

            // Update cache
            _productsCache.value = _productsCache.value + created

            Result.success(created)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun updateProduct(product: Product): Result<Product> {
        return try {
            val dto = apiClient.updateProduct(product.id, product.toDto())
            val updated = dto.toDomain()

            // Update cache
            _productsCache.value = _productsCache.value.map {
                if (it.id == updated.id) updated else it
            }

            Result.success(updated)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun deleteProduct(id: String): Result<Unit> {
        return try {
            apiClient.deleteProduct(id)

            // Remove from cache
            _productsCache.value = _productsCache.value.filter { it.id != id }

            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun refreshProducts(): Result<Unit> {
        return try {
            val dtos = apiClient.getProducts()
            val products = dtos.map { it.toDomain() }
            _productsCache.value = products
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}