package com.theauraflow.pos.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.theauraflow.pos.domain.model.Customer
import kotlinx.serialization.Serializable

/**
 * Database entity for Customer.
 */
@Entity(tableName = "customers")
@Serializable
data class CustomerEntity(
    @PrimaryKey
    val id: String,
    val name: String,
    val email: String? = null,
    val phone: String? = null,
    val address: String? = null,
    val loyaltyPoints: Int = 0,
    val totalSpent: Double = 0.0,
    val orderCount: Int = 0,
    val isActive: Boolean = true,
    val notes: String? = null,
    val createdAt: Long = 0,
    val updatedAt: Long = 0
)

fun CustomerEntity.toDomain(): Customer {
    return Customer(
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
}

fun Customer.toEntity(): CustomerEntity {
    return CustomerEntity(
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
}
