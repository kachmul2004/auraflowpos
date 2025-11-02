package com.theauraflow.pos

import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application
import com.theauraflow.pos.App
import com.theauraflow.pos.core.di.appModule
import com.theauraflow.pos.core.di.mockDataModule
import com.theauraflow.pos.di.initializeKoin
import org.koin.core.context.startKoin

fun main() {
    // Initialize Koin using shared initializer
    initializeKoin()

    application {
        Window(onCloseRequest = ::exitApplication, title = "AuraFlow POS") {
            App()
        }
    }
}