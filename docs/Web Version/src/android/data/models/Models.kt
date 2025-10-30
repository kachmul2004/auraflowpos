package com.auraflow.pos.data.models

import java.time.LocalDateTime
import java.util.UUID

// ============================================================================
// PRODUCT MODELS
// ============================================================================

data class Product(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val price: Double,
    val category: String,
    val imageUrl: String? = null,
    val stock: Int = 0,
    val sku: String? = null,
    val barcode: String? = null,
    val description: String? = null,
    val taxable: Boolean = true,
    val variations: List<ProductVariation> = emptyList(),
    val modifiers: List<Modifier> = emptyList(),
    val isActive: Boolean = true,
    val cost: Double? = null
)

data class ProductVariation(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val options: List<VariationOption>
)

data class VariationOption(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val priceAdjustment: Double = 0.0
)

data class Modifier(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val priceAdjustment: Double = 0.0,
    val category: String? = null
)

// ============================================================================
// CART MODELS
// ============================================================================

data class CartItem(
    val id: String = UUID.randomUUID().toString(),
    val product: Product,
    val quantity: Int = 1,
    val selectedVariations: Map<String, VariationOption> = emptyMap(),
    val selectedModifiers: List<Modifier> = emptyList(),
    val notes: String? = null,
    val priceOverride: Double? = null,
    val discount: ItemDiscount? = null
) {
    val unitPrice: Double
        get() {
            val basePrice = priceOverride ?: product.price
            val variationAdjustment = selectedVariations.values.sumOf { it.priceAdjustment }
            val modifierAdjustment = selectedModifiers.sumOf { it.priceAdjustment }
            return basePrice + variationAdjustment + modifierAdjustment
        }

    val totalPrice: Double
        get() {
            val subtotal = unitPrice * quantity
            return when (discount?.type) {
                DiscountType.PERCENTAGE -> subtotal * (1 - discount.value / 100)
                DiscountType.FIXED -> maxOf(0.0, subtotal - discount.value)
                else -> subtotal
            }
        }
}

data class ItemDiscount(
    val type: DiscountType,
    val value: Double,
    val reason: String? = null
)

enum class DiscountType {
    PERCENTAGE,
    FIXED
}

// ============================================================================
// ORDER MODELS
// ============================================================================

data class Order(
    val id: String = UUID.randomUUID().toString(),
    val orderNumber: String,
    val items: List<CartItem>,
    val subtotal: Double,
    val discount: Double = 0.0,
    val tax: Double,
    val tip: Double = 0.0,
    val total: Double,
    val paymentMethods: List<PaymentMethod>,
    val status: OrderStatus = OrderStatus.COMPLETED,
    val orderType: OrderType = OrderType.DINE_IN,
    val customer: Customer? = null,
    val employee: User? = null,
    val timestamp: LocalDateTime = LocalDateTime.now(),
    val notes: String? = null,
    val tableNumber: String? = null
)

data class PaymentMethod(
    val method: PaymentMethodType,
    val amount: Double,
    val tender: Double? = null,
    val change: Double? = null,
    val giftCardNumber: String? = null
)

enum class PaymentMethodType {
    CASH,
    CARD,
    CHEQUE,
    GIFT_CARD
}

enum class OrderStatus {
    PENDING,
    COMPLETED,
    REFUNDED,
    VOIDED,
    HELD,
    PARKED
}

enum class OrderType {
    DINE_IN,
    TAKEOUT,
    DELIVERY,
    DRIVE_THRU,
    PICKUP,
    CURBSIDE
}

// ============================================================================
// CUSTOMER MODELS
// ============================================================================

data class Customer(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val email: String? = null,
    val phone: String? = null,
    val address: String? = null,
    val loyaltyPoints: Int = 0,
    val totalSpent: Double = 0.0,
    val visitCount: Int = 0,
    val notes: String? = null,
    val createdAt: LocalDateTime = LocalDateTime.now()
)

// ============================================================================
// USER MODELS
// ============================================================================

data class User(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val email: String,
    val role: UserRole,
    val pin: String,
    val isActive: Boolean = true,
    val permissions: Set<Permission> = emptySet()
)

enum class UserRole {
    CASHIER,
    MANAGER,
    ADMIN
}

enum class Permission {
    MANAGE_PRODUCTS,
    MANAGE_USERS,
    MANAGE_SETTINGS,
    VOID_TRANSACTIONS,
    REFUND_ORDERS,
    PRICE_OVERRIDE,
    DISCOUNT_ITEMS,
    VIEW_REPORTS,
    MANAGE_CASH_DRAWER,
    CLOCK_IN_OUT
}

// ============================================================================
// SHIFT MODELS
// ============================================================================

data class Shift(
    val id: String = UUID.randomUUID().toString(),
    val userId: String,
    val userName: String,
    val clockIn: LocalDateTime,
    val clockOut: LocalDateTime? = null,
    val startingCash: Double = 0.0,
    val endingCash: Double? = null,
    val totalSales: Double = 0.0,
    val transactions: Int = 0
)

// ============================================================================
// GIFT CARD MODELS
// ============================================================================

data class GiftCard(
    val number: String,
    val balance: Double,
    val isActive: Boolean = true
)

// ============================================================================
// BUSINESS PROFILE MODELS
// ============================================================================

data class BusinessProfile(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val address: String? = null,
    val phone: String? = null,
    val email: String? = null,
    val taxRate: Double = 0.08,
    val currency: String = "USD",
    val receiptHeader: String? = null,
    val receiptFooter: String? = null,
    val logo: String? = null,
    val subscriptions: List<String> = emptyList(),
    val industryType: IndustryType = IndustryType.GENERAL
)

enum class IndustryType {
    GENERAL,
    RESTAURANT,
    RETAIL,
    BAR,
    CAFE,
    SALON,
    PHARMACY
}

// ============================================================================
// CATEGORY MODEL
// ============================================================================

data class Category(
    val id: String,
    val name: String,
    val icon: String,
    val color: String
)

// ============================================================================
// HELD ORDER MODEL
// ============================================================================

data class HeldOrder(
    val id: String = UUID.randomUUID().toString(),
    val items: List<CartItem>,
    val customer: Customer? = null,
    val notes: String? = null,
    val timestamp: LocalDateTime = LocalDateTime.now()
)

// ============================================================================
// TABLE MODELS (for restaurant/bar)
// ============================================================================

data class Table(
    val id: String = UUID.randomUUID().toString(),
    val number: String,
    val seats: Int = 4,
    val status: TableStatus = TableStatus.AVAILABLE,
    val currentOrder: Order? = null
)

enum class TableStatus {
    AVAILABLE,
    OCCUPIED,
    RESERVED,
    NEEDS_CLEANING
}

// ============================================================================
// TAB MODELS (for bar)
// ============================================================================

data class Tab(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val customer: Customer? = null,
    val items: List<CartItem>,
    val subtotal: Double,
    val openedAt: LocalDateTime = LocalDateTime.now(),
    val openedBy: User
)
