package com.theauraflow.pos.data.local

import com.juul.indexeddb.Database
import com.juul.indexeddb.Key
import com.juul.indexeddb.openDatabase
import kotlinx.coroutines.CompletableDeferred
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch

/**
 * JS platform implementation using JuulLabs IndexedDB library.
 *
 * IndexedDB benefits:
 * - No 5-10MB limit like localStorage (GBs of storage)
 * - Proper suspend functions (no callbacks!)
 * - Full ACID transactions
 * - Better performance for large datasets
 *
 * @see https://github.com/JuulLabs/indexeddb
 */
actual fun createPlatformLocalStorage(): LocalStorage {
    return IndexedDBLocalStorage()
}

/**
 * IndexedDB implementation using JuulLabs library with proper suspend functions.
 */
class IndexedDBLocalStorage : LocalStorage {
    private val dbName = "AuraFlowPOS"
    private val dbVersion = 1
    private val storeName = "keyValueStore"

    // Cache for synchronous access (required by existing LocalStorage interface)
    private val cache = mutableMapOf<String, String>()
    private var database: Database? = null
    private val initDeferred = CompletableDeferred<Unit>()

    init {
        // Initialize database and load cache asynchronously
        GlobalScope.launch {
            try {
                initDatabase()
            } catch (e: Exception) {
                println("❌ IndexedDB: Init failed: ${e.message}")
                e.printStackTrace()
                initDeferred.complete(Unit) // Continue with empty cache
            }
        }
    }

    private suspend fun initDatabase() {
        try {
            // Open database with migration
            database = openDatabase(dbName, dbVersion) { database, oldVersion, newVersion ->
                println("🔄 IndexedDB: Migration running - oldVersion=$oldVersion, newVersion=$newVersion")

                if (oldVersion < 1) {
                    // Create object store for key-value pairs
                    println("📦 IndexedDB: Creating object store '$storeName'")
                    database.createObjectStore(storeName)
                    println("✅ IndexedDB: Object store '$storeName' created")
                }
            }

            println("✅ IndexedDB: Database opened successfully")

            // Verify the object store exists
            try {
                database?.transaction(storeName) {
                    // Just verify we can access the store
                    objectStore(storeName)
                }
                println("✅ IndexedDB: Object store '$storeName' verified")
            } catch (e: Exception) {
                println("❌ IndexedDB: Object store '$storeName' not found!")
                println("   Please run in browser console: indexedDB.deleteDatabase('$dbName'); location.reload();")
                initDeferred.complete(Unit)
                return
            }

            // Load all data into cache
            loadAllToCache()
            initDeferred.complete(Unit)
        } catch (e: Exception) {
            println("❌ IndexedDB: Failed to initialize: ${e.message}")
            e.printStackTrace()
            initDeferred.complete(Unit)
        }
    }

    private suspend fun loadAllToCache() {
        try {
            val db = database ?: return

            println("🔄 IndexedDB: Loading all data from store '$storeName'...")

            // Use transaction to read all data
            db.transaction(storeName) {
                val store = objectStore(storeName)

                // Open cursor to iterate through all entries (with autoContinue parameter)
                var count = 0
                store.openCursor(autoContinue = true).collect { cursor ->
                    count++
                    val key = cursor.key.toString()
                    val value = cursor.value

                    println("📥 IndexedDB: Cursor entry #$count - key=$key, valueType=${value::class.simpleName}")

                    // Handle different value types - convert to Kotlin String
                    val stringValue: String = when (value) {
                        is String -> value
                        else -> value.toString()
                    }

                    cache[key] = stringValue

                    // Safe substring for logging
                    val preview = if (stringValue.length > 50) {
                        stringValue.substring(0, 50) + "..."
                    } else {
                        stringValue
                    }
                    println("   ✓ Stored in cache: $preview")
                }
            }

            println("📂 IndexedDB: Loaded ${cache.size} items into cache")
            cache.keys.forEach { key ->
                println("   - $key (${cache[key]?.length ?: 0} chars)")
            }
        } catch (e: Exception) {
            println("❌ IndexedDB: Failed to load cache: ${e.message}")
            e.printStackTrace()
        }
    }

    private suspend fun ensureInitialized() {
        // Wait for initialization to complete
        initDeferred.await()
    }

    override suspend fun saveString(key: String, value: String) {
        // Ensure database is initialized
        ensureInitialized()

        // Update cache immediately for synchronous access
        cache[key] = value
        println("💾 IndexedDB: Saving to cache[$key]: ${value.take(100)}... (${value.length} chars)")

        // Save to IndexedDB asynchronously
        try {
            saveToIndexedDB(key, value)
        } catch (e: Exception) {
            println("❌ IndexedDB: Failed to save $key: ${e.message}")
            e.printStackTrace()
        }
    }

    private suspend fun saveToIndexedDB(key: String, value: String) {
        try {
            val db = database ?: run {
                println("⚠️ IndexedDB: Database not initialized, cannot save $key")
                return
            }

            println("💾 IndexedDB: Writing to database - key=$key, valueLength=${value.length}")

            // Use writeTransaction with proper put operation
            db.writeTransaction(storeName) {
                val store = objectStore(storeName)
                store.put(value, Key(key))
            }

            println("✅ IndexedDB: Saved $key successfully to database")
        } catch (e: Exception) {
            println("❌ IndexedDB: Error saving $key: ${e.message}")
            e.printStackTrace()
        }
    }

    override suspend fun getString(key: String): String? {
        // Ensure database is initialized
        ensureInitialized()

        // Return from cache for synchronous access
        val value = cache[key]
        if (value != null) {
            println("📖 IndexedDB: Read from cache[$key]: ${value.take(100)}...")
        } else {
            println("📖 IndexedDB: Read from cache[$key]: null")
        }
        return value
    }

    override suspend fun remove(key: String) {
        // Ensure database is initialized
        ensureInitialized()

        // Remove from cache
        cache.remove(key)

        // Remove from IndexedDB
        try {
            val db = database ?: return

            db.writeTransaction(storeName) {
                val store = objectStore(storeName)
                store.delete(Key(key))
            }

            println("🗑️ IndexedDB: Removed $key")
        } catch (e: Exception) {
            println("❌ IndexedDB: Error removing $key: ${e.message}")
            e.printStackTrace()
        }
    }

    override suspend fun clear() {
        // Ensure database is initialized
        ensureInitialized()

        // Clear cache
        cache.clear()

        // Clear IndexedDB
        try {
            val db = database ?: return

            db.writeTransaction(storeName) {
                val store = objectStore(storeName)
                store.clear()
            }

            println("🗑️ IndexedDB: Cleared all data")
        } catch (e: Exception) {
            println("❌ IndexedDB: Error clearing: ${e.message}")
            e.printStackTrace()
        }
    }
}
