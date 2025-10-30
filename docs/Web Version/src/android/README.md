# AuraFlow POS - Complete Android Implementation

## 📱 Overview

This folder contains the **complete, self-contained Android implementation** of AuraFlow POS. Everything you need to build and run the Android app is here:

- ✅ All data models (Product, Order, Customer, User, etc.)
- ✅ Complete sample data for testing
- ✅ Business logic & repositories
- ✅ Subscription system (General, Retail, Restaurant, Bar, Cafe, Salon, Pharmacy, Ultimate)
- ✅ Plugin architecture
- ✅ ViewModels & state management
- ✅ Full UI components & screens
- ✅ Theme & design system
- ✅ Utilities & constants

## 📁 Complete Project Structure

```
android/
├── core/                        # Core utilities
│   ├── Constants.kt            # App-wide constants & config
│   └── Utils.kt                # Formatting, validation, calculations
│
├── data/                        # Data layer
│   ├── models/
│   │   └── Models.kt          # All models (Product, Order, Customer, User, etc.)
│   ├── repository/
│   │   └── POSRepository.kt   # Data operations & state management
│   └── SampleData.kt          # Complete mock data (20 products, users, customers)
│
├── domain/                      # Business logic
│   ├── plugins/
│   │   └── PluginManager.kt   # Plugin system for modular features
│   ├── subscription/
│   │   └── SubscriptionManager.kt  # Feature management by preset
│   └── usecase/
│       ├── CartUseCases.kt    # Cart operations & validation
│       └── OrderUseCases.kt   # Order creation & validation
│
├── ui/                          # UI layer
│   ├── viewmodel/
│   │   └── POSViewModel.kt    # Main ViewModel (MVVM pattern)
│   ├── Badge.kt               # Basic UI components
│   ├── Button.kt
│   ├── Card.kt
│   ├── Dialog.kt
│   └── TextField.kt
│
├── components/                  # Complex components
│   ├── ActionBar.kt           # Action buttons & search
│   ├── CategoryFilter.kt      # Category filter chips
│   ├── NumericKeypad.kt       # Numeric input (ready for future use)
│   ├── PaymentDialog.kt       # Payment processing
│   ├── ProductCard.kt         # Product card with split layout
│   ├── ProductGrid.kt         # Product grid with #D9D9D9 background
│   └── ShoppingCart.kt        # Shopping cart display
│
├── screens/                     # Full screens
│   └── POSScreen.kt           # Main POS screen
│
├── theme/                       # Design system
│   ├── Color.kt               # Dark theme colors
│   ├── Type.kt                # Material3 typography
│   └── Theme.kt               # Theme configuration
│
├── utils/
│   └── Extensions.kt          # Kotlin extensions
│
├── build.gradle.kts            # Build configuration
├── README.md                   # This file (Quick reference)
├── IMPLEMENTATION_GUIDE.md     # Detailed implementation guide
└── COMPLETE_GUIDE.md          # Comprehensive documentation
```

## 🎨 Design System

### Dark Theme Colors
- **Background**: `#0A0A0A` - Main background
- **Card**: `#141414` - Card surfaces
- **Primary**: `#3B82F6` - Blue (actions)
- **Destructive**: `#EF4444` - Red (delete/cancel)
- **Success**: `#10B981` - Green (success states)
- **Product Grid**: `#D9D9D9` - Light gray background

### Typography
Material Design 3 scale with Inter font family.

## 🏗️ Architecture

Clean Architecture with MVVM:

```
View (Composables)
    ↓
ViewModel (POSViewModel)
    ↓
Use Cases (CartUseCases, OrderUseCases)
    ↓
Repository (POSRepository)
    ↓
Data (Models, SampleData)
```

## 📦 What's Included

### Data Models
- **Product**: With variations, modifiers, pricing
- **CartItem**: Cart management with calculations
- **Order**: Complete order with payment methods
- **Customer**: Customer info, loyalty points
- **User**: Employee management with roles & permissions
- **Shift**: Clock in/out tracking
- **GiftCard**: Gift card management
- **Table**: Table management (restaurant/bar)
- **Tab**: Open tabs (bar)

### Sample Data
- **20 Products** across 6 categories (Coffee, Food, Drinks, Desserts, Merchandise)
- **3 Users** (Cashier PIN:1234, Manager PIN:5678, Admin PIN:9999)
- **3 Customers** with loyalty points
- **3 Gift Cards** with balances
- **Business Profile** configured for Cafe

### Subscription Presets
- **General**: Basic POS features
- **Retail**: + Inventory, barcode scanner, loyalty
- **Restaurant**: + Table management, order types, tipping, kitchen display
- **Bar**: + Open tabs, tab management, age verification
- **Cafe**: + Order types, tipping, modifiers, loyalty
- **Salon**: + Appointments, service providers
- **Pharmacy**: + Prescription tracking, regulated substances
- **Ultimate**: All features enabled

## 🚀 Quick Start

### 1. Initialize Components

