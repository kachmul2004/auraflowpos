package com.theauraflow.pos.data.local

/**
 * Wasm implementation of LocalStorage factory.
 *
 * TODO: Implement IndexedDB storage for Wasm as per:
 * https://www.reddit.com/r/Kotlin/comments/1jo7784/any_opfs_or_indexdb_wrapper_that_compiles_to_wasm/
 *
 * Current implementation uses InMemoryLocalStorage as a temporary solution.
 * IndexedDB would provide:
 * - Better storage capacity (not limited to 5-10MB like localStorage)
 * - Better performance for large datasets
 * - Transaction support
 * - Proper Wasm compatibility
 */
actual fun createPlatformLocalStorage(): LocalStorage {
    println("⚠️ WASM: Using InMemoryLocalStorage (data won't persist across page refreshes)")
    println("   TODO: Implement IndexedDB for proper persistence")
    return InMemoryLocalStorage()
}

/**
 * External object for accessing browser localStorage in Wasm.
 * This uses the browser's built-in localStorage API.
 */
@JsModule("./wasmLocalStorage.mjs")
external object WasmStorageJS {
    fun setItem(key: String, value: String)
    fun getItem(key: String): String?
    fun removeItem(key: String)
    fun clear()
}

/**
 * Browser localStorage implementation for Wasm platform.
 * Uses the @JsModule approach with external object that properly references the JavaScript module.
 */
class WasmBrowserLocalStorage : LocalStorage {
    override suspend fun saveString(key: String, value: String) {
        try {
            println("💾 WASM: Saving to localStorage[$key]...")
            WasmStorageJS.setItem(key, value)
            println("✅ WASM: Saved successfully")
        } catch (e: Exception) {
            println("❌ WASM: Failed to save to localStorage: ${e.message}")
            e.printStackTrace()
        }
    }

    override suspend fun getString(key: String): String? {
        return try {
            val result = WasmStorageJS.getItem(key)
            println("📖 WASM: Read from localStorage[$key]: ${result?.take(50)}")
            result
        } catch (e: Exception) {
            println("❌ WASM: Failed to read from localStorage: ${e.message}")
            e.printStackTrace()
            null
        }
    }

    override suspend fun remove(key: String) {
        try {
            WasmStorageJS.removeItem(key)
        } catch (e: Exception) {
            println("❌ WASM: Failed to remove from localStorage: ${e.message}")
        }
    }

    override suspend fun clear() {
        try {
            WasmStorageJS.clear()
        } catch (e: Exception) {
            println("❌ WASM: Failed to clear localStorage: ${e.message}")
        }
    }
}
