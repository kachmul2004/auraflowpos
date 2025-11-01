package com.theauraflow.pos.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.ForeignKey
import com.theauraflow.pos.domain.model.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

/**
 * Database entity for Order Item (CartItem stored in order).
 * Foreign key: orderId -> OrderEntity.id
 *
 * Note: modifiers are serialized as JSON string for storage.
 */
@Entity(
    tableName = "order_items",
    foreignKeys = [
        ForeignKey(
            entity = OrderEntity::class,
            parentColumns = ["id"],
            childColumns = ["orderId"],
            onDelete = ForeignKey.CASCADE
        )
    ]
)
@Serializable
data class OrderItemEntity(
    @PrimaryKey
    val id: String,
    val orderId: String, // Foreign key
    val productId: String,
    val productName: String,
    val productPrice: Double,
    val variationId: String? = null,
    val variationName: String? = null,
    val variationPrice: Double? = null,
    val quantity: Int,
    val modifiersJson: String? = null, // Serialized CartItemModifier list
    val discountJson: String? = null, // Serialized Discount object
    val notes: String? = null
)

/**
 * Helper to serialize modifiers to JSON.
 */
fun List<CartItemModifier>.toJson(): String {
    return Json.encodeToString(this)
}

/**
 * Helper to deserialize modifiers from JSON.
 */
fun String.toModifierList(): List<CartItemModifier> {
    return try {
        Json.decodeFromString<List<CartItemModifier>>(this)
    } catch (e: Exception) {
        emptyList()
    }
}

/**
 * Helper to serialize discount to JSON.
 */
fun Discount.toJson(): String {
    return Json.encodeToString(this)
}

/**
 * Helper to deserialize discount from JSON.
 */
fun String.toDiscount(): Discount? {
    return try {
        Json.decodeFromString<Discount>(this)
    } catch (e: Exception) {
        null
    }
}

fun OrderItemEntity.toDomain(product: Product): CartItem {
    val variation = if (variationId != null && variationName != null && variationPrice != null) {
        ProductVariation(
            id = variationId,
            name = variationName,
            price = variationPrice,
            stockQuantity = 0
        )
    } else null

    val modifiers = modifiersJson?.toModifierList() ?: emptyList()
    val discount = discountJson?.toDiscount()

    return CartItem(
        id = id,
        product = product,
        variation = variation,
        quantity = quantity,
        modifiers = modifiers,
        discount = discount,
        notes = notes
    )
}

fun CartItem.toEntity(orderId: String): OrderItemEntity {
    return OrderItemEntity(
        id = id,
        orderId = orderId,
        productId = product.id,
        productName = product.name,
        productPrice = product.price,
        variationId = variation?.id,
        variationName = variation?.name,
        variationPrice = variation?.price,
        quantity = quantity,
        modifiersJson = modifiers.takeIf { it.isNotEmpty() }?.toJson(),
        discountJson = discount?.toJson(),
        notes = notes
    )
}
