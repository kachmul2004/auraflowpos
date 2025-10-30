# AuraFlow POS - Admin Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Products Management](#products-management)
4. [Inventory Management](#inventory-management)
5. [User Management](#user-management)
6. [Terminals Configuration](#terminals-configuration)
7. [Reports](#reports)
8. [Settings](#settings)

---

## Getting Started

### Accessing the Admin Dashboard

#### From Cashier Login Screen
1. Click the "Admin Login" button at the bottom of the login screen
2. Enter admin credentials
3. Click "Sign In"

#### From POS View
1. Click the "Admin" button in the top navigation bar
2. If you have an open shift, you'll be prompted to clock out first
3. Enter admin credentials when prompted

### Admin Login Credentials
- **Username**: admin
- **Password**: admin123

### Switching Back to POS
- Click "Back to POS" button in the sidebar
- You'll return to your active cashier session if one exists
- Otherwise, you'll be directed to the cashier login screen

---

## Dashboard Overview

The admin dashboard home provides:

### Quick Stats
- **Total Sales Today**: Real-time sales revenue
- **Orders Today**: Number of completed orders
- **Active Staff**: Currently clocked-in employees
- **Low Stock Items**: Products requiring restock

### Recent Activity
- Latest transactions
- Recent user logins
- System alerts

### Sales Chart
- Visual representation of sales trends
- Filter by day, week, or month

### Inventory Alerts
- Products with low stock (< 10 units)
- Out-of-stock items
- Quick links to inventory management

---

## Products Management

### Overview
The Products module uses a tabbed interface with three sections:
1. **Products** - Main product catalog
2. **Categories** - Product categorization
3. **Recipes** - Ingredient tracking (coming soon)

### Products Tab

#### Creating a New Product

1. Click "Add Product" button
2. Fill in required fields:
   - **Product Name** (required)
   - **SKU** - Stock keeping unit (searchable in POS)
   - **Barcode** - UPC/EAN barcode for scanner (🆕 NEW)
   - **Cost Price** - Your purchase/cost price
   - **Selling Price** (required) - Customer-facing price
   - **Category** (required) - Select from dropdown
   - **Stock Quantity** - Initial inventory count

3. Optional settings:
   - **Variable Weight/Price Product** - Enable for items sold by weight or with varying prices
   - **In Stock** - Toggle availability
   - **Description** - Additional product information

4. Click "Create Product"

#### Editing Products

1. Find product in the data table (use search if needed)
2. Click the edit icon (pencil) in the Actions column
3. Modify fields as needed
4. Click "Update Product"

#### Deleting Products

1. Find product in the table
2. Click the delete icon (trash) in the Actions column
3. Confirm deletion

**Note**: Products with active inventory may require additional confirmation.

#### Product Features

**Variable Products**
- Enable for products sold by weight (meat, produce)
- Enable for products with variable pricing
- System prompts for actual price/weight at checkout

**Cost Price**
- Used for profit margin calculations
- Not visible to customers
- Helps with financial reporting

**Product Variations** ✨ NEW
- Different sizes, colors, or styles of the same product
- Each variation has its own price and stock level
- Example: Coffee in Small, Medium, Large sizes

#### Creating Products with Variations

1. **Enable Variations**: Toggle "Product Has Variations" switch
2. **Set Variation Type**: Enter what varies (e.g., "Size", "Color", "Style")
3. **Add Variations**: Click "Add Variation" button for each variant
4. **Configure Each Variation**:
   - **Name** (required) - e.g., Small, Medium, Large
   - **Price** (required) - Individual price for this variation
   - **Stock** - Inventory count for this specific variation
   - **SKU** (optional) - Unique identifier for this variation
5. **Save Product**

**Example: Coffee Product with Size Variations**
- Variation Type: "Size"
- Variations:
  - Small: $3.50, 50 units, SKU: COF-001-S
  - Medium: $4.50, 30 units, SKU: COF-001-M
  - Large: $5.50, 20 units, SKU: COF-001-L

**Tips for Variations**:
- Use clear, consistent naming (Small/Medium/Large, not S/M/L)
- Set realistic stock levels per variation
- Use SKUs to track variations separately
- Main product price/stock fields are disabled when variations enabled
- Products table will show price range ($3.50 - $5.50) and variation count

**Modifiers**
- Add-ons and customizations
- Can have additional charges
- Example: Extra cheese, bacon, no onions

### Barcode Scanner Setup 🆕 NEW

The Barcode Scanner plugin allows cashiers to quickly add products by scanning barcodes with a USB scanner or manual entry.

#### Setting Up Products for Barcode Scanning

1. **Add Barcodes to Products**:
   - Edit each product in the Products tab
   - Enter the barcode number in the **Barcode** field
   - Use standard UPC, EAN-13, or EAN-8 format
   - Click "Update Product" to save

2. **Barcode Format Guidelines**:
   - **UPC**: 12 digits (e.g., `012345678905`)
   - **EAN-13**: 13 digits (e.g., `0123456789012`)
   - **EAN-8**: 8 digits (e.g., `01234567`)
   - Enter numbers only, no dashes or spaces

3. **SKU as Fallback**:
   - Products without barcodes can still be scanned using SKU
   - Scanner searches barcode first, then SKU
   - Recommended: Use both barcode and SKU for maximum flexibility

4. **Product Variations and Barcodes**:
   - Each variation can have its own SKU
   - Scanner will find product by variation SKU
   - Example: Coffee Medium (SKU: COF-001-M)
   - Barcode on main product searches all variations

#### Enabling the Barcode Scanner Plugin

1. Navigate to **Admin → Plugins**
2. Find "Barcode Scanner" in the plugin list
3. Ensure your subscription includes the plugin:
   - Available in **Professional** package and above
   - Included in **Ultimate** package
4. Toggle the plugin to "Active"
5. Scanner button appears in POS action bar

#### USB Barcode Scanner Configuration

**Recommended Hardware**:
- USB barcode scanners (keyboard wedge type)
- Supports UPC, EAN, Code 128, Code 39, QR codes
- No special drivers needed

**Setup Process**:
1. Connect USB scanner to computer
2. Test scanner by opening a text editor
3. Scan a barcode - it should type the number
4. If it works in text editor, it will work in POS

**Scanner Settings** (if configurable):
- Enable "Send Enter after scan"
- Disable any prefix/suffix characters
- Set to keyboard wedge mode
- Use USB-HID protocol

#### Best Practices for Barcodes

**Data Entry**:
- ✅ Enter barcodes exactly as they appear
- ✅ Use the barcode from product packaging
- ✅ Test scan after adding barcode
- ❌ Don't add dashes or formatting
- ❌ Don't use duplicate barcodes

**Testing**:
1. Add barcode to a test product
2. Click "Scan" button in POS
3. Scan the product
4. Verify product is added to cart
5. Check scan history in scanner dialog

**Bulk Import** (Coming Soon):
- Import products with barcodes from CSV
- Update existing products with barcodes
- Export product catalog with barcodes

#### Troubleshooting Barcode Scanner

**Scanner not working?**
- Verify scanner is plugged in and powered
- Test scanner in a text editor first
- Ensure POS scanner dialog input is focused
- Check scanner is in USB-HID mode

**Product not found?**
- Verify barcode is entered correctly in product
- Try manually entering the barcode in scanner
- Check if it's a variation - use variation SKU
- Verify product is set to "In Stock"

**Wrong product scanned?**
- Check for duplicate barcodes in system
- Verify barcode matches product packaging
- Update incorrect barcodes immediately

### Categories Tab

#### Creating Categories

1. Switch to "Categories" tab
2. Click "Add Category"
3. Fill in:
   - **Category Name** (required)
   - **Description** - Optional details
   - **Color** - Pick a color for visual identification
4. Click "Create Category"

#### Managing Categories

**Features**:
- Color coding for easy visual identification
- Product count shows items in each category
- Cannot delete categories with existing products

**Best Practices**:
- Use clear, descriptive names
- Choose distinct colors for each category
- Organize by department or product type

### Recipes Tab

**Status**: Coming Soon

This section will allow you to:
- Define ingredient lists for products
- Track ingredient inventory automatically
- Calculate recipe costs
- Manage recipe yields

---

## Inventory Management

### Overview

The Inventory module provides comprehensive stock management with:
- Real-time stock levels
- Low stock alerts
- Stock adjustment tracking
- Stock taking tools

### Dashboard Stats

- **Total Products** - Items in your inventory
- **Low Stock** - Items with < 10 units (amber alert)
- **Out of Stock** - Items with 0 units (red alert)

### Viewing Inventory

The main inventory table shows:
- Product name
- SKU
- Category
- Current stock quantity
- Stock status badge
- Quick action buttons

**Using the Table**:
- **Search** - Find products by name
- **Sort** - Click column headers to sort
- **Pagination** - Adjust items per page (default: 50)
- **Columns** - Toggle column visibility with the gear icon

### Stock Adjustments

#### Making Adjustments

1. Find the product in the inventory list
2. Click "Adjust Stock" button
3. Fill in the form:
   - **Current Stock** - Shown for reference (read-only)
   - **New Quantity** (required) - Enter the correct stock count
   - **Reason** (required) - Select from dropdown:
     - Stock Take
     - Damaged
     - Lost/Stolen
     - Stock Received
     - Customer Return
     - Correction
     - Other
   - **Notes** - Optional details

4. Review the adjustment summary (shows +/- change)
5. Click "Save Adjustment"

#### Adjustment Reasons

| Reason | When to Use |
|--------|-------------|
| Stock Take | Physical inventory count |
| Damaged | Broken or unusable items |
| Lost/Stolen | Missing inventory |
| Stock Received | New stock arrival |
| Customer Return | Items returned by customers |
| Correction | Fixing previous errors |
| Other | Any other scenario |

### Stock Taking

**Status**: Interface available, barcode integration coming soon

#### Process Overview

1. Click "Stock Taking" button
2. Count physical inventory
3. Enter actual counts
4. System compares with recorded stock
5. Review discrepancies
6. Apply adjustments

**Future Enhancement**: Barcode scanner support for faster counting

### Low Stock Alerts

**Automatic Alerts**:
- Products below 10 units show amber warning
- Products at 0 units show red alert
- Dashboard shows count of low stock items

**Best Practices**:
- Review low stock daily
- Set up reorder points
- Plan restocking before items run out

---

## User Management

### Overview

Manage staff accounts, permissions, and access control.

### User List

The user table displays:
- Full name
- Email address
- Role (with color-coded badge)
- PIN (hidden for security)
- Permission count
- Action buttons

### Creating Users

1. Click "Add User" button
2. Fill in user details:
   - **First Name** (required)
   - **Last Name** (required)
   - **Email** (required)
   - **PIN** - Auto-generated 6-digit number
   - **Role** - Select from dropdown:
     - Cashier - Basic POS access
     - Manager - Enhanced permissions
     - Admin - Full system access

3. Set permissions (check applicable boxes):
   - Process Sales
   - Void Items
   - Price Override
   - Process Returns
   - Cash Management
   - View Reports
   - Manage Products
   - Manage Users

4. Click "Create User"

### PIN Management

**Auto-Generation**:
- System generates random 6-digit PIN on user creation
- Click refresh icon to generate new PIN
- PINs must be exactly 6 digits

**Security**:
- PINs are hidden in the user list (shown as ••••••)
- Users can change their own PIN from profile dropdown
- Admins can reset PINs for any user

### User Roles

#### Cashier
- Access to POS interface
- Process sales and returns
- Limited administrative access
- Permissions can be customized

#### Manager
- All cashier permissions
- Manager override capability
- Access to reports
- Can approve restricted operations

#### Admin
- Full system access
- User management
- System configuration
- All reports and analytics
- Cannot be deleted

### Editing Users

1. Find user in the table
2. Click edit icon
3. Modify details
4. Update permissions as needed
5. Click "Update User"

### Deleting Users

- Regular users can be deleted
- Admin users cannot be deleted (system protection)
- Confirm deletion when prompted

**Warning**: Deleting a user removes their account but preserves transaction history for audit purposes.

### User Permissions

| Permission | Description |
|------------|-------------|
| Process Sales | Complete checkout transactions |
| Void Items | Remove items from orders |
| Price Override | Change product prices |
| Process Returns | Handle refunds and returns |
| Cash Management | Cash in/out operations |
| View Reports | Access sales reports |
| Manage Products | Add/edit products |
| Manage Users | Create/edit staff accounts |

---

## Terminals Configuration

### Overview

Configure point-of-sale terminals with custom settings and receipt templates.

### Terminal List

View all configured terminals with:
- Terminal name
- Associated users
- Receipt template
- Z-Report template
- Expense report template

### Creating Terminals

1. Click "Add Terminal"
2. Enter terminal details:
   - Terminal name (e.g., "Till 1", "Front Counter")
   - Location (optional)
   - Device ID (optional)

3. Configure receipt templates:
   - **Header** - Business info, logo, address
   - **Footer** - Thank you message, return policy
   - Format using plain text or basic formatting

4. Assign users to terminal
5. Click "Create Terminal"

### Receipt Templates

**Template Types**:
1. **Standard Receipt** - Customer purchase receipts
2. **Z-Report Template** - End-of-day reconciliation
3. **Expenses Template** - Cash in/out reports

**Customization Options**:
- Header text (business info)
- Footer text (thank you message)
- Include/exclude tax breakdown
- Show/hide barcode
- Add promotional messages

---

## Reports

### Available Reports

#### Sales Reports
- Sales by period (day, week, month)
- Sales by category
- Sales by product
- Sales by cashier
- Hourly sales patterns

#### Financial Reports
- Cash reconciliation
- Payment method breakdown
- Discount analysis
- Tax collection summary

#### Inventory Reports
- Stock levels
- Stock movement
- Low stock items
- Inventory valuation

#### Performance Reports
- Cashier performance
- Average transaction value
- Items per transaction
- Peak hours analysis

#### Void Reports
- Voided items by user
- Void reasons analysis
- Void patterns and trends

### Generating Reports

1. Select report type
2. Choose date range
3. Apply filters:
   - Category
   - Cashier
   - Terminal
   - Product
4. Click "Generate Report"
5. View results
6. Export to CSV/PDF (coming soon)

### Z-Reports

**End-of-Day Reconciliation**:
- Generated automatically at shift close
- Shows all sales activity
- Payment method breakdown
- Cash movements
- Voided items
- Cashier summary

---

## Settings

### Business Settings
- Business name and details
- Tax rates and tax settings
- Currency and regional settings
- Receipt footer messages

### Industry Selection
Choose your business type for optimized features:
- **Restaurant** - Table management, order types, tipping
- **Retail** - Barcode scanning, standard checkout
- **Pharmacy** - Prescription tracking
- **Furniture** - Custom orders, delivery
- **Grocery** - Weight-based items
- **Salon** - Service booking

### System Settings
- Theme (Light/Dark mode)
- Date and time format
- Default terminal
- Auto-logout timeout
- Training mode defaults

### Notifications
- Low stock alerts
- End-of-day reminders
- Error notifications
- System updates

---

## Best Practices

### Daily Operations
1. Review dashboard each morning
2. Check inventory alerts
3. Monitor sales trends
4. Review staff activity

### Weekly Tasks
1. Reconcile Z-Reports
2. Review inventory levels
3. Plan restocking
4. Analyze sales reports
5. Review void reports for patterns

### Monthly Reviews
1. Comprehensive sales analysis
2. Staff performance review
3. Inventory audits
4. Update product pricing
5. Review and update user permissions

### Data Management
1. Regular backups (when cloud sync available)
2. Archive old reports
3. Review and clean up old products
4. Update seasonal inventory

### Security
1. Regular PIN rotation for users
2. Review user permissions quarterly
3. Monitor void and override activities
4. Secure admin credentials
5. Enable training mode for new staff

---

## Keyboard Shortcuts

### Global
- `Ctrl/Cmd + K` - Quick search
- `F1` - Help
- `Esc` - Close dialogs

### Navigation
- `Alt + D` - Dashboard
- `Alt + P` - Products
- `Alt + I` - Inventory
- `Alt + U` - Users
- `Alt + R` - Reports

---

## Troubleshooting

### Common Issues

**Can't delete a category**
- Categories with products cannot be deleted
- Move or delete products first, then delete category

**Low stock alerts not showing**
- Check threshold setting (default: 10 units)
- Verify product stock quantities are accurate

**User can't access admin**
- Verify user has admin role
- Check isAdmin flag is set to true

**Reports showing incorrect data**
- Verify date range selection
- Check filter settings
- Ensure shift was properly closed

### Getting Help
- Press `F1` for in-app help
- Check documentation in `/docs` folder
- Contact support with detailed issue description

---

## Future Features

Coming soon to the admin dashboard:
- [ ] Advanced analytics with AI insights
- [ ] Custom report builder
- [ ] Scheduled reports via email
- [ ] Multi-store management
- [ ] Supplier portal
- [ ] Purchase order system
- [ ] Employee scheduling
- [ ] Customer loyalty management
- [ ] Barcode label printing
- [ ] Cloud backup and sync

---

**Last Updated**: January 13, 2025  
**Version**: 1.2.0