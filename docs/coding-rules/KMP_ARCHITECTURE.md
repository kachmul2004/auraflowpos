# Kotlin Multiplatform Architecture Guidelines

## Clean Architecture Layers

### 1. Domain Layer (`shared/commonMain/domain/`)

**Pure Kotlin - NO platform dependencies**

```kotlin
// Domain models with serialization
@Serializable
data class Product(
    val id: String,
    val name: String,
    val price: Double,
    val imageUrl: String?
)

// Repository interface
interface ProductRepository {
    suspend fun getProducts(): Result<List<Product>>
    suspend fun getProductById(id: String): Result<Product>
    fun observeProducts(): Flow<List<Product>>
}

// Use case with single responsibility
class GetProductsUseCase(
    private val productRepository: ProductRepository
) {
    suspend operator fun invoke(): Result<List<Product>> {
        return productRepository.getProducts()
            .map { products ->
                products.filter { it.isActive }
                    .sortedBy { it.name }
            }
    }
}
```

**Rules:**

- ✅ Pure Kotlin only
- ✅ Domain models with `@Serializable`
- ✅ Repository interfaces
- ✅ Use cases with single responsibility
- ✅ Business logic only
- ❌ NO platform-specific code
- ❌ NO UI code
- ❌ NO framework dependencies

---

### 2. Data Layer (`shared/commonMain/data/`)

**Repository implementations, data sources, DTOs**

```kotlin
// Repository implementation
class ProductRepositoryImpl(
    private val remoteDataSource: ProductRemoteDataSource,
    private val localDataSource: ProductLocalDataSource
) : ProductRepository {
    
    override suspend fun getProducts(): Result<List<Product>> = withContext(Dispatchers.IO) {
        try {
            // Offline-first: Remote → Cache → Local
            val remoteProducts = remoteDataSource.fetchProducts()
            localDataSource.saveProducts(remoteProducts)
            Result.success(remoteProducts.map { it.toDomain() })
        } catch (e: Exception) {
            try {
                val localProducts = localDataSource.getProducts()
                Result.success(localProducts.map { it.toDomain() })
            } catch (cacheError: Exception) {
                Result.failure(e)
            }
        }
    }
    
    override fun observeProducts(): Flow<List<Product>> {
        return localDataSource.observeProducts()
            .map { entities -> entities.map { it.toDomain() } }
    }
}

// DTO with mapper
@Serializable
data class ProductDto(
    @SerialName("id") val id: String,
    @SerialName("name") val name: String,
    @SerialName("price") val price: Double,
    @SerialName("image_url") val imageUrl: String?
)

fun ProductDto.toDomain(): Product = Product(
    id = id,
    name = name,
    price = price,
    imageUrl = imageUrl
)
```

**Rules:**

- ✅ Implement repository interfaces
- ✅ Use DTOs for network/database
- ✅ Map DTOs to domain models
- ✅ Implement offline-first pattern
- ✅ Return `Result<T>` or `Flow<T>`
- ✅ Use `withContext(Dispatchers.IO)` for suspend functions
- ❌ NO direct domain model exposure
- ❌ NO mixing DTOs with domain models

---

### 3. Presentation Layer (`composeApp/commonMain/`)

**Compose UI, ViewModels, UI State**

```kotlin
// ViewModel with StateFlow
class POSViewModel(
    private val getProductsUseCase: GetProductsUseCase,
    private val addToCartUseCase: AddToCartUseCase
) : ViewModel() {
    
    private val _uiState = MutableStateFlow<POSUiState>(POSUiState.Loading)
    val uiState: StateFlow<POSUiState> = _uiState.asStateFlow()
    
    init {
        loadProducts()
    }
    
    fun loadProducts() {
        viewModelScope.launch {
            _uiState.value = POSUiState.Loading
            getProductsUseCase()
                .onSuccess { products ->
                    _uiState.value = POSUiState.Success(products)
                }
                .onFailure { error ->
                    _uiState.value = POSUiState.Error(error.toUiText())
                }
        }
    }
}

// Sealed UI State
sealed interface POSUiState {
    data object Loading : POSUiState
    data class Success(val products: List<Product>) : POSUiState
    data class Error(val message: UiText) : POSUiState
}

// Compose UI
@Composable
fun ProductListScreen(viewModel: POSViewModel = koinViewModel()) {
    val state by viewModel.uiState.collectAsState()
    
    when (val currentState = state) {
        is POSUiState.Loading -> LoadingIndicator()
        is POSUiState.Success -> ProductList(currentState.products)
        is POSUiState.Error -> ErrorMessage(currentState.message.asString())
    }
}
```

