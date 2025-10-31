# AuraFlowPOS

**Full-stack Point of Sale System** for restaurants, retail, salons, and pharmacies.

Built with **Kotlin Multiplatform** targeting Android, iOS, Desktop (macOS/Windows/Linux), Web (
Wasm), and Server (Ktor).

---

## 🎉 **Project Status: MVP Complete (100%) + UI Polish Done!**

### ✅ **Recently Completed (December 2024)**

**Core Features:**

- ✅ Complete POS interface with product grid (5x5 pagination)
- ✅ Shopping cart with checkout flow
- ✅ Login + Clock In system (web-matching design)
- ✅ Customer management
- ✅ Order processing with receipts
- ✅ 10+ dialogs (Payment, Receipt, Customer, etc.)
- ✅ Dark/Light theme toggle (fully functional)

**UI Polish:**

- ✅ All backgrounds: `#1B191A` (dark mode)
- ✅ Product cards: `#2F2D2D` with subtle borders
- ✅ Borders: `#999999` (perfect balance, 60% white)
- ✅ Text colors: Conditional (visible in both themes)
- ✅ No double borders anywhere
- ✅ Shared borders throughout
- ✅ Clock In dialog on POS screen (correct flow)
- ✅ Single terminal design (no terminal selection)

### 🔄 **Currently In Progress (15% of Phase 2)**

**Next Up:**

- Action button functionality (CashDrawer, Lock, ParkedSales)
- Backend integration
- Shift management with opening/closing balance
- Real authentication with JWT

---

## 🏗️ **Architecture**

**Pattern:** Clean Architecture + MVVM  
**Offline-First:** Room database with WebSocket sync  
**Dependency Injection:** Koin

```
├── shared/                    # Shared KMP code
│   ├── domain/               # Business logic
│   ├── data/                 # Repositories & data sources
│   └── presentation/         # ViewModels
├── composeApp/               # Compose Multiplatform UI
│   ├── commonMain/           # Shared UI components
│   ├── androidMain/          # Android-specific
│   ├── iosMain/              # iOS-specific
│   └── desktopMain/          # Desktop-specific
├── server/                   # Ktor backend
└── docs/                     # Documentation
```

---

## 🎨 **Design System**

**Colors (Dark Mode):**

- Background: `#1B191A`
- Surface: `#1B191A`
- Product Cards: `#2F2D2D`
- Borders: `#999999` (60% white)
- Card Borders: `#808080` (50% white)
- Primary: `#A5D8F3`
- Text: `#F9FAFD`

**Colors (Light Mode):**

- Background: `#FFFFFF`
- Surface: `#FFFFFF`
- Borders: `#C8C8CD`
- Primary: `#18181B`
- Text: `#09090B`

**Typography:** Material3 defaults  
**Spacing:** 4dp base unit  
**Border Radius:** 8dp (cards), 6dp (buttons)

---

## 🚀 **Getting Started**

### Prerequisites

- JDK 17 or higher
- Android Studio Hedgehog or later
- Xcode 15+ (for iOS)
- Node.js 18+ (for Web)

### Build Commands

**Fast Development Build (Recommended):**

```bash
./gradlew :shared:build :composeApp:assembleDebug -x test --max-workers=4
```

Builds shared module + Android only, skips tests. Much faster!

**Full Build (All Platforms):**

```bash
./gradlew build
```

**Run Android:**

```bash
./gradlew :composeApp:installDebug
```

**Run Desktop:**

```bash
./gradlew :composeApp:run
```

---

## 📱 **Features**

### Core POS Functionality

- ✅ Product catalog with categories
- ✅ 5x5 product grid with pagination
- ✅ Shopping cart with item editing
- ✅ Multiple payment methods (Cash, Card, Other)
- ✅ Receipt generation and printing
- ✅ Customer management
- ✅ Order notes
- ✅ Dark/Light theme

### Dialogs & Modals

- ✅ Login + Clock In (opening balance)
- ✅ Payment processing
- ✅ Receipt preview
- ✅ Edit cart items
- ✅ Customer selection
- ✅ Order notes
- ✅ Edit profile
- ✅ Shift status
- ✅ Quick settings
- ✅ Keyboard shortcuts

### Action Bar (UI Complete, Wiring In Progress)

- 🔄 Clock Out → Shift summary
- 🔄 Lock → Security lock screen
- 🔄 Cash Drawer → Add/remove cash
- 🔄 Transactions → Order history
- 🔄 Returns → Process returns
- 🔄 Orders → Parked sales

---

## 🎯 **Roadmap**

### ✅ Phase 1: MVP (COMPLETE)

- Login, POS screen, cart, checkout
- Product grid, customer management
- All core dialogs
- Dark/Light theme

### 🔄 Phase 2: Professional Features (15% Complete)

- ✅ Theme toggle (functional)
- ✅ Login flow redesign (web-matching)
- ✅ UI polish (colors, borders, spacing)
- 🔄 Action button functionality
- 🔄 Backend integration
- 🔄 Shift management

### ⏳ Phase 3: Advanced Features (Not Started)

- Shift reports & Z-Reports
- Barcode scanning
- Kitchen display system
- Table management
- Multi-location support

See `docs/IMPLEMENTATION_ROADMAP.md` for details.

---

## 📚 **Documentation**

### Design References

- `docs/UI_DESIGN_REFERENCE.md` - Tailwind → Compose conversions
- `docs/Web Version/` - Complete web source (React + TypeScript)

### Implementation Guides

- `docs/THEME_TOGGLE_IMPLEMENTATION.md`
- `docs/LOGIN_FLOW_IMPLEMENTATION.md`
- `docs/CLOCK_IN_FLOW_FINAL.md`
- `docs/BACKGROUND_COLOR_UPDATE.md`
- `docs/ACTION_BUTTONS_IMPLEMENTATION_PLAN.md`

---

## 🧪 **Testing**

Run tests:

```bash
./gradlew test
```

Run specific platform tests:

```bash
./gradlew :shared:testDebugUnitTest
./gradlew :composeApp:testDebugUnitTest
```

---

## 🤝 **Contributing**

1. Follow Clean Architecture principles
2. Use Koin for dependency injection
3. Return `Result<T>` for operations that can fail
4. Never use `!!` operator - use `?.` with proper null handling
5. Always run `./gradlew build` before committing
6. Match web version designs pixel-perfectly

---

## 📄 **License**

Proprietary - All rights reserved

---

## 🙏 **Credits**

Built with:

- Kotlin Multiplatform
- Compose Multiplatform
- Ktor (Server & Client)
- Room Database
- Koin DI
- Material3 Design

Design inspired by web version in `docs/Web Version/`

---

**Current Version:** 0.1.0-alpha  
**Last Updated:** December 2024  
**Status:** ✅ MVP Complete, 🔄 Phase 2 In Progress