package com.auraflow.pos.domain.subscription

import com.auraflow.pos.data.models.IndustryType

/**
 * Manages subscription features and presets for the POS system
 */
class SubscriptionManager {
    
    private var activeSubscriptions = mutableSetOf<String>()
    private var industryType: IndustryType = IndustryType.GENERAL
    
    fun setSubscriptions(subscriptions: List<String>) {
        activeSubscriptions = subscriptions.toMutableSet()
    }
    
    fun setIndustryType(type: IndustryType) {
        industryType = type
    }
    
    fun hasFeature(feature: String): Boolean {
        return activeSubscriptions.any { subscription ->
            getPresetFeatures(subscription).contains(feature)
        }
    }
    
    fun hasSubscription(subscription: String): Boolean {
        return activeSubscriptions.contains(subscription)
    }
    
    fun getActiveFeatures(): Set<String> {
        return activeSubscriptions.flatMap { getPresetFeatures(it) }.toSet()
    }
    
    private fun getPresetFeatures(preset: String): Set<String> {
        return when (preset) {
            "general" -> GeneralPreset.features
            "retail" -> RetailPreset.features
            "restaurant" -> RestaurantPreset.features
            "bar" -> BarPreset.features
            "cafe" -> CafePreset.features
            "salon" -> SalonPreset.features
            "pharmacy" -> PharmacyPreset.features
            "ultimate" -> UltimatePreset.features
            else -> emptySet()
        }
    }
    
    fun getOrderTypesForIndustry(): List<String> {
        return when (industryType) {
            IndustryType.RESTAURANT, IndustryType.CAFE -> 
                listOf("dine-in", "takeout", "delivery")
            IndustryType.BAR -> 
                listOf("dine-in", "takeout")
            IndustryType.RETAIL, IndustryType.SALON, IndustryType.PHARMACY -> 
                listOf("in-store", "online")
            else -> 
                listOf("standard")
        }
    }
}

// ============================================================================
// PRESET DEFINITIONS
// ============================================================================

object GeneralPreset {
    val features = setOf(
        "basic-pos",
        "cash-drawer",
        "receipt-printing",
        "product-management",
        "basic-reporting",
        "user-management"
    )
}

object RetailPreset {
    val features = GeneralPreset.features + setOf(
        "inventory-tracking",
        "barcode-scanner",
        "customer-management",
        "discount-management",
        "gift-cards",
        "loyalty-program",
        "returns-exchanges"
    )
}

object RestaurantPreset {
    val features = GeneralPreset.features + setOf(
        "table-management",
        "order-types",
        "tipping",
        "kitchen-display",
        "course-management",
        "split-checks",
        "modifiers",
        "variations"
    )
}

object BarPreset {
    val features = RestaurantPreset.features + setOf(
        "open-tabs",
        "tab-management",
        "happy-hour",
        "age-verification",
        "quick-drink-builder"
    )
}

object CafePreset {
    val features = GeneralPreset.features + setOf(
        "order-types",
        "tipping",
        "modifiers",
        "variations",
        "loyalty-program",
        "customer-management",
        "inventory-tracking"
    )
}

object SalonPreset {
    val features = GeneralPreset.features + setOf(
        "appointments",
        "service-providers",
        "customer-notes",
        "tipping",
        "package-deals",
        "loyalty-program"
    )
}

object PharmacyPreset {
    val features = RetailPreset.features + setOf(
        "prescription-tracking",
        "inventory-expiration",
        "customer-profiles",
        "insurance-billing",
        "regulated-substances"
    )
}

object UltimatePreset {
    val features = setOf(
        // All General
        "basic-pos",
        "cash-drawer",
        "receipt-printing",
        "product-management",
        "basic-reporting",
        "user-management",
        
        // All Retail
        "inventory-tracking",
        "barcode-scanner",
        "customer-management",
        "discount-management",
        "gift-cards",
        "loyalty-program",
        "returns-exchanges",
        
        // All Restaurant/Bar
        "table-management",
        "order-types",
        "tipping",
        "kitchen-display",
        "course-management",
        "split-checks",
        "modifiers",
        "variations",
        "open-tabs",
        "tab-management",
        "happy-hour",
        "age-verification",
        "quick-drink-builder",
        
        // All Salon
        "appointments",
        "service-providers",
        "customer-notes",
        "package-deals",
        
        // All Pharmacy
        "prescription-tracking",
        "inventory-expiration",
        "insurance-billing",
        "regulated-substances",
        
        // Advanced
        "multi-location",
        "advanced-analytics",
        "custom-reporting",
        "api-integrations",
        "employee-performance",
        "price-optimization",
        "automated-ordering"
    )
}

// ============================================================================
// FEATURE DESCRIPTIONS
// ============================================================================

object FeatureDescriptions {
    val descriptions = mapOf(
        "basic-pos" to "Core point-of-sale functionality",
        "cash-drawer" to "Cash management and drawer tracking",
        "receipt-printing" to "Print physical receipts",
        "product-management" to "Add, edit, and organize products",
        "basic-reporting" to "Sales reports and analytics",
        "user-management" to "Manage employees and permissions",
        "inventory-tracking" to "Track stock levels and reorder",
        "barcode-scanner" to "Scan product barcodes",
        "customer-management" to "Track customer information",
        "discount-management" to "Apply discounts and promotions",
        "gift-cards" to "Sell and redeem gift cards",
        "loyalty-program" to "Customer loyalty and rewards",
        "returns-exchanges" to "Process returns and exchanges",
        "table-management" to "Manage dining tables",
        "order-types" to "Dine-in, takeout, delivery options",
        "tipping" to "Add tips to transactions",
        "kitchen-display" to "Display orders in kitchen",
        "course-management" to "Manage meal courses",
        "split-checks" to "Split bills among customers",
        "modifiers" to "Customize items with modifiers",
        "variations" to "Product size/color variations",
        "open-tabs" to "Keep customer tabs open",
        "tab-management" to "Manage bar tabs",
        "happy-hour" to "Time-based pricing",
        "age-verification" to "Verify customer age",
        "quick-drink-builder" to "Build drinks quickly",
        "appointments" to "Schedule appointments",
        "service-providers" to "Assign staff to services",
        "customer-notes" to "Store customer preferences",
        "package-deals" to "Create service packages",
        "prescription-tracking" to "Track prescriptions",
        "inventory-expiration" to "Monitor expiration dates",
        "insurance-billing" to "Process insurance claims",
        "regulated-substances" to "Track controlled items",
        "multi-location" to "Manage multiple locations",
        "advanced-analytics" to "Detailed business analytics",
        "custom-reporting" to "Create custom reports",
        "api-integrations" to "Connect with third-party services",
        "employee-performance" to "Track employee metrics",
        "price-optimization" to "AI-powered pricing",
        "automated-ordering" to "Auto-generate purchase orders"
    )
}
