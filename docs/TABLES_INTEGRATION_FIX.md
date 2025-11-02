# Tables Feature Integration Fix 🍽️

**Date:** November 2, 2024  
**Status:** ⚠️ **TABLES NOT WIRED TO CART**

---

## 🐛 Problem Identified

The Tables feature exists but is **not integrated with the cart system**. This breaks the core
restaurant workflow.

### What's Missing:

1. **No `tableId` in Order/HeldCart models** - Can't track which table an order belongs to
2. **No `assignCartToTable()` function** - Can't assign current cart to a table
3. **ShoppingCart doesn't show table assignment** - Users don't see which table they're working on
4. **TableManagementScreen uses dummy data** - Not connected to actual orders
5. **No table clearing workflow** - Can't mark tables as available after payment

---

## 📋 How Web Version Works

### 1. Cart State Includes Table ID

```typescript
// Web: src/lib/store.ts
cart: {
  items: CartItem[],
  tableId: string | null,  // ← THIS IS MISSING IN KOTLIN
  ...
}
```

### 2. Assign Cart to Table Function

```typescript
assignCartToTable: (tableId: string) => {
  set((state) => ({
    cart: { ...state.cart, tableId },
    tables: state.tables.map((t) =>
      t.id === tableId
        ? { ...t, status: 'occupied', currentOrder: state.cart }
        : t
    ),
  }));
},
```

### 3. Shopping Cart Shows Table Assignment

```tsx
// ShoppingCart.tsx line 109-113
{isActive('table-management') && cart.tableId && (
  <div className="flex items-center gap-2 text-sm">
    📍 Table {tables.find(t => t.id === cart.tableId)?.number}
  </div>
)}
```

### 4. Table Cards Have Assign Button

```tsx
// TableFloorPlan.tsx line 178-185
<Button onClick={() => handleTableAssign(table.id)}>
  {isCurrentCart ? 'Current Table' : 'Assign Table'}
</Button>
```

### 5. Table Status Updates Automatically

- **Cart assigned** → Table becomes "occupied"
- **Order completed** → Table stays "occupied" (has order history)
- **Table cleared** → Table becomes "available"

---

## 🔧 Required Changes

### 1. Add `tableId` to Models

**File:** `shared/src/commonMain/kotlin/com/theauraflow/pos/domain/model/Order.kt`

```kotlin
@Serializable
data class Order(
    // ... existing fields ...
    val tableId: String? = null,  // ← ADD THIS
    val tableName: String? = null, // ← ADD THIS
    // ... rest of fields ...
)
```

**File:** `shared/src/commonMain/kotlin/com/theauraflow/pos/domain/model/HeldCart.kt`

```kotlin
@Serializable
data class HeldCart(
    // ... existing fields ...
    val tableId: String? = null,  // ← ADD THIS
    // ... rest of fields ...
)
```

### 2. Add Table Domain Model

**File:** `shared/src/commonMain/kotlin/com/theauraflow/pos/domain/model/Table.kt` (NEW FILE)

```kotlin
package com.theauraflow.pos.domain.model

import kotlinx.serialization.Serializable

@Serializable
data class Table(
    val id: String,
    val number: Int,
    val section: String? = null,
    val seats: Int,
    val status: TableStatus,
    val server: String? = null,
    val currentOrderId: String? = null
)

@Serializable
enum class TableStatus {
    AVAILABLE,
    OCCUPIED,
    RESERVED,
    CLEANING
}
```

### 3. Update Cart ViewModel

**File:** `shared/src/commonMain/kotlin/com/theauraflow/pos/presentation/viewmodel/CartViewModel.kt`

Add functions:

```kotlin
class CartViewModel(/* ... */) : ViewModel() {
    
    private val _tableId = MutableStateFlow<String?>(null)
    val tableId: StateFlow<String?> = _tableId.asStateFlow()
    
    fun assignToTable(tableId: String) {
        _tableId.value = tableId
        // Update cart in database with tableId
    }
    
    fun clearTableAssignment() {
        _tableId.value = null
    }
}
```

