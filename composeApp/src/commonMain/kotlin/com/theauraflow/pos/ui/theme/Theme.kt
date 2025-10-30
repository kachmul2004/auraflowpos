package com.theauraflow.pos.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable

/**
 * AuraFlow POS Theme
 *
 * Applies Material3 theming with colors matching the reference web app.
 * Supports both light and dark modes with exact colors from:
 * docs/Web Version/src/styles/globals.css
 */
@Composable
fun AuraFlowTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}