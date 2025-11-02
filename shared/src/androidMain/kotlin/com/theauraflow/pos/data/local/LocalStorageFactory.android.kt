package com.theauraflow.pos.data.local

import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import android.content.Context

/**
 * Android implementation of LocalStorage factory.
 * Uses SharedPreferences for persistent storage.
 */
actual fun createPlatformLocalStorage(): LocalStorage {
    return object : KoinComponent {
        val context: Context by inject()
    }.let { AndroidLocalStorage(it.context) }
}