**Rules:**

- ✅ Use `StateFlow` for UI state
- ✅ Private `MutableStateFlow`, public immutable `StateFlow`
- ✅ Sealed interface for UI state variants
- ✅ Launch coroutines in `viewModelScope`
- ✅ Handle loading/success/error states
- ✅ Inject use cases via constructor
- ✅ Use Material3 components
- ✅ Hoist state up
- ❌ NO business logic in ViewModel
- ❌ NO exposing `MutableStateFlow` publicly
- ❌ NO passing ViewModels to child composables

---

### 4. Core Layer (`shared/commonMain/core/`)

**DI, utilities, platform interfaces**

```kotlin
// Koin DI modules
val dataModule = module {
    single<HttpClient> { createHttpClient() }
    single<AppDatabase> { createDatabase() }
    single<ProductRepository> { ProductRepositoryImpl(get(), get()) }
}

val domainModule = module {
    factory { GetProductsUseCase(get()) }
    factory { AddToCartUseCase(get()) }
}

val presentationModule = module {
    viewModelOf(::POSViewModel)
    viewModelOf(::CartViewModel)
}

// Result wrapper
typealias Result<T> = kotlin.Result<T>

fun Throwable.toUiText(): UiText {
    return when (this) {
        is IOException -> UiText.StringResource("error_network")
        else -> UiText.DynamicString(message ?: "Unknown error")
    }
}

// UiText for localization
sealed interface UiText {
    data class DynamicString(val value: String) : UiText
    data class StringResource(val id: String, val args: List<Any> = emptyList()) : UiText
}

// Expect/actual for platform code
expect class Logger {
    fun log(message: String)
    fun error(message: String, throwable: Throwable?)
}
```

**Rules:**

- ✅ Use Koin 4.1.0 for DI
- ✅ Use `single` for stateful objects
- ✅ Use `factory` for stateless objects
- ✅ Use `viewModelOf` for ViewModels
- ✅ Use `Result<T>` for error handling
- ✅ Use `UiText` for localization
- ✅ Use `expect/actual` for platform-specific code
- ❌ NO global state
- ❌ NO hardcoded strings in UI

---

## Dependency Flow

```
Presentation Layer (UI, ViewModels)
        ↓ depends on
Domain Layer (Use Cases, Interfaces)
        ↑ implemented by
Data Layer (Repositories, Data Sources)
```

**Critical Rules:**

- ❌ Domain NEVER depends on Data or Presentation
- ❌ Data NEVER depends on Presentation
- ✅ All dependencies flow inward to Domain

---

## File Organization

```
shared/src/commonMain/kotlin/com/theauraflow/pos/
├── core/
│   ├── util/
│   │   ├── Result.kt
│   │   ├── UiText.kt
│   │   └── Extensions.kt
│   └── constants/
│       └── AppConstants.kt
├── domain/
│   ├── model/
│   │   ├── Product.kt
│   │   └── Order.kt
│   ├── repository/
│   │   ├── ProductRepository.kt
│   │   └── OrderRepository.kt
│   └── usecase/
│       ├── GetProductsUseCase.kt
│       └── AddToCartUseCase.kt
├── data/
│   ├── remote/
│   │   ├── dto/
│   │   │   └── ProductDto.kt
│   │   └── api/
│   │       └── ProductApi.kt
│   ├── local/
│   │   ├── entity/
│   │   │   └── ProductEntity.kt
│   │   └── dao/
│   │       └── ProductDao.kt
│   └── repository/
│       └── ProductRepositoryImpl.kt
└── presentation/
    ├── viewmodel/
    │   └── POSViewModel.kt
    └── ui/
        ├── screen/
        │   └── ProductListScreen.kt
        └── component/
            └── ProductCard.kt
```

**Principles:**

- One class per file
- Group by feature, not by type
- Max 300 lines per file
- Max 50 lines per function
- Use meaningful names
- Add KDoc for public API

---

## Best Practices Summary

### DO ✅

- Follow Clean Architecture layers
- Use dependency injection (Koin)
- Return `Result<T>` for error handling
- Use `Flow<T>` for streams
- Use sealed interfaces for UI state
- Map DTOs to domain models
- Implement offline-first pattern
- Use `viewModelScope` for coroutines
- Keep composables small (<100 lines)
- Use Material3 components

### DON'T ❌

- Mix domain models with DTOs
- Put business logic in ViewModels
- Expose `MutableStateFlow` publicly
- Use `!!` operator
- Block main thread
- Hardcode strings in UI
- Use `GlobalScope`
- Forget error handling
- Skip unit tests
- Create "manager" classes
