package com.theauraflow.pos

import androidx.compose.ui.window.ComposeUIViewController
import com.theauraflow.pos.core.di.appModule
import com.theauraflow.pos.core.di.mockDataModule
import org.koin.core.context.startKoin

fun MainViewController() = ComposeUIViewController {
    // Initialize Koin for iOS if not already started
    initKoinIfNeeded()
    App()
}

private fun initKoinIfNeeded() {
    try {
        startKoin {
            allowOverride(true)
            modules(
                appModule,      // Real repos + use cases
                mockDataModule  // Mock repos (overrides real)
            )
        }
    } catch (e: Exception) {
        // Koin already started, ignore
    }
}