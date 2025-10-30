package com.theauraflow.pos.core.di

import org.koin.core.module.Module
import org.koin.dsl.module

/**
 * Main application module containing core dependencies.
 *
 * This module provides:
 * - App-level utilities and helpers
 * - Configuration objects
 * - Platform-specific implementations
 *
 * Use [appModule] to include this module in your Koin configuration.
 */
val appModule = module {
    // Core utilities are already singletons, so no need to provide them here
    // If we had non-singleton utilities, we'd define them here
}
