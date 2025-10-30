package com.theauraflow.pos.domain.usecase.product

import com.theauraflow.pos.domain.model.Product
import com.theauraflow.pos.domain.repository.ProductRepository

/**
 * Use case for retrieving products filtered by category
 *
 * Business Rules:
 * - Returns only active products
 * - Sorted alphabetically by name
 */
class GetProductsByCategoryUseCase(
    private val productRepository: ProductRepository
) {
    /**
     * Gets products for a specific category
     *
     * @param categoryId The category ID to filter by
     * @return Result with list of products in that category
     */
    suspend operator fun invoke(categoryId: String): Result<List<Product>> {
        return productRepository.getProductsByCategory(categoryId)
            .map { products ->
                products
                    .filter { it.isActive }
                    .sortedBy { it.name }
            }
    }
}