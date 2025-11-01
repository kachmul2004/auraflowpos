package com.theauraflow.pos.data.local

import android.content.Context
import androidx.room.Room
import androidx.room.RoomDatabase

/**
 * Android-specific database builder.
 * Creates Room database instance with Android Context.
 */
fun getDatabaseBuilder(context: Context): RoomDatabase.Builder<AppDatabase> {
    val appContext = context.applicationContext
    val dbFile = appContext.getDatabasePath("auraflow_pos.db")
    return Room.databaseBuilder<AppDatabase>(
        context = appContext,
        name = dbFile.absolutePath
    )
}