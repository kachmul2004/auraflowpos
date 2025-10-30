# Kotlin Multiplatform Migration Guide

## 🎯 Overview

This guide covers migrating AuraFlow POS from the current **React/TypeScript + Android** architecture to a **unified Kotlin Multiplatform (KMP)** codebase with **Compose Multiplatform** for shared UI across all platforms.

## 🏗️ New Architecture

### Target Platforms

1. **Android** - Native Android app
2. **iOS** - Native iOS app
3. **Desktop** - Windows, macOS, Linux via JVM
4. **Web** - Browser via Kotlin/JS or Kotlin/Wasm
5. **Server** - Backend API via Ktor on JVM

### Source Sets Structure

```
shared/
├── src/
│   ├── commonMain/          # Shared code for ALL platforms
│   │   ├── kotlin/
│   │   │   ├── data/        # Models, repositories, DTOs
│   │   │   ├── domain/      # Business logic, use cases
│   │   │   ├── ui/          # Compose Multiplatform UI
│   │   │   │   ├── components/
│   │   │   │   ├── screens/
│   │   │   │   └── theme/
│   │   │   ├── plugins/     # Plugin system
│   │   │   ├── presets/     # Industry presets
│   │   │   └── utils/       # Utilities
│   │   └── resources/       # Shared resources
│   │
│   ├── androidMain/         # Android-specific code
│   │   └── kotlin/
│   │       ├── actual/      # Android implementations
│   │       └── platform/    # Android platform APIs
│   │
│   ├── iosMain/             # iOS-specific code
│   │   └── kotlin/
│   │       ├── actual/      # iOS implementations
│   │       └── platform/    # iOS platform APIs
│   │
│   ├── desktopMain/         # Desktop-specific code
│   │   └── kotlin/
│   │       ├── actual/      # Desktop implementations
│   │       └── platform/    # Desktop APIs
│   │
│   ├── jsMain/              # Web-specific code (JS)
│   │   └── kotlin/
│   │       ├── actual/      # Web implementations
│   │       └── platform/    # Browser APIs
│   │
│   ├── wasmJsMain/          # Web-specific code (Wasm)
│   │   └── kotlin/
│   │
│   ├── jvmMain/             # Server-specific code
│   │   └── kotlin/
│   │       ├── api/         # Ktor server endpoints
│   │       ├── database/    # PostgreSQL/Supabase
│   │       └── auth/        # Authentication
│   │
│   ├── commonTest/          # Shared tests
│   ├── androidTest/         # Android tests
│   ├── iosTest/             # iOS tests
│   └── ...
```

## 📦 Technology Stack

### Core Libraries

| Purpose | Library | Notes |
|---------|---------|-------|
| **UI Framework** | Compose Multiplatform | Shared UI across all platforms |
| **Navigation** | Voyager or Decompose | Multiplatform navigation |
| **Networking** | Ktor Client | HTTP client for all platforms |
| **Server** | Ktor Server | Backend API (JVM) |
| **Database** | SQLDelight | Type-safe SQL for all platforms |
| **Serialization** | Kotlinx.serialization | JSON parsing |
| **Async** | Kotlinx.coroutines | Coroutines and Flow |
| **DI** | Koin | Multiplatform DI |
| **State** | StateFlow / ViewModel | Reactive state management |
| **Settings** | Multiplatform Settings | Key-value storage |
| **DateTime** | Kotlinx-datetime | Date/time handling |

### Platform-Specific Libraries

| Platform | Libraries |
|----------|-----------|
| **Android** | AndroidX, Material3, Coil (images) |
| **iOS** | UIKit interop, native image loading |
| **Desktop** | JVM desktop APIs, window management |
| **Web** | kotlinx.browser, DOM APIs |
| **Server** | Exposed/PostgreSQL, Supabase SDK |

## 🔄 Migration Strategy

### Phase 1: Project Setup

1. **Create KMP Project Structure**
   ```bash
   # Use KMP wizard or Android Studio KMP template
   # Configure all target platforms
   ```

