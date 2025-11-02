package com.theauraflow.pos.data.repository

import com.theauraflow.pos.data.local.LocalStorage
import com.theauraflow.pos.domain.repository.SettingsRepository

/**
 * Implementation of SettingsRepository using LocalStorage.
 */
class SettingsRepositoryImpl(
    private val localStorage: LocalStorage
) : SettingsRepository {

    companion object {
        private const val KEY_DARK_MODE = "dark_mode"
        private const val KEY_SOUND_ENABLED = "sound_enabled"
        private const val KEY_AUTO_PRINT = "auto_print_receipts"
        private const val KEY_LAST_CATEGORY = "last_category"
    }

    override suspend fun getDarkMode(): Boolean {
        return localStorage.getString(KEY_DARK_MODE)?.toBoolean() ?: true
    }

    override suspend fun setDarkMode(enabled: Boolean) {
        localStorage.saveString(KEY_DARK_MODE, enabled.toString())
    }

    override suspend fun getSoundEnabled(): Boolean {
        return localStorage.getString(KEY_SOUND_ENABLED)?.toBoolean() ?: true
    }

    override suspend fun setSoundEnabled(enabled: Boolean) {
        localStorage.saveString(KEY_SOUND_ENABLED, enabled.toString())
    }

    override suspend fun getAutoPrintReceipts(): Boolean {
        return localStorage.getString(KEY_AUTO_PRINT)?.toBoolean() ?: false
    }

    override suspend fun setAutoPrintReceipts(enabled: Boolean) {
        localStorage.saveString(KEY_AUTO_PRINT, enabled.toString())
    }

    override suspend fun getLastCategory(): String? {
        return localStorage.getString(KEY_LAST_CATEGORY)
    }

    override suspend fun setLastCategory(category: String) {
        localStorage.saveString(KEY_LAST_CATEGORY, category)
    }
}