```kotlin
// Create repository
val repository = POSRepository()

// Create subscription manager
val subscriptionManager = SubscriptionManager().apply {
    setSubscriptions(listOf("cafe", "loyalty-program"))
    setIndustryType(IndustryType.CAFE)
}

// Create use cases
val cartUseCases = CartUseCases(repository)
val orderUseCases = OrderUseCases(repository)

// Create ViewModel
val viewModel = POSViewModel(
    repository,
    cartUseCases,
    orderUseCases,
    subscriptionManager
)
```

### 2. Build UI

```kotlin
@Composable
fun POSApp() {
    AuraFlowPOSTheme {
        val viewModel = viewModel<POSViewModel>()
        POSScreen(viewModel = viewModel)
    }
}
```

### 3. Handle Operations

```kotlin
// Add product to cart
viewModel.addToCart(product, quantity = 1)

// Update quantity
viewModel.updateQuantity(itemId, newQuantity)

// Apply discount
val discount = ItemDiscount(DiscountType.PERCENTAGE, 10.0)
viewModel.applyDiscount(discount)

// Create order
viewModel.createOrder(
    paymentMethods = listOf(
        PaymentMethod(
            method = PaymentMethodType.CASH,
            amount = 50.0,
            tender = 50.0,
            change = 0.0
        )
    ),
    tip = 5.0
)
```

## 💼 Business Logic

### Cart Summary Calculation

```kotlin
// Automatically calculated in ViewModel
val cartSummary by viewModel.cartSummary.collectAsState()

// Includes:
cartSummary.itemCount    // Total items
cartSummary.subtotal     // Sum of all items
cartSummary.discount     // Applied discount
cartSummary.tax          // Calculated tax
cartSummary.total        // Final total
```

### Feature Checking

```kotlin
// Check if feature is available
if (viewModel.hasFeature("tipping")) {
    // Show tipping UI
}

if (viewModel.hasFeature("table-management")) {
    // Show table management
}
```

### State Management

```kotlin
// Observe UI state
val uiState by viewModel.uiState.collectAsState()

when (uiState) {
    is POSUiState.Idle -> { /* Normal operation */ }
    is POSUiState.Processing -> { /* Show loading */ }
    is POSUiState.OrderCompleted -> { /* Show receipt */ }
    is POSUiState.Error -> { /* Show error message */ }
}
```

## 🔧 Utilities

### Formatting

```kotlin
Utils.formatCurrency(49.99)           // "$49.99"
Utils.formatDateTime(LocalDateTime.now())  // "Oct 29, 2025 02:30 PM"
Utils.formatPhoneNumber("5551234567") // "(555) 123-4567"
```

### Validation

```kotlin
Utils.isValidEmail("test@example.com")  // true
Utils.isValidPin("1234")                // true
Utils.isValidPrice(49.99)               // true
```

### Calculation

```kotlin
Utils.calculateTax(100.0, 0.08)                    // 8.00
Utils.calculatePercentageDiscount(100.0, 10.0)    // 10.00
Utils.calculateChange(47.50, 50.00)               // 2.50
```

## 📊 Sample Data Access

```kotlin
// Get all products
val products = SampleData.products

// Get users
val cashier = SampleData.users.find { it.role == UserRole.CASHIER }

// Get customers
val customers = SampleData.customers

// Get business profile
val profile = SampleData.businessProfile
```

## 🎯 Key Components

### ProductCard
50/50 split layout with elevation and hover effects

### ProductGrid
5-column grid with #D9D9D9 background and pagination

### ShoppingCart
Complete cart display with quantity controls and totals

### PaymentDialog
Multi-payment method support with validation

### CategoryFilter
Scrollable category chips with icons

## 📱 Responsive Design

Optimized for:
- **Tablets**: 10"+ displays (primary)
- **Large phones**: 6"+ compact mode
- **Landscape**: POS terminal orientation

## 📚 Documentation

- **README.md** (this file): Quick reference
- **IMPLEMENTATION_GUIDE.md**: Detailed setup instructions
- **COMPLETE_GUIDE.md**: Comprehensive documentation with examples

## 🧪 Testing Users

- **Cashier**: PIN `1234` (basic permissions)
- **Manager**: PIN `5678` (management permissions)
- **Admin**: PIN `9999` (all permissions)

## 📦 Dependencies

```gradle
dependencies {
    // Jetpack Compose
    implementation("androidx.compose.ui:ui:1.5.4")
    implementation("androidx.compose.material3:material3:1.1.2")
    
    // Material Icons Extended
    implementation("androidx.compose.material:material-icons-extended:1.5.4")
    
    // Image Loading
    implementation("io.coil-kt:coil-compose:2.5.0")
    
    // ViewModel
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.6.2")
    
    // Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")
}
```

## 🔄 Next Steps

1. **Database**: Integrate Room for persistence
2. **Network**: Add Retrofit for API calls
3. **Printing**: ESC/POS receipt printing
4. **Barcode**: Camera barcode scanning
5. **Auth**: Biometric authentication
6. **Sync**: Real-time sync with Supabase

## 📄 License

Part of AuraFlow POS. All rights reserved.

---

**Built with ❤️ using Kotlin & Jetpack Compose**

For comprehensive documentation, see **COMPLETE_GUIDE.md**
