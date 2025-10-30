# Koin Dependency Injection Setup Guide

## Overview

AuraFlowPOS uses **Koin** for dependency injection across all platforms (Android, iOS, Desktop,
Web). The DI architecture is designed to support **easy switching between mock/sample data and real
API backends** without changing any ViewModel or UI code.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Platform Entry                        │
│         (MainActivity, main(), etc.)                     │
│                                                          │
│  startKoin {                                             │
│    allowOverride(true)                                   │
│    modules(                                              │
│      appModule,       ← Real repos + use cases           │
│      mockDataModule   ← Mock repos (overrides real)      │
│    )                                                     │
│  }                                                       │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    Koin Modules                          │
├─────────────────────────────────────────────────────────┤
│  appModule (shared/core/di/AppModule.kt)                │
│    • Use Cases (LoginUseCase, etc.)                     │
│    • ViewModels (AuthViewModel, etc.)                   │
│    • Real Repositories (AuthRepositoryImpl, etc.)       │
│    • HttpClient, TokenStorage, Database                 │
│                                                          │
│  mockDataModule (shared/core/di/MockDataModule.kt)      │
│    • Mock Repositories (MockAuthRepository, etc.)       │
│    • InMemoryTokenStorage                               │
│    • Sample Data (products, customers, users)           │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    ViewModels                            │
│  • Inject ONLY interfaces (ProductRepository)           │
│  • NO direct reference to Mock/Real implementations     │
│  • Works with both mock and real data sources           │
└─────────────────────────────────────────────────────────┘
```

## Key Principle: Interface-Based Injection

**ViewModels and Use Cases ONLY inject repository interfaces:**

```kotlin
// 
class ProductViewModel(
    private val productRepository: ProductRepository  // Interface
) : ViewModel()

// 
class ProductViewModel(
    private val productRepository: MockProductRepository  // Concrete implementation
) : ViewModel()
```

This allows seamless switching between mock and real implementations.

## Module Organization

### 1. `appModule` (Real/Production)

**Location:** `shared/src/commonMain/kotlin/com/theauraflow/pos/core/di/AppModule.kt`

**Contains:**

- Use Cases (LoginUseCase, GetProductsUseCase, etc.)
- ViewModels (AuthViewModel, ProductViewModel, CartViewModel)
- Real Repository Implementations (AuthRepositoryImpl, ProductRepositoryImpl)
- Network clients (Ktor HttpClient)
- Database instances (Room/SQLDelight)
- TokenStorage (platform-specific secure storage)

**Example:**
```kotlin
val appModule = module {
    // Use Cases
    single { LoginUseCase(get()) }
    
    // ViewModels
    viewModel { AuthViewModel(get()) }
    
    // Real Repositories
    single<AuthRepository> { AuthRepositoryImpl(get(), get()) }
    single<ProductRepository> { ProductRepositoryImpl(get(), get()) }
    
    // Infrastructure
    single { createHttpClient() }
    single<TokenStorage> { SecureTokenStorage(get()) }  // Platform-specific
}
```

### 2. `mockDataModule` (Development/Testing)

**Location:** `shared/src/commonMain/kotlin/com/theauraflow/pos/core/di/MockDataModule.kt`

**Contains:**

- Mock Repository Implementations (MockAuthRepository, MockProductRepository)
- InMemoryTokenStorage (no persistence)
- Sample data from `docs/Web Version/src/data/mockData.ts`

**Example:**
```kotlin
val mockDataModule = module {
    // Override real repositories with mocks
    single<AuthRepository>(override = true) { MockAuthRepository(get()) }
    single<ProductRepository>(override = true) { MockProductRepository() }
    single<CustomerRepository>(override = true) { MockCustomerRepository() }
    
    // In-memory token storage
    single<TokenStorage>(override = true) { InMemoryTokenStorage() }
}
```

## Platform Initialization

### Android (`MainActivity.kt`)

```kotlin
import com.theauraflow.pos.core.di.appModule
import com.theauraflow.pos.core.di.mockDataModule
import org.koin.android.ext.koin.androidContext
import org.koin.core.context.startKoin

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Initialize Koin with Mock overrides for development
        startKoin {
            androidContext(this@MainActivity)
            allowOverride(true)  // 
            modules(
                appModule,      // Real repos + use cases
                mockDataModule  // Mock repos (overrides real)
            )
        }
        
        setContent { App() }
    }
}
```

### Desktop (`main.kt`)

```kotlin
import com.theauraflow.pos.core.di.appModule
import com.theauraflow.pos.core.di.mockDataModule
import org.koin.core.context.startKoin

fun main() {
    startKoin {
        allowOverride(true)
        modules(appModule, mockDataModule)
    }
    
    application {
        Window(onCloseRequest = ::exitApplication) {
            App()
        }
    }
}
```

### iOS (`MainViewController.kt`)

```kotlin
fun MainViewController() = ComposeUIViewController {
    // iOS Koin init should be done in Swift/Obj-C app delegate
    App()
}

