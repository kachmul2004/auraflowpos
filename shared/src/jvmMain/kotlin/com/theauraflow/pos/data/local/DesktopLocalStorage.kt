package com.theauraflow.pos.data.local

import java.util.prefs.Preferences

/**
 * Desktop (JVM) implementation of LocalStorage using Java Preferences.
 * Data persists across app restarts.
 */
class DesktopLocalStorage : LocalStorage {
    private val prefs: Preferences = Preferences.userRoot().node("com.theauraflow.pos")

    override suspend fun saveString(key: String, value: String) {
        prefs.put(key, value)
        prefs.flush()
    }

    override suspend fun getString(key: String): String? {
        return prefs.get(key, null)
    }

    override suspend fun remove(key: String) {
        prefs.remove(key)
        prefs.flush()
    }

    override suspend fun clear() {
        prefs.clear()
        prefs.flush()
    }
}
