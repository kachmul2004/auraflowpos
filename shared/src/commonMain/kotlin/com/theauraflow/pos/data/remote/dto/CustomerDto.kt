package com.theauraflow.pos.data.remote.dto

import com.theauraflow.pos.domain.model.Customer
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

/**
 * Data Transfer Object for Customer API responses.
 */
@Serializable
data class CustomerDto(
    @SerialName("id") val id: String,
    @SerialName("name") val name: String,
    @SerialName("email") val email: String? = null,
    @SerialName("phone") val phone: String? = null,
    @SerialName("address") val address: String? = null,
    @SerialName("loyalty_points") val loyaltyPoints: Int = 0,
    @SerialName("total_spent") val totalSpent: Double = 0.0,
    @SerialName("order_count") val orderCount: Int = 0,
    @SerialName("notes") val notes: String? = null,
    @SerialName("is_active") val isActive: Boolean = true
)

/**
 * Convert CustomerDto to domain Customer model.
 */
fun CustomerDto.toDomain(): Customer = Customer(
    id = id,
    name = name,
    email = email,
    phone = phone,
    address = address,
    loyaltyPoints = loyaltyPoints,
    totalSpent = totalSpent,
    orderCount = orderCount,
    isActive = isActive,
    notes = notes
)

/**
 * Convert domain Customer to CustomerDto.
 */
fun Customer.toDto(): CustomerDto = CustomerDto(
    id = id,
    name = name,
    email = email,
    phone = phone,
    address = address,
    loyaltyPoints = loyaltyPoints,
    totalSpent = totalSpent,
    orderCount = orderCount,
    isActive = isActive,
    notes = notes
)