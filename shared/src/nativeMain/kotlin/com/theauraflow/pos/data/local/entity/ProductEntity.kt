package com.theauraflow.pos.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.theauraflow.pos.domain.model.Product
import com.theauraflow.pos.domain.model.VariationType
import kotlinx.serialization.Serializable

/**
 * Database entity for Product.
 *
 * This is a plain data class that can be used by:
 * - Room (Android/iOS/Desktop) - Room will generate tables based on the data class
 * - IndexedDB (Web/Wasm) - used directly via kotlinx.serialization
 *
 * Note: Room annotations like @Entity, @PrimaryKey are added via expect/actual in platform-specific code.
 */
@Entity(tableName = "products")
@Serializable
data class ProductEntity(
    @PrimaryKey
    val id: String,
    val name: String,
    val sku: String? = null,
    val barcode: String? = null,
    val price: Double,
    val cost: Double? = null,
    val categoryId: String? = null,
    val categoryName: String? = null,
    val stockQuantity: Int = 0,
    val minStockLevel: Int = 0,
    val imageUrl: String? = null,
    val description: String? = null,
    val taxRate: Double = 0.0,
    val isActive: Boolean = true,
    val hasVariations: Boolean = false,
    val hasModifiers: Boolean = false,
    val variationTypeId: String? = null,
    val variationTypeName: String? = null,
    val createdAt: Long = 0L,
    val updatedAt: Long = 0L
)

/**
 * Extension function to convert ProductEntity to domain Product model.
 *
 * Note: Variations and modifiers are loaded separately via foreign key relationships.
 */
fun ProductEntity.toDomain(
    variations: List<com.theauraflow.pos.domain.model.ProductVariation> = emptyList(),
    modifiers: List<com.theauraflow.pos.domain.model.Modifier> = emptyList()
): Product {
    return Product(
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
        hasModifiers = hasModifiers,
        variationType = if (variationTypeId != null && variationTypeName != null) {
            VariationType(id = variationTypeId, name = variationTypeName)
        } else null,
        variations = variations.takeIf { it.isNotEmpty() },
        modifiers = modifiers.takeIf { it.isNotEmpty() }
    )
}

/**
 * Extension function to convert domain Product to ProductEntity.
 */
fun Product.toEntity(): ProductEntity {
    return ProductEntity(
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
        hasModifiers = hasModifiers,
        variationTypeId = variationType?.id,
        variationTypeName = variationType?.name,
        createdAt = 0L, // Will be set by the database
        updatedAt = 0L  // Will be set by the database
    )
}
