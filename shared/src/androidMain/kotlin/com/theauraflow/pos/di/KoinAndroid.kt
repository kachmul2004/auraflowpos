package com.theauraflow.pos.di

import android.content.Context
import com.theauraflow.pos.data.local.getDatabaseBuilder
import org.koin.android.ext.koin.androidContext
import org.koin.core.context.startKoin

/**
 * Initialize Koin for Android with database support.
 *
 * Call this from your Application.onCreate():
 * ```kotlin
 * class MyApplication : Application() {
 *     override fun onCreate() {
 *         super.onCreate()
 *         initKoin(this)
 *     }
 * }
 * ```
 */
fun initKoin(context: Context) {
    // Initialize database first
    initializeDatabase(getDatabaseBuilder(context))

    // Start Koin
    startKoin {
        androidContext(context)
        modules(appModules + databaseModule)
    }
}
