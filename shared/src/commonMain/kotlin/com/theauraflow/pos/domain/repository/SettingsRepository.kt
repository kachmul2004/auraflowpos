package com.theauraflow.pos.domain.repository

/**
 * Repository for managing app settings and preferences.
 */
interface SettingsRepository {
    /**
     * Get dark mode preference.
     */
    suspend fun getDarkMode(): Boolean

    /**
     * Set dark mode preference.
     */
    suspend fun setDarkMode(enabled: Boolean)

    /**
     * Get sound effects enabled preference.
     */
    suspend fun getSoundEnabled(): Boolean

    /**
     * Set sound effects enabled preference.
     */
    suspend fun setSoundEnabled(enabled: Boolean)

    /**
     * Get auto-print receipts preference.
     */
    suspend fun getAutoPrintReceipts(): Boolean

    /**
     * Set auto-print receipts preference.
     */
    suspend fun setAutoPrintReceipts(enabled: Boolean)

    /**
     * Get last selected category.
     */
    suspend fun getLastCategory(): String?

    /**
     * Set last selected category.
     */
    suspend fun setLastCategory(category: String)
}
