package com.theauraflow.pos.core.constants

/**
 * Application-wide constants.
 */
object AppConstants {
    // App Info
    const val APP_NAME = "AuraFlowPOS"
    const val APP_VERSION = "1.0.0"

    // Network
    const val API_BASE_URL = "https://api.auraflowpos.com/v1/"
    const val CONNECTION_TIMEOUT_MS = 30_000L
    const val READ_TIMEOUT_MS = 30_000L
    const val MAX_RETRY_COUNT = 3

    // Database
    const val DATABASE_NAME = "auraflow_pos.db"
    const val DATABASE_VERSION = 1

    // Pagination
    const val DEFAULT_PAGE_SIZE = 20
    const val MAX_PAGE_SIZE = 100

    // Cache
    const val CACHE_EXPIRY_MS = 5 * 60 * 1000L // 5 minutes

    // UI
    const val DEBOUNCE_DELAY_MS = 300L
    const val ANIMATION_DURATION_MS = 300

    // Business Logic
    const val MIN_PRODUCT_PRICE = 0.01
    const val MAX_PRODUCT_PRICE = 999999.99
    const val MAX_CART_ITEMS = 100
    const val TAX_RATE_DEFAULT = 0.0 // 0% default, configurable per location

    // Payment
    const val CASH_PAYMENT_TYPE = "CASH"
    const val CARD_PAYMENT_TYPE = "CARD"
    const val MOBILE_PAYMENT_TYPE = "MOBILE"

    // Preferences Keys
    object PreferenceKeys {
        const val AUTH_TOKEN = "auth_token"
        const val USER_ID = "user_id"
        const val SELECTED_PRESET = "selected_preset"
        const val THEME_MODE = "theme_mode"
        const val LANGUAGE = "language"
    }

    // Feature Flags
    object FeatureFlags {
        const val OFFLINE_MODE_ENABLED = true
        const val ANALYTICS_ENABLED = true
        const val DEBUG_MODE = false
    }
}