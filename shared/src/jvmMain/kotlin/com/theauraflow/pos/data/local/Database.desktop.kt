package com.theauraflow.pos.data.local

import androidx.room.Room
import androidx.room.RoomDatabase
import java.io.File

/**
 * JVM/Desktop-specific database builder.
 * Creates Room database instance with desktop file system path.
 */
fun getDatabaseBuilder(): RoomDatabase.Builder<AppDatabase> {
    val dbFile = File(System.getProperty("user.home"), ".auraflow_pos/auraflow_pos.db")
    dbFile.parentFile?.mkdirs()
    return Room.databaseBuilder<AppDatabase>(
        name = dbFile.absolutePath,
    )
}