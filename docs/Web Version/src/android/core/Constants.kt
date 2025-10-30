package com.auraflow.pos.core

/**
 * Application-wide constants
 */
object Constants {
    
    // App Info
    const val APP_NAME = "AuraFlow POS"
    const val APP_VERSION = "1.0.0"
    
    // Database
    const val DATABASE_NAME = "auraflow_pos.db"
    const val DATABASE_VERSION = 1
    
    // Shared Preferences
    const val PREFS_NAME = "auraflow_prefs"
    const val PREFS_USER_ID = "user_id"
    const val PREFS_BUSINESS_ID = "business_id"
    const val PREFS_LAST_SYNC = "last_sync"
    
    // Receipt
    const val RECEIPT_WIDTH = 48 // characters
    const val CURRENCY_SYMBOL = "$"
    const val CURRENCY_CODE = "USD"
    
    // Payments
    const val MIN_PAYMENT_AMOUNT = 0.01
    const val MAX_CASH_AMOUNT = 10000.0
    const val PAYMENT_TOLERANCE = 0.01 // 1 cent
    
    // Cart
    const val MAX_CART_ITEMS = 100
    const val MAX_ITEM_QUANTITY = 999
    
    // Discounts
    const val MAX_DISCOUNT_PERCENTAGE = 100.0
    const val MAX_DISCOUNT_FIXED = 10000.0
    
    // Tax
    const val DEFAULT_TAX_RATE = 0.08 // 8%
    
    // Tips
    const val TIP_PRESET_1 = 15.0
    const val TIP_PRESET_2 = 18.0
    const val TIP_PRESET_3 = 20.0
    const val TIP_PRESET_4 = 25.0
    
    // Quick Cash Amounts
    val QUICK_CASH_AMOUNTS = listOf(5.0, 10.0, 20.0, 50.0, 100.0)
    
    // Validation
    const val MIN_PIN_LENGTH = 4
    const val MAX_PIN_LENGTH = 6
    const val MIN_PRODUCT_NAME_LENGTH = 1
    const val MAX_PRODUCT_NAME_LENGTH = 100
    const val MIN_PRICE = 0.01
    const val MAX_PRICE = 999999.99
    
    // Network
    const val NETWORK_TIMEOUT = 30000L // 30 seconds
    const val RETRY_ATTEMPTS = 3
    const val RETRY_DELAY = 1000L // 1 second
    
    // Printing
    const val PRINT_COPIES = 1
    const val KITCHEN_PRINT_COPIES = 2
    
    // Barcode
    const val BARCODE_MIN_LENGTH = 8
    const val BARCODE_MAX_LENGTH = 20
    
    // Search
    const val SEARCH_MIN_CHARS = 2
    const val SEARCH_DEBOUNCE_MS = 300L
    
    // Animation
    const val ANIMATION_DURATION_SHORT = 150L
    const val ANIMATION_DURATION_MEDIUM = 300L
    const val ANIMATION_DURATION_LONG = 500L
    
    // Pagination
    const val PAGE_SIZE = 20
    const val INITIAL_LOAD_SIZE = 40
    
    // Cache
    const val CACHE_EXPIRY_MS = 3600000L // 1 hour
    const val MAX_CACHE_SIZE = 50 * 1024 * 1024 // 50 MB
    
    // Order Types
    val DEFAULT_ORDER_TYPES = listOf(
        "dine-in" to "Dine In",
        "takeout" to "Takeout",
        "delivery" to "Delivery"
    )
    
    // Category Icons (Material Icon names)
    val CATEGORY_ICONS = mapOf(
        "all" to "grid_view",
        "coffee" to "coffee",
        "food" to "restaurant",
        "drinks" to "local_bar",
        "desserts" to "cake",
        "merchandise" to "shopping_bag"
    )
}

object ErrorMessages {
    const val NETWORK_ERROR = "Network error. Please check your connection."
    const val INVALID_CREDENTIALS = "Invalid credentials. Please try again."
    const val INSUFFICIENT_STOCK = "Insufficient stock for this item."
    const val CART_EMPTY = "Cart is empty. Add items to continue."
    const val PAYMENT_INSUFFICIENT = "Payment amount is insufficient."
    const val INVALID_PIN = "Invalid PIN. Please try again."
    const val UNAUTHORIZED = "You don't have permission to perform this action."
    const val GENERIC_ERROR = "An error occurred. Please try again."
}

object SuccessMessages {
    const val ORDER_CREATED = "Order created successfully!"
    const val ORDER_HELD = "Order held successfully."
    const val PAYMENT_COMPLETE = "Payment completed successfully!"
    const val LOGIN_SUCCESS = "Logged in successfully!"
    const val CLOCK_IN_SUCCESS = "Clocked in successfully!"
    const val CLOCK_OUT_SUCCESS = "Clocked out successfully!"
}
