# AuraFlow POS - Android Implementation Guide

## Overview

This guide provides step-by-step instructions for implementing the Jetpack Compose version of AuraFlow POS in your Android project.

## 📋 Prerequisites

- Android Studio Hedgehog (2023.1.1) or later
- Kotlin 1.9.20+
- Minimum SDK: API 26 (Android 8.0)
- Target SDK: API 34 (Android 14)
- Gradle 8.0+

## 🚀 Quick Start

### 1. Project Setup

Create a new Android project or add to existing:

```bash
# In Android Studio
File > New > New Project > Empty Activity
# Choose Kotlin as language
# Minimum SDK: API 26
```

### 2. Configure Gradle

Add dependencies to `app/build.gradle.kts`:

```kotlin
android {
    compileSdk = 34
    
    defaultConfig {
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
    }
    
    buildFeatures {
        compose = true
    }
    
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.4"
    }
}

dependencies {
    // Compose BOM
    implementation(platform("androidx.compose:compose-bom:2023.10.01"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")
    
    // Activity & Lifecycle
    implementation("androidx.activity:activity-compose:1.8.1")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.6.2")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.6.2")
    
    // Navigation
    implementation("androidx.navigation:navigation-compose:2.7.5")
    
    // Coil for images
    implementation("io.coil-kt:coil-compose:2.5.0")
    
    // Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")
}
```

### 3. Copy Android Files

Copy the entire `android/` folder contents into your project:

```
your-project/
├── app/
│   └── src/
│       └── main/
│           └── java/
│               └── com/
│                   └── auraflow/
│                       └── pos/
│                           ├── theme/
│                           ├── models/
│                           ├── ui/
│                           ├── components/
│                           ├── screens/
│                           └── utils/
```

### 4. Update Package Names

Update all package declarations to match your project:

```kotlin
// From:
package com.auraflow.pos.theme

// To (example):
package com.yourcompany.yourapp.theme
```

### 5. Configure MainActivity

```kotlin
package com.auraflow.pos

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.auraflow.pos.screens.POSScreen
import com.auraflow.pos.theme.AuraFlowPOSTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            AuraFlowPOSTheme {
                Surface(
                    modifier = Modifier.fillMaxSize()
                ) {
                    // Your POS app starts here
                    POSScreen(
                        products = emptyList(), // Load from your data source
                        cartItems = emptyList(),
                        stockMap = emptyMap(),
                        onProductClick = { /* TODO */ },
                        onQuantityChange = { _, _ -> /* TODO */ },
                        onRemoveItem = { /* TODO */ },
                        onCheckout = { /* TODO */ },
                        onClearCart = { /* TODO */ }
                    )
                }
            }
        }
    }
}
```

## 🏗️ Architecture

### State Management

Use ViewModels for state management:

```kotlin
class POSViewModel : ViewModel() {
    private val _products = MutableStateFlow<List<Product>>(emptyList())
    val products: StateFlow<List<Product>> = _products.asStateFlow()
    
    private val _cartItems = MutableStateFlow<List<CartItem>>(emptyList())
    val cartItems: StateFlow<List<CartItem>> = _cartItems.asStateFlow()
    
    private val _stockMap = MutableStateFlow<Map<String, Int>>(emptyMap())
    val stockMap: StateFlow<Map<String, Int>> = _stockMap.asStateFlow()
    
    fun addToCart(product: Product) {
        // Implementation
    }
    
    fun updateQuantity(item: CartItem, newQuantity: Int) {
        // Implementation
    }
    
    fun removeFromCart(item: CartItem) {
        // Implementation
    }
}
```

### Using ViewModel in Screen

```kotlin
@Composable
fun POSScreenContainer(
    viewModel: POSViewModel = viewModel()
) {
    val products by viewModel.products.collectAsState()
    val cartItems by viewModel.cartItems.collectAsState()
    val stockMap by viewModel.stockMap.collectAsState()
    
    POSScreen(
        products = products,
        cartItems = cartItems,
        stockMap = stockMap,
        onProductClick = viewModel::addToCart,
        onQuantityChange = viewModel::updateQuantity,
        onRemoveItem = viewModel::removeFromCart,
        onCheckout = { /* Navigate to payment */ },
        onClearCart = viewModel::clearCart
    )
}
```

## 📱 Screen Layouts

### POS Main Screen

The main POS screen uses a two-column layout:

```
┌─────────────────────────────────────────────────────┐
│                   Action Bar                        │
├──────────────────────────────┬─────────────────────┤
│     Product Area (65%)        │  Cart Area (35%)    │
│  ┌─────────────────────────┐ │  ┌────────────────┐ │
│  │  Category Filter        │ │  │  Cart Header   │ │
│  ├─────────────────────────┤ │  ├────────────────┤ │
│  │                         │ │  │                │ │
│  │    Product Grid         │ │  │   Cart Items   │ │
│  │    (#D9D9D9 bg)        │ │  │                │ │
│  │                         │ │  │                │ │
│  ├─────────────────────────┤ │  ├────────────────┤ │
│  │     Pagination          │ │  │  Cart Summary  │ │
│  └─────────────────────────┘ │  └────────────────┘ │
└──────────────────────────────┴─────────────────────┘
```

### Responsive Layouts

For different screen sizes:

