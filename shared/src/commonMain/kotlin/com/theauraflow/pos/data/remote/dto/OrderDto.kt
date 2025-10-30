package com.theauraflow.pos.data.remote.dto

import com.theauraflow.pos.domain.model.Order
import com.theauraflow.pos.domain.model.OrderStatus
import com.theauraflow.pos.domain.model.PaymentMethod
import com.theauraflow.pos.domain.model.PaymentStatus
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

/**
 * Data Transfer Object for Order API responses.
 */
@Serializable
data class OrderDto(
    @SerialName("id") val id: String,
    @SerialName("order_number") val orderNumber: String,
    @SerialName("items") val items: List<CartItemDto>,
    @SerialName("customer_id") val customerId: String? = null,
    @SerialName("customer_name") val customerName: String? = null,
    @SerialName("subtotal") val subtotal: Double,
    @SerialName("tax") val tax: Double,
    @SerialName("discount") val discount: Double = 0.0,
    @SerialName("total") val total: Double,
    @SerialName("payment_method") val paymentMethod: String,
    @SerialName("payment_status") val paymentStatus: String,
    @SerialName("order_status") val orderStatus: String,
    @SerialName("notes") val notes: String? = null,
    @SerialName("created_at") val createdAt: Long,
    @SerialName("completed_at") val completedAt: Long? = null
)

/**
 * Convert OrderDto to domain Order model.
 */
fun OrderDto.toDomain(): Order = Order(
    id = id,
    orderNumber = orderNumber,
    items = items.map { it.toDomain() },
    customerId = customerId,
    customerName = customerName,
    subtotal = subtotal,
    tax = tax,
    discount = discount,
    total = total,
    paymentMethod = PaymentMethod.valueOf(paymentMethod.uppercase()),
    paymentStatus = PaymentStatus.valueOf(paymentStatus.uppercase()),
    orderStatus = OrderStatus.valueOf(orderStatus.uppercase()),
    notes = notes,
    createdAt = createdAt,
    completedAt = completedAt
)

/**
 * Convert domain Order to OrderDto.
 */
fun Order.toDto(): OrderDto = OrderDto(
    id = id,
    orderNumber = orderNumber,
    items = items.map { it.toDto() },
    customerId = customerId,
    customerName = customerName,
    subtotal = subtotal,
    tax = tax,
    discount = discount,
    total = total,
    paymentMethod = paymentMethod.name.lowercase(),
    paymentStatus = paymentStatus.name.lowercase(),
    orderStatus = orderStatus.name.lowercase(),
    notes = notes,
    createdAt = createdAt,
    completedAt = completedAt
)