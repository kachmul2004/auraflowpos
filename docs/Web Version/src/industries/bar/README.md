# Bar & Nightclub Industry Configuration

AuraFlow POS for bars, pubs, nightclubs, and lounges - optimized for high-volume beverage service with compliance and customer management features.

## Overview

The Bar & Nightclub preset is specifically designed for alcohol-focused establishments, providing all the essential tools needed to run a successful bar operation without requiring the Ultimate version.

**Frontend:** A complete bar-optimized interface with quick drink ordering, tab management, and section visualization. See [FRONTEND_IMPLEMENTATION.md](./FRONTEND_IMPLEMENTATION.md) for details.

## Included Features (Standard Tier)

### ✅ Core Bar Features

- **Age Verification** - Required for alcohol sales with compliance logging
- **Open Tabs** - Keep customer tabs open throughout their visit
- **Split Checks** - Split bills by item, evenly, or custom amounts
- **Table Management** - Manage bar seats, tables, booths, and VIP sections
- **Quick Drink Ordering** - Fast, intuitive drink selection
- **Drink Modifiers** - Pre-configured modifiers (rocks, neat, mixers, etc.)

### 🔐 Compliance & Safety

- **Age Verification**
  - Manual ID verification with date of birth entry
  - Optional ID scanner integration
  - Compliance logging for all verifications
  - Configurable minimum age (default: 21)
  - Service refusal logging

- **Alcohol Sales Hours**
  - Configurable service hours by day of week
  - Automatic blocking outside legal hours
  - Regional compliance support

- **Responsible Service**
  - Max drinks per transaction (configurable)
  - Incident reporting
  - Service refusal logging

### 💳 Tab Management

- **Open Tabs**
  - Credit card pre-authorization
  - Multiple tabs per customer
  - Tab duration tracking (default: 12 hours)
  - Warning thresholds for large tabs
  - Auto-gratuity for large parties

- **Payment Flexibility**
  - Split by drink
  - Split evenly
  - Pay custom amount
  - Quick 2/3/4-way split buttons
  - Card holds for open tabs

### 🍺 Drink Service

- **Product Categories**
  - Beer (draft, bottles, cans)
  - Wine (by glass, by bottle)
  - Spirits (well, call, premium, top shelf)
  - Cocktails
  - Non-alcoholic beverages
  - Food (if applicable)

- **Drink Modifiers**
  - Serving style: Rocks, Neat, Frozen, Blended
  - Size: Single, Double, Pitcher
  - Mixers: Coke, Sprite, Tonic, Soda, Juice
  - Special requests: Salt/Sugar rim, Extra garnish, Ice preferences

- **Quick Service**
  - Favorite drinks quick access
  - Recent orders
  - One-tap common drinks
  - Batch ordering for rounds

### 🎯 Table & Section Management

- **Floor Plan**
  - Visual table layout
  - Multiple sections: Main Bar, High Tops, Lounge, Patio, VIP
  - Table types: Bar Seats, Tables, Booths, VIP Sections
  - Real-time table status

- **VIP Services**
  - Bottle service tracking
  - Reserved sections
  - Premium pricing tiers

### 📊 Inventory Management

- **Bar-Specific Tracking**
  - Track by bottle/keg
  - Pour cost tracking
  - Low stock alerts
  - Waste tracking (spills, comps)
  - Inventory by section (bar vs. storage)

### 🎫 Order Types

1. **Bar** 🍺 - Direct bar service
2. **Table Service** 🍽️ - Wait staff table service
3. **Bottle Service** 🍾 - Premium VIP service
4. **To-Go** 🥤 - Takeout drinks (where legal)

## Getting Started

### Quick Setup

1. **Select Bar Preset**
   ```
   Admin Dashboard → Settings → Preset → Bar & Nightclub
   ```

2. **Configure Compliance**
   ```
   Settings → Age Verification
   - Set minimum age (default: 21)
   - Enable/disable ID scanning
   - Configure logging preferences
   ```

3. **Set Service Hours**
   ```
   Settings → Compliance
   - Configure alcohol service hours
   - Set by day of week
   - Account for local laws
   ```

4. **Add Your Products**
   ```
   Admin Dashboard → Products
   - Create categories: Beer, Wine, Spirits, Cocktails
   - Add modifiers for each category
   - Set pricing tiers (well, call, premium)
   ```

5. **Configure Tabs**
   ```
   Settings → Open Tabs
   - Set credit card authorization amount
   - Configure auto-gratuity threshold
   - Set tab duration limits
   ```

### Recommended Product Setup

#### Beer
- Category: Beer
- Modifiers: Draft/Bottle/Can, Size (Pint/Glass/Pitcher)
- Track inventory by keg/case

#### Wine
- Category: Wine
- Modifiers: By Glass/By Bottle, Red/White/Rosé
- Track by bottle

#### Spirits
- Category: Spirits
- Modifiers: Well/Call/Premium/Top Shelf, Rocks/Neat, Mixers
- Track by bottle, 1.25oz pour

