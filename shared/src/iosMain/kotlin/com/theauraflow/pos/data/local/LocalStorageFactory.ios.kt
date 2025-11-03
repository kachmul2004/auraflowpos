package com.theauraflow.pos.data.local

import platform.Foundation.NSUserDefaults

/**
 * iOS implementation of LocalStorage factory.
 * Uses NSUserDefaults for persistent key-value storage.
 */
actual fun createPlatformLocalStorage(): LocalStorage {
    return IOSLocalStorage()
}

/**
 * iOS-specific LocalStorage implementation using NSUserDefaults.
 * Perfect for lightweight data like settings, preferences, and auth tokens.
 */
class IOSLocalStorage : LocalStorage {
    private val userDefaults = NSUserDefaults.standardUserDefaults

    override suspend fun saveString(key: String, value: String) {
        userDefaults.setObject(value, forKey = key)
        userDefaults.synchronize()
        println("💾 iOS UserDefaults: Saved $key")
    }

    override suspend fun getString(key: String): String? {
        val value = userDefaults.stringForKey(key)
        if (value != null) {
            println("📖 iOS UserDefaults: Read $key = ${value.take(100)}...")
        } else {
            println("📖 iOS UserDefaults: Read $key = null")
        }
        return value
    }

    override suspend fun remove(key: String) {
        userDefaults.removeObjectForKey(key)
        userDefaults.synchronize()
        println("🗑️ iOS UserDefaults: Removed $key")
    }

    override suspend fun clear() {
        // Get all keys and remove them
        val domain = NSUserDefaults.standardUserDefaults.dictionaryRepresentation()
        domain.keys.forEach { key ->
            userDefaults.removeObjectForKey(key as String)
        }
        userDefaults.synchronize()
        println("🗑️ iOS UserDefaults: Cleared all data")
    }
}
