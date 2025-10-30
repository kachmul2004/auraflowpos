package com.theauraflow.pos.ui.theme

import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.ui.graphics.Color

/**
 * AuraFlow POS Color Palette
 * Exact match to web version from docs/Web Version/src/styles/globals.css
 */

// Dark Mode Colors (default - from :root)
object DarkColors {
    val Background = Color(0xFF0E1729)
    val Foreground = Color(0xFFF9FAFD)
    val Card = Color(0xFF1E293A)
    val CardForeground = Color(0xFFF9FAFD)
    val Primary = Color(0xFFA5D8F3)
    val PrimaryForeground = Color(0xFF0C132B)
    val Secondary = Color(0xFF191970)
    val SecondaryForeground = Color(0xFFF9FAFD)
    val Muted = Color(0xFF1E293A)
    val MutedForeground = Color(0xFF94A3B8)
    val Accent = Color(0xFF1E293A)
    val AccentForeground = Color(0xFFF9FAFD)
    val Destructive = Color(0xFFD4183D)
    val DestructiveForeground = Color(0xFFFFFFFF)
    val Border = Color(0xFF3C3C40)
    val Input = Color(0xFF3C3C40)
    val Ring = Color(0xFFA5D8F3)
    val Success = Color(0xFF34D399)
    val Warning = Color(0xFFFBBF24)
    val Info = Color(0xFF60A5FA)
}

// Light Mode Colors (from .light)
object LightColors {
    val Background = Color(0xFFFFFFFF)
    val Foreground = Color(0xFF09090B)
    val Card = Color(0xFFFFFFFF)
    val CardForeground = Color(0xFF09090B)
    val Primary = Color(0xFF18181B)
    val PrimaryForeground = Color(0xFFF9F9F9)
    val Secondary = Color(0xFFF4F4F5)
    val SecondaryForeground = Color(0xFF18181B)
    val Muted = Color(0xFFF4F4F5)
    val MutedForeground = Color(0xFF6F6F78)
    val Accent = Color(0xFFF4F4F5)
    val AccentForeground = Color(0xFF18181B)
    val Destructive = Color(0xFFD4183D)
    val DestructiveForeground = Color(0xFFFFFFFF)
    val Border = Color(0xFFC8C8CD)
    val Input = Color(0xFFE4E4E7)
    val Ring = Color(0xFF18181B)
    val Success = Color(0xFF059669)
    val Warning = Color(0xFFD97706)
    val Info = Color(0xFF2563EB)
}

// Material3 Dark Color Scheme
val DarkColorScheme = darkColorScheme(
    primary = DarkColors.Primary,
    onPrimary = DarkColors.PrimaryForeground,
    primaryContainer = DarkColors.Primary,
    onPrimaryContainer = DarkColors.PrimaryForeground,
    secondary = DarkColors.Secondary,
    onSecondary = DarkColors.SecondaryForeground,
    secondaryContainer = DarkColors.Secondary,
    onSecondaryContainer = DarkColors.SecondaryForeground,
    tertiary = DarkColors.Info,
    onTertiary = Color.White,
    tertiaryContainer = DarkColors.Info,
    onTertiaryContainer = Color.White,
    error = DarkColors.Destructive,
    onError = DarkColors.DestructiveForeground,
    errorContainer = DarkColors.Destructive,
    onErrorContainer = DarkColors.DestructiveForeground,
    background = DarkColors.Background,
    onBackground = DarkColors.Foreground,
    surface = DarkColors.Card,
    onSurface = DarkColors.CardForeground,
    surfaceVariant = DarkColors.Muted,
    onSurfaceVariant = DarkColors.MutedForeground,
    outline = DarkColors.Border,
    outlineVariant = DarkColors.Border,
    scrim = Color.Black,
)

// Material3 Light Color Scheme
val LightColorScheme = lightColorScheme(
    primary = LightColors.Primary,
    onPrimary = LightColors.PrimaryForeground,
    primaryContainer = LightColors.Primary,
    onPrimaryContainer = LightColors.PrimaryForeground,
    secondary = LightColors.Secondary,
    onSecondary = LightColors.SecondaryForeground,
    secondaryContainer = LightColors.Secondary,
    onSecondaryContainer = LightColors.SecondaryForeground,
    tertiary = LightColors.Info,
    onTertiary = Color.White,
    tertiaryContainer = LightColors.Info,
    onTertiaryContainer = Color.White,
    error = LightColors.Destructive,
    onError = LightColors.DestructiveForeground,
    errorContainer = LightColors.Destructive,
    onErrorContainer = LightColors.DestructiveForeground,
    background = LightColors.Background,
    onBackground = LightColors.Foreground,
    surface = LightColors.Card,
    onSurface = LightColors.CardForeground,
    surfaceVariant = LightColors.Muted,
    onSurfaceVariant = LightColors.MutedForeground,
    outline = LightColors.Border,
    outlineVariant = LightColors.Border,
    scrim = Color.Black,
)