#### Cocktails
- Category: Cocktails
- Modifiers: Size, Special requests
- Recipe tracking for consistency

## Bar-Specific Workflows

### Opening a Tab

1. Customer orders first drink
2. Age verification (if first transaction)
3. Select "Open Tab"
4. Swipe/hold customer's credit card
5. Pre-authorize card ($1.00 default)
6. Continue adding drinks to tab
7. Close tab when customer ready to leave

### Age Verification

**First Transaction:**
1. System prompts for age verification
2. Choose verification method:
   - Manual: Enter DOB from ID
   - Scan: Use ID scanner hardware
3. Verify customer is 21+
4. Log verification
5. Proceed with sale

**Subsequent Transactions:**
- Same customer - no re-verification needed
- System remembers verified customers per session

### Split Check

**By Drink:**
1. Open tab or complete order
2. Select "Split Check"
3. Assign each drink to person A, B, C, etc.
4. Process payments individually

**Evenly:**
1. Select "Split Evenly"
2. Choose number of people (2/3/4 or custom)
3. System divides total evenly
4. Process each payment

**Custom Amount:**
1. Select "Pay Amount"
2. Enter specific dollar amount
3. Remaining balance stays on tab/check

### Bottle Service (VIP)

1. Customer books VIP section
2. Assign table in VIP section
3. Create order with "Bottle Service" type
4. Add bottles, mixers, and service charge
5. Apply auto-gratuity (typically 18-20%)
6. Keep tab open for duration
7. Close when customer ready

## Compliance Best Practices

### Age Verification
- ✅ **ALWAYS** check ID for alcohol purchases
- ✅ Verify ID is valid government-issued photo ID
- ✅ Verify birthdate shows customer is 21+
- ✅ Log all verifications for compliance
- ✅ Refuse service if suspicious or underage
- ✅ Document all refusals

### Service Hours
- ✅ Know your local alcohol service laws
- ✅ Configure system to block sales outside legal hours
- ✅ Stop service at required cut-off time
- ✅ Account for last call procedures

### Responsible Service
- ✅ Monitor customer consumption
- ✅ Refuse service to intoxicated customers
- ✅ Offer water and non-alcoholic options
- ✅ Call taxis/rideshares for impaired customers
- ✅ Log incidents and refusals
- ✅ Train staff on responsible beverage service

## Hardware Recommendations

### Essential
- **Touchscreen POS Terminal** - Fast order entry
- **Receipt Printer** - Customer receipts
- **Card Reader** - Credit card processing
- **Cash Drawer** - Cash management

### Recommended
- **ID Scanner** - Automated age verification
- **Kitchen Printer** - If serving food
- **Handheld Devices** - Server tablets for table service
- **Label Printer** - Drink labels for servers

### Optional
- **Digital Displays** - Kitchen display system
- **Scale** - Pour cost verification
- **Camera System** - Security and compliance

## Tips for Success

### Speed of Service
- Pre-program popular drinks as favorites
- Use quick modifiers (double tap for double)
- Train staff on keyboard shortcuts
- Keep well-stocked inventory at bar
- Use handheld devices for table service

### Revenue Maximization
- Track pour costs to ensure profitability
- Monitor waste and comps
- Use suggested pricing based on cost
- Implement happy hour pricing (coming soon)
- Upsell premium spirits
- Promote bottle service

### Customer Experience
- Fast tab opening and closing
- Easy split checks
- Clear itemized receipts
- Smooth payment processing
- VIP service tracking

### Inventory Control
- Daily bottle counts
- Track waste and spills
- Monitor theft with variance reports
- Set par levels for auto-ordering
- Rotate stock (FIFO)

## Support for Bar-Specific Needs

### Coming Soon
- **Happy Hour Pricing** - Time-based automatic discounts
- **Loyalty Program** - Rewards for repeat customers
- **Reservation System** - VIP section booking
- **Event Management** - Special events and promotions
- **Advanced Inventory** - Real-time stock tracking

### Available Now in Ultimate
- All Standard features plus:
- Multi-location management
- Advanced analytics
- Custom reporting
- API integrations
- Priority support

## Legal Disclaimer

⚠️ **Important:** This software is a tool to assist with compliance but does NOT guarantee compliance with all local, state, and federal alcohol laws. It is the responsibility of the business owner and staff to:

- Know and follow all applicable laws
- Obtain proper licenses and permits
- Train staff on responsible beverage service
- Refuse service when appropriate
- Maintain proper insurance coverage

Consult with legal counsel to ensure full compliance with your jurisdiction's alcohol laws.

## Need Help?

- 📖 [User Guide](../../docs/USER_GUIDE.md)
- 🎓 [Training Videos](#) (Coming Soon)
- 💬 [Community Forum](#) (Coming Soon)
- 📧 Support: support@auraflow.com

---

**Industry:** Bar & Nightclub  
**Preset ID:** `bar`  
**Tier:** Standard  
**Last Updated:** 2025-01-29
