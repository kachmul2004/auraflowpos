package com.theauraflow.pos.di

import com.theauraflow.pos.data.local.AppDatabase
import com.theauraflow.pos.data.local.RoomDatabaseImpl
import com.theauraflow.pos.data.local.getRoomDatabase
import com.theauraflow.pos.data.local.database.PosDatabase
import org.koin.core.module.Module
import org.koin.dsl.module

/**
 * Database module for platforms that support Room (Android, iOS, Desktop).
 *
 * This module provides:
 * - AppDatabase: Room database instance
 * - PosDatabase: Abstract database interface
 *
 * Note: The AppDatabase must be initialized from platform-specific code
 * by calling `initializeDatabase()` before starting Koin.
 */

private var appDatabaseInstance: AppDatabase? = null

/**
 * Initialize the database before starting Koin.
 * Call this from platform-specific initialization code.
 *
 * Example:
 * ```kotlin
 * // Android
 * initializeDatabase(getDatabaseBuilder(context))
 *
 * // iOS
 * initializeDatabase(getDatabaseBuilder())
 *
 * // Desktop
 * initializeDatabase(getDatabaseBuilder())
 * ```
 */
fun initializeDatabase(builder: androidx.room.RoomDatabase.Builder<AppDatabase>) {
    appDatabaseInstance = getRoomDatabase(builder)
}

/**
 * Koin module for database dependencies.
 * Available on Android, iOS, and Desktop platforms.
 */
val databaseModule: Module = module {

    // Provide AppDatabase singleton
    single<AppDatabase> {
        appDatabaseInstance ?: error(
            "Database not initialized! Call initializeDatabase() before starting Koin."
        )
    }

    // Provide PosDatabase singleton
    single<PosDatabase> {
        RoomDatabaseImpl(get())
    }
}
