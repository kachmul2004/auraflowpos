package com.theauraflow.pos.data.local

/**
 * Web (JS) implementation of LocalStorage factory.
 * TODO: Implement using browser localStorage for true persistence.
 * Currently uses in-memory storage.
 */
actual fun createPlatformLocalStorage(): LocalStorage {
    return InMemoryLocalStorage()
}
