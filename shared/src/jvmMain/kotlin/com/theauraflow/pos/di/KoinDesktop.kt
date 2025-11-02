package com.theauraflow.pos.di

import com.theauraflow.pos.data.local.getDatabaseBuilder
import org.koin.core.context.startKoin

/**
 * Initialize Koin for Desktop (JVM) with database support.
 *
 * Call this from your main() function:
 * ```kotlin
 * fun main() = application {
 *     initKoin()
 *     // ...
 * }
 * ```
 */
fun initKoin() {
    // Initialize database first
    initializeDatabase(getDatabaseBuilder())

    // Start Koin
    startKoin {
        modules(appModules + databaseModule)
    }
}
