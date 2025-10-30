package com.auraflow.pos.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val AuraFlowDarkColorScheme = darkColorScheme(
    primary = Primary,
    onPrimary = PrimaryForeground,
    primaryContainer = Primary,
    onPrimaryContainer = PrimaryForeground,
    
    secondary = Secondary,
    onSecondary = SecondaryForeground,
    secondaryContainer = Secondary,
    onSecondaryContainer = SecondaryForeground,
    
    tertiary = Accent,
    onTertiary = AccentForeground,
    
    error = Destructive,
    onError = DestructiveForeground,
    errorContainer = Destructive,
    onErrorContainer = DestructiveForeground,
    
    background = Background,
    onBackground = Foreground,
    
    surface = Card,
    onSurface = CardForeground,
    surfaceVariant = Muted,
    onSurfaceVariant = MutedForeground,
    
    outline = Border,
    outlineVariant = Input,
    
    inverseSurface = Foreground,
    inverseOnSurface = Background,
    inversePrimary = Primary,
)

@Composable
fun AuraFlowPOSTheme(
    darkTheme: Boolean = true, // Always dark theme for POS
    content: @Composable () -> Unit
) {
    val colorScheme = AuraFlowDarkColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = AuraFlowTypography,
        content = content
    )
}
