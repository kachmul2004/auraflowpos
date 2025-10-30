package com.theauraflow.pos.data.remote.api

import com.theauraflow.pos.data.remote.dto.ProductDto
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.request.delete
import io.ktor.client.request.get
import io.ktor.client.request.parameter
import io.ktor.client.request.post
import io.ktor.client.request.put
import io.ktor.client.request.setBody

/**
 * API client for product-related endpoints.
 */
class ProductApiClient(
    private val client: HttpClient
) {
    /**
     * Get all products.
     */
    suspend fun getProducts(): List<ProductDto> {
        return client.get("api/products").body()
    }

    /**
     * Get a product by ID.
     */
    suspend fun getProductById(id: String): ProductDto {
        return client.get("api/products/$id").body()
    }

    /**
     * Search products by query.
     */
    suspend fun searchProducts(query: String): List<ProductDto> {
        return client.get("api/products/search") {
            parameter("q", query)
        }.body()
    }

    /**
     * Get products by category.
     */
    suspend fun getProductsByCategory(categoryId: String): List<ProductDto> {
        return client.get("api/products/category/$categoryId").body()
    }

    /**
     * Create a new product.
     */
    suspend fun createProduct(product: ProductDto): ProductDto {
        return client.post("api/products") {
            setBody(product)
        }.body()
    }

    /**
     * Update an existing product.
     */
    suspend fun updateProduct(id: String, product: ProductDto): ProductDto {
        return client.put("api/products/$id") {
            setBody(product)
        }.body()
    }

    /**
     * Delete a product.
     */
    suspend fun deleteProduct(id: String) {
        client.delete("api/products/$id")
    }

    /**
     * Update product stock quantity.
     */
    suspend fun updateStock(id: String, quantity: Int): ProductDto {
        return client.put("api/products/$id/stock") {
            setBody(mapOf("quantity" to quantity))
        }.body()
    }
}