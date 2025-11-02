package com.theauraflow.pos.data.local

/**
 * Desktop (JVM) implementation of LocalStorage factory.
 * Uses Java Preferences for persistent storage.
 */
actual fun createPlatformLocalStorage(): LocalStorage {
    return DesktopLocalStorage()
}