### 4. Create Table Repository & ViewModel

**File:** `shared/src/commonMain/kotlin/com/theauraflow/pos/domain/repository/TableRepository.kt` (
NEW)

```kotlin
interface TableRepository {
    fun observeTables(): Flow<List<Table>>
    suspend fun getTableById(id: String): Result<Table>
    suspend fun updateTableStatus(tableId: String, status: TableStatus): Result<Unit>
    suspend fun assignOrderToTable(tableId: String, orderId: String): Result<Unit>
    suspend fun clearTable(tableId: String): Result<Unit>
}
```

**File:**
`shared/src/commonMain/kotlin/com/theauraflow/pos/presentation/viewmodel/TableViewModel.kt` (NEW)

```kotlin
class TableViewModel(
    private val tableRepository: TableRepository,
    private val cartViewModel: CartViewModel
) : ViewModel() {
    
    val tables: StateFlow<List<Table>> = tableRepository
        .observeTables()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    
    fun assignCurrentCartToTable(tableId: String) {
        viewModelScope.launch {
            cartViewModel.assignToTable(tableId)
            tableRepository.updateTableStatus(tableId, TableStatus.OCCUPIED)
        }
    }
    
    fun clearTable(tableId: String) {
        viewModelScope.launch {
            tableRepository.clearTable(tableId)
            tableRepository.updateTableStatus(tableId, TableStatus.AVAILABLE)
        }
    }
}
```

### 5. Update Shopping Cart UI

**File:** `composeApp/src/commonMain/kotlin/com/theauraflow/pos/ui/components/ShoppingCart.kt`

Add table display:

```kotlin
// After customer selection, add:
tableId?.let { id ->
    val table = tables.find { it.id == id }
    if (table != null) {
        Surface(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 8.dp),
            shape = RoundedCornerShape(8.dp),
            color = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.3f)
        ) {
            Row(
                modifier = Modifier.padding(12.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.TableRestaurant,
                    contentDescription = null,
                    modifier = Modifier.size(20.dp)
                )
                Text(
                    text = "📍 Table ${table.number}",
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.Medium
                )
                Spacer(Modifier.weight(1f))
                TextButton(onClick = { /* Clear table assignment */ }) {
                    Text("Change", fontSize = 12.sp)
                }
            }
        }
    }
}
```

### 6. Wire Up Table Management Screen

**File:** `composeApp/src/commonMain/kotlin/com/theauraflow/pos/ui/screen/TableManagementScreen.kt`

Replace dummy data with real ViewModel:

```kotlin
@Composable
fun TableManagementScreen(
    tableViewModel: TableViewModel,
    cartViewModel: CartViewModel,
    onBack: () -> Unit
) {
    val tables by tableViewModel.tables.collectAsState()
    val currentTableId by cartViewModel.tableId.collectAsState()
    
    // ... use real data instead of dummy data
}
```

---

## 🗂️ Database Changes Needed

### 1. Add tableId to orders table

```sql
ALTER TABLE orders ADD COLUMN table_id TEXT;
ALTER TABLE orders ADD COLUMN table_name TEXT;
```

### 2. Create tables table

```sql
CREATE TABLE tables (
    id TEXT PRIMARY KEY,
    number INTEGER NOT NULL,
    section TEXT,
    seats INTEGER NOT NULL,
    status TEXT NOT NULL,
    server TEXT,
    current_order_id TEXT,
    FOREIGN KEY (current_order_id) REFERENCES orders(id)
);
```

### 3. Update DAOs

**File:** `shared/src/commonMain/kotlin/com/theauraflow/pos/data/local/dao/OrderDao.kt`

```kotlin
@Query("SELECT * FROM orders WHERE table_id = :tableId ORDER BY created_at DESC")
fun getOrdersByTableId(tableId: String): Flow<List<OrderEntity>>
```

---

## 🎯 Implementation Priority

### Phase 1: Core Models (30 min)

1. Add `tableId` to Order and HeldCart
2. Create Table domain model
3. Update database schema

