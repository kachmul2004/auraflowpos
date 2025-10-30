package com.theauraflow.pos.core.di

import org.koin.core.context.startKoin
import org.koin.core.context.stopKoin
import org.koin.core.module.Module
import org.koin.dsl.KoinAppDeclaration

/**
 * Initializes Koin dependency injection framework.
 *
 * This must be called once at application startup before any dependencies are accessed.
 *
 * Platform-specific implementations should call this in their respective entry points:
 * - **Android**: In `Application.onCreate()` or first Activity before composition
 * - **iOS**: In app delegate or content view
 * - **Desktop**: In `main()` function
 * - **Web**: In `main()` function
 */
// For development+test: Include mockDataModule in DI app startup for all in-memory data
object KoinInitializer {

    /**
     * Initializes Koin with all application modules.
     *
     * @param appDeclaration Optional platform-specific configuration
     */
    fun init(appDeclaration: KoinAppDeclaration? = null) {
        startKoin {
            // Allow module definitions to be overridden (useful for mocks in dev/testing)
            allowOverride(true)

            // Apply platform-specific configuration if provided
            appDeclaration?.invoke(this)

            // Load all modules (shared appModule already includes network/data/domain)
            modules(getAllModules())
        }
    }

    /**
     * Stops Koin and clears all dependencies.
     * Useful for testing or when restarting the app.
     */
    fun stop() {
        stopKoin()
    }

    /**
     * Returns all Koin modules for the application.
     * Add new modules here as they are created.
     */
    private fun getAllModules(): List<Module> = listOf(
        appModule,
        // Add other top-level modules here if they are not already included by appModule
    )
}

/**
 * Convenience function to initialize Koin.
 * Can be called from any platform.
 */
fun initKoin(appDeclaration: KoinAppDeclaration? = null) {
    KoinInitializer.init(appDeclaration)
}
