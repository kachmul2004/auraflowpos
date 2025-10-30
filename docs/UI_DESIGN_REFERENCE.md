# UI Design Reference Strategy

## 🎯 Design Source

All UI components in this Kotlin Multiplatform project MUST match the original AuraFlow POS designs
from the **local web version reference**.

**Source Location:** `docs/Web Version/src/android/`  
**Original Repository:** `kachmul2004/Auraflowposweb` (archived locally)

---

## 📁 Reference Files

### Theme & Colors

- **Path:** `docs/Web Version/src/android/theme/Color.kt`
- **Purpose:** Exact color values, naming conventions
- **Key Colors:** Purple500, Purple700, Pink500, Teal200, etc.

### Components

- **ProductCard:** `docs/Web Version/src/android/components/ProductCard.kt`
- **ProductGrid:** `docs/Web Version/src/android/components/ProductGrid.kt`
- **ShoppingCart:** `docs/Web Version/src/android/components/ShoppingCart.kt`
- **ActionBar:** `docs/Web Version/src/android/components/ActionBar.kt`
- **CategoryFilter:** `docs/Web Version/src/android/components/CategoryFilter.kt`
- **PaymentDialog:** `docs/Web Version/src/android/components/PaymentDialog.kt`
- **NumericKeypad:** `docs/Web Version/src/android/components/NumericKeypad.kt`

### Screens

- **POSScreen:** `docs/Web Version/src/android/screens/POSScreen.kt`

---

## ✅ Design Matching Process

For each component, we will:

1. **Read the original Kotlin/Android implementation** from `docs/Web Version/src/android/`
2. **Extract design specifications:**
    - Colors
    - Spacing (padding, margins)
    - Typography
    - Corner radius
    - Elevation/shadows
    - Icon sizes
    - Layout structure

3. **Translate to Compose Multiplatform:**
    - Convert Android-specific APIs to KMP equivalents
    - Use Material3 instead of Material2 where applicable
    - Maintain visual fidelity

4. **Verify pixel-perfect match:**
    - Compare screenshots
    - Check measurements
    - Validate interactions

---

## 🎨 Design System

Based on the local reference files in `docs/Web Version/src/android/`, the design system includes:

### Colors
- Primary: Purple shades
- Secondary: Pink/Teal accents
- Background: Neutrals
- Surface: Cards with elevation
- Error: Red variants

### Typography

- Font family: System default (Roboto on Android)
- Scale: Material3 type scale
- Weights: Regular, Medium, Bold

### Spacing

- Base unit: 4dp
- Common values: 8dp, 12dp, 16dp, 24dp, 32dp

### Shapes

- Small components: 8dp corner radius
- Cards: 12dp corner radius
- Buttons: 24dp (pill shape)

### Elevation

- Level 1: 2dp (cards)
- Level 2: 4dp (FABs)
- Level 3: 8dp (dialogs)

---

## 📝 Notes

- The local `docs/Web Version/src/android/` folder contains the authoritative design implementation
- Any discrepancies should be resolved in favor of these reference files
- Color names and values must exactly match the source
- Component layouts should be structurally identical

---

**Last Updated:** January 2025  
**Reference Source:** Local files in `docs/Web Version/src/android/`
