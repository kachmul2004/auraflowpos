package com.theauraflow.pos.data.remote.api

import com.theauraflow.pos.data.remote.dto.CategoryDto
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.request.delete
import io.ktor.client.request.get
import io.ktor.client.request.post
import io.ktor.client.request.put
import io.ktor.client.request.setBody

/**
 * API client for category-related endpoints.
 */
class CategoryApiClient(
    private val client: HttpClient
) {
    /**
     * Get all categories.
     */
    suspend fun getCategories(): List<CategoryDto> {
        return client.get("api/categories").body()
    }

    /**
     * Get a category by ID.
     */
    suspend fun getCategoryById(id: String): CategoryDto {
        return client.get("api/categories/$id").body()
    }

    /**
     * Get root categories (no parent).
     */
    suspend fun getRootCategories(): List<CategoryDto> {
        return client.get("api/categories/root").body()
    }

    /**
     * Get subcategories of a parent category.
     */
    suspend fun getSubcategories(parentId: String): List<CategoryDto> {
        return client.get("api/categories/$parentId/subcategories").body()
    }

    /**
     * Create a new category.
     */
    suspend fun createCategory(category: CategoryDto): CategoryDto {
        return client.post("api/categories") {
            setBody(category)
        }.body()
    }

    /**
     * Update an existing category.
     */
    suspend fun updateCategory(id: String, category: CategoryDto): CategoryDto {
        return client.put("api/categories/$id") {
            setBody(category)
        }.body()
    }

    /**
     * Delete a category.
     */
    suspend fun deleteCategory(id: String) {
        client.delete("api/categories/$id")
    }
}