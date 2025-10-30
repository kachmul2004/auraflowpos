# UI Design Reference Strategy

## 🎯 Design Source

All UI components in this Kotlin Multiplatform project MUST match the original AuraFlow POS designs
from the **web version TypeScript/React components**.

**Source Location:** `docs/Web Version/src/`  
**Original Repository:** `kachmul2004/Auraflowposweb` (archived locally)  
**Languages:** TypeScript (.tsx) and CSS

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

## 📝 Notes

- The TypeScript/React components in `docs/Web Version/src/` are the authoritative design reference
- Color names and values must be extracted from the CSS files
- Component layouts should be structurally identical to the web versions
- When in doubt, refer to the actual component JSX/TSX code

---

**Last Updated:** January 2025  
**Reference Source:** TypeScript/React components in `docs/Web Version/src/`  
**Format:** .tsx files with embedded CSS
