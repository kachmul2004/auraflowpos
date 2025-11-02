# Sample Data Source Explanation

**Date:** November 2, 2024

---

## 🎯 **Where Sample Data Comes From**

The app currently uses **mock/sample data** for development and testing. Here's the complete
breakdown:

---

## 📦 **Mock Data Repositories**

### **1. Products** (`MockProductRepository.kt`)

**Location:**
`shared/src/commonMain/kotlin/com/theauraflow/pos/data/repository/MockProductRepository.kt`

**Contains:**

- **30 products** across 3 categories:
    - **Food:** 10 items (Burgers, Pizza, Salad, Salmon, etc.)
    - **Beverages:** 10 items (Coffee, Juice, Smoothies, Soda, etc.)
    - **Retail:** 10 items (Headphones, Phone Cases, Shoes, etc.)

**Special Products:**

- **Coffee** - Has 3 variations (Small/Medium/Large) + 4 modifiers
- **Beef Burger** - Has 2 variations (Single/Double) + 6 modifiers

**Data Includes:**

- Product ID, Name, Price
- SKU, Barcode
- Stock quantity
- Category
- Image URLs (from Unsplash)
- Variations & Modifiers

---

### **2. Customers** (`MockCustomerRepository.kt`)

**Location:**
`shared/src/commonMain/kotlin/com/theauraflow/pos/data/repository/MockCustomerRepository.kt`

**Contains:**

- **6 sample customers**:
    - Sarah Johnson - 45 loyalty points, $1,250 spent
    - Michael Chen - 0 loyalty points, $3,420 spent
    - Emily Rodriguez - 5 loyalty points, $875 spent
    - David Thompson - 25 loyalty points, $5,680 spent
    - Jessica Martinez - 2 loyalty points, $435 spent
    - Robert Anderson - 0 loyalty points, $125 spent

**Data Includes:**

- ID, Name, Email, Phone
- Address (optional)
- Loyalty points
- Total spent
- Order count

---

### **3. Tables** (`TableRepositoryImpl.kt`)

**Location:**
`shared/src/commonMain/kotlin/com/theauraflow/pos/data/repository/TableRepositoryImpl.kt`

**Contains:**

- **12 restaurant tables** across 3 sections:
    - **Main Dining:** 4 tables (2-6 seats)
    - **Patio:** 2 tables (2-4 seats)
    - **Bar:** 2 tables (2 seats each)
    - **Private Dining:** 1 table (8 seats)
    - **Lounge:** 1 table (4 seats)
    - **Terrace:** 2 tables (4-6 seats)

**Data Includes:**

- Table number, name
- Seat count
- Section
- Status (Available/Occupied/Reserved/Cleaning)
- Server assignment (optional)

---

## ⚙️ **How It Works: Koin DI Module System**

### **Module Loading Order:**

```kotlin
// shared/src/commonMain/kotlin/com/theauraflow/pos/di/KoinInitializer.kt
modules(
    appModules +              // 1. Shared common modules
    platformModules +          // 2. Platform-specific modules  
    listOf(mockDataModule)     // 3. Mock data (OVERRIDES real implementations)
)
```

### **Three Module Types:**

#### **1. Real Implementation** (`dataModule`)

**Location:** `shared/src/commonMain/kotlin/com/theauraflow/pos/core/di/DataModule.kt`

```kotlin
single { ProductRepositoryImpl(get()) }
single { CustomerRepositoryImpl(get()) }
```

These would connect to:

- Remote API (backend server)
- Local Room database
- Real data sources

#### **2. Mock Implementation** (`mockDataModule`)

**Location:** `shared/src/commonMain/kotlin/com/theauraflow/pos/core/di/MockDataModule.kt`

```kotlin
single<ProductRepository> { MockProductRepository() }
single<CustomerRepository> { MockCustomerRepository() }
```

