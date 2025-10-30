# AuraFlow POS - Android Directory Index

## 📋 Complete File List

This document provides a comprehensive index of all files in the Android implementation.

### 📁 Core (`/android/core/`)

| File | Description | Key Contents |
|------|-------------|--------------|
| `Constants.kt` | Application constants | App config, receipt settings, validation rules, error messages |
| `Utils.kt` | Utility functions | Formatting, validation, calculations, receipt generation |

### 📁 Data Layer (`/android/data/`)

#### Models (`/android/data/models/`)

| File | Description | Models Included |
|------|-------------|-----------------|
| `Models.kt` | All data models | Product, CartItem, Order, Customer, User, Shift, GiftCard, Table, Tab, BusinessProfile, Category, HeldOrder |

**Enums defined**: OrderType, OrderStatus, PaymentMethodType, UserRole, Permission, DiscountType, IndustryType, TableStatus

#### Repository (`/android/data/repository/`)

| File | Description | Responsibilities |
|------|-------------|------------------|
| `POSRepository.kt` | Main data repository | Cart operations, order creation, user management, shift tracking, gift cards, analytics |

#### Sample Data (`/android/data/`)

| File | Description | Contents |
|------|-------------|----------|
| `SampleData.kt` | Mock data for testing | 20 products, 3 users, 3 customers, 3 gift cards, business profile |

### 📁 Domain Layer (`/android/domain/`)

#### Use Cases (`/android/domain/usecase/`)

| File | Description | Operations |
|------|-------------|------------|
| `CartUseCases.kt` | Cart business logic | Add/remove items, quantity updates, discount validation |
| `OrderUseCases.kt` | Order business logic | Order creation, payment validation, held orders |

#### Subscription (`/android/domain/subscription/`)

| File | Description | Features |
|------|-------------|----------|
| `SubscriptionManager.kt` | Feature management | 8 presets (General, Retail, Restaurant, Bar, Cafe, Salon, Pharmacy, Ultimate) |

**Presets defined**: GeneralPreset, RetailPreset, RestaurantPreset, BarPreset, CafePreset, SalonPreset, PharmacyPreset, UltimatePreset

#### Plugins (`/android/domain/plugins/`)

| File | Description | Plugins |
|------|-------------|---------|
| `PluginManager.kt` | Plugin system | BarcodePlugin, LoyaltyPlugin, KitchenDisplayPlugin, TableManagementPlugin, OpenTabsPlugin, InventoryPlugin, AppointmentsPlugin, AgeVerificationPlugin |

### 📁 UI Layer (`/android/ui/`)

#### ViewModels (`/android/ui/viewmodel/`)

| File | Description | State Management |
|------|-------------|------------------|
| `POSViewModel.kt` | Main ViewModel | Cart state, product filtering, order creation, subscription features |

**State classes**: POSUiState, CartSummary

#### Basic UI Components (`/android/ui/`)

| File | Component | Variants/Features |
|------|-----------|-------------------|
| `Badge.kt` | Badge component | Default, Destructive, Secondary, Outline |
| `Button.kt` | Button component | Primary, Secondary, Destructive, Ghost, Outline |
| `Card.kt` | Card components | Card, CardHeader, CardContent, CardFooter |
| `Dialog.kt` | Dialog component | AlertDialog with customizable content |
| `TextField.kt` | Text input | Material3 OutlinedTextField wrapper |

### 📁 Complex Components (`/android/components/`)

| File | Component | Purpose |
|------|-----------|---------|
| `ActionBar.kt` | Action bar | Search, categories, actions (Hold, Clear, Settings) |
| `CategoryFilter.kt` | Category filter | Horizontal scrolling chips with icons |
| `NumericKeypad.kt` | Numeric keypad | 3x4 grid for numeric input (ready for future use) |
| `PaymentDialog.kt` | Payment dialog | Multi-payment method support with validation |
| `ProductCard.kt` | Product card | 50/50 split layout with image, price, stock |
| `ProductGrid.kt` | Product grid | 5-column grid with #D9D9D9 background |
| `ShoppingCart.kt` | Shopping cart | Cart display with quantity controls and totals |

### 📁 Screens (`/android/screens/`)

| File | Screen | Description |
|------|--------|-------------|
| `POSScreen.kt` | Main POS | Complete POS interface with products, cart, categories |

### 📁 Theme (`/android/theme/`)

| File | Purpose | Contents |
|------|---------|----------|
| `Color.kt` | Color system | Dark theme colors, semantic tokens |
| `Type.kt` | Typography | Material3 typography scale |
| `Theme.kt` | Theme config | AuraFlowPOSTheme composable |

**Colors defined**: Background, Card, Primary, Secondary, Destructive, Success, Border, ProductGridBackground, TextPrimary, TextSecondary, TextTertiary

### 📁 Utils (`/android/utils/`)

| File | Purpose | Extensions |
|------|---------|------------|
| `Extensions.kt` | Kotlin extensions | Double.formatCurrency(), String extensions |

### 📁 Documentation

| File | Type | Contents |
|------|------|----------|
| `README.md` | Quick start | Overview, quick reference, basic usage |
| `IMPLEMENTATION_GUIDE.md` | Tutorial | Step-by-step setup and implementation |
| `COMPLETE_GUIDE.md` | Reference | Comprehensive documentation with examples |
| `INDEX.md` | Index | This file - complete directory listing |
| `build.gradle.kts` | Config | Build configuration and dependencies |

