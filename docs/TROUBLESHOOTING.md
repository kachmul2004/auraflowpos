# Troubleshooting Guide - AuraFlow POS

## Common Issues & Solutions

### 1. Gradle Lock Timeout Error

**Error Message:**

```
Timeout waiting to lock execution history cache
Owner PID: XXXXX
Our PID: YYYYY
```

**Cause:** Another Gradle daemon is holding a lock on the build cache.

**Solution:**

```bash
./gradlew --stop
```

This stops all Gradle daemons and releases the lock.

**Alternative Solution (if above doesn't work):**

```bash
# Kill specific Gradle process
kill -9 XXXXX  # Replace with the Owner PID from error

# Or kill all Gradle daemons
pkill -f gradle
```

---

### 2. Koin DI - "Unresolved reference 'koinInject'"

**Error:** Linter shows `koinInject` as unresolved.

**Cause:** Missing Koin context initialization in Compose.

**Solution:**
Wrap your app with `KoinApplication`:

```kotlin
@Composable
fun App() {
    KoinApplication(application = {
        modules(appModule)  // Your Koin modules
    }) {
        // Your app content here
        YourMainScreen()
    }
}
```

**Required imports:**

```kotlin
import org.koin.compose.KoinApplication
import org.koin.compose.koinInject
```

**Required dependency in `composeApp/build.gradle.kts`:**

```kotlin
commonMain.dependencies {
    implementation(libs.koin.compose)
}
```

---

### 3. "Cannot find symbol: formatCurrency"

**Cause:** Missing import for extension function.

**Solution:**

```kotlin
import com.theauraflow.pos.core.util.formatCurrency
```

---

### 4. Modifier Naming Conflict

**Error:** Ambiguous import between Compose `Modifier` and domain `Modifier`.

**Solution:** Use type alias:

```kotlin
import androidx.compose.ui.Modifier
import com.theauraflow.pos.domain.model.Modifier as ProductModifier
```

---

### 5. Room Database - "Cannot find implementation"

**Cause:** Room KMP is not properly configured.

**Solution:**
Add Room KSP plugin and dependencies:

```kotlin
plugins {
    alias(libs.plugins.ksp)
}

dependencies {
    add("kspCommonMainMetadata", libs.room.compiler)
}
```

---

### 6. iOS Build Fails - "Framework not found"

**Cause:** iOS framework not properly exported.

**Solution:**
Check `shared/build.gradle.kts`:

```kotlin
kotlin {
    iosArm64()
    iosSimulatorArm64()
    
    listOf(iosArm64(), iosSimulatorArm64()).forEach {
        it.binaries.framework {
            baseName = "shared"
            isStatic = true
        }
    }
}
```

---

### 7. WebAssembly Build Issues

**Cause:** Missing Wasm target configuration.

**Solution:**

```kotlin
@OptIn(ExperimentalWasmDsl::class)
wasmJs {
    browser()
    binaries.executable()
}
```

---

### 8. "No such property: libs"

**Cause:** Version catalog not found.

**Solution:**
Ensure `gradle/libs.versions.toml` exists and contains all required versions.

---

### 9. Ktor Client - "No suitable HttpClientEngine found"

**Cause:** Missing platform-specific engine.

**Solution:**
Add engines for each platform:

```kotlin
// Android
androidMain.dependencies {
    implementation(libs.ktor.client.android)
}

// iOS
iosMain.dependencies {
    implementation(libs.ktor.client.darwin)
}

// Desktop
jvmMain.dependencies {
    implementation(libs.ktor.client.cio)
}

// Web
jsMain.dependencies {
    implementation(libs.ktor.client.js)
}
```

---

### 10. "Preview not found" in Compose

**Cause:** Missing preview import or annotation.

**Solution:**

```kotlin
import org.jetbrains.compose.ui.tooling.preview.Preview

@Preview
@Composable
fun MyComponentPreview() {
    // Preview content
}
```

---

### 11. Build Gets Stuck at 90%

**Symptoms:**

```
<===========--> 90% EXECUTING [6m]
> :shared:compileTestKotlinJs
> :composeApp:linkReleaseFrameworkIosSimulatorArm64
> :composeApp:compileTestDevelopmentExecutableKotlinWasmJs
```

**Cause:** Kotlin Multiplatform trying to compile ALL platforms (Android, iOS, Desktop, JS, Wasm)
simultaneously, exhausting system resources (memory/CPU).

**Solution 1: Build Specific Platforms (Fast)**

```bash
# Android + Shared only (development builds)
./gradlew :shared:build :composeApp:assembleDebug -x test --max-workers=4

# Android APK only
./gradlew :composeApp:assembleDebug -x test

# Shared module only
./gradlew :shared:build -x test
```

**Solution 2: Optimize gradle.properties**

```properties
org.gradle.parallel=true
org.gradle.workers.max=4
kotlin.mpp.enableGranularSourceSetsMetadata=true
```

**Solution 3: Increase Memory (if needed)**

```properties
org.gradle.jvmargs=-Xmx8g -XX:MaxMetaspaceSize=2g
kotlin.daemon.jvmargs=-Xmx4g
```

**Why it works:**

- Limits parallel compilation to 4 workers
- Prevents memory exhaustion
- Focuses on platforms you're actively developing

**When to use full build:**

```bash
# Only for CI/release builds
./gradlew build --max-workers=4
```

---

## Build Commands Reference

### Clean Build

```bash
./gradlew clean build
```

### Build Specific Platform

```bash
./gradlew :composeApp:assembleDebug          # Android
./gradlew :composeApp:linkDebugFrameworkIos  # iOS
./gradlew :composeApp:jvmJar                 # Desktop
./gradlew :composeApp:jsBrowserDevelopment   # JS
./gradlew :composeApp:wasmJsBrowserDevelopment # Wasm
```

### Run Tests

```bash
./gradlew test                    # All tests
./gradlew :shared:allTests        # Shared module tests
./gradlew :composeApp:testDebug   # Android tests
```

### Stop All Daemons

```bash
./gradlew --stop
```

### Refresh Dependencies

```bash
./gradlew --refresh-dependencies
```

---

## IDE Issues

### IntelliJ IDEA / Android Studio

**Gradle Sync Fails:**

1. File → Invalidate Caches → Invalidate and Restart
2. Delete `.idea` and `.gradle` folders
3. Reimport project

**Compose Preview Not Working:**

1. Build → Rebuild Project
2. Ensure preview imports are correct
3. Check Compose compiler plugin is enabled

**Koin Injections Red:**

- IDE may not recognize Koin DI immediately
- Build project to verify it actually compiles
- Sync Gradle files

---

## Performance Issues

### Slow Build Times

**Solutions:**

1. Enable Gradle daemon: Add to `gradle.properties`
   ```properties
   org.gradle.daemon=true
   org.gradle.parallel=true
   org.gradle.caching=true
   ```

2. Increase Gradle memory:
   ```properties
   org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=1024m
   ```

3. Use configuration cache:
   ```bash
   ./gradlew build --configuration-cache
   ```

### App Runs Slowly

**Check:**

1. Enable R8/ProGuard for release builds
2. Use `implementation` instead of `api` where possible
3. Lazy-load heavy dependencies
4. Profile with Android Profiler

---

## Network Issues

### SSL/TLS Errors

**Solution:**
Configure Ktor client with custom SSL:

```kotlin
HttpClient(engine) {
    engine {
        https {
            trustManager = myTrustManager
        }
    }
}
```

### Timeout Errors

**Solution:**
Increase timeouts:

```kotlin
HttpClient {
    install(HttpTimeout) {
        requestTimeoutMillis = 30_000
        connectTimeoutMillis = 10_000
        socketTimeoutMillis = 10_000
    }
}
```

---

## Debugging Tips

### Enable Logging

**Koin:**

```kotlin
KoinApplication(application = {
    printLogger()  // Enable Koin logging
    modules(appModule)
})
```

**Ktor:**

```kotlin
HttpClient {
    install(Logging) {
        level = LogLevel.ALL
    }
}
```

**Custom Logger:**

```kotlin
Logger.d("TAG", "Debug message")
Logger.e("TAG", "Error message", throwable)
```

---

## Getting Help

1. **Check Documentation:**
    - `docs/AURAFLOW_KMP_MIGRATION_GUIDE.md`
    - `docs/COMPOSE_UI_GUIDELINES.md`
    - `docs/KMP_ARCHITECTURE.md`

2. **Search Issues:**
    - GitHub Issues
    - Stack Overflow with `kotlin-multiplatform` tag
    - Kotlin Slack #multiplatform channel

3. **Report Bugs:**
    - Include error message
    - Include platform & version
    - Include minimal reproducible example
    - Include relevant logs

---

**Last Updated:** January 2025
