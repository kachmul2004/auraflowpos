package com.theauraflow.pos.data.remote.dto

import com.theauraflow.pos.domain.model.CartItem
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

/**
 * Data Transfer Object for CartItem in orders.
 */
@Serializable
data class CartItemDto(
    @SerialName("id") val id: String,
    @SerialName("product") val product: ProductDto,
    @SerialName("quantity") val quantity: Int,
    @SerialName("modifiers") val modifiers: List<ModifierDto> = emptyList(),
    @SerialName("discount") val discount: DiscountDto? = null,
    @SerialName("notes") val notes: String? = null
)

/**
 * Convert CartItemDto to domain CartItem model.
 */
fun CartItemDto.toDomain(): CartItem = CartItem(
    id = id,
    product = product.toDomain(),
    quantity = quantity,
    modifiers = modifiers.map { it.toDomain() },
    discount = discount?.toDomain(),
    notes = notes
)

/**
 * Convert domain CartItem to CartItemDto.
 */
fun CartItem.toDto(): CartItemDto = CartItemDto(
    id = id,
    product = product.toDto(),
    quantity = quantity,
    modifiers = modifiers.map { it.toDto() },
    discount = discount?.toDto(),
    notes = notes
)