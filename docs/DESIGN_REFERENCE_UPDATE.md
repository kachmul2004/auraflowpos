# Design Reference Update - January 2025

## Change Summary

**Previous:** Referenced GitHub repo `kachmul2004/Auraflowposweb` via GitHub MCP  
**Now:** Using local files in `docs/Web Version/src/android/`

---

## What Changed

### ✅ Documentation Updated

1. **`docs/UI_DESIGN_REFERENCE.md`**
    - Updated all paths to point to `docs/Web Version/src/android/`
    - Changed strategy from "fetch from GitHub" to "read from local files"
    - Added note that files are archived locally

2. **`docs/NEXT_STEPS_UI_REDESIGN.md`**
    - Updated Phase 1 to read local files instead of downloading
    - Changed all references to point to local folder
    - Updated technical approach section

3. **`firebender.json`**
    - Added `designReference` section with complete file mappings
    - Updated all rules to reference local design files
    - Added `project` metadata
    - Added `important` reminders section
    - Removed GitHub references

---

## New Design Reference Structure

All design files are now in:

```
docs/Web Version/src/android/
├── theme/
│   ├── Color.kt           ← Color definitions
│   ├── Theme.kt           ← Material3 theme
│   └── Type.kt            ← Typography
├── components/
│   ├── ProductCard.kt     ← Product card design
│   ├── ProductGrid.kt     ← Grid layout
│   ├── ShoppingCart.kt    ← Cart UI
│   ├── ActionBar.kt       ← Top bar
│   ├── CategoryFilter.kt  ← Category chips
│   ├── PaymentDialog.kt   ← Checkout dialog
│   └── NumericKeypad.kt   ← Number pad
└── screens/
    └── POSScreen.kt       ← Main POS layout
```

---

## Key File Mappings (in firebender.json)

```json
{
  "designReference": {
    "source": "local",
    "path": "docs/Web Version/src/android/",
    "keyFiles": {
      "colors": "docs/Web Version/src/android/theme/Color.kt",
      "theme": "docs/Web Version/src/android/theme/Theme.kt",
      "typography": "docs/Web Version/src/android/theme/Type.kt",
      "components": {
        "productCard": "docs/Web Version/src/android/components/ProductCard.kt",
        "productGrid": "docs/Web Version/src/android/components/ProductGrid.kt",
        "shoppingCart": "docs/Web Version/src/android/components/ShoppingCart.kt",
        ...
      },
      "screens": {
        "posScreen": "docs/Web Version/src/android/screens/POSScreen.kt"
      }
    }
  }
}
```

---

## Benefits of Local Reference

### ✅ Faster Access

- No network calls to GitHub API
- No authentication required
- Instant file reading

### ✅ Always Available

- Works offline
- No API rate limits
- No token expiration

### ✅ Version Controlled

- Reference files are part of the repo
- Changes are tracked
- Easy to update reference if needed

### ✅ Simpler Workflow

- Direct file reading with standard tools
- No need for GitHub MCP
- Clear file paths

---

## How to Use

### For AI Assistant

When implementing UI components:

1. Read reference file from `docs/Web Version/src/android/`
2. Extract design specifications (colors, spacing, etc.)
3. Implement in KMP using the specs
4. Ensure pixel-perfect match

### For Developers

When adding new components:

1. Check `docs/Web Version/src/android/` for reference
2. Follow the existing design patterns
3. Maintain consistency with reference files
4. Document any deviations

---

## Updated Rules in firebender.json

### Theme Files (`**/ui/theme/**/*.kt`)

- ✅ Reference local design files for exact colors
- ✅ Match typography from local files
- ❌ No more GitHub references

### Component Files (`**/ui/components/**/*.kt`)

- ✅ Match component designs from local files
- ✅ Match spacing, padding, sizes from local files
- ❌ No more web app references

### Screen Files (`**/ui/screens/**/*.kt`)

- ✅ Reference POSView from local files
- ✅ Match three-column layout from local files
- ❌ No more GitHub URL references

---

## Important Reminders

From `firebender.json`:

```json
{
  "important": {
    "designSource": "ALWAYS read design specifications from docs/Web Version/src/android/ folder - this is the source of truth for all UI designs",
    "previewRequirement": "ALL @Composable functions MUST have corresponding @Preview functions in androidMain/preview/ folder",
    "buildCommand": "Run './gradlew build' at the end of coding sessions to verify compilation",
    "colorMatching": "Colors, spacing, typography, and layouts MUST pixel-perfect match the reference files"
  }
}
```

---

## Next Steps

Now that references are updated:

1. ✅ **Read reference files** - Start with `Color.kt`, `ProductCard.kt`
2. ✅ **Extract specifications** - Document colors, spacing, typography
3. ✅ **Update our components** - Match designs pixel-perfect
4. ✅ **Verify accuracy** - Compare our output with reference

---

## Files Updated

| File | Status | Description |
|------|--------|-------------|
| `docs/UI_DESIGN_REFERENCE.md` | ✅ Updated | Design reference strategy |
| `docs/NEXT_STEPS_UI_REDESIGN.md` | ✅ Updated | UI redesign action plan |
| `firebender.json` | ✅ Updated | Rules and reference mappings |
| `docs/DESIGN_REFERENCE_UPDATE.md` | ✅ Created | This summary document |

---

**Status:** ✅ Complete  
**Date:** January 2025  
**Impact:** All future UI work will use local design files  
**Benefit:** Faster, more reliable design reference

---

*All design specifications are now sourced from `docs/Web Version/src/android/`*
