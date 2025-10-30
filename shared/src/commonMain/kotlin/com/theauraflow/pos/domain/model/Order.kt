package com.theauraflow.pos.domain.model

import kotlinx.serialization.Serializable

/**
 * Domain model representing a completed order/transaction.
 */
@Serializable
data class Order(
    val id: String,
    val orderNumber: String,
    val items: List<CartItem>,
    val customerId: String? = null,
    val customerName: String? = null,
    val subtotal: Double,
    val tax: Double,
    val discount: Double = 0.0,
    val total: Double,
    val paymentMethod: PaymentMethod,
    val paymentStatus: PaymentStatus,
    val orderStatus: OrderStatus,
    val notes: String? = null,
    val createdAt: Long,
    val completedAt: Long? = null
) {
    /**
     * Check if order is completed.
     */
    val isCompleted: Boolean
        get() = orderStatus == OrderStatus.COMPLETED

    /**
     * Check if order is cancelled.
     */
    val isCancelled: Boolean
        get() = orderStatus == OrderStatus.CANCELLED

    /**
     * Check if payment is complete.
     */
    val isPaid: Boolean
        get() = paymentStatus == PaymentStatus.PAID

    /**
     * Get total number of items.
     */
    val itemCount: Int
        get() = items.sumOf { it.quantity }

    /**
     * Calculate change due (for cash payments).
     */
    fun calculateChange(amountPaid: Double): Double {
        return (amountPaid - total).coerceAtLeast(0.0)
    }

    companion object {
        /**
         * Generate a unique order number.
         */
        fun generateOrderNumber(timestamp: Long): String {
            return "ORD-${timestamp}"
        }
    }
}

/**
 * Payment methods supported in the POS system.
 */
@Serializable
enum class PaymentMethod {
    CASH,
    CARD,
    MOBILE,
    GIFT_CARD,
    OTHER
}

/**
 * Payment status of an order.
 */
@Serializable
enum class PaymentStatus {
    PENDING,
    PAID,
    REFUNDED,
    FAILED
}

/**
 * Order status in the system.
 */
@Serializable
enum class OrderStatus {
    PENDING,
    COMPLETED,
    CANCELLED,
    REFUNDED
}
