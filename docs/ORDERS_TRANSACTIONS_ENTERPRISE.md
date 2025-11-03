# Enterprise Orders & Transactions System 🏢

**Date:** November 2, 2024  
**Status:** 🚧 **IN PROGRESS**

---

## ✅ **Completed**

### **1. Orders Screen Redesign**

- ✅ Enterprise table layout with sortable columns
- ✅ Search functionality (order #, customer name)
- ✅ **Pagination** (25 orders per page)
- ✅ **Wider search box** (300dp - 600dp)
- ✅ Shows variations and modifiers in detail view
- ✅ Order detail dialog with action buttons

---

## 🚧 **To Implement**

### **2. Transaction System**

#### **Transaction Model:**

```kotlin
data class Transaction(
    val id: String,
    val referenceNumber: String,      // TXN-20241102-001
    val date: Long,                    // Timestamp
    val amount: Double,                // Transaction amount
    val paymentMethod: PaymentMethod,  // CASH, CARD, OTHER
    val type: TransactionType,         // SALE, REFUND, CASH_IN, CASH_OUT, etc.
    val status: TransactionStatus,     // COMPLETED, PENDING, FAILED, CANCELLED
    val orderId: String?,              // Linked order (null for non-order transactions)
    val orderNumber: String?,          // Display order number if linked
    val description: String?,          // Transaction description
    val performedBy: String,           // User who performed transaction
    val metadata: Map<String, String>? // Additional data
)

enum class TransactionType {
    SALE,           // Regular sale
    REFUND,         // Order refund
    CASH_IN,        // Cash added to drawer
    CASH_OUT,       // Cash removed from drawer
    PAYOUT,         // Vendor payment, petty cash
    ADJUSTMENT,     // Inventory or price adjustment
    TIP,            // Tip received
    VOID            // Voided transaction
}

enum class TransactionStatus {
    COMPLETED,
    PENDING,
    FAILED,
    CANCELLED,
    REVERSED
}
```

#### **Transaction Table UI:**

```
┌──────────────────────────────────────────────────────────────────────┐
│ Ref #      │ Date/Time │ Type   │ Amount  │ Payment │ Status │ Order# │
├────────────┼───────────┼────────┼─────────┼─────────┼────────┼────────┤
│ TXN-001    │ 10:30 AM  │ SALE   │ +$19.49 │ CASH    │ ✓      │ ORD001 │
│ TXN-002    │ 10:45 AM  │ SALE   │ +$9.99  │ CARD    │ ✓      │ ORD002 │
│ TXN-003    │ 11:00 AM  │ REFUND │ -$19.49 │ CASH    │ ✓      │ ORD001 │
│ TXN-004    │ 11:15 AM  │ CASH_IN│ +$100.00│ CASH    │ ✓      │ -      │
└────────────────────────────────────────────────────────────────────��─┘
```

---

### **3. Delete Order (Super Admin)**

#### **Flow:**

1. User clicks "Delete" button
2. Show **Password Dialog**:
   ```
   ┌──────────────────────────────���──────┐
   │ ⚠️  DELETE ORDER - ADMIN AUTH       │
   ├─────────────────────────────────────┤
   │ Order: ORD-001 ($19.49)             │
   │                                     │
   │ Enter Super Admin Password:         │
   │ [••••••••]                          │
   ├─────────────────────────────────────┤
   │ [Cancel] [Authenticate]             │
   └─────────────────────────────────────┘
   ```

3. If authenticated, show **Confirmation Dialog**:
   ```
   ┌─────────────────────────────────────┐
   │ ⚠️  CONFIRM DELETE                  │
   ├─────────────────────────────────────┤
   │ This action is PERMANENT and will:  │
   │                                     │
   │ ⚠️  Delete order ORD-001            │
   │ ⚠️  Remove from sales history       │
   │ ⚠️  Affect financial reports        │
   │ ⚠️  Cannot be undone                │
   │                                     │
   │ Reason (required):                  │
   │ [Data entry error, duplicate...]    │
   │                                     │
   │ Type "DELETE" to confirm:           │
   │ [_____]                             │
   ├─────────────────────────────────────┤
   │ [Cancel] [DELETE ORDER]             │
   └─────────────────────────────────────┘
   ```

4. **Audit Trail:**
    - Log deletion in audit table
    - Record: who, when, why, what was deleted
    - Keep soft copy for compliance

---

### **4. Cancel Order (Enterprise)**

#### **Flow:**

1. User clicks "Cancel" button
2. Show **Cancel Order Dialog**:
   ```
   ┌──────────────────────────────────────────────┐
   │ CANCEL ORDER - ORD-001                       │
   ├──────────────────────────────────────────────┤
   │ Order Total: $19.49                          │
   │ Payment: CASH                                │
   │                                              │
   │ Cancellation Reason: *                       │
   │ ┌────────────────────────────────────────┐  │
   │ │ ⚪ Customer request                     │  │
   │ │ ⚪ Item out of stock                    │  │
   │ │ ⚪ Pricing error                        │  │
   │ │ ⚪ Kitchen unable to fulfill           │  │
   │ │ ⚪ Payment issue                        │  │
   │ │ ⚪ Other (specify below)                │  │
   │ └────────────────────────────────────────┘  │
   │                                              │
   │ Additional Notes:                            │
   │ [___________________________]                │
   │                                              │
   │ ☑️  Process Refund ($19.49)                  │
   │     Refund Method: ○ Original  ○ Cash       │
   │                                              │
   │ ☑️  Restock Inventory                        │
   │     Items: 1 Caesar Salad, 1 Coffee         │
   │                                              │
   │ ☑️  Notify Customer (if email on file)       │
   │                                              │
   │ ☑️  Create Transaction Record                │
   │     Type: REFUND | Status: PENDING          │
   │                                              │
   │ ⚠️  This will:                                │
   │     • Mark order as CANCELLED                │
   │     • Process refund transaction             │
   │     • Return items to inventory              │
   │     • Update sales reports                   │
   ├──────────────────────────────────────────────┤
   │ [Cancel] [CANCEL ORDER]                      │
   └──────────────────────────────────────────────┘
   ```

3. **Process Cancellation:**
    - Update order status to CANCELLED
    - Store cancellation reason and notes
    - If refund checked:
        - Create REFUND transaction
        - Update cash drawer balance
        - Link to original SALE transaction
    - If restock checked:
        - Add items back to inventory
        - Update stock quantities
    - Create audit log entry
    - Send notification if checked

---

### **5. Restocking & Inventory Management**

#### **When Restocking:**

```kotlin
suspend fun restockFromCancelledOrder(order: Order, reason: String): Result<Unit> {
    return try {
        order.items.forEach { item ->
            // Return base product to stock
            productRepository.updateStock(
                productId = item.product.id,
                quantityChange = +item.quantity,
                reason = "ORDER_CANCELLED: ${order.orderNumber}",
                reference = order.id
            )
            
            // If has variation, update variation stock
            item.variation?.let { variation ->
                productRepository.updateVariationStock(
                    productId = item.product.id,
                    variationId = variation.id,
                    quantityChange = +item.quantity,
                    reason = "ORDER_CANCELLED: ${order.orderNumber}",
                    reference = order.id
                )
            }
            
            // Log inventory transaction
            inventoryRepository.createTransaction(
                type = InventoryTransactionType.RESTOCK,
                productId = item.product.id,
                quantity = item.quantity,
                reason = reason,
                orderId = order.id
            )
        }
        Result.success(Unit)
    } catch (e: Exception) {
        Result.failure(e)
    }
}
```

---

### **6. Enterprise Cancellation Features**

#### **Option 1: Partial Cancellation**

Allow cancelling specific items from an order:

```
☑️ Caesar Salad (1x) - $9.99
☐ Coffee Medium (1x) - $9.50
```

- Adjust order total
- Partial refund
- Selective restocking

#### **Option 2: Reason Templates**

Pre-configured reasons with specific actions:

- **Customer Request** → Full refund + Restock
- **Out of Stock** → No refund + Notify customer
- **Pricing Error** → Adjust price + Keep order
- **Kitchen Issue** → Full refund + Compensation

#### **Option 3: Manager Override**

For large refunds (e.g., > $100):

- Require manager PIN
- Send notification to manager
- Add to manager review queue

#### **Option 4: Loyalty Points Adjustment**

If customer earned points:

- Deduct points if refunded
- Keep points if cancelled by restaurant
- Partial adjustment for partial cancellation

#### **Option 5: Kitchen Notification**

If order sent to kitchen:

- Notify kitchen display system
- Stop preparation
- Update kitchen queue

#### **Option 6: Financial Adjustments**

- Update daily sales report
- Adjust tax liability
- Update payment method totals
- Reconcile cash drawer

---

### **7. Transaction Auto-Creation**

Every order should create a transaction:

```kotlin
suspend fun createOrder(...): Result<Order> {
    // Create order
    val order = Order(...)
    orderRepository.save(order)
    
    // Create transaction
    val transaction = Transaction(
        id = generateId(),
        referenceNumber = generateTxnNumber(),
        date = System.currentTimeMillis(),
        amount = order.total,
        paymentMethod = order.paymentMethod,
        type = TransactionType.SALE,
        status = TransactionStatus.COMPLETED,
        orderId = order.id,
        orderNumber = order.orderNumber,
        description = "Sale: ${order.itemCount} items",
        performedBy = currentUser.id
    )
    transactionRepository.save(transaction)
    
    Result.success(order)
}
```

---

### **8. Refund Transaction Creation**

When cancelling with refund:

```kotlin
suspend fun processRefund(order: Order, reason: String): Result<Transaction> {
    val refundTransaction = Transaction(
        id = generateId(),
        referenceNumber = generateTxnNumber(),
        date = System.currentTimeMillis(),
        amount = -order.total,  // Negative for refund
        paymentMethod = order.paymentMethod,
        type = TransactionType.REFUND,
        status = TransactionStatus.COMPLETED,
        orderId = order.id,
        orderNumber = order.orderNumber,
        description = "Refund: $reason",
        performedBy = currentUser.id,
        metadata = mapOf(
            "original_transaction_id" to originalTransactionId,
            "reason" to reason
        )
    )
    
    transactionRepository.save(refundTransaction)
    
    // Update cash drawer
    if (order.paymentMethod == PaymentMethod.CASH) {
        cashDrawerRepository.recordCashOut(
            amount = order.total,
            reason = "Refund: ${order.orderNumber}"
        )
    }
    
    Result.success(refundTransaction)
}
```

---

## 📋 **Implementation Checklist**

### **Phase 1: Core Models** ✅

- [ ] Create Transaction model
- [ ] Create TransactionType enum
- [ ] Create TransactionStatus enum
- [ ] Create TransactionRepository
- [ ] Create TransactionDatabase entities

### **Phase 2: UI Components**

- [ ] TransactionsScreen with table
- [ ] SuperAdminPasswordDialog
- [ ] DeleteConfirmationDialog
- [ ] CancelOrderDialog with all options
- [ ] RefundConfirmationDialog

### **Phase 3: Business Logic**

- [ ] Auto-create transaction on order creation
- [ ] Delete order with admin auth
- [ ] Cancel order with reason
- [ ] Process refunds
- [ ] Restock inventory
- [ ] Update financial reports

### **Phase 4: Audit Trail**

- [ ] Create AuditLog model
- [ ] Log all order modifications
- [ ] Log deletions (what, who, when, why)
- [ ] Log cancellations
- [ ] Tamper-proof audit trail

### **Phase 5: Reporting**

- [ ] Transaction history reports
- [ ] Refund reports
- [ ] Cancellation analytics
- [ ] Stock movement reports

---

## 🔒 **Security & Compliance**

### **Super Admin Authentication:**

- Separate password from regular staff
- Time-limited session
- Multi-factor option
- Logged and audited

### **Audit Trail Requirements:**

- **Who:** User ID + name
- **What:** Action + affected data
- **When:** Timestamp (UTC + local)
- **Why:** Reason provided
- **How:** Method (UI, API, bulk)
- **Result:** Success/failure

### **Data Retention:**

- Deleted orders: Keep soft copy for 7 years
- Audit logs: Keep forever
- Transaction records: Keep forever
- Financial data: Regulatory period (varies)

---

## 📊 **Reports Affected**

When cancelling/deleting orders:

1. **Daily Sales Report** - Adjust total
2. **Tax Report** - Adjust tax collected
3. **Payment Method Report** - Adjust totals
4. **Inventory Report** - Update stock levels
5. **Revenue Report** - Recalculate
6. **Refund Report** - Add entry
7. **Manager Dashboard** - Update metrics

---

**Status:** Ready for implementation!  
**Estimated Time:** 6-8 hours for complete implementation  
**Priority:** HIGH - Critical enterprise features