### Phase 2: Repository & ViewModel (45 min)

4. Create TableRepository interface
5. Implement TableRepositoryImpl
6. Create TableViewModel
7. Wire up Koin DI

### Phase 3: UI Integration (1 hour)

8. Update CartViewModel with table functions
9. Add table display to ShoppingCart
10. Wire TableManagementScreen to real data
11. Add "Assign Table" workflow

### Phase 4: Testing (30 min)

12. Test table assignment flow
13. Test order completion clears table
14. Test table status updates

**Total Time:** ~2.5 hours

---

## 📊 User Flow (Web Version Reference)

1. **Cashier starts new order**
    - Cart is empty, no table assigned

2. **Cashier adds items to cart**
    - Cart has items but no table yet

3. **Cashier clicks "Tables" button**
    - Opens full-screen TableManagementScreen
    - Shows all tables with status colors

4. **Cashier selects a table**
    - Clicks or double-clicks table card
    - Table card highlights
    - "Assign Table" button appears

5. **Cashier assigns cart to table**
    - Clicks "Assign Table"
    - Cart now shows "📍 Table 5" at top
    - Table status changes to "Occupied"
    - Returns to POS view

6. **Cashier continues order**
    - Can add/remove items
    - Table assignment persists
    - Can change table if needed

7. **Cashier completes payment**
    - Order saved with tableId
    - Table remains "Occupied" (has order history)

8. **Manager/Server clears table**
    - Opens table details
    - Clicks "Clear Table"
    - Table status → "Available"

---

## 🎨 Visual States

### Shopping Cart States

**Without Table:**

```
┌─────────────────────────┐
│ 🛒 Shopping Cart        │
├─────────────────────────┤
│ Customer: Select...     │
│                         │
│ 2x Coffee         $6.00 │
│ 1x Muffin         $3.50 │
│                         │
│ Subtotal:         $9.50 │
└─────────────────────────┘
```

**With Table:**

```
┌─────────────────────────┐
│ 🛒 Shopping Cart        │
├─────────────────────────┤
│ Customer: John Doe      │
├─────────────────────────┤
│ 📍 Table 5      [Change]│ ← NEW
├─────────────────────────┤
│ 2x Coffee         $6.00 │
│ 1x Muffin         $3.50 │
│                         │
│ Subtotal:         $9.50 │
└─────────────────────────┘
```

### Table Card States

**Available:**

```
┌──────────────┐
│  ⭕ 5        │
│              │
│  ✅ Available│
│  👥 4 seats  │
│              │
│ [Assign]     │
└──────────────┘
```

**Occupied:**

```
┌──────────────┐
│  ⭕ 5        │
│              │
│  ❌ Occupied │
│  👥 4 seats  │
│  💰 $45.50   │
│  ⏰ 25 min   │
│              │
│ [Details]    │
└──────────────┘
```

---

## 🔍 Key Web References

**Assignment Flow:**

- `docs/Web Version/src/components/TableManagementPage.tsx`
- `docs/Web Version/src/plugins/table-management/components/TableFloorPlan.tsx`
- `docs/Web Version/src/plugins/table-management/components/TableDetailsDialog.tsx`

**Cart Integration:**

- `docs/Web Version/src/components/ShoppingCart.tsx` (line 109-113)
- `docs/Web Version/src/lib/store.ts` (assignCartToTable function)

---

## ✅ Success Criteria

After implementation, users should be able to:

1. ✅ View all tables with live status
2. ✅ Assign current cart to a table
3. ✅ See table assignment in cart
4. ✅ Change table if needed
5. ✅ Complete order (table stays occupied)
6. ✅ View orders for a specific table
7. ✅ Clear table when guests leave

---

**Status:** 📋 **DOCUMENTED - READY TO IMPLEMENT**  
**Priority:** ⭐⭐⭐ **HIGH** (Core restaurant feature)  
**Estimated Time:** 2.5 hours  
**Next Step:** Implement Phase 1 (Core Models)

**This is a critical feature for restaurant mode!** 🍽️
