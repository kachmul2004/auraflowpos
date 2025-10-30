package com.theauraflow.pos

import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application
import com.theauraflow.pos.App
import com.theauraflow.pos.core.di.appModule
import com.theauraflow.pos.core.di.mockDataModule
import org.koin.core.context.startKoin

fun main() {
    // Initialize Koin for Desktop with Mock overrides
    // IMPORTANT: mockDataModule MUST come AFTER appModule to override real repos
    startKoin {
        allowOverride(true)
        modules(
            appModule,      // Contains real repos and use cases
            mockDataModule  // Overrides with mock repos for dev/testing
        )
    }

    application {
        Window(onCloseRequest = ::exitApplication, title = "AuraFlow POS") {
            App()
        }
    }
}