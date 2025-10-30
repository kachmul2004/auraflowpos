# AuraFlow POS - User Guide

**Version**: 2.5  
**Last Updated**: October 24, 2025

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Taking Orders](#taking-orders)
3. [Barcode Scanner](#barcode-scanner-new)
4. [Processing Payments](#processing-payments)
5. [Advanced Features](#advanced-features)
6. [Keyboard Shortcuts](#keyboard-shortcuts)
7. [Training Mode](#training-mode)

---

## Getting Started

### Clocking In

1. Log in with your credentials (username + PIN)
2. Click the **"Clock In"** button
3. Select your terminal from the dropdown
4. Enter your starting cash drawer balance
5. Click **"Clock In"** to begin your shift

### Understanding the Interface

- **Left Side**: Product grid with categories and search
- **Right Side**: Shopping cart with current order items
- **Bottom**: Action bar with shift, cash drawer, and other functions
- **Top**: Status indicators (online status, shift status, user info)

---

## Taking Orders

### Adding Products to Cart

1. **Click** a product in the product grid
2. If the product has **variations** (size, color), select the variation
3. Add any **modifiers** (extras, toppings)
4. Adjust **quantity** if needed
5. Click **"Add to Cart"**

### Managing Cart Items

- **Change Quantity**: Use +/- buttons or click the quantity number
- **Item Menu** (⋮): Click three dots on any item to:
  - Edit quantity
  - Apply item discount
  - Override price (requires permission)
  - Void item (requires permission + reason)

### Order Details

- **Add Customer**: Click "Add Customer" to select a customer
- **Order Type**: Choose Dine-in, Takeout, or Delivery
- **Notes**: Add special instructions
- **Discount**: Apply order-level discount (percentage or fixed amount)

---

## Barcode Scanner 🆕

### Quick Start

The Barcode Scanner allows you to quickly add products by scanning barcodes with a USB scanner or entering them manually.

### Using a USB Scanner (Recommended)

1. Click the green **"Scan"** button in the action bar
2. The scanner dialog opens with the input field auto-focused
3. **Scan** any product barcode with your USB scanner
4. Product is **automatically added** to cart!
5. Continue scanning more items

> **💡 Tip**: USB barcode scanners work like keyboards - they type the barcode and press Enter automatically!

### Manual Barcode Entry

1. Click the **"Scan"** button
2. Type the barcode or SKU number manually
3. Press **Enter** or click **"Scan"**
4. Product is added to cart if found

### Scanner Dialog Features

The scanner dialog has 3 tabs:

#### 1. Manual / USB Tab
- Input field for manual entry or USB scanning
- **Scan** button to process the barcode
- Instructions for USB scanner setup
- Auto-focus on input field for quick scanning

#### 2. Camera Tab
- Camera-based scanning (Coming Soon)
- Will support mobile camera scanning in future update

#### 3. History Tab
- Shows last 20 scans with success/failure status
- Displays:
  - Barcode/SKU number
  - Product name (if found)
  - Timestamp (e.g., "Just now", "5m ago")
  - Success ✅ or failure ❌ indicator
- **"Scan Again"** button for successful scans
- **"Clear History"** to remove all scan records

### Scanner Features

- ✅ Searches by **barcode** first
- ✅ Falls back to **SKU** if barcode not found
- ✅ Checks **variation SKUs** for products with variations
- ✅ **Success toast** with product name when found
- ✅ **Error toast** with barcode when not found
- ✅ **Scan history** tracking with timestamps
- ✅ Works on **desktop and mobile**

### Troubleshooting

**Product not found?**
- Verify the product has a barcode or SKU in the admin panel
- Try entering the SKU manually instead of the barcode
- Check if it's a variation SKU (e.g., "COF-001-M" for Coffee Medium)

**USB scanner not working?**
- Ensure the scanner is plugged in and powered on
- Click in the input field to ensure it's focused
- Test by scanning into a text editor first
- Some scanners require configuration - check your scanner manual

### Sample Barcodes for Testing

Use these barcodes to test the scanner:

- `0123456789012` - Organic Apples ($2.99)
- `0123456789029` - Whole Wheat Bread ($4.50)
- `0123456789036` - Free-Range Eggs ($5.20)
- `0123456789104` - Painkiller Tablets ($8.99)
- `FRT-001` - Organic Apples (by SKU)
- `COF-001-M` - Coffee Medium (variation SKU)

---

## Processing Payments

### Standard Checkout

1. Review items and total in cart
2. Click the green **"Charge"** button
3. Select payment method (Cash, Card, Cheque, Gift Card)
4. Enter payment details
5. Add tip if applicable (Dine-in only)
6. Click **"Complete Payment"**
7. Receipt is displayed

### Payment Methods

#### Cash
- Enter amount received
- Change is calculated automatically
- Opens cash drawer

#### Credit/Debit Card
- Process card through terminal
- Enter last 4 digits for reference
- No cash drawer opening

#### Cheque
- Enter check number for tracking
- Verify customer ID

#### Gift Card
- Enter or scan gift card code
- Balance is checked automatically
- Partial redemption supported

### Split Payments

Accept multiple payment methods for a single order:

1. Select first payment method
2. Enter partial amount
3. Click **"Add Payment"**
4. Repeat for additional methods
5. Complete when balance reaches $0.00

### Tipping

- Available for **Dine-in orders only**
- Quick percentages: 15%, 18%, 20%, 25%
- Or enter custom tip amount
- Tip is added to final total

---

## Advanced Features

### Returns & Refunds

1. Click **"Returns"** in action bar
2. Search for original transaction
3. Select items to return
4. Enter return reason
5. Process refund to original payment method

### Void Items

**Requires Permission** - All voids are logged!

1. Click item menu (⋮) in cart
2. Select **"Void Item"**
3. Enter reason (required)
4. Confirm void

> **⚠️ Important**: Voiding is different from removing - it creates an audit trail with your user ID, timestamp, and reason.

### Price Override

**May require manager approval**

1. Click item menu (⋮) in cart
2. Select **"Price Override"**
3. Enter new price
4. Enter reason (required)
5. Manager may need to approve with PIN

### Item Discounts

1. Click item menu (⋮) in cart
2. Select **"Item Discount"**
3. Choose percentage or fixed amount
4. Enter discount value
5. Preview shows new price

### Cash Drawer Operations

**No Sale (Open Drawer)**:
- Press **F10** to open drawer without a sale
- Logged as "No Sale" transaction

**Cash In/Out**:
1. Click **"Cash Drawer"**
2. Select "Cash In" or "Cash Out"
3. Enter amount and reason
4. **Cash In**: Adding money (e.g., starting float)
5. **Cash Out**: Removing money (e.g., safe drop)

### Parking Sales

Save current order and start a new one:

1. Click **"Park Sale"**
2. Current order is saved
3. Cart is cleared
4. Resume later: Click **"Park Sale"** → Select parked order

> **💡 Tip**: A badge shows the number of parked sales

---

## Keyboard Shortcuts

### General
- **F1** - Show keyboard shortcuts
- **F2** - Park current sale
- **F3** - Search products
- **Ctrl+K** - Quick search
- **Esc** - Close dialogs / Clear search

### Payment
- **F4** - Cash payment
- **F5** - Card payment
- **F6** - Process payment
- **Ctrl+T** - Add tip

### Orders
- **F7** - Recent orders
- **F8** - Process return
- **Ctrl+R** - Reload parked sale
- **Ctrl+N** - Clear cart / New order

### Cash Drawer
- **F9** - Open cash drawer
- **F10** - No sale (open drawer)
- **Ctrl+D** - Cash in/out

### Cart Actions
- **Delete** - Remove selected item
- **Ctrl+** - Increase quantity
- **Ctrl-** - Decrease quantity
- **Ctrl+I** - Apply item discount
- **Ctrl+P** - Price override

### Admin
- **F11** - View shift status summary
- **F12** - View transactions
- **Ctrl+L** - Lock screen
- **Ctrl+Shift+T** - Toggle training mode

---

## Training Mode

### What is Training Mode?

Training Mode allows you to practice using the POS without affecting real business data.

### When Training Mode is Enabled:

- ✅ Transactions are marked as "training"
- ✅ Inventory is **NOT** deducted
- ✅ Sales are **NOT** included in reports
- ✅ Financial records are **NOT** affected

### How to Enable

- Toggle the **"Training"** switch in the top header
- Or press **Ctrl+Shift+T**

### ⚠️ **CRITICAL WARNING**

**Always turn OFF Training Mode before processing real customer transactions!**

Transactions in training mode will NOT be recorded in your sales or financial data. Double-check the training indicator before processing real sales.

---

## Quick Tips

### Faster Checkout

1. **Use barcode scanner** for quick product lookup
2. **Press F4** for cash payment (skips dialog step)
3. **Use keyboard shortcuts** to speed up workflow
4. **Park sales** to handle multiple customers
5. **Set up quick-access categories** in product grid

### Best Practices

- ✅ Count your drawer at the start and end of shift
- ✅ Always enter a reason for voids and price overrides
- ✅ Use Training Mode when learning new features
- ✅ Double-check order before charging
- ✅ Verify customer information for returns
- ✅ Log out when leaving the terminal

### Common Issues

**Can't add product?**
- Check if product is in stock
- Verify product has a price set
- Ensure you're not in a locked state

**Barcode not scanning?**
- Click in the scanner input field
- Verify barcode is in the system
- Try entering the SKU manually

**Payment not processing?**
- Check that shift is started
- Verify payment amount covers total
- For split payments, ensure total is $0.00

**Cash drawer won't open?**
- Verify you have permission
- Check if shift is active
- Try "No Sale" (F10) if just testing

---

## Need More Help?

- **In-App Help**: Press **F1** or click the **?** icon
- **Admin Support**: Contact your store manager
- **Technical Issues**: Contact AuraFlow support

---

**End of User Guide**

*Last Updated: October 24, 2025*  
*Version: 2.5 - Barcode Scanner Update*