2. **Configure `build.gradle.kts`**
   ```kotlin
   plugins {
       kotlin("multiplatform")
       id("org.jetbrains.compose")
       id("com.android.library")
       kotlin("plugin.serialization")
       id("app.cash.sqldelight")
   }
   
   kotlin {
       // Android
       androidTarget()
       
       // iOS
       listOf(
           iosX64(),
           iosArm64(),
           iosSimulatorArm64()
       ).forEach { iosTarget ->
           iosTarget.binaries.framework {
               baseName = "shared"
               isStatic = true
           }
       }
       
       // Desktop
       jvm("desktop")
       
       // Web
       js(IR) {
           browser()
       }
       wasmJs {
           browser()
       }
       
       // Server
       jvm("server")
       
       sourceSets {
           val commonMain by getting {
               dependencies {
                   implementation(compose.runtime)
                   implementation(compose.foundation)
                   implementation(compose.material3)
                   implementation("io.ktor:ktor-client-core:2.3.7")
                   implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
                   implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.2")
                   implementation("io.insert-koin:koin-core:3.5.3")
                   implementation("app.cash.sqldelight:runtime:2.0.1")
               }
           }
           
           val androidMain by getting {
               dependencies {
                   implementation("io.ktor:ktor-client-android:2.3.7")
                   implementation("app.cash.sqldelight:android-driver:2.0.1")
               }
           }
           
           val iosMain by getting {
               dependencies {
                   implementation("io.ktor:ktor-client-darwin:2.3.7")
                   implementation("app.cash.sqldelight:native-driver:2.0.1")
               }
           }
           
           val desktopMain by getting {
               dependencies {
                   implementation("io.ktor:ktor-client-java:2.3.7")
                   implementation("app.cash.sqldelight:sqlite-driver:2.0.1")
               }
           }
           
           val jsMain by getting {
               dependencies {
                   implementation("io.ktor:ktor-client-js:2.3.7")
                   implementation("app.cash.sqldelight:web-worker-driver:2.0.1")
               }
           }
           
           val serverMain by getting {
               dependencies {
                   implementation("io.ktor:ktor-server-core:2.3.7")
                   implementation("io.ktor:ktor-server-netty:2.3.7")
                   implementation("org.postgresql:postgresql:42.7.1")
               }
           }
       }
   }
   ```

### Phase 2: Migrate Data Models

**Current (TypeScript):**
```typescript
// lib/types.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
}
```

**New (Kotlin - commonMain):**
```kotlin
// shared/src/commonMain/kotlin/data/models/Product.kt
@Serializable
data class Product(
    val id: String,
    val name: String,
    val price: Double,
    val category: String,
    val image: String? = null
)
```

### Phase 3: Migrate Business Logic

**Current (TypeScript):**
```typescript
// lib/store.ts
export const useStore = create<POSStore>((set, get) => ({
  cart: [],
  addToCart: (item) => set(state => ({
    cart: [...state.cart, item]
  })),
}));
```

**New (Kotlin - commonMain):**
```kotlin
// shared/src/commonMain/kotlin/domain/usecase/CartUseCases.kt
class CartUseCases(
    private val repository: POSRepository
) {
    fun addToCart(item: CartItem): Flow<Result<Unit>> = flow {
        try {
            repository.addToCart(item)
            emit(Result.success(Unit))
        } catch (e: Exception) {
            emit(Result.failure(e))
        }
    }
}

// shared/src/commonMain/kotlin/ui/viewmodel/POSViewModel.kt
class POSViewModel(
    private val cartUseCases: CartUseCases
) : ViewModel() {
    private val _cart = MutableStateFlow<List<CartItem>>(emptyList())
    val cart: StateFlow<List<CartItem>> = _cart.asStateFlow()
    
    fun addToCart(item: CartItem) {
        viewModelScope.launch {
            cartUseCases.addToCart(item).collect { result ->
                result.onSuccess {
                    _cart.value = _cart.value + item
                }
            }
        }
    }
}
```

### Phase 4: Migrate UI Components

**Current (React/TypeScript):**
```typescript
// components/ProductCard.tsx
export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <div className="bg-card p-4 rounded-lg" onClick={() => onClick(product)}>
      <img src={product.image} alt={product.name} />
      <h3 className="text-foreground">{product.name}</h3>
      <p className="text-muted-foreground">${product.price}</p>
    </div>
  );
}
```

**New (Compose Multiplatform - commonMain):**
```kotlin
// shared/src/commonMain/kotlin/ui/components/ProductCard.kt
@Composable
fun ProductCard(
    product: Product,
    onClick: (Product) -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .clickable { onClick(product) },
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        )
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            AsyncImage(
                model = product.image,
                contentDescription = product.name,
                modifier = Modifier
                    .fillMaxWidth()
                    .aspectRatio(1f)
            )
            
            Text(
                text = product.name,
                style = MaterialTheme.typography.titleMedium,
                color = MaterialTheme.colorScheme.onSurface
            )
            
            Text(
                text = "$${product.price}",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}
```

### Phase 5: Implement expect/actual