```kotlin
@Composable
fun ResponsivePOSScreen() {
    val windowSizeClass = calculateWindowSizeClass()
    
    when (windowSizeClass.widthSizeClass) {
        WindowWidthSizeClass.Compact -> {
            // Phone: Tabbed layout
            TabletPOSLayout()
        }
        WindowWidthSizeClass.Medium,
        WindowWidthSizeClass.Expanded -> {
            // Tablet/Desktop: Side-by-side
            POSScreen(/* ... */)
        }
    }
}
```

## 🎨 Theming & Customization

### Custom Colors

Edit `theme/Color.kt`:

```kotlin
// Change primary brand color
val Primary = Color(0xFF3B82F6) // Your brand color

// Change product grid background
val ProductGridBackground = Color(0xFFD9D9D9) // Custom gray
```

### Custom Typography

Edit `theme/Type.kt`:

```kotlin
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily

val CustomFont = FontFamily(
    Font(R.font.your_font_regular, FontWeight.Normal),
    Font(R.font.your_font_bold, FontWeight.Bold)
)

val AuraFlowTypography = Typography(
    displayLarge = TextStyle(
        fontFamily = CustomFont,
        // ...
    )
)
```

## 🔌 Data Integration

### Using Room Database

```kotlin
@Entity(tableName = "products")
data class ProductEntity(
    @PrimaryKey val id: String,
    val name: String,
    val price: Double,
    val category: String,
    val stock: Int,
    val imageUrl: String?
)

@Dao
interface ProductDao {
    @Query("SELECT * FROM products WHERE isActive = 1")
    fun getAllProducts(): Flow<List<ProductEntity>>
    
    @Query("SELECT * FROM products WHERE category = :category")
    fun getProductsByCategory(category: String): Flow<List<ProductEntity>>
}
```

### Using Retrofit for API

```kotlin
interface POSApiService {
    @GET("products")
    suspend fun getProducts(): List<Product>
    
    @POST("transactions")
    suspend fun createTransaction(@Body transaction: Transaction): TransactionResponse
}

class POSRepository(
    private val api: POSApiService,
    private val database: POSDatabase
) {
    fun getProducts(): Flow<List<Product>> {
        return database.productDao().getAllProducts()
            .map { entities -> entities.map { it.toProduct() } }
    }
    
    suspend fun syncProducts() {
        val products = api.getProducts()
        database.productDao().insertAll(products.map { it.toEntity() })
    }
}
```

## 🧪 Testing

### Unit Tests

```kotlin
class POSViewModelTest {
    private lateinit var viewModel: POSViewModel
    
    @Before
    fun setup() {
        viewModel = POSViewModel(
            repository = FakePOSRepository()
        )
    }
    
    @Test
    fun `adding product to cart increases cart size`() = runTest {
        val product = createTestProduct()
        viewModel.addToCart(product)
        
        val cartItems = viewModel.cartItems.first()
        assertEquals(1, cartItems.size)
    }
}
```

### UI Tests

```kotlin
@Test
fun testProductCardDisplays() {
    composeTestRule.setContent {
        AuraFlowPOSTheme {
            ProductCard(
                product = testProduct,
                availableStock = 10,
                onClick = {}
            )
        }
    }
    
    composeTestRule
        .onNodeWithText(testProduct.name)
        .assertIsDisplayed()
}
```

## 📦 Build & Deploy

### Build Release APK

```bash
./gradlew assembleRelease
```

### Build App Bundle

```bash
./gradlew bundleRelease
```

### ProGuard Rules

Add to `proguard-rules.pro`:

```proguard
# Keep Compose
-keep class androidx.compose.** { *; }

# Keep Models
-keep class com.auraflow.pos.models.** { *; }

# Keep Retrofit models
-keepclassmembers,allowobfuscation class * {
    @com.google.gson.annotations.SerializedName <fields>;
}
```

## 🔧 Performance Optimization

### Image Loading

```kotlin
// Use Coil for efficient image loading
AsyncImage(
    model = ImageRequest.Builder(LocalContext.current)
        .data(product.imageUrl)
        .crossfade(true)
        .memoryCachePolicy(CachePolicy.ENABLED)
        .build(),
    contentDescription = product.name
)
```

### LazyList Optimization

```kotlin
LazyVerticalGrid(
    columns = GridCells.Fixed(5),
    // Key for efficient recomposition
    key = { product -> product.id }
) {
    items(products, key = { it.id }) { product ->
        ProductCard(/* ... */)
    }
}
```

## 🐛 Common Issues

### Issue: Images not loading

**Solution**: Add internet permission to `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

### Issue: Compose preview not working

**Solution**: Ensure preview dependencies are added:

```kotlin
debugImplementation("androidx.compose.ui:ui-tooling")
debugImplementation("androidx.compose.ui:ui-test-manifest")
```

### Issue: Theme colors not applying

**Solution**: Ensure you're wrapping content in `AuraFlowPOSTheme`:

```kotlin
setContent {
    AuraFlowPOSTheme {
        // Your content here
    }
}
```

## 📚 Additional Resources

- [Jetpack Compose Documentation](https://developer.android.com/jetpack/compose)
- [Material Design 3](https://m3.material.io/)
- [Android Architecture Guide](https://developer.android.com/topic/architecture)
- [Coil Image Loading](https://coil-kt.github.io/coil/)

## 🆘 Support

For issues or questions:
1. Check the main project documentation
2. Review the component-specific documentation in each file
3. Open an issue on the project repository

## 📄 License

Part of the AuraFlow POS system. See main project LICENSE.
