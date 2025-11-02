package com.theauraflow.pos.util

/**
 * Simple locale support for text variations.
 * Currently supports US English vs UK English.
 */
object Locale {
    enum class Region {
        US, // United States - uses "Check"
        UK  // United Kingdom - uses "Cheque"
    }

    private var currentRegion: Region = Region.US

    /**
     * Set the current region/locale.
     */
    fun setRegion(region: Region) {
        currentRegion = region
    }

    /**
     * Get the current region.
     */
    fun getRegion(): Region = currentRegion

    /**
     * Get localized text for "Check" vs "Cheque".
     */
    val check: String
        get() = when (currentRegion) {
            Region.US -> "Check"
            Region.UK -> "Cheque"
        }

    /**
     * Get localized text for "Split Check" vs "Split Cheque".
     */
    val splitCheck: String
        get() = "Split $check"
}