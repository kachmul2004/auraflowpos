# Wasm Storage Implementation TODO

**Current Status:** ⚠️ Wasm uses `InMemoryLocalStorage` (data lost on refresh)  
**Recommended Solution:** Implement IndexedDB wrapper for Wasm

---

## 🐛 Current Issue

Wasm build cannot use browser `localStorage` due to `@JsModule` resolution issues:

```
Module not found: Error: Can't resolve './wasmLocalStorage.mjs'
```

**Why this happens:**

- `@JsModule("./wasmLocalStorage.mjs")` expects the file in the Kotlin output directory
- Webpack can't resolve relative module paths from Wasm-compiled Kotlin
- Browser localStorage has 5-10MB limit anyway (not ideal for POS data)

**Current workaround:**

- Using `InMemoryLocalStorage()` - data lost on page refresh
- Fine for testing, **NOT suitable for production**

---

## ✅ Proper Solution: IndexedDB

As discussed in Reddit thread:
https://www.reddit.com/r/Kotlin/comments/1jo7784/any_opfs_or_indexdb_wrapper_that_compiles_to_wasm/

### **Why IndexedDB?**

1. ✅ **Wasm compatible** - Works with Wasm/JS interop
2. ✅ **Large storage** - Stores GBs of data (not MB like localStorage)
3. ✅ **Better performance** - Indexed queries, transactions
4. ✅ **Proper API** - Async, non-blocking
5. ✅ **Standard** - Supported by all modern browsers

### **Implementation Options**

#### **Option 1: Use kotlinx-wasm-idb (Recommended)**

There might be a Kotlin/Wasm IndexedDB wrapper library. Check:

- https://github.com/topics/indexeddb?l=kotlin
- https://kotlinlang.org/docs/wasm-libraries.html

#### **Option 2: Create Custom Wrapper**

Create external declarations for IndexedDB API:

```kotlin
// shared/src/wasmJsMain/kotlin/com/theauraflow/pos/data/local/IndexedDBStorage.kt

@OptIn(ExperimentalJsExport::class)
external class IDBFactory {
    fun open(name: String, version: Int): IDBOpenDBRequest
}

@OptIn(ExperimentalJsExport::class)
external class IDBOpenDBRequest {
    var onsuccess: ((dynamic) -> Unit)?
    var onerror: ((dynamic) -> Unit)?
    var onupgradeneeded: ((dynamic) -> Unit)?
    val result: IDBDatabase
}

@OptIn(ExperimentalJsExport::class)
external class IDBDatabase {
    fun createObjectStore(name: String, options: dynamic): IDBObjectStore
    fun transaction(storeNames: dynamic, mode: String): IDBTransaction
}

@OptIn(ExperimentalJsExport::class)
external class IDBTransaction {
    fun objectStore(name: String): IDBObjectStore
    var oncomplete: ((dynamic) -> Unit)?
    var onerror: ((dynamic) -> Unit)?
}

@OptIn(ExperimentalJsExport::class)
external class IDBObjectStore {
    fun put(value: dynamic, key: dynamic = definedExternally): IDBRequest
    fun get(key: dynamic): IDBRequest
    fun delete(key: dynamic): IDBRequest
    fun clear(): IDBRequest
}

@OptIn(ExperimentalJsExport::class)
external class IDBRequest {
    var onsuccess: ((dynamic) -> Unit)?
    var onerror: ((dynamic) -> Unit)?
    val result: dynamic
}

// Access browser's indexedDB
external val indexedDB: IDBFactory

class IndexedDBStorage : LocalStorage {
    private var db: IDBDatabase? = null
    
    init {
        // Open/create database
        val request = indexedDB.open("AuraFlowPOS", 1)
        
        request.onupgradeneeded = { event ->
            val db = event.asDynamic().target.result as IDBDatabase
            if (!db.objectStoreNames.contains("storage")) {
                db.createObjectStore("storage", js("({keyPath: 'key'})"))
            }
        }
        
        request.onsuccess = { event ->
            db = event.asDynamic().target.result as IDBDatabase
            println("✅ IndexedDB opened successfully")
        }
        
        request.onerror = { event ->
            println("❌ IndexedDB error: ${event.asDynamic().target.error}")
        }
    }
    
    override suspend fun saveString(key: String, value: String) {
        return suspendCoroutine { continuation ->
            val transaction = db!!.transaction(js("[\"storage\"]"), "readwrite")
            val store = transaction.objectStore("storage")
            
            val data = js("({key: key, value: value})")
            val request = store.put(data)
            
            request.onsuccess = {
                println("✅ Saved to IndexedDB: $key")
                continuation.resume(Unit)
            }
            
            request.onerror = {
                println("❌ Failed to save to IndexedDB")
                continuation.resumeWithException(Exception("IndexedDB save failed"))
            }
        }
    }
    
    override suspend fun getString(key: String): String? {
        return suspendCoroutine { continuation ->
            val transaction = db!!.transaction(js("[\"storage\"]"), "readonly")
            val store = transaction.objectStore("storage")
            val request = store.get(key)
            
            request.onsuccess = { event ->
                val result = event.asDynamic().target.result
                val value = if (result != null) result.value as? String else null
                continuation.resume(value)
            }
            
            request.onerror = {
                continuation.resumeWithException(Exception("IndexedDB get failed"))
            }
        }
    }
    
    // ... implement remove() and clear()
}
```

#### **Option 3: Use OPFS (Origin Private File System)**

For even more storage (multiple GBs):

- Modern browsers support OPFS
- File-based API (not key-value like IndexedDB)
- More complex but very powerful

---

## 🔧 Quick Fix for Testing

For now, Wasm uses `InMemoryLocalStorage` which means:

**✅ Works for:**

- Testing Wasm build
- Single-session usage
- Development

**❌ Doesn't work for:**

- Page refresh (data lost)
- Production use
- Multi-tab sync

**Workaround for testing:**

1. Use JS build for testing persistence (works with localStorage)
2. Use Wasm for UI testing (receipt, checkout flow)
3. Implement IndexedDB before production

---

## 📋 Implementation Checklist

- [ ] Research existing Kotlin/Wasm IndexedDB libraries
- [ ] Create external declarations for IndexedDB API
- [ ] Implement `IndexedDBStorage : LocalStorage`
- [ ] Handle async initialization (db.open is async)
- [ ] Add error handling for quota exceeded
- [ ] Test with large datasets (1000+ orders)
- [ ] Add migration from localStorage (for JS build)
- [ ] Update LocalStorageFactory.wasmJs.kt

---

## 🎯 Priority

**Medium-High** - Wasm persistence is important for production, but:

- JS build works fine with localStorage
- Android/iOS/Desktop all have proper persistence
- Wasm is mainly for web demos

**Timeline:**

- Phase 1: Keep InMemoryStorage for now ✅ (current)
- Phase 2: Implement IndexedDB (1-2 days)
- Phase 3: Add OPFS support (optional, for very large datasets)

---

**Status:** ⚠️ TODO  
**Blocking:** No (JS build works)  
**Reference:
** https://www.reddit.com/r/Kotlin/comments/1jo7784/any_opfs_or_indexdb_wrapper_that_compiles_to_wasm/
