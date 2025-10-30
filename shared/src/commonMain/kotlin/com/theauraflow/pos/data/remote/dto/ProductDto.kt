package com.theauraflow.pos.data.remote.dto

import com.theauraflow.pos.domain.model.Product
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

/**
 * Data Transfer Object for Product API responses.
 *
 * Maps snake_case API fields to domain model.
 */
@Serializable
data class ProductDto(
    @SerialName("id") val id: String,
    @SerialName("name") val name: String,
    @SerialName("sku") val sku: String? = null,
    @SerialName("barcode") val barcode: String? = null,
    @SerialName("price") val price: Double,
    @SerialName("cost") val cost: Double? = null,
    @SerialName("category_id") val categoryId: String? = null,
    @SerialName("category_name") val categoryName: String? = null,
    @SerialName("stock_quantity") val stockQuantity: Int = 0,
    @SerialName("min_stock_level") val minStockLevel: Int = 0,
    @SerialName("image_url") val imageUrl: String? = null,
    @SerialName("description") val description: String? = null,
    @SerialName("tax_rate") val taxRate: Double = 0.0,
    @SerialName("is_active") val isActive: Boolean = true,
    @SerialName("has_variations") val hasVariations: Boolean = false,
    @SerialName("has_modifiers") val hasModifiers: Boolean = false
)

/**
 * Convert ProductDto to domain Product model.
 */
fun ProductDto.toDomain(): Product = Product(
    id = id,
    name = name,
    sku = sku,
    barcode = barcode,
    price = price,
    cost = cost,
    categoryId = categoryId,
    categoryName = categoryName,
    stockQuantity = stockQuantity,
    minStockLevel = minStockLevel,
    imageUrl = imageUrl,
    description = description,
    taxRate = taxRate,
    isActive = isActive,
    hasVariations = hasVariations,
    hasModifiers = hasModifiers
)

/**
 * Convert domain Product to ProductDto.
 */
fun Product.toDto(): ProductDto = ProductDto(
    id = id,
    name = name,
    sku = sku,
    barcode = barcode,
    price = price,
    cost = cost,
    categoryId = categoryId,
    categoryName = categoryName,
    stockQuantity = stockQuantity,
    minStockLevel = minStockLevel,
    imageUrl = imageUrl,
    description = description,
    taxRate = taxRate,
    isActive = isActive,
    hasVariations = hasVariations,
    hasModifiers = hasModifiers
)