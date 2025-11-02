package com.theauraflow.pos.data.local

import android.content.Context
import android.content.SharedPreferences

/**
 * Android implementation of LocalStorage using SharedPreferences.
 * Data persists across app restarts.
 */
class AndroidLocalStorage(context: Context) : LocalStorage {
    private val prefs: SharedPreferences = context.getSharedPreferences(
        "auraflow_pos_storage",
        Context.MODE_PRIVATE
    )

    override suspend fun saveString(key: String, value: String) {
        prefs.edit().putString(key, value).apply()
    }

    override suspend fun getString(key: String): String? {
        return prefs.getString(key, null)
    }

    override suspend fun remove(key: String) {
        prefs.edit().remove(key).apply()
    }

    override suspend fun clear() {
        prefs.edit().clear().apply()
    }
}
