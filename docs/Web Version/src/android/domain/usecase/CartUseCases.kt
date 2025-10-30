package com.auraflow.pos.domain.usecase

import com.auraflow.pos.data.models.*
import com.auraflow.pos.data.repository.POSRepository

/**
 * Use cases for cart operations
 * Encapsulates business logic and validation
 */
class CartUseCases(private val repository: POSRepository) {
    
    fun addProductToCart(product: Product, quantity: Int = 1): Result<Unit> {
        if (quantity <= 0) {
            return Result.failure(IllegalArgumentException("Quantity must be positive"))
        }
        
        if (product.stock < quantity) {
            return Result.failure(IllegalStateException("Insufficient stock"))
        }
        
        repository.addToCart(product, quantity)
        return Result.success(Unit)
    }
    
    fun addItemToCart(cartItem: CartItem): Result<Unit> {
        if (cartItem.quantity <= 0) {
            return Result.failure(IllegalArgumentException("Quantity must be positive"))
        }
        
        repository.addToCart(cartItem)
        return Result.success(Unit)
    }
    
    fun updateItemQuantity(itemId: String, quantity: Int): Result<Unit> {
        if (quantity < 0) {
            return Result.failure(IllegalArgumentException("Quantity cannot be negative"))
        }
        
        repository.updateQuantity(itemId, quantity)
        return Result.success(Unit)
    }
    
    fun removeItemFromCart(itemId: String) {
        repository.removeFromCart(itemId)
    }
    
    fun clearCart() {
        repository.clearCart()
    }
    
    fun applyDiscount(discount: ItemDiscount): Result<Unit> {
        when (discount.type) {
            DiscountType.PERCENTAGE -> {
                if (discount.value < 0 || discount.value > 100) {
                    return Result.failure(
                        IllegalArgumentException("Percentage must be between 0 and 100")
                    )
                }
            }
            DiscountType.FIXED -> {
                if (discount.value < 0) {
                    return Result.failure(
                        IllegalArgumentException("Fixed discount cannot be negative")
                    )
                }
            }
        }
        
        repository.setDiscount(discount)
        return Result.success(Unit)
    }
    
    fun removeDiscount() {
        repository.setDiscount(null)
    }
    
    fun setOrderType(orderType: OrderType) {
        repository.setOrderType(orderType)
    }
}
