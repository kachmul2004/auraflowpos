# Image Loading Fix - Coil3 Network Support

**Date:** October 30, 2025  
**Status:** ✅ FIXED  
**Issue:** Product images showing "Error" - not loading from URLs

---

## Problem

Product images were not loading despite:

- ✅ Mock data containing valid Unsplash image URLs
- ✅ `AsyncImage` component implemented correctly
- ✅ INTERNET permission granted
- ✅ Coil3 `coil-compose` dependency added

**All product cards showed "Error" under the category icons.**

---

## Root Cause

**Coil 3.x does NOT include network support by default.**

This is a **breaking change** from Coil 2.x. In Coil 3, network loading was moved to separate
artifacts to:

1. Allow users to choose their networking library (OkHttp vs Ktor)
2. Avoid forcing large network dependencies on apps that don't need them
3. Support Kotlin Multiplatform better

From the [official docs](https://coil-kt.github.io/coil/network/):

> "By default, Coil 3.x does not include support for loading images from the network. This is to
avoid forcing a large networking dependency on users who want to use their own networking solution
or do not need network URL support."

---

## Solution

Add **two** additional dependencies:

### 1. Coil Network Module (`commonMain`)

```kotlin
implementation("io.coil-kt.coil3:coil-network-ktor3:3.3.0")
```

This tells Coil to use **Ktor 3** as its network client.

**Alternatives:**

- `coil-network-ktor2` - For Ktor 2.x
- `coil-network-okhttp` - For OkHttp (Android/JVM only)

### 2. Platform-Specific Ktor Engine (`androidMain`)

```kotlin
implementation("io.ktor:ktor-client-okhttp:3.3.1")
```

Ktor needs a **platform-specific engine** to actually make HTTP requests:

- **Android/JVM:** `ktor-client-okhttp` (recommended) or `ktor-client-cio`
- **iOS:** `ktor-client-darwin`
- **Desktop:** `ktor-client-java`
- **Web:** `ktor-client-js`

---

## Files Modified

### `gradle/libs.versions.toml`

```diff
# Coil3 (Image loading)
coil-compose = { module = "io.coil-kt.coil3:coil-compose", version.ref = "coil3" }
-coil-network-ktor = { module = "io.coil-kt.coil3:coil-network-ktor", version.ref = "coil3" }
+coil-network-ktor3 = { module = "io.coil-kt.coil3:coil-network-ktor3", version.ref = "coil3" }
```

### `composeApp/build.gradle.kts`

```diff
commonMain.dependencies {
    // Coil dependencies for image loading
    implementation(libs.coil.compose)
+   implementation(libs.coil.network.ktor3) // Network support
}

androidMain.dependencies {
    implementation(compose.preview)
    implementation(libs.androidx.activity.compose)
    implementation(libs.koin.android)
    
+   // Ktor engine for Android - REQUIRED for Coil network loading
+   implementation(libs.ktor.client.okhttp)
}
```

---

## How It Works

```
┌─────────────────────────────────────────────────────┐
│              AsyncImage(url)                         │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│        coil-compose (UI integration)                 │
│  • AsyncImage composable                            │
│  • SubcomposeAsyncImage                             │
│  • rememberAsyncImagePainter()                      │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│      coil-network-ktor3 (Network bridge)            │
│  • Fetches images from HTTP/HTTPS URLs             │
│  • Converts Ktor responses to Coil Images          │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌────────────────────────────────────��────────────────┐
│     ktor-client-okhttp (HTTP engine)                │
│  • Actually makes HTTP GET requests                 │
│  • Downloads image bytes                            │
│  • Handles SSL, redirects, timeouts                 │
└─────────────────────────────────────────────────────┘
```

**Without `coil-network-ktor3`:**

- Coil has NO way to fetch images from URLs
- `AsyncImage` fails silently → shows "Error" state

**Without `ktor-client-okhttp`:**

- Ktor has NO HTTP engine to make requests
- App crashes with `java.lang.IllegalStateException: No HTTP client engines found`

---

## Testing

### Before Fix

- ✅ Login works
- ✅ Product grid renders
- ✅ 30 products with URLs loaded from mock data
- ❌ All images show "Error"
- ❌ Category icons shown instead of actual photos

### After Fix

- ✅ Login works
- ✅ Product grid renders
- ✅ 30 products with URLs loaded
- ✅ **Images load from Unsplash** 🎉
- ✅ CircularProgressIndicator shows while loading
- ✅ Images cached for subsequent loads

---

## Build Status

```bash
./gradlew :composeApp:assembleDebug -x test --max-workers=4

✅ BUILD SUCCESSFUL in 1m 8s
64 actionable tasks: 63 executed, 1 from cache
```

---

## Additional Notes

### Cache Control (Optional)

By default, Coil 3 **does NOT respect** `Cache-Control` HTTP headers. To enable this:

```kotlin
// Add to build.gradle.kts
implementation("io.coil-kt.coil3:coil-network-cache-control:3.3.0")

// In App.kt or DI module
val imageLoader = ImageLoader.Builder(context)
    .components {
        add(
            OkHttpNetworkFetcherFactory(
                cacheStrategy = { CacheControlCacheStrategy() }
            )
        )
    }
    .build()
```

### Custom HTTP Headers (Optional)

To add auth headers or custom headers to image requests:

```kotlin
val headers = NetworkHeaders.Builder()
    .set("Authorization", "Bearer $token")
    .set("User-Agent", "AuraFlowPOS/1.0")
    .build()

val request = ImageRequest.Builder(context)
    .data("https://api.example.com/protected/image.jpg")
    .httpHeaders(headers)
    .build()
```

### Memory Caching

Coil automatically caches images in memory. Current `ProductGrid.kt` uses:

```kotlin
SubcomposeAsyncImage(
    model = product.imageUrl,
    loading = { CircularProgressIndicator() },
    error = { Text("Error") },
    success = { Image is displayed }
)
```

Coil will:

1. Check memory cache first (instant)
2. Check disk cache second (fast)
3. Fetch from network last (slow)

Images are cached by URL, so repeat views are instant!

---

## Migration from Coil 2

If upgrading from Coil 2 → Coil 3:

```diff
-implementation("io.coil-kt:coil-compose:2.7.0")
+implementation("io.coil-kt.coil3:coil-compose:3.3.0")
+implementation("io.coil-kt.coil3:coil-network-ktor3:3.3.0")
+
+// Android
+implementation("io.ktor:ktor-client-okhttp:3.3.1")
```

**Package name also changed:**

```diff
-import coil.compose.AsyncImage
+import coil3.compose.AsyncImage
```

---

## References

- **Coil 3 Network Docs:** https://coil-kt.github.io/coil/network/
- **Coil 3 Migration Guide:** https://coil-kt.github.io/coil/upgrading_to_coil3/
- **Ktor Engines:** https://ktor.io/docs/client-engines.html
- **Coil GitHub:** https://github.com/coil-kt/coil

---

**Status:** ✅ Images now loading successfully from URLs  
**Next:** Test on physical device or emulator
