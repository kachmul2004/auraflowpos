# UI Design Reference Strategy

## 🎯 Design Source

All UI components in this Kotlin Multiplatform project MUST match the original AuraFlow POS designs
from the **web version TypeScript/React components**.

**Source Location:** `docs/Web Version/src/`  
**Original Repository:** `kachmul2004/Auraflowposweb` (archived locally)  
**Languages:** TypeScript (.tsx) and CSS

---

## 📋 **DESIGN REFERENCE PROCESS (FOLLOW THIS EVERY TIME!)**

### **Step 1: Find the Component**

When implementing ANY component, ALWAYS:

1. **Check the web version first**: `docs/Web Version/src/components/`
2. **Find the exact component file**: e.g., `TopAppBar`, `ShoppingCart`, `ProductCard`
3. **Read the TSX file completely** to understand:
    - Component structure
    - Props/parameters
    - State management
    - User interactions

### **Step 2: Extract Design Specifications**

From the TSX file, extract:

#### **A. Layout & Dimensions**

```tsx
// Example from ShoppingCart.tsx line 100:
<div className="w-full lg:w-96 lg:border-l border-border flex flex-col h-full bg-card">
```

**Translation:**

- `w-full` = fillMaxWidth()
- `lg:w-96` = width(384.dp) on desktop (96 * 4px = 384px)
- `flex flex-col` = Column()
- `h-full` = fillMaxHeight()

#### **B. Tailwind to Kotlin/Compose Conversion**

**Width Classes:**

- `w-full` → `Modifier.fillMaxWidth()`
- `w-96` → `Modifier.width(384.dp)` (96 * 4px)
- `w-80` → `Modifier.width(320.dp)` (80 * 4px)
- `w-64` → `Modifier.width(256.dp)` (64 * 4px)
- `w-1/2` → `Modifier.weight(0.5f)` or `fillMaxWidth(0.5f)`
- `flex-1` → `Modifier.weight(1f)` (takes remaining space)

**Spacing:**

- `gap-2` → `Arrangement.spacedBy(8.dp)` (2 * 4px)
- `gap-4` → `Arrangement.spacedBy(16.dp)` (4 * 4px)
- `p-4` → `Modifier.padding(16.dp)` (4 * 4px)
- `px-2` → `Modifier.padding(horizontal = 8.dp)`
- `py-3` → `Modifier.padding(vertical = 12.dp)`

**Font Sizes:**

- `text-xs` → `fontSize = 12.sp`
- `text-sm` → `fontSize = 14.sp`
- `text-base` → `fontSize = 16.sp`
- `text-lg` → `fontSize = 18.sp`
- `text-xl` → `fontSize = 20.sp`

#### **C. Icons - Lucide to Material Icons**

**From web version header (lines 435-506 in POSView.tsx):**

| Web (Lucide)                      | Material Icons                                | Usage             |
|-----------------------------------|-----------------------------------------------|-------------------|
| `<HelpCircle />`                  | `Icons.Default.Help`                          | Help button       |
| `<User />`                        | `Icons.Default.TableChart`                    | Tables button     |
| `<Shield />`                      | `Icons.Default.AdminPanelSettings`            | Admin button      |
| `<Maximize2 />` / `<Minimize2 />` | `Icons.Default.Fullscreen` / `FullscreenExit` | Fullscreen toggle |
| `<Sun />` / `<Moon />`            | `Icons.Default.WbSunny` / `Brightness3`       | Theme toggle      |
| `<GraduationCap />`               | `Icons.Default.School`                        | Training mode     |

**Icon Size Patterns:**

- Small icons: `w-3 h-3` → `Modifier.size(12.dp)`
- Regular icons: `w-4 h-4` → `Modifier.size(16.dp)`
- Large icons: `w-5 h-5` → `Modifier.size(20.dp)`

### **Step 3: Layout Proportions**

**From POSView.tsx (lines 537-575):**

```tsx
<div className="flex-1 flex overflow-hidden">
  {/* Left: Product Grid */}
  <div className="flex-1 flex flex-col overflow-hidden">
    ...
  </div>
  
  {/* Right: Shopping Cart */}
  <div className="hidden lg:block">
    <ShoppingCart />
  </div>
</div>
```

**Breakdown:**

- Product Grid: `flex-1` → Takes ALL remaining space
- Shopping Cart: Fixed width in component (`w-96` = 384dp)
- **NOT 70/30 split** - It's **"remaining space"** + **"fixed 384dp"**

**Kotlin Implementation:**

```kotlin
Row {
    // Products: Takes remaining space
    Column(modifier = Modifier.weight(1f)) {
        ProductGrid(...)
    }
    
    VerticalDivider()
    
    // Cart: Fixed 384dp
    ShoppingCart(modifier = Modifier.width(384.dp))
}
```

---

## 📁 Reference Files

### Styles & Theme

- **Globals CSS:** `docs/Web Version/src/styles/globals.css`
- **Component Styles:** `docs/Web Version/src/components/` (CSS files with components)
- **Purpose:** Exact color values, spacing, typography, themes

### Components

Component references are located in `docs/Web Version/src/components/`:

