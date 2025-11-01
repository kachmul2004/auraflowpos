package com.theauraflow.pos.data.local

import androidx.room.RoomDatabase
import androidx.sqlite.driver.bundled.BundledSQLiteDriver
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.IO

/**
 * Common database instantiation function.
 * Configures the Room database with BundledSQLiteDriver and IO dispatcher.
 *
 * Usage:
 * ```
 * // Android
 * val database = getRoomDatabase(getDatabaseBuilder(context))
 *
 * // iOS/Desktop
 * val database = getRoomDatabase(getDatabaseBuilder())
 * ```
 */
fun getRoomDatabase(
    builder: RoomDatabase.Builder<AppDatabase>
): AppDatabase {
    return builder
        .setDriver(BundledSQLiteDriver())
        .setQueryCoroutineContext(Dispatchers.IO)
        .build()
}