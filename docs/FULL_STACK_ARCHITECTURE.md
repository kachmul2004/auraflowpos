# 🏗️ AuraFlowPOS Full-Stack KMP Architecture

**Last Updated:** {{DATE}}  
**Target Platforms:** Android, iOS, macOS, Linux, Windows, Web (Wasm), Server (JVM)

---

## 📁 Project Structure

```
AuraFlowPOS/
├── commonModels/                  # Shared DTOs between client and server
│   ├── src/
│   │   └── commonMain/kotlin/
│   │       └── com/theauraflow/pos/models/
│   │           ├── ProductDto.kt
│   │           ├── OrderDto.kt
│   │           ├── CustomerDto.kt
│   │           ├── UserDto.kt
│   │           └── ApiResponse.kt
│   └── build.gradle.kts
│
├── server/                        # Ktor Server (JVM)
│   ├── src/
│   │   └── main/kotlin/
│   │       └── com/theauraflow/pos/server/
│   │           ├── Application.kt
│   │           ├── plugins/
│   │           │   ├── Authentication.kt
│   │           │   ├── ContentNegotiation.kt
│   │           │   ├── CORS.kt
│   │           │   ├── StatusPages.kt
│   │           │   └── WebSockets.kt
│   │           ├── routes/
│   │           │   ├── AuthRoutes.kt
│   │           │   ├── ProductRoutes.kt
│   │           │   ├── OrderRoutes.kt
│   │           │   ├── CustomerRoutes.kt
│   │           │   └── AdminRoutes.kt
│   │           ├── database/
│   │           │   ├── DatabaseFactory.kt
│   │           │   ├── tables/
│   │           │   │   ├── ProductsTable.kt
│   │           │   │   ├── OrdersTable.kt
│   │           │   │   └── UsersTable.kt
│   │           │   └── dao/
│   │           │       ├── ProductDao.kt
│   │           │       └── OrderDao.kt
│   │           ├── repositories/
│   │           │   ├── ProductRepository.kt
│   │           │   └── OrderRepository.kt
│   │           ├── services/
│   │           │   ├── AuthService.kt
│   │           │   └── PaymentService.kt
│   │           └── util/
│   │               ├── JwtConfig.kt
│   │               └── ErrorHandling.kt
│   ├── resources/
│   │   └── application.conf
│   └── build.gradle.kts
│
├── shared/                        # Client shared code (UI, ViewModels, etc.)
│   ├── src/
│   │   ├── commonMain/kotlin/
│   │   │   └── com/theauraflow/pos/
│   │   │       ├── App.kt
│   │   │       ├── core/
│   │   │       │   ├── util/
│   │   │       │   └── constants/
│   │   │       ├── domain/
│   │   │       │   ├── model/           # Domain models
│   │   │       │   ├── repository/      # Repository interfaces
│   │   │       │   └── usecase/         # Use cases
│   │   │       ├── data/
│   │   │       │   ├── remote/          # API clients
│   │   │       │   ├── local/           # Room database
│   │   │       │   └── repository/      # Repository implementations
│   │   │       ├── presentation/
│   │   │       │   ├── viewmodel/
│   │   │       │   └── ui/              # Compose UI components
│   │   │       └── di/                  # Koin modules
│   │   ├── androidMain/kotlin/
│   │   ├── iosMain/kotlin/
│   │   ├── jvmMain/kotlin/              # Desktop
│   │   └── wasmJsMain/kotlin/           # Web
│   └── build.gradle.kts
│
├── androidApp/
├── iosApp/
├── desktopApp/
└── webApp/
```

---

## 🔄 Data Flow Architecture

### 1. **Client → Server Flow**

```
┌─────────────┐
│   UI Layer  │  (Compose Multiplatform)
│  @Composable│
└──────┬──────┘
       │ User Action
       ↓
┌─────────────┐
│  ViewModel  │  (State Management)
│   + State   │
└──────┬──────┘
       │ Business Logic
       ↓
┌─────────────┐
│  Use Case   │  (Business Rules)
│ (Domain)    │
└──────┬──────┘
       │ Data Request
       ↓
┌─────────────┐
│ Repository  │  (Data Abstraction)
│  Interface  │
└──────┬──────┘
       │ Implementation
       ↓
┌─────────────┐
│  Ktor       │  HTTP/WebSocket
│  Client     │────────────────────┐
└─────────────┘                    │
       │                           │
       │ Cache                     │ Network
       ↓                           │
┌─────────────┐                    │
│   Room DB   │                    │
│ (Local)     │                    │
└─────────────┘                    │
                                   ↓
                            ┌──────────────┐
                            │ KTOR SERVER  │
                            │              │
                            │ • Routes     │
                            │ • Services   │
                            │ • Business   │
                            │   Logic      │
                            └──────┬───────┘
                                   │
                                   ↓
                            ┌──────────────┐
                            │  Exposed ORM │
                            │  Repository  │
                            └──────┬───────┘
                                   │
                                   ↓
                            ┌──────────────┐
                            │  PostgreSQL  │
                            │   Database   │
                            └──────────────┘
```

