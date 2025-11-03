package com.theauraflow.pos.server.services

import com.theauraflow.pos.server.routes.CreateProductRequest
import com.theauraflow.pos.server.routes.ProductDto
import com.theauraflow.pos.server.routes.UpdateProductRequest

interface ProductService {
    suspend fun list(
        q: String? = null,
        categoryId: String? = null,
        page: Int = 1,
        pageSize: Int = 50
    ): List<ProductDto>

    suspend fun getById(id: String): ProductDto?

    suspend fun create(request: CreateProductRequest): ProductDto

    suspend fun update(id: String, request: UpdateProductRequest): ProductDto?

    suspend fun softDelete(id: String): Boolean
}