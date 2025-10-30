package com.theauraflow.pos.domain.usecase.order

import com.theauraflow.pos.domain.model.Order
import com.theauraflow.pos.domain.model.PaymentMethod
import com.theauraflow.pos.domain.repository.CartRepository
import com.theauraflow.pos.domain.repository.OrderRepository

/**
 * Use case for creating an order (checkout process).
 *
 * Business logic:
 * - Validates cart is not empty
 * - Validates payment amount for cash payments
 * - Creates order
 * - Clears cart on success
 */
class CreateOrderUseCase(
    private val orderRepository: OrderRepository,
    private val cartRepository: CartRepository
) {
    suspend operator fun invoke(
        customerId: String? = null,
        paymentMethod: PaymentMethod,
        amountPaid: Double? = null,
        notes: String? = null
    ): Result<Order> {
        // Validate cart is not empty
        val cartItems = cartRepository.getCart().getOrElse {
            return Result.failure(it)
        }

        if (cartItems.isEmpty()) {
            return Result.failure(
                IllegalStateException("Cannot create order with empty cart")
            )
        }

        // Get cart totals
        val totals = cartRepository.getCartTotals().getOrElse {
            return Result.failure(it)
        }

        // Validate cash payment
        if (paymentMethod == PaymentMethod.CASH) {
            if (amountPaid == null) {
                return Result.failure(
                    IllegalArgumentException("Amount paid is required for cash payments")
                )
            }
            if (amountPaid < totals.total) {
                return Result.failure(
                    IllegalArgumentException(
                        "Insufficient payment. Required: ${totals.total}, Paid: $amountPaid"
                    )
                )
            }
        }

        // Create order
        return orderRepository.createOrder(
            customerId = customerId,
            paymentMethod = paymentMethod,
            amountPaid = amountPaid,
            notes = notes
        ).onSuccess {
            // Clear cart on successful order
            cartRepository.clearCart()
        }
    }

    /**
     * Calculate change for cash payment.
     */
    fun calculateChange(total: Double, amountPaid: Double): Double {
        return (amountPaid - total).coerceAtLeast(0.0)
    }
}
