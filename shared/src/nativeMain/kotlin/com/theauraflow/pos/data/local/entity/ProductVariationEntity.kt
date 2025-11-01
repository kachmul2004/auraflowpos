package com.theauraflow.pos.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.ForeignKey
import com.theauraflow.pos.domain.model.ProductVariation
import kotlinx.serialization.Serializable

/**
 * Database entity for Product Variation.
 * Foreign key: productId -> ProductEntity.id
 */
@Entity(
    tableName = "product_variations",
    foreignKeys = [
        ForeignKey(
            entity = ProductEntity::class,
            parentColumns = ["id"],
            childColumns = ["productId"],
            onDelete = ForeignKey.CASCADE
        )
    ]
)
@Serializable
data class ProductVariationEntity(
    @PrimaryKey
    val id: String,
    val productId: String, // Foreign key
    val name: String,
    val price: Double,
    val stockQuantity: Int = 0,
    val sku: String? = null,
    val barcode: String? = null,
    val imageUrl: String? = null
)

fun ProductVariationEntity.toDomain(): ProductVariation {
    return ProductVariation(
        id = id,
        name = name,
        price = price,
        stockQuantity = stockQuantity,
        sku = sku,
        barcode = barcode,
        imageUrl = imageUrl
    )
}

fun ProductVariation.toEntity(productId: String): ProductVariationEntity {
    return ProductVariationEntity(
        id = id,
        productId = productId,
        name = name,
        price = price,
        stockQuantity = stockQuantity,
        sku = sku,
        barcode = barcode,
        imageUrl = imageUrl
    )
}
