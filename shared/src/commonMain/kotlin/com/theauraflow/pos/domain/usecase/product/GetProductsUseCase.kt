package com.theauraflow.pos.domain.usecase.product

import com.theauraflow.pos.domain.model.Product
import com.theauraflow.pos.domain.repository.ProductRepository

/**
 * Use case for getting products with optional filtering.
 *
 * Business logic:
 * - Only returns active products
 * - Sorts by name alphabetically
 * - Filters out products with invalid prices
 */
class GetProductsUseCase(
    private val productRepository: ProductRepository
) {
    /**
     * Get all active products, sorted by name.
     */
    suspend operator fun invoke(): Result<List<Product>> {
        return productRepository.getProducts()
            .map { products ->
                products
                    .filter { it.isActive && it.isValidPrice() }
                    .sortedBy { it.name }
            }
    }

    /**
     * Get products by category.
     */
    suspend fun byCategory(categoryId: String): Result<List<Product>> {
        return productRepository.getProductsByCategory(categoryId)
            .map { products ->
                products
                    .filter { it.isActive && it.isValidPrice() }
                    .sortedBy { it.name }
            }
    }

    /**
     * Get products that are low in stock.
     */
    suspend fun lowStock(): Result<List<Product>> {
        return productRepository.getProducts()
            .map { products ->
                products
                    .filter { it.isActive && it.needsRestock }
                    .sortedBy { it.stockQuantity }
            }
    }
}
