package com.theauraflow.pos.data.local

/**
 * Simple local storage interface for temporary data persistence.
 * This is a mock implementation using in-memory storage.
 *
 * TODO: Replace with Room database + DataStore when implementing full persistence.
 */
interface LocalStorage {
    /**
     * Save a string value.
     */
    suspend fun saveString(key: String, value: String)

    /**
     * Get a string value.
     */
    suspend fun getString(key: String): String?

    /**
     * Remove a value.
     */
    suspend fun remove(key: String)

    /**
     * Clear all values.
     */
    suspend fun clear()
}

/**
 * In-memory implementation of LocalStorage.
 * Data is lost when app restarts.
 */
class InMemoryLocalStorage : LocalStorage {
    private val storage = mutableMapOf<String, String>()

    override suspend fun saveString(key: String, value: String) {
        storage[key] = value
    }

    override suspend fun getString(key: String): String? {
        return storage[key]
    }

    override suspend fun remove(key: String) {
        storage.remove(key)
    }

    override suspend fun clear() {
        storage.clear()
    }
}
