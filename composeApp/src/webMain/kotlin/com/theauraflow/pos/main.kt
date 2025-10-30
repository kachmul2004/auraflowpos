package com.theauraflow.pos

import androidx.compose.ui.ExperimentalComposeUiApi
import androidx.compose.ui.window.ComposeViewport
import com.theauraflow.pos.core.di.appModule
import com.theauraflow.pos.core.di.mockDataModule
import org.koin.core.context.startKoin

@OptIn(ExperimentalComposeUiApi::class)
fun main() {
    // Initialize Koin for Web/WASM
    startKoin {
        allowOverride(true)
        modules(
            appModule,      // Real repos + use cases
            mockDataModule  // Mock repos (overrides real)
        )
    }

    ComposeViewport {
        App()
    }
}