### 2. **Server → Client Real-Time Updates (WebSocket)**

```
┌──────────────┐
│  PostgreSQL  │  Database Change
└──────┬───────┘
       │
       ↓
┌──────────────┐
│   Server     │  Detect change
│  Repository  │
└──────┬───────┘
       │
       ↓
┌──────────────┐
│  WebSocket   │  Broadcast
│  Manager     │  to all clients
└──────┬───────┘
       │
       └─────────────────┬─────────────────┐
                         │                 │
                    ┌────▼────┐      ┌────▼────┐
                    │ Client 1│      │ Client 2│
                    │ (POS 1) │      │ (POS 2) │
                    └─────────┘      └─────────┘
                    Update UI         Update UI
                    immediately       immediately
```

---

## 🔐 Authentication Flow

```
1. Login Request:
   Client → POST /api/auth/login {email, password}
   Server → Validate credentials → Generate JWT → Return {accessToken, refreshToken}

2. Authenticated Requests:
   Client → GET /api/products
            Header: Authorization: Bearer <accessToken>
   Server → Validate JWT → Process → Return data

3. Token Refresh:
   Client → POST /api/auth/refresh {refreshToken}
   Server → Validate refresh token → Generate new JWT → Return {accessToken}

4. WebSocket Authentication:
   Client → ws://server/ws/orders
            Header: Authorization: Bearer <accessToken>
   Server → Validate JWT → Establish connection
```

---

## 🗄️ Database Schema (PostgreSQL)

### Core Tables

```sql
-- Users (Employees/Admin)
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

-- Products
CREATE TABLE products (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE,
    price DECIMAL(10, 2) NOT NULL,
    cost DECIMAL(10, 2),
    category VARCHAR(100),
    stock_quantity INT DEFAULT 0,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

-- Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID,
    user_id UUID NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    tax DECIMAL(10, 2) DEFAULT 0,
    discount DECIMAL(10, 2) DEFAULT 0,
    payment_method VARCHAR(50),
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order Items
CREATE TABLE order_items (
    id UUID PRIMARY KEY,
    order_id UUID NOT NULL,
    product_id UUID NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Customers
CREATE TABLE customers (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    loyalty_points INT DEFAULT 0,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);
```

---

## 📡 API Endpoints

### Authentication

- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register new user
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout

### Products

- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/{id}` - Update product (Admin)
- `DELETE /api/products/{id}` - Delete product (Admin)
- `GET /api/products/search?q={query}` - Search products

### Orders

- `GET /api/orders` - Get all orders
- `GET /api/orders/{id}` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/{id}` - Update order
- `GET /api/orders/user/{userId}` - Get orders by user

### Customers

- `GET /api/customers` - Get all customers
- `GET /api/customers/{id}` - Get customer by ID
- `POST /api/customers` - Create customer
- `PUT /api/customers/{id}` - Update customer

### Admin

- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/reports` - Get reports
- `GET /api/admin/users` - Manage users

### WebSocket

- `WS /ws/orders` - Real-time order updates
- `WS /ws/inventory` - Real-time inventory updates

---

## 🔧 Technology Stack

### Server (JVM)

- **Ktor 3.3.1** - Web framework
- **Exposed 0.58.0** - ORM (type-safe SQL)
- **PostgreSQL** - Primary database
- **Redis** - Caching & sessions
- **JWT** - Authentication
- **Logback** - Logging
- **Koin 4.1.0** - Dependency injection
- **Flyway** - Database migrations

### Client (Multiplatform)

- **Kotlin 2.2.21**
- **Compose Multiplatform 1.9.2** - UI
- **Ktor Client 3.3.1** - HTTP/WebSocket
- **Room 2.7.0** - Local database
- **Koin 4.1.0** - DI
- **Kotlinx Serialization 1.7.3** - JSON
- **Coil3 3.0.4** - Image loading
- **Voyager 1.1.0** - Navigation

### Shared

- **commonModels** - DTOs shared between client and server
- **Kotlinx Serialization** - JSON serialization
- **Kotlinx DateTime 0.6.1** - Date/time handling

---

## 🚀 Development Workflow

### 1. **Define Data Model**

```kotlin
// commonModels/src/commonMain/kotlin/models/ProductDto.kt
@Serializable
data class ProductDto(
    val id: String,
    val name: String,
    val price: Double,
    val category: String,
    val stockQuantity: Int
)
```

### 2. **Implement Server API**

```kotlin
// server/src/main/kotlin/routes/ProductRoutes.kt
fun Route.productRoutes(repository: ProductRepository) {
    route("/api/products") {
        get {
            val products = repository.getAllProducts()
            call.respond(HttpStatusCode.OK, products)
        }
        
        post {
            val dto = call.receive<CreateProductDto>()
            val product = repository.createProduct(dto)
            call.respond(HttpStatusCode.Created, product)
        }
    }
}
```

### 3. **Implement Client Repository**

```kotlin
// shared/src/commonMain/kotlin/data/repository/ProductRepositoryImpl.kt
class ProductRepositoryImpl(
    private val api: ProductApi,
    private val cache: ProductCache
) : ProductRepository {
    override suspend fun getProducts(): Result<List<Product>> {
        return try {
            val products = api.getProducts()
            cache.saveProducts(products)
            Result.success(products.map { it.toDomain() })
        } catch (e: Exception) {
            // Fallback to cache
            Result.success(cache.getProducts().map { it.toDomain() })
        }
    }
}
```

### 4. **Use in UI**

```kotlin
// shared/src/commonMain/kotlin/presentation/ui/ProductListScreen.kt
@Composable
fun ProductListScreen(viewModel: ProductViewModel) {
    val state by viewModel.state.collectAsState()
    
    when (val result = state.products) {
        is Result.Success -> {
            LazyColumn {
                items(result.data) { product ->
                    ProductItem(product, onClick = { /* ... */ })
                }
            }
        }
        is Result.Loading -> LoadingIndicator()
        is Result.Error -> ErrorMessage(result.message)
    }
}
```

---

## 🔄 Offline-First Strategy

1. **Always try network first** for fresh data
2. **Cache successful responses** locally in Room
3. **On network error**, fallback to cached data
4. **Queue failed writes** for retry when online
5. **Sync queued operations** when connection restored
6. **WebSocket updates** keep all clients in sync

---

## 🧪 Testing Strategy

### Server Tests

- **Unit Tests**: Repository, Service logic
- **Integration Tests**: Database operations
- **API Tests**: Route handlers
- **Load Tests**: Performance under load

### Client Tests

- **Unit Tests**: ViewModels, Use Cases, Repositories
- **UI Tests**: Compose UI components
- **Integration Tests**: End-to-end flows
- **Platform Tests**: Platform-specific code

---

## 📦 Deployment

### Server Deployment

```bash
# Build fat JAR
./gradlew :server:shadowJar

# Run server
java -jar server/build/libs/server-all.jar

# Docker
docker build -t auraflow-server .
docker run -p 8080:8080 auraflow-server
```

### Client Deployment

```bash
# Android
./gradlew :androidApp:assembleRelease

# iOS
./gradlew :iosApp:iosArm64Binaries

# Desktop
./gradlew :desktopApp:packageDistributionForCurrentOS

# Web
./gradlew :webApp:wasmJsBrowserDistribution
```

---

## 🔐 Security Considerations

1. **HTTPS only** in production
2. **JWT tokens** with short expiration
3. **Refresh tokens** for session management
4. **Rate limiting** on API endpoints
5. **Input validation** on server
6. **SQL injection protection** via Exposed ORM
7. **CORS** properly configured
8. **Secrets** in environment variables
9. **Password hashing** with bcrypt
10. **Role-based access control**

---

## 📚 Next Steps

1. ✅ Set up project structure
2. ✅ Configure server module with Ktor
3. ✅ Set up PostgreSQL & Exposed
4. ✅ Implement authentication
5. ✅ Create API endpoints
6. ✅ Implement client repositories
7. ✅ Build UI components
8. ✅ Add WebSocket real-time sync
9. ✅ Implement offline mode
10. ✅ Testing & deployment

---

**This architecture provides a solid foundation for building a production-ready, full-stack POS
system with Kotlin Multiplatform!** 🚀
