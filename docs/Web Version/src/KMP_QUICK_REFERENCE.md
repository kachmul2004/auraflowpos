# Kotlin Multiplatform Quick Reference

## 🎯 Project Structure

```
project/
├── shared/                      # KMP shared module
│   ├── src/
│   │   ├── commonMain/         # 🌍 Code for ALL platforms
│   │   ├── androidMain/        # 🤖 Android-specific
│   │   ├── iosMain/           # 🍎 iOS-specific
│   │   ├── desktopMain/       # 🖥️ Desktop-specific
│   │   ├── jsMain/            # 🌐 Web (JS)-specific
│   │   ├── wasmJsMain/        # 🌐 Web (Wasm)-specific
│   │   ├── jvmMain/           # 🖧 Server-specific
│   │   └── commonTest/        # 🧪 Shared tests
│   └── build.gradle.kts
│
├── androidApp/                 # Android application
├── iosApp/                     # iOS application
├── desktopApp/                 # Desktop application
├── webApp/                     # Web application
└── server/                     # Backend server
```

## 📦 Key Libraries

### UI & Navigation
```kotlin
// Compose Multiplatform - UI framework
implementation(compose.runtime)
implementation(compose.foundation)
implementation(compose.material3)

// Voyager - Navigation
implementation("cafe.adriel.voyager:voyager-navigator:1.0.0")
implementation("cafe.adriel.voyager:voyager-screenmodel:1.0.0")
```

### Networking
```kotlin
// Ktor Client - HTTP requests
implementation("io.ktor:ktor-client-core:2.3.7")
implementation("io.ktor:ktor-client-content-negotiation:2.3.7")
implementation("io.ktor:ktor-serialization-kotlinx-json:2.3.7")

// Platform engines
androidMain: implementation("io.ktor:ktor-client-android:2.3.7")
iosMain: implementation("io.ktor:ktor-client-darwin:2.3.7")
desktopMain: implementation("io.ktor:ktor-client-java:2.3.7")
jsMain: implementation("io.ktor:ktor-client-js:2.3.7")
```

### Database
```kotlin
// SQLDelight - Type-safe SQL
implementation("app.cash.sqldelight:runtime:2.0.1")
implementation("app.cash.sqldelight:coroutines-extensions:2.0.1")

// Platform drivers
androidMain: implementation("app.cash.sqldelight:android-driver:2.0.1")
iosMain: implementation("app.cash.sqldelight:native-driver:2.0.1")
desktopMain: implementation("app.cash.sqldelight:sqlite-driver:2.0.1")
jsMain: implementation("app.cash.sqldelight:web-worker-driver:2.0.1")
```

### Serialization & Async
```kotlin
// Kotlinx Serialization - JSON
implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.2")

// Kotlinx Coroutines - Async
implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
```

### Dependency Injection
```kotlin
// Koin - DI framework
implementation("io.insert-koin:koin-core:3.5.3")
implementation("io.insert-koin:koin-compose:1.1.2")
```

### Server (jvmMain only)
```kotlin
// Ktor Server
implementation("io.ktor:ktor-server-core:2.3.7")
implementation("io.ktor:ktor-server-netty:2.3.7")
implementation("io.ktor:ktor-server-content-negotiation:2.3.7")
```

## 🔄 Common Patterns

### Data Model
```kotlin
// commonMain
@Serializable
data class Product(
    val id: String,
    val name: String,
    val price: Double,
    val category: String
)
```

### Repository
```kotlin
// commonMain
class ProductRepository(
    private val api: ProductApi,
    private val database: Database
) {
    suspend fun getProducts(): Result<List<Product>> = runCatching {
        val products = api.fetchProducts()
        database.productQueries.insertAll(products)
        products
    }
    
    fun observeProducts(): Flow<List<Product>> {
        return database.productQueries
            .selectAll()
            .asFlow()
            .mapToList(Dispatchers.Default)
    }
}
```

### ViewModel
```kotlin
// commonMain
class ProductViewModel(
    private val repository: ProductRepository
) : ViewModel() {
    private val _state = MutableStateFlow<ProductState>(ProductState.Loading)
    val state: StateFlow<ProductState> = _state.asStateFlow()
    
    init {
        loadProducts()
    }
    
    private fun loadProducts() {
        viewModelScope.launch {
            repository.getProducts()
                .onSuccess { products ->
                    _state.value = ProductState.Success(products)
                }
                .onFailure { error ->
                    _state.value = ProductState.Error(error.message ?: "Unknown error")
                }
        }
    }
}

sealed interface ProductState {
    object Loading : ProductState
    data class Success(val products: List<Product>) : ProductState
    data class Error(val message: String) : ProductState
}
```