**Platform-specific file operations:**

```kotlin
// shared/src/commonMain/kotlin/platform/FileOperations.kt
expect class FileOperations {
    suspend fun saveReceipt(receipt: String): Result<String>
    suspend fun loadSettings(): Result<Settings>
}

// shared/src/androidMain/kotlin/platform/FileOperations.kt
actual class FileOperations(private val context: Context) {
    actual suspend fun saveReceipt(receipt: String): Result<String> {
        return withContext(Dispatchers.IO) {
            try {
                val file = File(context.filesDir, "receipt_${System.currentTimeMillis()}.txt")
                file.writeText(receipt)
                Result.success(file.absolutePath)
            } catch (e: Exception) {
                Result.failure(e)
            }
        }
    }
}

// shared/src/iosMain/kotlin/platform/FileOperations.kt
actual class FileOperations {
    actual suspend fun saveReceipt(receipt: String): Result<String> {
        return withContext(Dispatchers.Default) {
            // iOS implementation using NSFileManager
            // ...
        }
    }
}
```

### Phase 6: Server-Side Migration

**Current (Node.js):**
```javascript
// backend/server.js
app.get('/api/products', async (req, res) => {
  const products = await supabase.from('products').select('*');
  res.json(products);
});
```

**New (Ktor - jvmMain):**
```kotlin
// shared/src/jvmMain/kotlin/api/ProductsApi.kt
fun Application.configureProductsRouting() {
    routing {
        get("/api/products") {
            val products = database.productQueries.getAllProducts().executeAsList()
            call.respond(products)
        }
        
        post("/api/products") {
            val product = call.receive<Product>()
            database.productQueries.insertProduct(
                id = product.id,
                name = product.name,
                price = product.price,
                category = product.category
            )
            call.respond(HttpStatusCode.Created, product)
        }
    }
}
```

## 🎨 UI Migration Mapping

| React/Tailwind | Compose Multiplatform |
|----------------|----------------------|
| `<div className="bg-card">` | `Card { }` |
| `<button className="btn">` | `Button { }` |
| `<input />` | `TextField(value, onValueChange)` |
| `className="text-xl font-bold"` | `style = MaterialTheme.typography.headlineMedium` |
| `className="bg-primary"` | `containerColor = MaterialTheme.colorScheme.primary` |
| `useState()` | `remember { mutableStateOf() }` |
| `useEffect()` | `LaunchedEffect` |
| `useStore()` | `viewModel.state.collectAsState()` |
| shadcn/ui components | Material3 components |

## 🔌 Plugin System Migration

**Current (TypeScript):**
```typescript
// plugins/loyalty-program/index.ts
export const loyaltyPlugin: Plugin = {
  id: 'loyalty-program',
  name: 'Loyalty Program',
  activate: async () => { /* ... */ },
  deactivate: async () => { /* ... */ }
};
```

**New (Kotlin - commonMain):**
```kotlin
// shared/src/commonMain/kotlin/plugins/loyalty/LoyaltyPlugin.kt
class LoyaltyPlugin : Plugin {
    override val id = "loyalty-program"
    override val name = "Loyalty Program"
    override val version = "1.0.0"
    
    override suspend fun activate(context: PluginContext) {
        // Activation logic
    }
    
    override suspend fun deactivate(context: PluginContext) {
        // Deactivation logic
    }
    
    @Composable
    override fun provideUI() {
        LoyaltyProgramScreen()
    }
}
```

## 🗄️ Database Migration

**SQLDelight Schema:**
```sql
-- shared/src/commonMain/sqldelight/com/auraflow/pos/database/Products.sq

CREATE TABLE Product (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT NOT NULL,
    image TEXT
);

getAllProducts:
SELECT * FROM Product;

getProductById:
SELECT * FROM Product WHERE id = ?;

insertProduct:
INSERT INTO Product(id, name, price, category, image)
VALUES (?, ?, ?, ?, ?);
```

## 📱 Platform Entry Points

### Android
```kotlin
// androidApp/src/main/kotlin/MainActivity.kt
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            App() // Shared Compose UI
        }
    }
}
```

### iOS
```kotlin
// iosApp/iosApp/ContentView.swift
struct ContentView: View {
    var body: some View {
        ComposeView()
    }
}

struct ComposeView: UIViewControllerRepresentable {
    func makeUIViewController(context: Context) -> UIViewController {
        MainViewControllerKt.MainViewController()
    }
}
```

