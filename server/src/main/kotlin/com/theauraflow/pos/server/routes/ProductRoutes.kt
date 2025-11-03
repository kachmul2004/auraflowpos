package com.theauraflow.pos.server.routes

import com.theauraflow.pos.server.database.tables.ProductsTable
import com.theauraflow.pos.server.services.ProductService
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
import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.kotlin.datetime.CurrentDateTime
import org.koin.core.context.GlobalContext
import java.util.*

/**
 * Product management routes (protected with JWT).
 */
fun Route.productRoutes() {
    authenticate("auth-jwt") {
        route("/products") {

            // Get all products (with optional pagination and filters)
            get {
                val q = call.request.queryParameters["q"]
                val categoryId = call.request.queryParameters["categoryId"]
                val page = call.request.queryParameters["page"]?.toIntOrNull() ?: 1
                val pageSize = call.request.queryParameters["pageSize"]?.toIntOrNull() ?: 50

                val productService = GlobalContext.get().get<ProductService>()
                val products = productService.list(
                    q = q,
                    categoryId = categoryId,
                    page = page,
                    pageSize = pageSize
                )

                call.respond(HttpStatusCode.OK, SuccessResponse<List<ProductDto>>(data = products))
            }

            // Get product by ID
            get("/{id}") {
                val id = call.parameters["id"] ?: throw IllegalArgumentException("Invalid ID")

                val productService = GlobalContext.get().get<ProductService>()
                val product = productService.getById(id)

                if (product == null) {
                    call.respond(
                        HttpStatusCode.NotFound,
                        ErrorResponse("Not Found", "Product not found", 404)
                    )
                    return@get
                }

                call.respond(HttpStatusCode.OK, SuccessResponse<ProductDto>(data = product))
            }

            // Search products
            get("/search") {
                val query = call.request.queryParameters["q"]
                val page = call.request.queryParameters["page"]?.toIntOrNull() ?: 1
                val pageSize = call.request.queryParameters["pageSize"]?.toIntOrNull() ?: 50

                val productService = GlobalContext.get().get<ProductService>()
                val products = productService.list(q = query, page = page, pageSize = pageSize)
                call.respond(HttpStatusCode.OK, SuccessResponse<List<ProductDto>>(data = products))
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

                val productService = GlobalContext.get().get<ProductService>()
                val product = productService.create(request)

                call.respond(
                    HttpStatusCode.Created,
                    SuccessResponse<ProductDto>(data = product, message = "Product created successfully")
                )
            }

            // Update product
            put("/{id}") {
                val id = call.parameters["id"] ?: throw IllegalArgumentException("Invalid ID")
                val request = call.receive<UpdateProductRequest>()

                val productService = GlobalContext.get().get<ProductService>()
                val updated = productService.update(id, request)

                if (updated == null) {
                    call.respond(
                        HttpStatusCode.NotFound,
                        ErrorResponse("Not Found", "Product not found", 404)
                    )
                    return@put
                }

                call.respond(
                    HttpStatusCode.OK,
                    SuccessResponse<ProductDto>(data = updated, message = "Product updated successfully")
                )
            }

            // Delete product (soft delete)
            delete("/{id}") {
                val id = call.parameters["id"] ?: throw IllegalArgumentException("Invalid ID")

                val productService = GlobalContext.get().get<ProductService>()
                val ok = productService.softDelete(id)

                if (!ok) {
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
    @Contextual val price: java.math.BigDecimal,
    @Contextual val cost: java.math.BigDecimal?,
    val categoryId: String?,
    val stockQuantity: Int,
    val minStockLevel: Int,
    val imageUrl: String?,
    val description: String?,
    @Contextual val taxRate: java.math.BigDecimal,
    val isActive: Boolean,
    val createdAt: String,
    val updatedAt: String
)

@Serializable
data class CreateProductRequest(
    val name: String,
    val sku: String? = null,
    val barcode: String? = null,
    @Contextual val price: java.math.BigDecimal,
    @Contextual val cost: java.math.BigDecimal? = null,
    val categoryId: String? = null,
    val stockQuantity: Int = 0,
    val minStockLevel: Int = 0,
    val imageUrl: String? = null,
    val description: String? = null,
    @Contextual val taxRate: java.math.BigDecimal = 0.toBigDecimal()
)

@Serializable
data class UpdateProductRequest(
    val name: String? = null,
    val sku: String? = null,
    val barcode: String? = null,
    @Contextual val price: java.math.BigDecimal? = null,
    @Contextual val cost: java.math.BigDecimal? = null,
    val categoryId: String? = null,
    val stockQuantity: Int? = null,
    val minStockLevel: Int? = null,
    val imageUrl: String? = null,
    val description: String? = null,
    @Contextual val taxRate: java.math.BigDecimal? = null
)
