package com.auraflow.pos.models

/**
 * Product data model
 */
data class Product(
    val id: String,
    val name: String,
    val price: Double,
    val priceDisplay: String,
    val category: String,
    val sku: String = "",
    val barcode: String? = null,
    val stock: Int = 0,
    val imageUrl: String? = null,
    val description: String? = null,
    val taxRate: Double = 0.0,
    val hasVariations: Boolean = false,
    val hasModifiers: Boolean = false,
    val isActive: Boolean = true
)

/**
 * Category enum matching the React app
 */
enum class Category(val displayName: String) {
    GROCERIES("Groceries"),
    BEVERAGES("Beverages"),
    SNACKS("Snacks"),
    DAIRY("Dairy"),
    BAKERY("Bakery"),
    MEAT("Meat"),
    PRODUCE("Produce"),
    FROZEN("Frozen"),
    HOUSEHOLD("Household"),
    PERSONAL_CARE("Personal Care"),
    COFFEE("Coffee"),
    ALCOHOL("Alcohol"),
    FOOD("Food"),
    OTHER("Other")
}

/**
 * Cart item model
 */
data class CartItem(
    val id: String,
    val product: Product,
    val quantity: Int,
    val price: Double,
    val note: String? = null,
    val discount: Double = 0.0
) {
    val subtotal: Double
        get() = (price * quantity) - discount
}

/**
 * Order type enum
 */
enum class OrderType(val displayName: String) {
    DINE_IN("Dine In"),
    TAKEOUT("Takeout"),
    DELIVERY("Delivery"),
    PICKUP("Pickup")
}
