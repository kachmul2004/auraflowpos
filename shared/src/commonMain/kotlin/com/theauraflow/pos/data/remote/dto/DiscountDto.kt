package com.theauraflow.pos.data.remote.dto

import com.theauraflow.pos.domain.model.Discount
import com.theauraflow.pos.domain.model.DiscountType
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

/**
 * Data Transfer Object for Discount API responses.
 */
@Serializable
data class DiscountDto(
    @SerialName("id") val id: String,
    @SerialName("name") val name: String,
    @SerialName("type") val type: String,
    @SerialName("value") val value: Double,
    @SerialName("code") val code: String? = null,
    @SerialName("is_active") val isActive: Boolean = true
)

/**
 * Convert DiscountDto to domain Discount model.
 */
fun DiscountDto.toDomain(): Discount = Discount(
    id = id,
    name = name,
    type = DiscountType.valueOf(type.uppercase().replace("-", "_")),
    value = value,
    code = code,
    isActive = isActive
)

/**
 * Convert domain Discount to DiscountDto.
 */
fun Discount.toDto(): DiscountDto = DiscountDto(
    id = id,
    name = name,
    type = type.name.lowercase().replace("_", "-"),
    value = value,
    code = code,
    isActive = isActive
)