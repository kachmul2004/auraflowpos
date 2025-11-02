package com.theauraflow.pos.presentation.viewmodel

import com.theauraflow.pos.domain.repository.SettingsRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

/**
 * ViewModel for managing app settings and preferences.
 */
class SettingsViewModel(
    private val settingsRepository: SettingsRepository,
    private val scope: CoroutineScope
) {
    private val _darkMode = MutableStateFlow(true)
    val darkMode: StateFlow<Boolean> = _darkMode.asStateFlow()

    private val _soundEnabled = MutableStateFlow(true)
    val soundEnabled: StateFlow<Boolean> = _soundEnabled.asStateFlow()

    private val _autoPrintReceipts = MutableStateFlow(false)
    val autoPrintReceipts: StateFlow<Boolean> = _autoPrintReceipts.asStateFlow()

    private val _lastCategory = MutableStateFlow<String?>(null)
    val lastCategory: StateFlow<String?> = _lastCategory.asStateFlow()

    init {
        // Load initial values
        scope.launch {
            _darkMode.value = settingsRepository.getDarkMode()
            _soundEnabled.value = settingsRepository.getSoundEnabled()
            _autoPrintReceipts.value = settingsRepository.getAutoPrintReceipts()
            _lastCategory.value = settingsRepository.getLastCategory()
        }
    }

    /**
     * Toggle dark mode.
     */
    fun toggleDarkMode() {
        scope.launch {
            val newValue = !_darkMode.value
            _darkMode.value = newValue
            settingsRepository.setDarkMode(newValue)
        }
    }

    /**
     * Toggle sound effects.
     */
    fun toggleSound() {
        scope.launch {
            val newValue = !_soundEnabled.value
            _soundEnabled.value = newValue
            settingsRepository.setSoundEnabled(newValue)
        }
    }

    /**
     * Toggle auto-print receipts.
     */
    fun toggleAutoPrint() {
        scope.launch {
            val newValue = !_autoPrintReceipts.value
            _autoPrintReceipts.value = newValue
            settingsRepository.setAutoPrintReceipts(newValue)
        }
    }

    /**
     * Set last selected category.
     */
    fun setLastCategory(category: String) {
        scope.launch {
            _lastCategory.value = category
            settingsRepository.setLastCategory(category)
        }
    }
}
