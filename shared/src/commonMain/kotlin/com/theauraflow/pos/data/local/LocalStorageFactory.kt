package com.theauraflow.pos.data.local

/**
 * Factory function to create platform-specific LocalStorage implementation.
 * Each platform provides its own actual implementation.
 */
expect fun createPlatformLocalStorage(): LocalStorage