### Composable UI
```kotlin
// commonMain
@Composable
fun ProductScreen(
    viewModel: ProductViewModel = koinViewModel()
) {
    val state by viewModel.state.collectAsState()
    
    when (val currentState = state) {
        is ProductState.Loading -> {
            CircularProgressIndicator()
        }
        is ProductState.Success -> {
            LazyColumn {
                items(currentState.products) { product ->
                    ProductCard(product)
                }
            }
        }
        is ProductState.Error -> {
            Text("Error: ${currentState.message}")
        }
    }
}

@Composable
fun ProductCard(product: Product) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(8.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = product.name,
                style = MaterialTheme.typography.titleMedium
            )
            Text(
                text = "$${product.price}",
                style = MaterialTheme.typography.bodyMedium
            )
        }
    }
}
```

### expect/actual
```kotlin
// commonMain/kotlin/platform/FileSystem.kt
expect class FileSystem {
    suspend fun writeFile(path: String, content: String): Result<Unit>
    suspend fun readFile(path: String): Result<String>
}

// androidMain/kotlin/platform/FileSystem.kt
actual class FileSystem(private val context: Context) {
    actual suspend fun writeFile(path: String, content: String): Result<Unit> {
        return withContext(Dispatchers.IO) {
            runCatching {
                val file = File(context.filesDir, path)
                file.writeText(content)
            }
        }
    }
    
    actual suspend fun readFile(path: String): Result<String> {
        return withContext(Dispatchers.IO) {
            runCatching {
                val file = File(context.filesDir, path)
                file.readText()
            }
        }
    }
}

// iosMain/kotlin/platform/FileSystem.kt
actual class FileSystem {
    actual suspend fun writeFile(path: String, content: String): Result<Unit> {
        return withContext(Dispatchers.Default) {
            runCatching {
                // iOS implementation using NSFileManager
                val fileManager = NSFileManager.defaultManager
                val documentsPath = NSSearchPathForDirectoriesInDomains(
                    NSDocumentDirectory,
                    NSUserDomainMask,
                    true
                ).first() as String
                val filePath = "$documentsPath/$path"
                content.writeToFile(filePath, atomically = true, encoding = NSUTF8StringEncoding)
            }
        }
    }
}
```

### SQLDelight
```sql
-- commonMain/sqldelight/com/auraflow/pos/Product.sq

CREATE TABLE Product (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT NOT NULL
);

selectAll:
SELECT * FROM Product;

selectById:
SELECT * FROM Product WHERE id = ?;

insert:
INSERT OR REPLACE INTO Product(id, name, price, category)
VALUES (?, ?, ?, ?);

deleteById:
DELETE FROM Product WHERE id = ?;
```

```kotlin
// Usage in commonMain
class ProductDatabase(driver: SqlDriver) {
    private val database = Database(driver)
    val productQueries = database.productQueries
    
    suspend fun insertProduct(product: Product) {
        productQueries.insert(
            id = product.id,
            name = product.name,
            price = product.price,
            category = product.category
        )
    }
    
    fun getAllProducts(): Flow<List<Product>> {
        return productQueries.selectAll()
            .asFlow()
            .mapToList(Dispatchers.Default)
    }
}
```

### Koin DI
```kotlin
// commonMain/kotlin/di/AppModule.kt
val appModule = module {
    // Repositories
    single { ProductRepository(get(), get()) }
    
    // ViewModels
    viewModel { ProductViewModel(get()) }
    
    // Database
    single { ProductDatabase(get()) }
}

// androidMain/kotlin/di/PlatformModule.kt
actual val platformModule = module {
    single<SqlDriver> {
        AndroidSqliteDriver(
            Database.Schema,
            get(),
            "auraflow.db"
        )
    }
}

// commonMain/kotlin/App.kt
fun initKoin() {
    startKoin {
        modules(appModule, platformModule)
    }
}
```

## 🎨 Compose Cheat Sheet

### State Management
```kotlin
// Local state
var text by remember { mutableStateOf("") }

// StateFlow from ViewModel
val state by viewModel.state.collectAsState()

// Derived state
val isEmpty by remember { derivedStateOf { text.isEmpty() } }
```

### Effects
```kotlin
// Run on composition
LaunchedEffect(Unit) {
    // Load data
}

// Run when key changes
LaunchedEffect(productId) {
    viewModel.loadProduct(productId)
}

// Cleanup on dispose
DisposableEffect(Unit) {
    onDispose {
        // Cleanup
    }
}

// Side effect without restart
SideEffect {
    // Update external state
}
```

### Material3 Components
```kotlin
// Button
Button(onClick = { /* action */ }) {
    Text("Click Me")
}

// TextField
OutlinedTextField(
    value = text,
    onValueChange = { text = it },
    label = { Text("Label") }
)

// Card
Card(
    modifier = Modifier.fillMaxWidth(),
    colors = CardDefaults.cardColors(
        containerColor = MaterialTheme.colorScheme.surface
    )
) {
    // Content
}

// LazyColumn (RecyclerView equivalent)
LazyColumn {
    items(products) { product ->
        ProductCard(product)
    }
}

// Dialog
if (showDialog) {
    AlertDialog(
        onDismissRequest = { showDialog = false },
        title = { Text("Title") },
        text = { Text("Message") },
        confirmButton = {
            TextButton(onClick = { showDialog = false }) {
                Text("OK")
            }
        }
    )
}
```

