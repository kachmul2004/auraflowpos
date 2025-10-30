package com.theauraflow.pos.server.routes

import com.theauraflow.pos.server.database.tables.ProductsTable
import com.theauraflow.pos.server.util.*
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.datetime.Clock
import kotlinx.datetime.TimeZone
import kotlinx.datetime.toLocalDateTime
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.*
import java.util.*

/**
 * Product management routes (protected with JWT).
 */
fun Route.productRoutes() {
    authenticate("auth-jwt") {
        route("/products") {

            // Get all products
            get {
                val products = dbQuery {
                    ProductsTable.selectAll()
                        .where { ProductsTable.isActive eq true }
                        .map { it.toProductDto() }
                }

                call.respond(HttpStatusCode.OK, SuccessResponse(data = products))
            }

            // Get product by ID
            get("/{id}") {
                val id = call.parameters["id"] ?: throw IllegalArgumentException("Invalid ID")

                val product = dbQuery {
                    ProductsTable.selectAll()
                        .where { (ProductsTable.id eq id) and (ProductsTable.isActive eq true) }
                        .singleOrNull()
                        ?.toProductDto()
                }

                if (product == null) {
                    call.respond(
                        HttpStatusCode.NotFound,
                        ErrorResponse("Not Found", "Product not found", 404)
                    )
                    return@get
                }

                call.respond(HttpStatusCode.OK, SuccessResponse(data = product))
            }

            // Search products
            get("/search") {
                val query = call.request.queryParameters["q"] ?: ""

                val products = dbQuery {
                    ProductsTable.selectAll()
                        .where {
                            (ProductsTable.isActive eq true) and
                                    (ProductsTable.name.lowerCase() like "%${query.lowercase()}%")
                        }
                        .map { it.toProductDto() }
                }

                call.respond(HttpStatusCode.OK, SuccessResponse(data = products))
            }

            // Create product
            post {
                val request = call.receive<CreateProductRequest>()

                // Validate
                val fieldErrors = mutableMapOf<String, String>()
                if (request.name.isBlank()) fieldErrors["name"] = "Name is required"
                if (request.price <= 0.toBigDecimal()) fieldErrors["price"] =
                    "Price must be greater than 0"

                if (fieldErrors.isNotEmpty()) {
                    call.respond(
                        HttpStatusCode.BadRequest,
                        ValidationErrorResponse(
                            message = "Validation failed",
                            fieldErrors = fieldErrors
                        )
                    )
                    return@post
                }

                // Create product
                val productId = UUID.randomUUID().toString()
                val product = dbQuery {
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

                    ProductsTable.selectAll()
                        .where { ProductsTable.id eq productId }
                        .single()
                        .toProductDto()
                }

                call.respond(
                    HttpStatusCode.Created,
                    SuccessResponse(data = product, message = "Product created successfully")
                )
            }

            // Update product
            put("/{id}") {
                val id = call.parameters["id"] ?: throw IllegalArgumentException("Invalid ID")
                val request = call.receive<UpdateProductRequest>()

                // Check if product exists
                val exists = dbQuery {
                    ProductsTable.selectAll()
                        .where { ProductsTable.id eq id }
                        .singleOrNull() != null
                }

                if (!exists) {
                    call.respond(
                        HttpStatusCode.NotFound,
                        ErrorResponse("Not Found", "Product not found", 404)
                    )
                    return@put
                }

                // Update product
                val product = dbQuery {
                    ProductsTable.update({ ProductsTable.id eq id }) {
                        request.name?.let { name -> it[ProductsTable.name] = name }
                        request.sku?.let { sku -> it[ProductsTable.sku] = sku }
                        request.barcode?.let { barcode -> it[ProductsTable.barcode] = barcode }
                        request.price?.let { price -> it[ProductsTable.price] = price }
                        request.cost?.let { cost -> it[ProductsTable.cost] = cost }
                        request.categoryId?.let { categoryId ->
                            it[ProductsTable.categoryId] = categoryId
                        }
                        request.stockQuantity?.let { qty -> it[stockQuantity] = qty }
                        request.minStockLevel?.let { min -> it[minStockLevel] = min }
                        request.imageUrl?.let { url -> it[imageUrl] = url }
                        request.description?.let { desc -> it[description] = desc }
                        request.taxRate?.let { tax -> it[taxRate] = tax }
                        it[updatedAt] = Clock.System.now().toLocalDateTime(TimeZone.UTC)
                    }

                    ProductsTable.selectAll()
                        .where { ProductsTable.id eq id }
                        .single()
                        .toProductDto()
                }

                call.respond(
                    HttpStatusCode.OK,
                    SuccessResponse(data = product, message = "Product updated successfully")
                )
            }

            // Delete product (soft delete)
            delete("/{id}") {
                val id = call.parameters["id"] ?: throw IllegalArgumentException("Invalid ID")

                val updated = dbQuery {
                    ProductsTable.update({ ProductsTable.id eq id }) {
                        it[isActive] = false
                        it[updatedAt] = Clock.System.now().toLocalDateTime(TimeZone.UTC)
                    }
                }

                if (updated == 0) {
                    call.respond(
                        HttpStatusCode.NotFound,
                        ErrorResponse("Not Found", "Product not found", 404)
                    )
                    return@delete
                }

                call.respond(
                    HttpStatusCode.OK,
                    SuccessResponse(
                        data = mapOf("deleted" to true),
                        message = "Product deleted successfully"
                    )
                )
            }
        }
    }
}

// Extension function to convert ResultRow to DTO
fun ResultRow.toProductDto() = ProductDto(
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

@Serializable
data class ProductDto(
    val id: String,
    val name: String,
    val sku: String?,
    val barcode: String?,
    val price: java.math.BigDecimal,
    val cost: java.math.BigDecimal?,
    val categoryId: String?,
    val stockQuantity: Int,
    val minStockLevel: Int,
    val imageUrl: String?,
    val description: String?,
    val taxRate: java.math.BigDecimal,
    val isActive: Boolean,
    val createdAt: String,
    val updatedAt: String
)

@Serializable
data class CreateProductRequest(
    val name: String,
    val sku: String? = null,
    val barcode: String? = null,
    val price: java.math.BigDecimal,
    val cost: java.math.BigDecimal? = null,
    val categoryId: String? = null,
    val stockQuantity: Int = 0,
    val minStockLevel: Int = 0,
    val imageUrl: String? = null,
    val description: String? = null,
    val taxRate: java.math.BigDecimal = 0.toBigDecimal()
)

@Serializable
data class UpdateProductRequest(
    val name: String? = null,
    val sku: String? = null,
    val barcode: String? = null,
    val price: java.math.BigDecimal? = null,
    val cost: java.math.BigDecimal? = null,
    val categoryId: String? = null,
    val stockQuantity: Int? = null,
    val minStockLevel: Int? = null,
    val imageUrl: String? = null,
    val description: String? = null,
    val taxRate: java.math.BigDecimal? = null
)
