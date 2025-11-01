package com.theauraflow.pos.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.theauraflow.pos.domain.model.*
import kotlinx.serialization.Serializable

/**
 * Database entity for Order.
 * Order items are stored separately in OrderItemEntity with foreign key.
 */
@Entity(tableName = "orders")
@Serializable
data class OrderEntity(
    @PrimaryKey
    val id: String,
    val orderNumber: String,
    val customerId: String? = null,
    val customerName: String? = null,
    val subtotal: Double,
    val tax: Double,
    val discount: Double = 0.0,
    val total: Double,
    val paymentMethod: String, // "CASH", "CARD", "MOBILE", etc.
    val paymentStatus: String, // "PENDING", "PAID", "REFUNDED", "FAILED"
    val orderStatus: String, // "PENDING", "COMPLETED", "CANCELLED", "REFUNDED"
    val notes: String? = null,
    val createdAt: Long,
    val completedAt: Long? = null
)

fun OrderEntity.toDomain(items: List<CartItem>): Order {
    return Order(
        id = id,
        orderNumber = orderNumber,
        items = items,
        customerId = customerId,
        customerName = customerName,
        subtotal = subtotal,
        tax = tax,
        discount = discount,
        total = total,
        paymentMethod = PaymentMethod.valueOf(paymentMethod),
        paymentStatus = PaymentStatus.valueOf(paymentStatus),
        orderStatus = OrderStatus.valueOf(orderStatus),
        notes = notes,
        createdAt = createdAt,
        completedAt = completedAt
    )
}

fun Order.toEntity(): OrderEntity {
    return OrderEntity(
        id = id,
        orderNumber = orderNumber,
        customerId = customerId,
        customerName = customerName,
        subtotal = subtotal,
        tax = tax,
        discount = discount,
        total = total,
        paymentMethod = paymentMethod.name,
        paymentStatus = paymentStatus.name,
        orderStatus = orderStatus.name,
        notes = notes,
        createdAt = createdAt,
        completedAt = completedAt
    )
}
