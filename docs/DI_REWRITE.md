### AuraFlow POS — Koin DI Rewrite (KMP + Compose Multiplatform)

Last updated: 2025-10-30

This document summarizes the DI issues that caused runtime crashes, the complete rewrite to a Koin setup aligned with KMP/CMP best practices, and guidance for maintaining and extending DI going forward.

---

### Symptoms observed
- App crashed on launch with:
  - `NoDefinitionFoundException` for `com.theauraflow.pos.presentation.viewmodel.AuthViewModel`
- Emulator logs around EGL/dataspace are benign and unrelated to the crash.

### Root causes
1. Duplicate DI definitions and ViewModels across modules
   - `composeApp/src/commonMain/...` had its own `AppModule.kt` and simple `Compose*ViewModel` classes.
   - `shared/src/commonMain/...` defined a complete multi-layer DI (api/data/domain) and ViewModels that depend on use cases.
   - The app was mixing these two worlds, resulting in missing bindings at runtime.

2. Koin context initialized inside a composable
   - `App.kt` wrapped the app with `KoinApplication { modules(appModule) }`, which is not ideal for KMP/CMP and clashed with the shared DI runtime expectations.

3. Missing binding for shared `AuthViewModel`
   - Shared `AuthViewModel` existed and depended on use cases, but DI didn’t provide a `single { AuthViewModel(...) }` binding.

---

### What we changed
1. Unified on the shared DI (KMP-first) and removed per-composable Koin init
   - Removed `KoinApplication { ... }` wrapper from `App.kt`.
   - Koin is now initialized once from the Android entry point using a shared initializer.

2. Use shared ViewModels in UI
   - `App.kt`, `LoginScreen.kt`, and `POSScreen.kt` now reference shared ViewModels:
     - `AuthViewModel` (shared)
     - `ProductViewModel` (shared)
     - `CartViewModel` (shared)
   - Adjusted `POSScreen` to consume shared state models (`UiState`) and call shared methods (`searchProducts`, `addToCart`).
   - Left `CheckoutScreen` as-is for now; it still references the legacy `ComposeCartViewModel` and should be migrated next if/when used.

3. Added missing bindings to shared DI
   - In `shared/src/commonMain/.../DomainModule.kt`, added:
     - `single { AuthViewModel(loginUseCase = get(), logoutUseCase = get(), refreshTokenUseCase = get(), viewModelScope = CoroutineScope(Dispatchers.Default)) }`
   - Product and Cart ViewModels were already provided as `single { ... }` with their use cases.

4. Platform startup
   - Android: `composeApp/src/androidMain/.../MainActivity.kt` now calls `initKoin()` once in `onCreate()` before composing the UI.

5. Kept legacy compose-only ViewModels but removed references
   - The previous `ComposeAuthViewModel`, `ComposeProductViewModel`, `ComposeCartViewModel` remain in the repo for now to minimize churn, but are no longer referenced in active screens.
   - You may delete them in a follow-up cleanup PR if desired.

---

### Files touched (high level)
- Updated
  - `composeApp/src/commonMain/kotlin/com/theauraflow/pos/App.kt`
  - `composeApp/src/commonMain/kotlin/com/theauraflow/pos/ui/screen/LoginScreen.kt`
  - `composeApp/src/commonMain/kotlin/com/theauraflow/pos/ui/screen/POSScreen.kt`
  - `composeApp/src/androidMain/kotlin/com/theauraflow/pos/MainActivity.kt`
  - `shared/src/commonMain/kotlin/com/theauraflow/pos/core/di/DomainModule.kt` (add `AuthViewModel` binding)
- Added
  - `docs/DI_REWRITE.md` (this document)
- Unchanged but present
  - `shared/src/commonMain/kotlin/com/theauraflow/pos/core/di/KoinInitializer.kt` (used for `initKoin()`)
  - `shared/src/commonMain/kotlin/com/theauraflow/pos/core/di/AppModule.kt` (includes api/data/domain/network)

---

### Result
- The DI graph is now defined centrally in `shared` and initialized once at platform startup.
- UI uses the shared ViewModels, resolving the `NoDefinitionFoundException` for `AuthViewModel`.

---

### How to initialize Koin (KMP/CMP best practice)
- Shared initializer: `shared/src/commonMain/.../KoinInitializer.kt`
  ```kotlin
  // Anywhere in platform startup
  import com.theauraflow.pos.core.di.initKoin

  fun startApp() {
      initKoin() // optionally pass appDeclaration for platform bindings
  }
  ```
