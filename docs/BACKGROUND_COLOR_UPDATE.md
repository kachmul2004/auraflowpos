# Background Color Update - Web Version Alignment

## Overview

Removed all adaptive/alpha-modified backgrounds and replaced them with solid colors from the web
version. This ensures pixel-perfect matching with the web design and consistent appearance across
all devices.

## Problem

The app was using `.copy(alpha = ...)` to create semi-transparent backgrounds in many places:

- `MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)`
- `MaterialTheme.colorScheme.primary.copy(alpha = 0.1f)`
- `Color(0xFFF59E0B).copy(alpha = 0.2f)`

**Issue:** Web version uses solid colors from `globals.css`, not alpha-blended ones.

## Solution

Replace all alpha-modified backgrounds with solid theme colors:

### Mapping

| ❌ Old (Adaptive) | ✅ New (Web Colors) |
|-------------------|---------------------|
| `surfaceVariant.copy(alpha = X)` | `surfaceVariant` (solid) |
| `primary.copy(alpha = 0.1f)` | `primaryContainer` or `surfaceVariant` |
| `outline.copy(alpha = 0.3f)` | `outlineVariant` or solid `outline` |
| Custom color + alpha | Use theme color directly |

### Web Color Reference

From `docs/Web Version/src/styles/globals.css`:

**Dark Mode:**

- `background`: `#1B191A`
- `card`: `#1B191A`
- `muted`: `#1B191A` (= surfaceVariant)
- `border`: `#3C3C40`

**Light Mode:**

- `background`: `#FFFFFF`
- `card`: `#FFFFFF`
- `muted`: `#F4F4F5` (= surfaceVariant)
- `border`: `#C8C8CD`

## Changes Made

### 1. Dialog Backgrounds

**Before:**

```kotlin
color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
```

**After:**

```kotlin
color = MaterialTheme.colorScheme.surfaceVariant  // Solid color
```

**Files Updated:**

- EditProfileDialog.kt
- QuickSettingsDialog.kt
- KeyboardShortcutsDialog.kt
- OrderNotesDialog.kt

### 2. Border Colors

**Before:**

```kotlin
MaterialTheme.colorScheme.outline.copy(alpha = 0.5f)
```

**After:**

```kotlin
MaterialTheme.colorScheme.outlineVariant  // Or solid outline
```

**Files Updated:**

- EditProfileDialog.kt
- QuickSettingsDialog.kt

### 3. Primary Container Backgrounds

**Before:**

```kotlin
MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.3f)
```

**After:**

```kotlin
MaterialTheme.colorScheme.surfaceVariant  // Web uses muted, not transparent primary
```

**Files Updated:**

- EditProfileDialog.kt
- QuickSettingsDialog.kt

### 4. Table Status Colors

**Before:**

```kotlin
TableStatus.Available -> Color(0xFF10B981).copy(alpha = 0.1f)
TableStatus.Occupied -> Color(0xFFEF4444).copy(alpha = 0.1f)
```

**After:**

```kotlin
TableStatus.Available -> MaterialTheme.colorScheme.surfaceVariant  // Solid background
TableStatus.Occupied -> MaterialTheme.colorScheme.surfaceVariant   // Use badge/text for color
```

**Files Updated:**

- TablesDialog.kt
- TableManagementScreen.kt

### 5. Skeleton Shimmer

**Kept as-is** - Shimmer effect legitimately needs gradient animation.

## Exceptions

These places correctly use alpha/transparency:

1. **Shimmer effects** - Animation requires gradient
2. **Disabled states** - Legitimately need reduced opacity
3. **Icon tints for inactive state** - Standard Material Design pattern
4. **Shadows/scrim** - Overlay effects

## Web Version Pattern

The web version uses:

- `bg-card` - Solid card color
- `bg-muted` - Solid muted color (= surfaceVariant)
- `bg-muted/50` - ONLY for hover states, not default backgrounds
- `opacity-50` - ONLY for disabled states and icons

## Verification

To verify correct implementation:

1. **Compare with web version** - Screenshots should match exactly
2. **Check theme colors** - All backgrounds use theme colors, not custom + alpha
3. **No .copy(alpha = ...)** - Except for legitimate use cases above

## Build Commands

```bash
# Full build
./gradlew :shared:build :composeApp:assembleDebug -x test --max-workers=4

# Fast build (development)
./gradlew :shared:build :composeApp:assembleDebug -x test --max-workers=4
```

## Files Modified

Total: ~10-15 files

**Dialogs:**

- EditProfileDialog.kt
- QuickSettingsDialog.kt
- KeyboardShortcutsDialog.kt
- OrderNotesDialog.kt
- EditCartItemDialog.kt
- CustomerSelectionDialog.kt

**Screens:**

- POSScreen.kt
- TableManagementScreen.kt

**Components:**

- TablesDialog.kt
- HelpDialog.kt

## Benefits

✅ **Pixel-perfect match** with web version
✅ **Consistent appearance** across all screens
✅ **Better performance** - No runtime alpha blending
✅ **Simpler code** - Direct color usage, no calculations
✅ **Theme-aware** - All colors from theme, easier to maintain

## Before/After Examples

### Example 1: Dialog Surface

**Before:**

```kotlin
Surface(
    color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
)
```

**After:**

```kotlin
Surface(
    color = MaterialTheme.colorScheme.surfaceVariant
)
```

### Example 2: Alert Container

**Before:**

```kotlin
Surface(
    color = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.3f)
)
```

**After:**

```kotlin
Surface(
    color = MaterialTheme.colorScheme.surfaceVariant
)
```

### Example 3: Border

**Before:**

```kotlin
border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.5f))
```

**After:**

```kotlin
border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant)
```

## Testing Checklist

- [ ] All dialogs match web version
- [ ] No visual regression in dark mode
- [ ] No visual regression in light mode
- [ ] Table status colors consistent
- [ ] No alpha-modified backgrounds (except legitimate cases)
- [ ] Borders visible and consistent
- [ ] All components use theme colors

---

**Status:** ✅ Ready for implementation
**Impact:** Better web design alignment, cleaner code
**Breaking Changes:** None (visual only)
