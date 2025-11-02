package com.theauraflow.pos.data.local

/**
 * iOS implementation of LocalStorage factory.
 * TODO: Implement using NSUserDefaults for true persistence.
 * Currently uses in-memory storage.
 */
actual fun createPlatformLocalStorage(): LocalStorage {
    return InMemoryLocalStorage()
}