## 📊 Statistics

### File Count by Type

- **Kotlin files**: 25
- **Documentation**: 4
- **Build files**: 1
- **Total**: 30 files

### Lines of Code (Approximate)

- **Models**: ~600 lines
- **Sample Data**: ~400 lines
- **Repository**: ~300 lines
- **Use Cases**: ~150 lines
- **Subscription**: ~250 lines
- **Plugins**: ~150 lines
- **ViewModel**: ~250 lines
- **UI Components**: ~800 lines
- **Complex Components**: ~600 lines
- **Screens**: ~200 lines
- **Theme**: ~200 lines
- **Utils**: ~250 lines
- **Core**: ~200 lines
- **Total**: ~4,350 lines

### Models Count

- **Main Models**: 13 (Product, CartItem, Order, Customer, User, Shift, GiftCard, Table, Tab, BusinessProfile, Category, HeldOrder, ProductVariation)
- **Supporting Models**: 5 (VariationOption, Modifier, ItemDiscount, PaymentMethod, CartSummary)
- **Enums**: 8 (OrderType, OrderStatus, PaymentMethodType, UserRole, Permission, DiscountType, IndustryType, TableStatus)

### Feature Count

- **Subscription Presets**: 8
- **Plugins**: 8
- **UI Components**: 12
- **Complex Components**: 7
- **Screens**: 1

## 🗂️ Key Relationships

```
POSViewModel
├── Uses → POSRepository
├── Uses → CartUseCases
├── Uses → OrderUseCases
└── Uses → SubscriptionManager

POSRepository
├── Manages → Products
├── Manages → Cart
├── Manages → Orders
├── Manages → Customers
└── Manages → Users

CartUseCases
└── Uses → POSRepository

OrderUseCases
└── Uses → POSRepository

SubscriptionManager
├── Contains → 8 Presets
└── Manages → Features

PluginManager
├── Contains → 8 Plugins
└── Manages → Activation

POSScreen
├── Uses → POSViewModel
├── Renders → ProductGrid
├── Renders → ShoppingCart
├── Renders → CategoryFilter
└── Renders → ActionBar
```

## 📦 Dependencies Required

### Core Android

```gradle
androidx.compose.ui:ui
androidx.compose.material3:material3
androidx.compose.material:material-icons-extended
androidx.activity:activity-compose
androidx.lifecycle:lifecycle-viewmodel-compose
```

### Image Loading

```gradle
io.coil-kt:coil-compose
```

### Coroutines

```gradle
org.jetbrains.kotlinx:kotlinx-coroutines-android
```

### Optional (for production)

```gradle
androidx.room:room-runtime          # Local database
androidx.datastore:datastore-preferences  # Settings
com.squareup.retrofit2:retrofit     # API calls
```

## 🎯 Entry Points

### 1. Main Application Entry

```kotlin
// Your MainActivity.kt
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            AuraFlowPOSTheme {
                POSApp()
            }
        }
    }
}

@Composable
fun POSApp() {
    val viewModel = viewModel<POSViewModel>()
    POSScreen(viewModel = viewModel)
}
```

### 2. Dependency Initialization

```kotlin
// In your Application class or MainActivity
val repository = POSRepository()
val subscriptionManager = SubscriptionManager()
val cartUseCases = CartUseCases(repository)
val orderUseCases = OrderUseCases(repository)

val viewModel = POSViewModel(
    repository,
    cartUseCases,
    orderUseCases,
    subscriptionManager
)
```

## 🔍 Finding Things

### Need to modify...

- **Colors**: → `theme/Color.kt`
- **Typography**: → `theme/Type.kt`
- **Models**: → `data/models/Models.kt`
- **Sample Data**: → `data/SampleData.kt`
- **Business Logic**: → `domain/usecase/`
- **Features**: → `domain/subscription/SubscriptionManager.kt`
- **Plugins**: → `domain/plugins/PluginManager.kt`
- **UI State**: → `ui/viewmodel/POSViewModel.kt`
- **Constants**: → `core/Constants.kt`
- **Utilities**: → `core/Utils.kt`
- **Components**: → `components/` or `ui/`

### Need to add...

- **New Model**: → Add to `data/models/Models.kt`
- **New Sample Data**: → Add to `data/SampleData.kt`
- **New Feature**: → Add to subscription preset in `SubscriptionManager.kt`
- **New Plugin**: → Implement `Plugin` interface in `PluginManager.kt`
- **New Use Case**: → Create in `domain/usecase/`
- **New Component**: → Create in `components/` or `ui/`
- **New Screen**: → Create in `screens/`

## 📚 Documentation Hierarchy

1. **README.md** → Quick start, overview
2. **IMPLEMENTATION_GUIDE.md** → Step-by-step tutorial
3. **COMPLETE_GUIDE.md** → Comprehensive reference
4. **INDEX.md** → This file, directory listing

Start with README, then IMPLEMENTATION_GUIDE for setup, then COMPLETE_GUIDE for deep dive.

---

**Last Updated**: October 29, 2025  
**Android Version**: 1.0.0  
**Kotlin Version**: 1.9.20  
**Compose Version**: 1.5.4
