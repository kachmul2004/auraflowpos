# AuraFlowPOS - KMP/CMP Migration Guide

**Version:** 1.0  
**Last Updated:** January 2025  
**Status:** In Progress

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Migration Strategy](#migration-strategy)
- [Implementation Phases](#implementation-phases)

---

## 🎯 Overview

This document outlines the complete migration strategy for converting the AuraFlowPOS
TypeScript/React web application into a Kotlin Multiplatform (KMP) + Compose Multiplatform (CMP)
application with enterprise-grade architecture.

### Goals

- ✅ **Pixel-perfect design similarity** to web version
- ✅ **Enterprise architecture** with Clean Architecture + MVVM
- ✅ **Code sharing** across Android, iOS, Desktop, and Web
- ✅ **Maintainability** with Koin DI and modular structure
- ✅ **Production-ready** with proper error handling and testing

### Source Application

- **Repository:** https://github.com/kachmul2004/Auraflowposweb
- **Technology:** TypeScript + React + Vite
- **Architecture:** Multi-subscription plugin-based POS system
- **Backend:** Supabase

---

## 🏗️ Architecture

### Clean Architecture Layers

```
┌─────────────────────────────────────────────────────┐
│                  Presentation Layer                  │
│  (Compose UI, ViewModels, UI State, Navigation)    │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│                   Domain Layer                       │
│    (Use Cases, Business Logic, Domain Models)      │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│                    Data Layer                        │
│  (Repositories, Data Sources, API, Database, DTOs)  │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│                   Core Layer                         │
│    (DI, Utils, Network, Platform Interfaces)       │
└─────────────────────────────────────────────────────┘
```

### Module Organization

```
AuraFlowPOS/
├── commonModels/                  # Shared DTOs (Client ↔ Server)
│   └── src/commonMain/kotlin/
│       └── com/theauraflow/pos/models/
│           ├── ProductDto.kt
│           ├── OrderDto.kt
│           └── CustomerDto.kt
│
├── server/                        # Ktor Server (JVM)
│   ├── src/main/kotlin/
│   │   └── com/theauraflow/pos/server/
│   │       ├── Application.kt
│   │       ├── plugins/
│   │       │   ├── Authentication.kt
│   │       │   ├── ContentNegotiation.kt
│   │       │   ├── CORS.kt
│   │       │   └── WebSockets.kt
│   │       ├── routes/
│   │       │   ├── ProductRoutes.kt
│   │       │   ├── OrderRoutes.kt
│   │       │   └── AuthRoutes.kt
│   │       ├── database/
│   │       │   ├── DatabaseFactory.kt
│   │       │   └── tables/
│   │       ├── repositories/
│   │       └── services/
│   └── resources/
│       └── application.conf
│
├── shared/                        # Client shared code
│   ├── src/
│   │   ├── commonMain/kotlin/
│   │   │   └── com/theauraflow/pos/
│   │   │       ├── App.kt
│   │   │       ├── core/              # Utilities, constants
│   │   │       ├── domain/            # Business logic (models, use cases)
│   │   │       ├── data/              # Data layer (repositories, API, DB)
│   │   │       ├── presentation/      # UI (ViewModels, Compose)
│   │   │       └── di/                # Dependency injection
│   │   ├── androidMain/kotlin/
│   │   ├── iosMain/kotlin/
│   │   ├── jvmMain/kotlin/            # Desktop
│   │   └── wasmJsMain/kotlin/         # Web
│   └── build.gradle.kts
│
├── androidApp/                    # Android-specific
│   ├── src/main/
│   │   ├── kotlin/
│   │   │   └── MainActivity.kt
│   │   ├── res/
│   │   └── AndroidManifest.xml
│   └── build.gradle.kts
│
├── iosApp/                        # iOS-specific (Xcode project)
│   ├── iosApp/
│   │   ├── ContentView.swift
│   │   └── Info.plist
│   └── iosApp.xcodeproj/
│
├── desktopApp/                    # Desktop-specific
│   ├── src/jvmMain/kotlin/
│   │   └── Main.kt
│   └── build.gradle.kts
│
├── webApp/                        # Web-specific (Wasm)
│   ├── src/wasmJsMain/kotlin/
│   │   └── Main.kt
│   └── build.gradle.kts
│
├── build.gradle.kts               # Root build file
├── gradle.properties
├── settings.gradle.kts
└── firebender.json                # AI coding rules

---

## 🛠️ Technology Stack

### Core Technologies

- **Kotlin** 2.2.21
- **Compose Multiplatform** 1.9.2
- **Kotlin Multiplatform** 2.2.21
- **Gradle** 8.11
- **Ktor Server** 2.2.3

### Dependency Injection

- **Koin** 4.1.0
   - `koin-core` 4.1.0
   - `koin-compose` 4.1.0
   - `koin-compose-viewmodel` 4.1.0
   - `koin-android` 4.1.0 (Android)

### Networking

- **Ktor Client** 3.3.1
   - Engine: Android/Darwin/CIO/Js
   - Plugins: ContentNegotiation, Logging, Auth, WebSockets
   - Serialization: kotlinx-serialization-json

### Database

- **Room** 2.7.0-alpha10 (Multiplatform)
   - `room-runtime`
   - `room-compiler` (KSP)
- **SQLDelight** 2.0.2 (alternative)

### State Management

- **Kotlin Coroutines** 1.9.0
- **Kotlin Flows** (StateFlow, SharedFlow)
- **Lifecycle ViewModel** 2.8.7
- **Lifecycle Runtime Compose** 2.8.7

### Navigation

- **Voyager** 1.1.0 (Recommended for KMP)
   - `voyager-navigator`
   - `voyager-screenmodel`
   - `voyager-transitions`
- **PreCompose** 1.7.0 (alternative)
- **Compose Navigation** 2.8.5 (Jetpack - Android focused)

### Serialization

- **Kotlinx Serialization** 1.7.3
   - `kotlinx-serialization-json`
   - `kotlinx-serialization-core`

### Image Loading

- **Coil3** 3.0.4 (Compose Multiplatform)
   - `coil-compose`
   - `coil-network-ktor`
- **Kamel** 1.0.0 (alternative)

### Date/Time

- **Kotlinx DateTime** 0.6.1

### Logging

- **Kermit** 2.0.4 (Multiplatform logging)
- **Napier** 2.7.1 (alternative)

### Testing

- **Kotlin Test** 2.2.21
- **Turbine** 1.2.0 (Flow testing)
- **MockK** 1.13.14
- **Kotest** 5.9.1 (assertions)

### Build Tools

- **KSP (Kotlin Symbol Processing)** 2.2.21-1.0.29
- **BuildKonfig** 0.15.2 (build configuration)
- **Ktlint** 12.1.2 (code formatting)

### Platform-Specific

#### Android

- **Material3** 1.3.1
- **Activity Compose** 1.9.3
- **Accompanist** 0.36.0 (if needed)

#### iOS

- **Native Interop** (built-in)

#### Desktop

- **Compose Desktop** 1.9.2

#### Web

- **Compose for Web** 1.9.2

---

## 📁 Project Structure

### Detailed Directory Structure

```
shared/src/commonMain/kotlin/com/theauraflow/pos/
│
├── core/                          # Core utilities
│   ├── di/                       # Dependency injection
│   │   ├── KoinInitializer.kt
│   │   ├── AppModule.kt
│   │   ├── NetworkModule.kt
│   │   ├── DatabaseModule.kt
│   │   └── RepositoryModule.kt
│   │
│   ├── network/                  # Network configuration
│   │   ├── HttpClientFactory.kt
│   │   ├── NetworkConfig.kt
│   │   └── ApiEndpoints.kt
│   │
│   ├── database/                 # Database configuration
│   │   ├── DatabaseFactory.kt
│   │   └── AppDatabase.kt
│   │
│   ├── util/                     # Utilities
│   │   ├── Result.kt            # Result wrapper
│   │   ├── UiText.kt            # String resources
│   │   ├── Logger.kt
│   │   └── Extensions.kt
│   │
│   └── constants/               # Constants
│       └── AppConstants.kt
│
├── domain/                       # Domain layer
│   ├── model/                   # Domain models
│   │   ├── Product.kt
│   │   ├── CartItem.kt
│   │   ├── Order.kt
│   │   ├── Customer.kt
│   │   ├── User.kt
│   │   └── Payment.kt
│   │
│   ├── repository/              # Repository interfaces
│   │   ├── ProductRepository.kt
│   │   ├── OrderRepository.kt
│   │   ├── CustomerRepository.kt
│   │   └── AuthRepository.kt
│   │
│   └── usecase/                 # Use cases
│       ├── product/
│       │   ├── GetProductsUseCase.kt
│       │   └── SearchProductsUseCase.kt
│       ├── cart/
│       │   ├── AddToCartUseCase.kt
│       │   ├── UpdateCartItemUseCase.kt
│       │   └── ClearCartUseCase.kt
│       └── order/
│           ├── CreateOrderUseCase.kt
│           └── GetOrdersUseCase.kt
│
├── data/                        # Data layer
│   ├── remote/                  # Remote data sources
│   │   ├── api/
│   │   │   ├── ProductApi.kt
│   │   │   ├── OrderApi.kt
│   │   │   └── AuthApi.kt
│   │   └── dto/                # Data transfer objects
│   │       ├── ProductDto.kt
│   │       ├── OrderDto.kt
│   │       └── Mappers.kt
│   │
│   ├── local/                   # Local data sources
│   │   ├── dao/
│   │   │   ├── ProductDao.kt
│   │   │   ├── OrderDao.kt
│   │   │   └── CustomerDao.kt
│   │   └── entity/             # Database entities
│   │       ├── ProductEntity.kt
│   │       ├── OrderEntity.kt
│   │       └── Mappers.kt
│   │
│   └── repository/              # Repository implementations
│       ├── ProductRepositoryImpl.kt
│       ├── OrderRepositoryImpl.kt
│       └── CustomerRepositoryImpl.kt
│
└── presentation/               # Presentation layer (minimal in shared)
    └── base/
        ├── BaseViewModel.kt
        └── UiState.kt
```

### ComposeApp Structure

```
composeApp/src/commonMain/kotlin/com/theauraflow/pos/
│
├── ui/                         # UI components
│   ├── theme/                  # Theme configuration
│   │   ├── Color.kt
│   │   ├── Typography.kt
│   │   ├── Theme.kt
│   │   └── Dimens.kt
│   │
│   ├── components/             # Reusable components
│   │   ├── buttons/
│   │   ├── cards/
│   │   ├── dialogs/
│   │   └── inputs/
│   │
│   └── screens/               # Feature screens
│       ├── pos/
│       │   ├── POSScreen.kt
│       │   ├── POSViewModel.kt
│       │   └── POSUiState.kt
│       ├── products/
│       │   ├── ProductGridScreen.kt
│       │   ├── ProductViewModel.kt
│       │   └── ProductUiState.kt
│       ├── cart/
│       │   ├── ShoppingCartScreen.kt
│       │   ├── CartViewModel.kt
│       │   └── CartUiState.kt
│       └── payment/
│           ├── PaymentScreen.kt
│           ├── PaymentViewModel.kt
│           └── PaymentUiState.kt
│
├── navigation/                # Navigation
│   ├── AppNavigation.kt
│   ├── Screen.kt
│   └── NavGraph.kt
│
└── App.kt                     # Main app entry
```

---

## 🔄 Migration Strategy

### Phase 0: Server Infrastructure (Week 1) 
**Goal:** Establish Ktor server backend infrastructure

#### Tasks:

1. **Server Setup**
    - Configure Ktor Server with Netty
    - Set up all plugins (ContentNegotiation, CORS, StatusPages, WebSockets, Authentication, CallLogging)
    - Configure PostgreSQL with Exposed ORM
    - Set up JWT authentication with refresh tokens
    - Create 6 database tables (Users, Products, Categories, Customers, Orders, OrderItems)
    - Implement error handling and logging

2. **Server API Endpoints**
    - Health check endpoints (3 endpoints)
    - Authentication routes (login, register, refresh token)
    - Products CRUD API (list, get, create, update, delete, search)
    - All endpoints tested and working

**Status:** 
### Phase 1: Foundation Setup (Week 1) 

**Goal:** Establish client project structure and core infrastructure

#### Tasks:

1. **Project Setup**
    - Configure build.gradle.kts files
    - Set up version catalogs
    - Configure Kotlin and Compose Multiplatform

2. **Core Infrastructure** (60% Complete)
    - Implement Result wrapper
    - Create UiText for string resources
    - Set up Logger utility
    - Create Extensions.kt with utilities
    - Create AppConstants.kt
    - Create base ViewModel classes

3. **Dependency Injection** 
    - Configure Koin with modules
    - Create AppModule, NetworkModule, DatabaseModule
    - Set up platform-specific modules

4. **Network Layer**
    - Configure Ktor client
    - Implement API endpoints
    - Create DTOs and mappers
    - Connect to server API

5. **Database Layer**
    - Set up Room database
    - Create DAOs and entities
    - Implement migrations

### Phase 2: Domain Layer (Week 2)

**Goal:** Implement business logic and use cases

#### Tasks:

1. **Domain Models**
    - Map TypeScript types to Kotlin data classes
    - Create domain models for:
        - Product, Category, Modifier
        - Cart, CartItem
        - Order, Transaction
        - Customer, User
        - Payment methods

2. **Repository Interfaces**
    - Define contracts for data operations
    - Document expected behaviors

3. **Use Cases**
    - Implement business logic
    - Add validation rules
    - Handle error scenarios

### Phase 3: Data Layer Implementation (Week 2-3)

**Goal:** Connect domain to data sources

#### Tasks:

1. **Remote Data Sources**
    - Implement API clients
    - Handle authentication
    - Manage API errors

2. **Local Data Sources**
    - Implement DAOs
    - Create database operations
    - Handle offline scenarios

3. **Repository Implementations**
    - Connect remote and local sources
    - Implement caching strategies
    - Add synchronization logic

### Phase 4: UI/UX Implementation (Week 3-5)

**Goal:** Build pixel-perfect UI matching web version

#### Tasks:

1. **Theme Setup**
    - Match colors from web version
    - Implement typography
    - Create consistent spacing

2. **Core Components**
    - Product Grid
    - Shopping Cart
    - Action Bar
    - Dialogs (Payment, Modifiers, etc.)

3. **Main Screens**
    - POS View
    - Product Selection
    - Cart Management
    - Checkout Flow

4. **Additional Features**
    - Search functionality
    - Category filtering
    - Item modifications
    - Discount application

### Phase 5: Platform-Specific Features (Week 5-6)

**Goal:** Implement platform-specific optimizations

#### Tasks:

1. **Android**
    - Hardware integration (printers, scanners)
    - Android-specific UI tweaks
    - Permission handling

2. **iOS**
    - iOS-specific UI adjustments
    - Native integrations
    - Permissions

3. **Desktop**
    - Keyboard shortcuts
    - Window management
    - Desktop-specific features

### Phase 6: Testing & Optimization (Week 6-7)

**Goal:** Ensure quality and performance

#### Tasks:

1. **Unit Tests**
    - Test use cases
    - Test repositories
    - Test ViewModels

2. **Integration Tests**
    - Test API integration
    - Test database operations

3. **UI Tests**
    - Test navigation
    - Test user flows

4. **Performance**
    - Optimize images
    - Reduce bundle size
    - Improve startup time

---

## 📊 Implementation Phases

### Current Status: Phase 1 (Foundation Setup)

| Phase | Status | ETA | Notes |
|-------|--------|-----|-------|
| Phase 0: Server Infrastructure | ✅ COMPLETED | Week 1 | Setting up infrastructure |
| Phase 1: Foundation | 🟡 In Progress | Week 1 | Setting up client infrastructure |
| Phase 2: Domain Layer | ⚪ Not Started | Week 2 | |
| Phase 3: Data Layer | ⚪ Not Started | Week 2-3 | |
| Phase 4: UI/UX | ⚪ Not Started | Week 3-5 | |
| Phase 5: Platform Features | ⚪ Not Started | Week 5-6 | |
| Phase 6: Testing | ⚪ Not Started | Week 6-7 | |

---

## 🎨 Design Matching Strategy

### Key UI Components to Match:

1. **POSView (Main Screen)**
    - Three-column layout (Products | Cart | Actions)
    - Category filters at top
    - Search bar
    - Product grid with images and prices

2. **Shopping Cart**
    - Item list with quantities
    - Modifiers display
    - Subtotal, tax, total calculation
    - Action buttons (Clear, Hold, Checkout)

3. **Product Grid**
    - Grid layout with product cards
    - Product images
    - Name, price, stock indicator
    - Category badges

4. **Dialogs**
    - Payment dialog
    - Modifier selection
    - Customer selection
    - Item discount

### Color Palette (from Web)

```kotlin
object AuraFlowColors {
    val Primary = Color(0xFF4F46E5)  // Indigo
    val Secondary = Color(0xFF10B981) // Green
    val Background = Color(0xFFF9FAFB) // Light gray
    val Surface = Color(0xFFFFFFFF) // White
    val Error = Color(0xFFEF4444) // Red
    val OnPrimary = Color(0xFFFFFFFF)
    val OnSurface = Color(0xFF111827)
}
```

---

## 📝 Best Practices

### Code Organization

1. **One class per file**
2. **Group by feature, not by type**
3. **Keep files under 300 lines**
4. **Use meaningful names**

### Dependency Injection

1. **Use constructor injection**
2. **Prefer single/factory over viewModel for shared logic**
3. **Create separate modules per layer**
4. **Use `KoinApplication` for initialization**

### State Management

1. **Use StateFlow for UI state**
2. **Immutable data classes for state**
3. **Handle loading, success, error states**
4. **Use sealed classes for events**

### Error Handling

1. **Use Result wrapper**
2. **Provide user-friendly messages**
3. **Log errors appropriately**
4. **Handle network and database errors**

### Testing

1. **Test business logic in domain layer**
2. **Mock repositories in ViewModel tests**
3. **Use Turbine for Flow testing**
4. **Aim for 70%+ code coverage**

---

## 🔗 References

- [Source Repository](https://github.com/kachmul2004/Auraflowposweb)
- [Kotlin Multiplatform Docs](https://kotlinlang.org/docs/multiplatform.html)
- [Compose Multiplatform](https://www.jetbrains.com/lp/compose-mpp/)
- [Koin Documentation](https://insert-koin.io/)
- [Room Multiplatform](https://developer.android.com/kotlin/multiplatform/room)
- [Ktor Client](https://ktor.io/docs/getting-started-ktor-client-multiplatform-mobile.html)

---

## 📞 Support

For questions or issues, please refer to:

- Project Documentation in `/docs`
- Architecture Decision Records (ADRs)
- Team communication channels

---

**Last Updated:** January 2025  
**Maintainers:** AuraFlowPOS Development Team
