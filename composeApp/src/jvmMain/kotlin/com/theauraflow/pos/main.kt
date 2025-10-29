package com.theauraflow.pos

import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application

fun main() = application {
    Window(
        onCloseRequest = ::exitApplication,
        title = "AuraFlow POS",
    ) {
        App()
    }
}