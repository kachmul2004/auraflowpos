package com.theauraflow.pos

import androidx.compose.ui.window.ComposeUIViewController
import com.theauraflow.pos.di.initializeKoinIfNeeded

fun MainViewController() = ComposeUIViewController {
    // Initialize Koin using shared initializer
    initializeKoinIfNeeded()
    App()
}