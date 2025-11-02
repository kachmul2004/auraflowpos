package com.theauraflow.pos.di

import com.theauraflow.pos.data.local.getDatabaseBuilder
import org.koin.core.context.startKoin

/**
 * Initialize Koin for iOS with database support.
 *
 * Call this from your AppDelegate or SwiftUI App:
 * ```swift
 * @main
 * struct iOSApp: App {
 *     init() {
 *         KoinIOSKt.initKoin()
 *     }
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