- Android example (`MainActivity.onCreate`):
  ```kotlin
  override fun onCreate(savedInstanceState: Bundle?) {
      super.onCreate(savedInstanceState)
      initKoin()
      setContent { App() }
  }
  ```
- Compose: do NOT wrap your root with `KoinApplication {}`. Use `koinInject()` / `koinViewModel()` inside composables to retrieve dependencies.

---

### How to add a new Koin module
1. Create a `module { ... }` in `shared/src/commonMain/kotlin/com/theauraflow/pos/core/di/<YourModule>.kt`.
   ```kotlin
   // Example: BillingModule.kt
   package com.theauraflow.pos.core.di

   import org.koin.dsl.module

   val billingModule = module {
       // factories or singles
       // factory { CreateInvoiceUseCase(get()) }
       // single<PaymentGateway> { StripeGateway(get()) }
   }
   ```
2. Include it in `AppModule.kt`.
   ```kotlin
   // AppModule.kt
   val appModule = module {
       includes(
           networkModule,
           apiModule,
           dataModule,
           domainModule,
           billingModule, // <- add here
       )
   }
   ```
3. If you need platform-specific bindings (files, paths, etc.), add a `platformModule` via `expect/actual` and include it in `initKoin { modules(platformModule) }`.

---

### ViewModel best practices (KMP/CMP + Koin)
- Prefer `factoryOf(::UseCase)` for use cases and `single { ... }` for ViewModels and repositories unless you need scoped lifecycles.
- Provide a `CoroutineScope` internally (e.g., `CoroutineScope(Dispatchers.Default)`) or via injection if you need test control.
- Avoid Android `androidx.lifecycle.ViewModel` in shared code; use plain classes managing `StateFlow`.
- In Compose, inject with `koinInject()` (CMP) or `koinViewModel()` (when using koin-compose-viewmodel artifacts).

---

### Migrating screens to shared ViewModels
- Replace direct state lists with `UiState<T>` pattern used in shared VMs.
  ```kotlin
  val productsState by productViewModel.productsState.collectAsState()
  val products = when (val s = productsState) {
      is UiState.Success -> s.data
      is UiState.Error -> emptyList() // optionally show error
      else -> emptyList() // loading/idle
  }
  ```
- Update method names to shared API:
  - Search: `searchProducts(query)`
  - Add to cart: `addToCart(product)`

---

### Troubleshooting
- NoDefinitionFoundException: ensure your type is bound in a loaded module and the platform called `initKoin()` before composition.
- IDE highlights `koinInject` in red: sync Gradle and ensure `koin-compose` is in dependencies.
- Mixed ViewModels (legacy vs shared): fully migrate the screen to shared ViewModels to avoid API mismatches.

---

### Next steps (optional)
- Migrate `CheckoutScreen` to shared `CartViewModel`.
- Remove the legacy `Compose*ViewModel` classes and the old `composeApp` DI module to reduce confusion.
- Introduce `platformModule` expect/actual bindings if/when platform-specific services are needed (file access, resources).

---

### References
- Koin KMP: https://insert-koin.io/docs/reference/koin-mp/kmp/
- Koin + Compose Multiplatform: https://insert-koin.io/docs/quickstart/cmp/


---

#### Addendum — 2025-10-30 17:10

- Deprecation of composeApp DI:
  - The file `composeApp/src/commonMain/kotlin/com/theauraflow/pos/core/di/AppModule.kt` has been deprecated and stripped of Koin definitions to prevent conflicts with the shared DI graph. Do not add modules there. Add modules only under `shared/src/commonMain/kotlin/com/theauraflow/pos/core/di/` and include them from the shared `appModule`.
- ViewModels to use:
  - Use ONLY the shared ViewModels from `shared/src/commonMain/kotlin/com/theauraflow/pos/presentation/viewmodel/` (`AuthViewModel`, `ProductViewModel`, `CartViewModel`).
  - The legacy `Compose*ViewModel` classes under `composeApp/.../presentation/viewmodel/` are legacy and should not be referenced. Screens have been migrated (e.g., `POSScreen`, `CheckoutScreen`) to shared VMs.
- Desktop (JVM) initialization:
  - `composeApp/src/jvmMain/kotlin/com/theauraflow/pos/main.kt` now calls `initKoin()` before composing. This fixes the previous crash: `KoinApplication has not been started`.
- Koin initializer cleanup:
  - `shared/src/commonMain/.../KoinInitializer.kt` now loads only the shared `appModule` (which already includes network/data/domain) to avoid duplicate module registration.
- Android warning `hiddenapi`:
  - The log about `Landroid/os/SystemProperties;->addChangeCallback` is a Compose reflection access note and is benign. It does not affect functionality.
