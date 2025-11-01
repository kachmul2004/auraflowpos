package com.theauraflow.pos.data.remote.dto

import com.theauraflow.pos.domain.model.CartItem
import com.theauraflow.pos.domain.model.CartItemModifier
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

/**
 * Data Transfer Object for CartItemModifier (modifier with quantity).
 */
@Serializable
data class CartItemModifierDto(
    @SerialName("id") val id: String,
    @SerialName("name") val name: String,
    @SerialName("price") val price: Double,
    @SerialName("quantity") val quantity: Int = 1,
    @SerialName("groupId") val groupId: String? = null,
    @SerialName("groupName") val groupName: String? = null
)

/**
 * Convert CartItemModifierDto to domain CartItemModifier model.
 */
fun CartItemModifierDto.toDomain(): CartItemModifier = CartItemModifier(
    id = id,
    name = name,
    price = price,
    quantity = quantity,
    groupId = groupId,
    groupName = groupName
)

/**
 * Convert domain CartItemModifier to CartItemModifierDto.
 */
fun CartItemModifier.toDto(): CartItemModifierDto = CartItemModifierDto(
    id = id,
    name = name,
    price = price,
    quantity = quantity,
    groupId = groupId,
    groupName = groupName
)

/**
 * Data Transfer Object for CartItem in orders.
 */
@Serializable
data class CartItemDto(
    @SerialName("id") val id: String,
    @SerialName("product") val product: ProductDto,
    @SerialName("quantity") val quantity: Int,
    @SerialName("modifiers") val modifiers: List<CartItemModifierDto> = emptyList(),
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