// In Swift:
// import shared
// KoinInitializerKt.initKoin { _ in }
```

## Switching Between Mock and Real Data

### Development Mode (Mock Data)

**Current default setup - no API calls, uses sample data:**

```kotlin
startKoin {
    allowOverride(true)
    modules(
        appModule,      // Contains real repos
        mockDataModule  // Overrides with mocks 
    )
}
```

**Credentials for mock login:**

- Email: `admin@example.com`, Password: `password123`
- Email: `john@example.com`, Password: `password123`
- Email: `jane@example.com`, Password: `password123`

### Production Mode (Real API)

**Remove `mockDataModule` to use real API:**

```kotlin
startKoin {
    modules(appModule)  // Only real repos, no overrides
}
```

**No ViewModel changes needed!** The app automatically switches to using the real API.

## Mock Repositories

### MockAuthRepository

**Location:**
`shared/src/commonMain/kotlin/com/theauraflow/pos/data/repository/MockAuthRepository.kt`

**Features:**

- Simulates login with 300ms delay
- Returns mock User object with access/refresh tokens
- Stores tokens in InMemoryTokenStorage
- No network calls

**Valid Credentials:**

```kotlin
private val mockUsers = listOf(
    User("1", "Admin", "admin@example.com", "ADMIN"),
    User("2", "John Doe", "john@example.com", "CASHIER"),
    User("3", "Jane Smith", "jane@example.com", "MANAGER")
)
// All use password: "password123"
```

### MockProductRepository

**Location:**
`shared/src/commonMain/kotlin/com/theauraflow/pos/data/repository/MockProductRepository.kt`

**Features:**

- Returns 9 sample products (Coffee, Pizza, etc.)
- Includes categories, prices, images
- Simulates 200ms network delay
- Supports search, filter by category

**Sample Products:**

- Coffee ($4.99) - Beverages
- Pizza ($12.99) - Food
- Burger ($8.99) - Food
- Salad ($7.99) - Food
- And 5 more...

### MockCustomerRepository

**Location:**
`shared/src/commonMain/kotlin/com/theauraflow/pos/data/repository/MockCustomerRepository.kt`

**Features:**

- Returns 4 sample customers
- Includes loyalty points, visit counts
- Supports search by name/phone

## Testing Login Flow

### Step 1: Build and Install

```bash
./gradlew :composeApp:assembleDebug
```

### Step 2: Launch App

The login screen appears with credentials pre-filled:

- **Username:** `admin@example.com`
- **Password:** `password123`

### Step 3: Tap "Sign In"

**What happens (mock mode):**

1. `ComposeAuthViewModel.login()` is called
2. Delegates to `AuthViewModel.login()`
3. Calls `LoginUseCase`
4. Uses `MockAuthRepository.login()`
5. Simulates 300ms delay
6. Returns mock User + tokens
7. Stores tokens in `InMemoryTokenStorage`
8. Updates `isLoggedIn` StateFlow to `true`
9. UI navigates to POSScreen

**No API calls are made!** Check logcat - you should NOT see:

```
REQUEST: https://api.auraflowpos.com/v1/api/auth/login
```

## Troubleshooting

### Issue: Still seeing API calls in logcat

**Solution:**

1. Ensure `allowOverride(true)` is set in `startKoin { }`
2. Ensure `mockDataModule` is loaded AFTER `appModule`
3. Clean build: `./gradlew clean`
4. Rebuild: `./gradlew :composeApp:assembleDebug`

### Issue: NoDefinitionFoundException

**Solution:**
Check that your module includes the missing dependency:

```kotlin
val mockDataModule = module {
    single<AuthRepository> { MockAuthRepository(get()) }  // Requires TokenStorage
    single<TokenStorage> { InMemoryTokenStorage() }       // Must be defined first
}
```

### Issue: Koin definition conflict

**Solution:**
Add `override = true` to mock bindings:

```kotlin
single<AuthRepository>(override = true) { MockAuthRepository(get()) }
```

## Migration to Production

### Step 1: Implement Real Repositories

Replace mock implementations with real API calls:

```kotlin
class AuthRepositoryImpl(
    private val httpClient: HttpClient,
    private val tokenStorage: TokenStorage
) : AuthRepository {
    override suspend fun login(username: String, password: String): Result<User> {
        return try {
            val response = httpClient.post("https://api.auraflowpos.com/v1/api/auth/login") {
                setBody(LoginRequest(username, password))
            }
            Result.success(response.body())
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
```

### Step 2: Update Platform Entry

Remove `mockDataModule`:

```kotlin
// Android MainActivity.kt
startKoin {
    androidContext(this@MainActivity)
    modules(appModule)  // Only real repos
}
```

### Step 3: No ViewModel Changes Needed!

ViewModels still inject `AuthRepository` interface
Now gets `AuthRepositoryImpl` instead of `MockAuthRepository`
Same code, different implementation

## Best Practices

1. **Always inject interfaces, never concrete implementations**
2. **Keep mock logic separate from real logic**
3. **Use `allowOverride(true)` for development builds**
4. **Load `mockDataModule` LAST to ensure overrides work**
5. **Test both mock and real modes before production**
6. **Document mock credentials and sample data**

## References

- **Koin KMP Documentation:** https://insert-koin.io/docs/quickstart/kotlin-multiplatform
- **Koin Compose Multiplatform:** https://insert-koin.io/docs/quickstart/compose-multiplatform
- **Mock Data Source:** `docs/Web Version/src/data/mockData.ts`
- **Clean Architecture:
  ** https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html

---

**Last Updated:** 2025-10-30  
**Status:**  Working - Mock mode active by default