### Desktop
```kotlin
// desktopApp/src/jvmMain/kotlin/Main.kt
fun main() = application {
    Window(
        onCloseRequest = ::exitApplication,
        title = "AuraFlow POS"
    ) {
        App() // Shared Compose UI
    }
}
```

### Web
```kotlin
// webApp/src/jsMain/kotlin/Main.kt
fun main() {
    CanvasBasedWindow("AuraFlow POS") {
        App() // Shared Compose UI
    }
}
```

## 🧪 Testing Strategy

```kotlin
// shared/src/commonTest/kotlin/domain/CartUseCasesTest.kt
class CartUseCasesTest {
    @Test
    fun `addToCart should add item to cart`() = runTest {
        val repository = FakePOSRepository()
        val useCase = CartUseCases(repository)
        
        val item = CartItem(/* ... */)
        useCase.addToCart(item).test {
            val result = awaitItem()
            assertTrue(result.isSuccess)
            awaitComplete()
        }
    }
}
```

## 📋 Migration Checklist

### Setup
- [ ] Create KMP project structure
- [ ] Configure all target platforms
- [ ] Setup Compose Multiplatform
- [ ] Configure SQLDelight
- [ ] Setup Ktor (client + server)
- [ ] Configure Koin DI

### Data Layer
- [ ] Migrate all TypeScript interfaces to Kotlin data classes
- [ ] Create SQLDelight schema from Supabase schema
- [ ] Implement repositories with Ktor client
- [ ] Create platform-specific database drivers
- [ ] Implement offline queue with SQLDelight

### Domain Layer
- [ ] Migrate business logic to use cases
- [ ] Port plugin system to Kotlin
- [ ] Migrate industry presets
- [ ] Implement subscription manager
- [ ] Create domain models

### UI Layer
- [ ] Create Material3 theme matching current design
- [ ] Migrate all React components to Compose
- [ ] Implement ViewModels with StateFlow
- [ ] Setup navigation (Voyager/Decompose)
- [ ] Create shared screens

### Platform-Specific
- [ ] Implement expect/actual for file operations
- [ ] Implement expect/actual for printing
- [ ] Android: Integrate existing Android code
- [ ] iOS: Create iOS app wrapper
- [ ] Desktop: Create desktop application
- [ ] Web: Configure Kotlin/JS or Kotlin/Wasm
- [ ] Server: Migrate Node.js backend to Ktor

### Features
- [ ] Shopping cart functionality
- [ ] Payment processing
- [ ] Receipt generation and printing
- [ ] User authentication
- [ ] Product management
- [ ] Customer management
- [ ] Offline mode
- [ ] Real-time sync
- [ ] Analytics

### Testing
- [ ] Unit tests for domain layer
- [ ] UI tests for common UI
- [ ] Platform-specific integration tests
- [ ] End-to-end tests

### Deployment
- [ ] Android: Google Play Store
- [ ] iOS: App Store
- [ ] Desktop: Platform-specific installers
- [ ] Web: Deploy to hosting
- [ ] Server: Deploy backend API

## 🚀 Benefits of KMP Migration

1. **Single Codebase** - ~80% code sharing across all platforms
2. **Consistent UI** - Same UI on Android, iOS, Desktop, Web
3. **Type Safety** - Full type safety with Kotlin
4. **Performance** - Native performance on all platforms
5. **Easier Maintenance** - Fix bugs once, deploy everywhere
6. **Faster Development** - Write features once
7. **Better Testing** - Test shared logic once
8. **Native Features** - Platform-specific code when needed

## 📚 Resources

- [Kotlin Multiplatform Docs](https://kotlinlang.org/docs/multiplatform.html)
- [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)
- [Ktor Documentation](https://ktor.io/)
- [SQLDelight](https://cashapp.github.io/sqldelight/)
- [Koin Multiplatform](https://insert-koin.io/docs/reference/koin-mp/kmp)
- [Voyager Navigation](https://voyager.adriel.cafe/)
- [KMP Samples](https://github.com/JetBrains/compose-multiplatform)

## 💡 Pro Tips

1. **Start with commonMain** - Maximize code sharing from the start
2. **Use expect/actual sparingly** - Only for truly platform-specific code
3. **Design for multiplatform** - Think cross-platform from day one
4. **Test in commonTest** - Shared tests run on all platforms
5. **Use Compose Preview** - Preview UI on all platforms
6. **Gradual Migration** - Migrate module by module
7. **Platform Parity** - Ensure feature parity across platforms

---

**Next Steps:**
1. Review this guide thoroughly
2. Set up KMP project structure
3. Start with data models migration
4. Incrementally migrate features
5. Test on each platform continuously
