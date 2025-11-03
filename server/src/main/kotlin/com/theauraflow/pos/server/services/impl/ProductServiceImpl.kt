@file:Suppress("DEPRECATION", "DEPRECATION_ERROR")
package com.theauraflow.pos.server.services.impl

import com.theauraflow.pos.server.database.tables.ProductsTable
import com.theauraflow.pos.server.routes.CreateProductRequest
import com.theauraflow.pos.server.routes.ProductDto
import com.theauraflow.pos.server.routes.UpdateProductRequest
import com.theauraflow.pos.server.services.ProductService
import com.theauraflow.pos.server.util.dbQuery
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.like
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.kotlin.datetime.CurrentDateTime
import java.util.UUID

class ProductServiceImpl : ProductService {

    override suspend fun list(
        q: String?,
        categoryId: String?,
        page: Int,
        pageSize: Int
    ): List<ProductDto> = dbQuery {
        val base = ProductsTable.selectAll()
            .where { ProductsTable.isActive eq true }

        val filtered = base.let { query ->
            var qExp: Op<Boolean>? = null
            if (!q.isNullOrBlank()) {
                qExp = ProductsTable.name.lowerCase() like "%${q.lowercase()}%"
            }
            var catExp: Op<Boolean>? = null
            if (!categoryId.isNullOrBlank()) {
                catExp = ProductsTable.categoryId eq categoryId
            }
            when {
                qExp != null && catExp != null -> query.andWhere { qExp and catExp }
                qExp != null -> query.andWhere { qExp }
                catExp != null -> query.andWhere { catExp }
                else -> query
            }
        }

        val offsetInt = ((page - 1).coerceAtLeast(0)) * pageSize
        filtered
            .orderBy(ProductsTable.updatedAt, SortOrder.DESC)
            .limit(pageSize)
            .map { row -> row.toProductDto() }
            .let { list ->
                if (offsetInt <= 0) list else list.drop(offsetInt)
            }
    }

    override suspend fun getById(id: String): ProductDto? = dbQuery {
        ProductsTable.selectAll()
            .where { (ProductsTable.id eq id) and (ProductsTable.isActive eq true) }
            .singleOrNull()
            ?.toProductDto()
    }

    override suspend fun create(request: CreateProductRequest): ProductDto = dbQuery {
        val productId = UUID.randomUUID().toString()
        ProductsTable.insert {
            it[id] = productId
            it[name] = request.name
            it[sku] = request.sku
            it[barcode] = request.barcode
            it[price] = request.price
            it[cost] = request.cost
            it[categoryId] = request.categoryId
            it[stockQuantity] = request.stockQuantity
            it[minStockLevel] = request.minStockLevel
            it[imageUrl] = request.imageUrl
            it[description] = request.description
            it[taxRate] = request.taxRate
        }
        ProductsTable.selectAll().where { ProductsTable.id eq productId }.single().toProductDto()
    }

    override suspend fun update(id: String, request: UpdateProductRequest): ProductDto? = dbQuery {
        val affected = ProductsTable.update({ ProductsTable.id eq id }) {
            request.name?.let { v -> it[ProductsTable.name] = v }
            request.sku?.let { v -> it[ProductsTable.sku] = v }
            request.barcode?.let { v -> it[ProductsTable.barcode] = v }
            request.price?.let { v -> it[ProductsTable.price] = v }
            request.cost?.let { v -> it[ProductsTable.cost] = v }
            request.categoryId?.let { v -> it[ProductsTable.categoryId] = v }
            request.stockQuantity?.let { v -> it[ProductsTable.stockQuantity] = v }
            request.minStockLevel?.let { v -> it[ProductsTable.minStockLevel] = v }
            request.imageUrl?.let { v -> it[ProductsTable.imageUrl] = v }
            request.description?.let { v -> it[ProductsTable.description] = v }
            request.taxRate?.let { v -> it[ProductsTable.taxRate] = v }
            it[updatedAt] = CurrentDateTime
        }
        if (affected == 0) return@dbQuery null
        ProductsTable.selectAll().where { ProductsTable.id eq id }.single().toProductDto()
    }

    override suspend fun softDelete(id: String): Boolean = dbQuery {
        ProductsTable.update({ ProductsTable.id eq id }) {
            it[isActive] = false
            it[updatedAt] = CurrentDateTime
        } > 0
    }
}

private fun ResultRow.toProductDto() = ProductDto(
    id = this[ProductsTable.id],
    name = this[ProductsTable.name],
    sku = this[ProductsTable.sku],
    barcode = this[ProductsTable.barcode],
    price = this[ProductsTable.price],
    cost = this[ProductsTable.cost],
    categoryId = this[ProductsTable.categoryId],
    stockQuantity = this[ProductsTable.stockQuantity],
    minStockLevel = this[ProductsTable.minStockLevel],
    imageUrl = this[ProductsTable.imageUrl],
    description = this[ProductsTable.description],
    taxRate = this[ProductsTable.taxRate],
    isActive = this[ProductsTable.isActive],
    createdAt = this[ProductsTable.createdAt].toString(),
    updatedAt = this[ProductsTable.updatedAt].toString()
)