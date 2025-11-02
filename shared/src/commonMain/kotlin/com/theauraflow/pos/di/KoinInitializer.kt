package com.theauraflow.pos.di

import com.theauraflow.pos.core.di.mockDataModule
import org.koin.core.KoinApplication
import org.koin.core.context.startKoin
import org.koin.core.module.Module
import org.koin.dsl.KoinAppDeclaration

/**
 * Shared Koin initialization for all platforms.
 *
 * This eliminates duplicate initialization code across Android, iOS, Desktop, JS, and WasmJS.
 * Platform-specific configuration (like androidContext) can be added via the optional config block.
 *
 * Usage:
 * ```kotlin
 * // iOS, Desktop, JS, WasmJS
 * initializeKoin()
 *
 * // Android (with context)
 * initializeKoin {
 *     androidContext(this@MainActivity)
 * }
 * ```
 */
fun initializeKoin(
    platformModules: List<Module> = emptyList(),
    config: (KoinAppDeclaration)? = null
): KoinApplication {
    return startKoin {
        // Apply platform-specific config if provided (e.g., androidContext)
        config?.invoke(this)

        // Allow overriding for mock data during development
        allowOverride(true)

        // Load modules in order:
        // 1. Shared common modules (network, data)
        // 2. Platform-specific modules (database for native platforms)
        // 3. Mock modules (override for development/testing)
        modules(
            appModules +           // From shared: networkModule, dataModule
                    platformModules +      // Platform-specific modules (e.g., databaseModule)
                    listOf(mockDataModule) // Mock overrides for development
        )
    }
}

/**
 * Safe initialization that won't crash if Koin is already started.
 *
 * Useful for iOS where MainViewController might be recreated,
 * or for preview/testing scenarios.
 */
fun initializeKoinIfNeeded(
    platformModules: List<Module> = emptyList(),
    config: (KoinAppDeclaration)? = null
) {
    try {
        initializeKoin(platformModules, config)
    } catch (e: Exception) {
        // Koin already started, ignore
        // This is expected in scenarios like:
        // - iOS app backgrounding/foregrounding
        // - Compose previews
        // - Test scenarios
    }
}