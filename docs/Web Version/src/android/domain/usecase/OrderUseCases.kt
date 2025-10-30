package com.auraflow.pos.domain.usecase

import com.auraflow.pos.data.models.*
import com.auraflow.pos.data.repository.POSRepository

/**
 * Use cases for order operations
 */
class OrderUseCases(private val repository: POSRepository) {
    
    fun createOrder(
        paymentMethods: List<PaymentMethod>,
        tip: Double = 0.0,
        customer: Customer? = null,
        notes: String? = null
    ): Result<Order> {
        // Validate payments
        if (paymentMethods.isEmpty()) {
            return Result.failure(IllegalArgumentException("At least one payment method required"))
        }
        
        if (paymentMethods.any { it.amount <= 0 }) {
            return Result.failure(IllegalArgumentException("Payment amounts must be positive"))
        }
        
        if (tip < 0) {
            return Result.failure(IllegalArgumentException("Tip cannot be negative"))
        }
        
        val order = repository.createOrder(paymentMethods, tip, customer, notes)
            ?: return Result.failure(IllegalStateException("Cart is empty"))
        
        return Result.success(order)
    }
    
    fun holdOrder(customer: Customer? = null, notes: String? = null): Result<Unit> {
        repository.holdOrder(customer, notes)
        return Result.success(Unit)
    }
    
    fun recallHeldOrder(orderId: String): Result<Unit> {
        repository.recallHeldOrder(orderId)
        return Result.success(Unit)
    }
    
    fun deleteHeldOrder(orderId: String): Result<Unit> {
        repository.deleteHeldOrder(orderId)
        return Result.success(Unit)
    }
    
    fun validatePayments(paymentMethods: List<PaymentMethod>, total: Double): Result<Unit> {
        val totalPaid = paymentMethods.sumOf { it.amount }
        
        if (totalPaid < total - 0.01) { // Allow 1 cent tolerance
            return Result.failure(
                IllegalStateException("Payment insufficient. Need ${total - totalPaid} more")
            )
        }
        
        return Result.success(Unit)
    }
}
