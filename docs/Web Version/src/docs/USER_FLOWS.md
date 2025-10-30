# AuraFlow POS - User Flows

## Table of Contents
1. [Cashier Flows](#cashier-flows)
2. [Admin Flows](#admin-flows)
3. [Manager Flows](#manager-flows)

## Cashier Flows

### Flow 1: Clock In
```
START
  ↓
Login Screen
  ↓
Enter PIN
  ↓
Clock In Dialog Opens
  ↓
Select Terminal → Enter Opening Balance
  ↓
Click "Clock In"
  ↓
POS View Loads
  ↓
END (Ready to process sales)
```

### Flow 2: Standard Sale
```
START (Cashier clocked in)
  ↓
Customer arrives with items
  ↓
Search or browse for products
  ↓
Click product(s) to add to cart
  ├─→ Has variations? → Select variation → Add to cart
  └─→ No variations → Add directly to cart
  ↓
Select order type (dine-in/takeout/delivery)
  ↓
Add customer (optional)
  ↓
Add order notes (optional)
  ↓
Apply discounts (if applicable)
  ↓
Click "Charge" button
  ↓
Payment Dialog Opens
  ↓
Select payment method(s)
  ├─→ Cash → Enter amount received → Calculate change
  ├─→ Card → Process card payment
  ├─→ Gift Card → Enter card number → Redeem
  └─→ Split Payment → Add multiple methods
  ↓
Add tip (if applicable)
  ↓
Complete Payment
  ↓
Receipt Dialog Opens
  ↓
Print/Email Receipt (optional)
  ↓
Cart Clears
  ↓
END (Ready for next customer)
```

### Flow 3: Void Item
```
START (Item in cart)
  ↓
Click three-dot menu on cart item
  ↓
Select "Void Item"
  ↓
Void Dialog Opens
  ↓
Check permissions
  ├─→ Has permission → Continue
  └─→ No permission → Request Manager Override
      ↓
      Manager enters credentials
      ↓
      Approved → Continue
  ↓
Enter void reason (required)
  ↓
Click "Void Item"
  ↓
System logs void transaction
  ↓
Item removed from cart
  ↓
END
```

### Flow 4: Return/Refund
```
START
  ↓
Customer requests return
  ↓
Click "Returns" button in action bar
  ↓
Returns Dialog Opens
  ↓
Search for original order
  ├─→ By order number
  ├─→ By date
  └─→ By customer
  ↓
Select order
  ↓
Select items to return (checkboxes)
  ↓
Enter return reason (required)
  ↓
Check permissions
  ├─→ Has permission → Continue
  └─→ No permission → Request Manager Override
  ↓
Click "Process Return"
  ↓
System creates return transaction
  ↓
Process refund
  ├─→ Original payment method
  ├─→ Cash refund
  └─→ Store credit
  ↓
Print return receipt
  ↓
END
```

### Flow 5: Park Sale
```
START (Items in cart)
  ↓
Customer needs to leave temporarily
  ↓
Press F2 or click "Park Sale"
  ↓
System saves current cart
  ↓
Cart clears
  ↓
Ready for next customer
  ↓
[Later] Customer returns
  ↓
Click "Park Sale" button
  ↓
Parked Sales Dialog opens
  ↓
Select saved sale from list
  ↓
Cart restored
  ↓
Continue with sale
  ↓
END
```

### Flow 6: Clock Out
```
START (End of shift)
  ↓
Click "Clock Out" button
  ↓
Confirmation dialog
  ↓
Count physical cash in drawer
  ↓
Enter closing balance
  ↓
System generates Z-Report
  ↓
Z-Report Dialog opens
  ↓
Review:
  - Sales summary
  - Payment method breakdown
  - Cash reconciliation
  - Void items
  - Transactions
  ↓
Print/Save Z-Report
  ↓
Shift ended
  ↓
Returns to login screen
  ↓
END
```

### Flow 7: Cash Drawer Operations

#### No Sale (Open Drawer)
```
START
  ↓
Need to open drawer without sale
  ↓
Press F10
  ↓
Cash drawer opens
  ↓
System logs no-sale event
  ↓
END
```

#### Cash In/Out
```
START
  ↓
Click "Cash Drawer" button
  ↓
Cash Drawer Dialog opens
  ↓
Select operation
  ├─→ Cash In (deposit, paid-in)
  └─→ Cash Out (paid-out, expense)
  ↓
Enter amount
  ↓
Enter description/note
  ↓
Click confirm
  ↓
System logs transaction
  ↓
END
```

## Admin Flows

### Flow 1: Product Management

#### Create New Product
```
START
  ↓
Navigate to Admin Dashboard
  ↓
Click "Products" in sidebar
  ↓
Click "Add Product" button
  ↓
Product Form opens
  ↓
Enter product details:
  - Name
  - Category
  - Price
  - SKU/Barcode
  - Description
  ↓
Upload product image
  ↓
Configure inventory:
  - Stock quantity
  - Low stock alert threshold
  - Track inventory (yes/no)
  ↓
Add variations (optional)
  ├─→ Add variation type (Size, Color, etc.)
  ├─→ Add variation options
  └─→ Set prices per variation
  ↓
Configure modifiers (optional)
  ├─→ Select modifier groups
  └─→ Set prices for modifiers
  ↓
Save Product
  ↓
Product appears in POS
  ↓
END
```

#### Edit Existing Product
```
START
  ↓
Products list view
  ↓
Search/Filter for product
  ↓
Click product row
  ↓
Product details open
  ↓
Click "Edit" button
  ↓
Modify fields as needed
  ↓
Save changes
  ↓
Changes reflect immediately in POS
  ↓
END
```

### Flow 2: Category Management
```
START
  ↓
Navigate to "Categories"
  ↓
View existing categories
  ↓
Click "Add Category"
  ↓
Enter:
  - Category name
  - Description
  - Display order
  - Color/Icon (optional)
  ↓
Save category
  ↓
Category available in product creation
  ↓
END
```

### Flow 3: User Management
```
START
  ↓
Navigate to "Users"
  ↓
Click "Add User"
  ↓
Enter:
  - Name
  - PIN
  - Role (Cashier/Manager/Admin)
  - Email (optional)
  ↓
Assign permissions:
  ├─→ Void items
  ├─→ Price override
  ├─→ Process returns
  ├─→ Cash drawer access
  └─→ View reports
  ↓
Assign terminals
  ↓
Save user
  ↓
User can now log in
  ↓
END
```

### Flow 4: Terminal Configuration
```
START
  ↓
Navigate to "Terminals"
  ↓
Click "Add Terminal"
  ↓
Enter:
  - Terminal name
  - Terminal ID
  - Location
  ↓
Configure receipt template:
  - Header (store name, address)
  - Footer (thank you message)
  - Logo (optional)
  ↓
Configure Z-Report template
  ↓
Assign printers
  ↓
Save terminal
  ↓
Terminal available for shifts
  ↓
END
```

### Flow 5: Sales Reporting
```
START
  ↓
Navigate to "Reports"
  ↓
Select report type:
  ├─→ Sales by Period
  ├─→ Sales by Product
  ├─→ Sales by Category
  ├─→ Sales by Cashier
  ├─→ Payment Method Breakdown
  ├─→ Void Analysis
  └─→ Inventory Movement
  ↓
Set filters:
  - Date range
  - Terminal
  - Cashier
  - Category
  - Payment method
  ↓
Click "Generate Report"
  ↓
Report displays with:
  - Charts/graphs
  - Data tables
  - Summary statistics
  ↓
Export options:
  ├─→ PDF
  ├─→ Excel/CSV
  └─→ Print
  ↓
END
```

### Flow 6: Industry Configuration
```
START
  ↓
Navigate to "Settings" → "Business Profile"
  ↓
Select Industry Type:
  ├─→ Restaurant/Café
  ├─→ Retail/Grocery
  ├─→ Pharmacy
  ├─→ Furniture
  └─→ General
  ↓
System configures:
  - Available order types
  - Required fields
  - Default categories
  - Suggested modifiers
  - Report templates
  - UI elements
  ↓
Review configuration
  ↓
Save settings
  ↓
POS updates with industry-specific features
  ↓
END
```

## Manager Flows

### Flow 1: Approve Manager Override
```
START (Cashier requests override)
  ↓
Manager Override Dialog appears on cashier screen
  ↓
Displays:
  - Action being requested
  - Cashier requesting
  - Timestamp
  ↓
Manager enters credentials:
  - PIN or
  - Username/Password
  ↓
System validates credentials
  ↓
Check if manager has required permission
  ├─→ Has permission → Approve
  └─→ No permission → Deny
  ↓
Action proceeds
  ↓
System logs:
  - Manager who approved
  - Action approved
  - Timestamp
  ↓
END
```

### Flow 2: Review Void Reports
```
START
  ↓
Navigate to "Reports" → "Void Analysis"
  ↓
View void summary:
  - Total voids by period
  - Voids by cashier
  - Voids by reason
  - High-frequency patterns
  ↓
Drill down into specific voids
  ↓
Review details:
  - Item voided
  - Amount
  - Cashier
  - Timestamp
  - Reason provided
  ↓
Identify patterns or concerns
  ↓
Take action if needed:
  ├─→ Coaching/training
  ├─→ Policy review
  └─→ Further investigation
  ↓
END
```

### Flow 3: Cash Drawer Reconciliation
```
START
  ↓
End of business day
  ↓
Navigate to "Cash Management"
  ↓
View all shift Z-Reports
  ↓
For each terminal:
  - Expected cash
  - Actual cash counted
  - Variance
  ↓
Investigate variances:
  ├─→ Review transactions
  ├─→ Check voids
  ├─→ Verify cash in/out
  └─→ Check payment splits
  ↓
Document findings
  ↓
Prepare bank deposit
  ↓
END
```

## Navigation Between Cashier and Admin

### Cashier → Admin
```
START (Cashier logged in)
  ↓
Click "Admin" button (in header)
  ↓
Confirmation dialog:
  "Clock out current session?"
  ├─→ YES
  │   ↓
  │   Enter closing balance
  │   ↓
  │   Generate Z-Report
  │   ↓
  │   End shift
  │   ↓
  │   Navigate to Admin Login
  └─→ NO
      ↓
      Leave session open
      ↓
      Navigate to Admin Login
  ↓
Admin Login Screen
  ↓
Enter admin credentials
  ↓
Admin Dashboard
  ↓
END
```

### Admin → Cashier
```
START (Admin logged in)
  ↓
Click "Back to POS" button
  ↓
Check for open cashier session
  ├─→ Session exists
  │   ↓
  │   Resume existing session
  │   ↓
  │   Return to POS View
  └─→ No session
      ↓
      Show cashier login
      ↓
      Clock in process
      ↓
      POS View
  ↓
END
```

## Error Handling Flows

### Insufficient Permissions
```
User attempts restricted action
  ↓
Check permissions
  ↓
Permission denied
  ↓
Show Manager Override Dialog
  ↓
Manager approves OR user cancels
  ↓
Action proceeds OR canceled
```

### Offline Mode
```
Network connection lost
  ↓
Show offline indicator
  ↓
Continue operations locally
  ↓
Queue transactions for sync
  ↓
Network restored
  ↓
Sync queued transactions
  ↓
Show online indicator
```

### Stock Unavailable
```
Item added to cart
  ↓
Check stock
  ↓
Quantity exceeds available stock
  ↓
Show warning dialog
  ↓
Offer options:
  ├─→ Reduce quantity to available
  ├─→ Cancel add
  └─→ Override (if permitted)
```

## Version History
- **v1.0.0** (2025-01-13): Initial user flow documentation
