package com.theauraflow.pos.data.local

import androidx.room.RoomDatabase
import androidx.sqlite.driver.bundled.BundledSQLiteDriver
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.IO
import com.theauraflow.pos.data.local.database.PosDatabase

/**
 * Creates a PosDatabase instance using Room.
 * This function is available on Android, iOS, and Desktop platforms.
 *
 * Usage:
 * - Android: createRoomDatabase(getDatabaseBuilder(context))
 * - iOS: createRoomDatabase(getDatabaseBuilder())
 * - Desktop: createRoomDatabase(getDatabaseBuilder())
 */
fun createRoomDatabase(
    builder: RoomDatabase.Builder<AppDatabase>
): PosDatabase {
    val database = getRoomDatabase(builder)
    return RoomDatabaseImpl(database)
}
