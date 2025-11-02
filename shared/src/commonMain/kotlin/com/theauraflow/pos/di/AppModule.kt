package com.theauraflow.pos.di

import com.theauraflow.pos.core.di.domainModule
import org.koin.core.module.Module

/**
 * Main application modules for commonMain.
 *
 * These modules are available on all platforms.
 * Platform-specific modules (like databaseModule) should be added
 * during platform initialization.
 */
val appModules = listOf(
    networkModule,
    dataModule,
    domainModule  // ViewModels and use cases
)