## 🔧 Build Configuration

### build.gradle.kts (shared)
```kotlin
plugins {
    kotlin("multiplatform")
    id("org.jetbrains.compose")
    id("com.android.library")
    kotlin("plugin.serialization")
    id("app.cash.sqldelight")
}

kotlin {
    androidTarget()
    
    listOf(iosX64(), iosArm64(), iosSimulatorArm64()).forEach {
        it.binaries.framework {
            baseName = "shared"
            isStatic = true
        }
    }
    
    jvm("desktop")
    js(IR) { browser() }
    
    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation(compose.runtime)
                implementation(compose.foundation)
                implementation(compose.material3)
                // ... other common dependencies
            }
        }
        
        val androidMain by getting {
            dependencies {
                // Android-specific
            }
        }
        
        val iosMain by getting {
            dependencies {
                // iOS-specific
            }
        }
        
        val desktopMain by getting {
            dependencies {
                // Desktop-specific
            }
        }
    }
}

sqldelight {
    databases {
        create("Database") {
            packageName.set("com.auraflow.pos.database")
        }
    }
}
```

## 🚀 Platform Entry Points

### Android
```kotlin
// androidApp/MainActivity.kt
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            App()
        }
    }
}
```

### iOS
```swift
// iosApp/ContentView.swift
import shared

struct ContentView: View {
    var body: some View {
        ComposeView()
            .ignoresSafeArea()
    }
}

struct ComposeView: UIViewControllerRepresentable {
    func makeUIViewController(context: Context) -> UIViewController {
        MainViewControllerKt.MainViewController()
    }
    
    func updateUIViewController(_ uiViewController: UIViewController, context: Context) {}
}
```

### Desktop
```kotlin
// desktopApp/Main.kt
fun main() = application {
    Window(
        onCloseRequest = ::exitApplication,
        title = "AuraFlow POS"
    ) {
        App()
    }
}
```

### Web
```kotlin
// webApp/Main.kt
fun main() {
    CanvasBasedWindow("AuraFlow POS") {
        App()
    }
}
```

## 📝 Common Tasks

### Make HTTP Request
```kotlin
val client = HttpClient {
    install(ContentNegotiation) {
        json()
    }
}

suspend fun fetchProducts(): List<Product> {
    return client.get("https://api.example.com/products").body()
}
```

### Save to Database
```kotlin
database.productQueries.insert(
    id = product.id,
    name = product.name,
    price = product.price,
    category = product.category
)
```

### Navigate (Voyager)
```kotlin
@Composable
fun ProductListScreen() {
    val navigator = LocalNavigator.currentOrThrow
    
    Button(onClick = {
        navigator.push(ProductDetailScreen(productId))
    }) {
        Text("View Details")
    }
}
```

### Show Toast/Snackbar
```kotlin
val snackbarHostState = remember { SnackbarHostState() }

LaunchedEffect(Unit) {
    snackbarHostState.showSnackbar("Product added to cart")
}

SnackbarHost(hostState = snackbarHostState)
```

## 🧪 Testing

```kotlin
// commonTest
class ProductViewModelTest {
    @Test
    fun `should load products on init`() = runTest {
        val repository = FakeProductRepository()
        val viewModel = ProductViewModel(repository)
        
        assertEquals(ProductState.Loading, viewModel.state.value)
        
        advanceUntilIdle()
        
        assertTrue(viewModel.state.value is ProductState.Success)
    }
}
```

## 🎯 Migration Priorities

1. **Data Models** - Easy, high value
2. **Business Logic** - Medium difficulty, high value
3. **Repository Layer** - Medium difficulty, high value
4. **ViewModels** - Easy, high value
5. **UI Components** - Time-consuming, high value
6. **Platform-Specific** - Varies, necessary for features

## 💡 Best Practices

- ✅ Maximize code in `commonMain`
- ✅ Use `expect/actual` only when necessary
- ✅ Keep UI in `commonMain` using Compose Multiplatform
- ✅ Use sealed classes for state
- ✅ Use Flow for reactive streams
- ✅ Test shared code in `commonTest`
- ✅ Use Material3 for consistent UI
- ✅ Follow MVVM architecture

---

**Quick Links:**
- [Full Migration Guide](./KMP_MIGRATION_GUIDE.md)
- [firebender.json](./firebender.json)
- [Compose Multiplatform Docs](https://www.jetbrains.com/lp/compose-multiplatform/)
