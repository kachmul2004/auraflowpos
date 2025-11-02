package com.theauraflow.pos

import androidx.compose.ui.ExperimentalComposeUiApi
import androidx.compose.ui.window.ComposeViewport
import com.theauraflow.pos.core.di.appModule
import com.theauraflow.pos.core.di.mockDataModule
import com.theauraflow.pos.di.initializeKoin

@OptIn(ExperimentalComposeUiApi::class)
fun main() {
    // Initialize Koin using shared initializer
    initializeKoin()

    ComposeViewport {
        App()
    }
}