These provide hardcoded sample data (what's currently active)

#### **3. Override Strategy**

```kotlin
allowOverride(true) // In KoinInitializer

// Loading order means mockDataModule OVERRIDES dataModule
// So MockProductRepository is used instead of ProductRepositoryImpl
```

---

## 🔄 **Current Configuration**

### **Active:**

✅ **Mock Data** (In-memory sample data)

- No backend server needed
- No database needed
- Perfect for development/testing
- Data resets on app restart

### **Inactive:**

❌ **Real Data** (Would need backend API)

- ProductRepositoryImpl (needs API client)
- CustomerRepositoryImpl (needs API client)
- Room database integration

---

## 🎛️ **How to Switch Between Mock and Real Data**

### **Option 1: Remove Mock Module** (Use Real Data)

**Edit:** `shared/src/commonMain/kotlin/com/theauraflow/pos/di/KoinInitializer.kt`

```kotlin
// BEFORE (Mock data)
modules(
    appModules +
    platformModules +
    listOf(mockDataModule)  // ← Remove this line
)

// AFTER (Real data)
modules(
    appModules +
    platformModules
    // mockDataModule removed - will use ProductRepositoryImpl, CustomerRepositoryImpl
)
```

### **Option 2: Environment Variable** (Recommended)

```kotlin
val useMockData = System.getenv("USE_MOCK_DATA")?.toBoolean() ?: true

modules(
    appModules +
    platformModules +
    if (useMockData) listOf(mockDataModule) else emptyList()
)
```

### **Option 3: Build Variant**

```kotlin
// androidMain
fun initKoin() {
    initializeKoin(
        platformModules = if (BuildConfig.DEBUG) {
            listOf(mockDataModule)
        } else {
            emptyList() // Production uses real data
        }
    )
}
```

---

## 📊 **Sample Data Summary**

| Data Type | Count | Location | Status |
|-----------|-------|----------|--------|
| Products | 30 | MockProductRepository.kt | ✅ Active |
| Customers | 6 | MockCustomerRepository.kt | ✅ Active |
| Tables | 12 | TableRepositoryImpl.kt | ✅ Active |
| Orders | 0 | Created at runtime | Dynamic |
| Transactions | 0 | Created at runtime | Dynamic |

---

## 🔍 **Where Each Mock Repository Is Used**

### **MockProductRepository:**

- ProductViewModel → ProductGrid
- Search functionality
- Category filtering
- Product details

### **MockCustomerRepository:**

- CustomerViewModel → CustomerSelectionDialog
- Customer search
- Loyalty points
- Top customers

### **TableRepositoryImpl:**

- TableViewModel → TableManagementScreen
- Table status management
- Cart assignment

---

## 🚀 **To Connect to Real Backend**

### **Step 1: Backend API Ready**

```kotlin
// Ensure these exist and work:
- GET /api/products
- GET /api/customers  
- POST /api/orders
- etc.
```

### **Step 2: Update API Client**

```kotlin
// shared/.../data/remote/api/ProductApiClient.kt
class ProductApiClient(private val client: HttpClient) {
    suspend fun getProducts(): List<Product> {
        return client.get("$BASE_URL/api/products").body()
    }
}
```

### **Step 3: Remove Mock Module**

```kotlin
// KoinInitializer.kt
modules(
    appModules + platformModules
    // mockDataModule REMOVED
)
```

### **Step 4: Test**

- App will now fetch from real API
- Data persists in backend
- Requires internet connection (or offline sync)

---

## 💡 **Benefits of Current Mock Setup**

✅ **Fast Development**

- No backend server needed
- No database setup
- Works offline
- Instant app startup

✅ **Easy Testing**

- Predictable data
- No network delays
- Can test all scenarios
- UI/UX testing

✅ **Demo Ready**

- Always has data
- Looks professional
- No empty states
- Perfect for presentations

---

## ⚠️ **Limitations**

❌ **Data Resets**

- On app restart
- No persistence (except settings)

❌ **No Sync**

- Can't share between devices
- No cloud backup

❌ **Limited Data**

- Only 30 products
- Only 6 customers
- Can't add more via UI (would need to edit MockRepositoryImpl files)

---

## 🎯 **Recommendation**

### **For Development/Demo:** (Current)

✅ Keep mock data - works perfectly

### **For Production:**

1. Build backend API
2. Implement real repository methods
3. Remove mockDataModule from KoinInitializer
4. Add offline sync with Room database

---

## 📝 **Summary**

**Current Setup:**

- ✅ Mock data active
- ✅ 30 products, 6 customers, 12 tables
- ✅ Perfect for development
- ✅ No backend needed

**To Use Real Data:**

- Remove `listOf(mockDataModule)` from KoinInitializer
- Ensure backend API is running
- ProductRepositoryImpl will connect to API

**Location of Sample Data:**

- `MockProductRepository.kt` - All products
- `MockCustomerRepository.kt` - All customers
- `TableRepositoryImpl.kt` - All tables

The mock data is **intentional** for development and provides a complete, realistic POS experience
without requiring a backend server! 🎉