- **ProductCard:** Look for product card component (50/50 horizontal split, stock badge)
- **ProductGrid:** Grid layout for displaying products
- **ShoppingCart:** Cart container with items list
- **ActionBar:** Top navigation bar
- **CategoryFilter:** Category chips for filtering
- **PaymentDialog:** Payment method selection
- **NumericKeypad:** Number input pad

### Screens

- **POSView:** Main POS screen layout (grid + cart + actions)
- **CheckoutView:** Checkout/payment screen
- **OrderHistoryView:** Order history list
- **LoginView:** Login/authentication screen

---

## ✅ Design Matching Process

For each component, we will:

1. **Read the original TypeScript/React implementation** from `docs/Web Version/src/components/`
2. **Extract design specifications from CSS/JSX:**
   - Colors (hex values from globals.css)
   - Spacing (padding, margins, gaps)
   - Typography (font sizes, weights, line heights)
   - Corner radius (border-radius)
   - Elevation/shadows (box-shadow)
    - Icon sizes
   - Layout structure (flexbox layout)

3. **Translate to Compose Multiplatform:**
   - Convert HTML/CSS to Compose Modifiers
   - Convert React hooks to Kotlin StateFlow
   - Convert TypeScript types to Kotlin data classes
    - Maintain visual fidelity

4. **Verify pixel-perfect match:**
    - Compare screenshots
    - Check measurements
    - Validate interactions

---

## 🎨 **REAL EXAMPLES FROM THIS PROJECT**

### **Example 1: Top App Bar Icons**

**Step 1 - Find in web:**

```tsx
// docs/Web Version/src/components/POSView.tsx:435
<HelpCircle className="w-3 h-3 md:w-4 md:h-4" />
```

**Step 2 - Convert:**

```kotlin
Icon(
    imageVector = Icons.Default.Help,
    modifier = Modifier.size(16.dp) // w-4 h-4 = 16dp
)
```

### **Example 2: Cart Width**

**Step 1 - Find in web:**

```tsx
// docs/Web Version/src/components/ShoppingCart.tsx:100
<div className="w-full lg:w-96 lg:border-l ...">
```

**Step 2 - Convert:**

```kotlin
ShoppingCart(
    modifier = Modifier.width(384.dp) // lg:w-96 = 96*4 = 384dp
)
```

### **Example 3: Product Grid Layout**

**Step 1 - Find in web:**

```tsx
// POSView.tsx
<div className="flex-1 flex flex-col overflow-hidden">
```

**Step 2 - Convert:**

```kotlin
Column(
    modifier = Modifier
        .weight(1f) // flex-1 = take remaining space
        .fillMaxHeight()
)
```

---

## 🎨 Design System

Based on the TypeScript/React components in `docs/Web Version/src/`, the design system includes:

### Colors (from globals.css)

**Dark Mode (default `:root`):**

- Background: `#0E1729` (dark blue)
- Card/Surface: `#1E293A` (darker blue)
- Primary: `#A5D8F3` (light blue)
- Foreground/Text: `#F9FAFD` (light text)
- Border: `#3C3C40` (dark gray)
- Muted: `#334155` (muted gray)

**Light Mode (`.light`):**

- Background: `#FFFFFF` (white)
- Card/Surface: `#FFFFFF` (white)
- Primary: `#18181B` (dark/black)
- Foreground/Text: `#09090B` (very dark text)
- Border: `#C8C8CD` (light gray)
- Muted: `#F1F5F9` (light gray background)

### Typography

- Font family: System default (Roboto on Android)
- Scale: Material3 type scale
- Weights: Regular, Medium, Bold
- Sizes: 12sp, 13sp, 14sp, 15sp, 16sp, 18sp, etc.

### Spacing

- Base unit: 4dp
- Common values: 8dp, 12dp, 16dp, 20dp, 24dp, 32dp

### Shapes

- Small components: 6dp-8dp corner radius
- Cards: 8dp-12dp corner radius
- Buttons: 6dp-8dp corner radius

### Elevation

- Cards: 0dp (flat) or subtle shadow
- Hover states: Subtle shadow increase
- Dialogs: Elevated shadow

---

## 📝 **CHECKLIST FOR EVERY NEW COMPONENT**

Before implementing ANY component, complete this checklist:

- [ ] **1. Found the web version file** in `docs/Web Version/src/components/`
- [ ] **2. Read the entire TSX file** to understand structure
- [ ] **3. Extracted layout dimensions** (width, height, flex properties)
- [ ] **4. Identified all icons** and mapped to Material Icons
- [ ] **5. Noted spacing values** (gap, padding, margin)
- [ ] **6. Extracted font sizes** and converted to sp
- [ ] **7. Listed all colors** used
- [ ] **8. Understood user interactions** (click, hover, etc.)
- [ ] **9. Created Kotlin implementation** matching exactly
- [ ] **10. Tested with preview** to verify visual match

---

## 📝 Notes

- The TypeScript/React components in `docs/Web Version/src/` are the authoritative design reference
- Color names and values must be extracted from the CSS files
- Component layouts should be structurally identical to the web versions
- When in doubt, refer to the actual component JSX/TSX code
- **ALWAYS check Tailwind classes for exact measurements** - don't guess!

---

**Last Updated:** October 31, 2025  
**Reference Source:** TypeScript/React components in `docs/Web Version/src/`  
**Format:** .tsx files with embedded CSS

