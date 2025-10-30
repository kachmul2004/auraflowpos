package com.theauraflow.pos.domain.usecase.product

import com.theauraflow.pos.domain.model.Product
import com.theauraflow.pos.domain.repository.ProductRepository

/**
 * Use case for searching products.
 *
 * Business logic:
 * - Minimum query length of 2 characters
 * - Only searches active products
 * - Returns results sorted by relevance (exact matches first)
 */
class SearchProductsUseCase(
    private val productRepository: ProductRepository
) {
    suspend operator fun invoke(query: String): Result<List<Product>> {
        // Validate query length
        if (query.trim().length < 2) {
            return Result.success(emptyList())
        }

        return productRepository.searchProducts(query.trim())
            .map { products ->
                products
                    .filter { it.isActive }
                    .sortedWith(
                        compareBy(
                            // Exact name matches first
                            { !it.name.equals(query, ignoreCase = true) },
                            // Then starts with query
                            { !it.name.startsWith(query, ignoreCase = true) },
                            // Then alphabetically
                            { it.name }
                        )
                    )
            }
    }
}
