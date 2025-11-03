# 🔧 Server Module - Fixes Needed

**Status:** ❌ Server module currently has compilation errors  
**Cause:** Server module was disabled earlier, sync code added but not fully integrated

---

## 🐛 COMPILATION ERRORS

### **1. SyncRoutes.kt** - Multiple Issues

#### **Issue A: `ErrorResponse` Missing `statusCode` Parameter**

**Error:**

```
No value passed for parameter 'statusCode'
```

**Fix:** Add `statusCode = 500` to all `ErrorResponse()` calls:

```kotlin
// BEFORE:
ErrorResponse(
    error = "SYNC_FAILED",
    message = e.message ?: "Failed to sync data",
    timestamp = kotlinx.datetime.Clock.System.now().toEpochMilliseconds()
)

// AFTER:
ErrorResponse(
    error = "SYNC_FAILED",
    message = e.message ?: "Failed to sync data",
    statusCode = 500,
    timestamp = kotlinx.datetime.Clock.System.now().toEpochMilliseconds()
)
```

**Locations to fix (12 places):**

- Line 70 (SYNC_FAILED)
- Line 97 (SYNC_FAILED)
- Line 124 (SYNC_FAILED)
- Line 142 (MISSING_DEVICE_ID) - use `statusCode = 400`
- Line 160 (FETCH_FAILED)

#### **Issue B: `LocalDateTime.toInstant()` Missing Import**

**Error:**

```
Unresolved reference 'toInstant'
```

**Fix:** Add import and extension function:

```kotlin
import kotlinx.datetime.toInstant

// Or use the full path:
row[SyncOrdersTable.createdAt].toInstant(TimeZone.UTC).toEpochMilliseconds()
```

**Locations to fix (6 places):**

- Lines 401, 403, 411 (Order timestamps)
- Lines 446, 448, 456 (Transaction timestamps)

#### **Issue C: SQL `select {}` Lambda Syntax**

**Error:**

```
Argument type mismatch: actual type is 'Function0<Op<Boolean>>'
```

**Fix:** Remove the curly braces from single-condition selects:

```kotlin
// BEFORE:
SyncOrdersTable.select { SyncOrdersTable.localId eq syncableOrder.localId }

// AFTER: (Already correct)
SyncOrdersTable.select {
    SyncOrdersTable.localId eq syncableOrder.localId
}

// But for filters in getServerUpdates, the syntax is already correct
```

**Note:** The select syntax is already correct, but Exposed might need explicit `where` instead.

---

### **2. ProductRoutes.kt** - BigDecimal Serialization

**Error:**

```
Serializer has not been found for type 'BigDecimal'
```

**Fix:** ProductRoutes is not related to sync, can be fixed separately or left commented out.

---

## ✅ QUICK FIX CHECKLIST

To get the server compiling:

### **Step 1: Fix ErrorResponse Calls**

Replace all `ErrorResponse(...)` calls to include `statusCode`:

```kotlin
// Find & Replace in SyncRoutes.kt:
ErrorResponse(
    error = "SYNC_FAILED",
    message =  
    timestamp = 

// With:
ErrorResponse(
    error = "SYNC_FAILED",
    message = 
    statusCode = 500,
    timestamp = 
```

### **Step 2: Fix LocalDateTime.toInstant()**

Add import at top of file:

```kotlin
import kotlinx.datetime.toInstant
```

### **Step 3: Comment Out ProductRoutes Temporarily**

In `Routing.kt`:

```kotlin
fun Application.configureRouting() {
    routing {
        healthRoutes()
        authRoutes()
        
        route("/api") {
            // productRoutes()  // TODO: Fix BigDecimal serialization
            syncRoutes()  // ✅ Should work after fixes
        }
    }
}
```

---

## 🎯 ALTERNATIVE: Use Provided Fix

Instead of manual fixes, I can create a corrected version of `SyncRoutes.kt` with all issues fixed.
This would be faster than fixing each error individually.

Would you like me to:

1. ✅ Create a fully corrected `SyncRoutes.kt` file
2. ⏸️ Guide you through manual fixes
3. 🔧 Fix just the critical errors first, test, then fix remaining

---

## RECOMMENDATION

**Best approach:** Let me create a corrected `SyncRoutes.kt` file in one go. This will:

- Fix all 50+ compilation errors
- Ensure consistent style
- Test once to verify it works
- Save time vs fixing each error individually

The file is ~470 lines, so it's manageable to rewrite cleanly.

---

## 📝 SUMMARY

**Errors:**

- ❌ 12x Missing `statusCode` parameter in `ErrorResponse`
- ❌ 6x Missing `.toInstant()` for LocalDateTime
- ❌ Some SQL query syntax needs adjustment
- ❌ ProductRoutes has unrelated BigDecimal issues (can ignore for now)

**Solution:**

- ✅ Fix SyncRoutes.kt (I can provide corrected version)
- ✅ Comment out ProductRoutes temporarily
- ✅ Test server compilation
- ✅ Move forward with sync testing

**ETA:** 5-10 minutes to fix all errors

---

**Next:** Shall I create the corrected `SyncRoutes.kt` file?
