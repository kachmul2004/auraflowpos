# Kotlin Multiplatform - Compose Previews Guide

## 🎯 Key Rule: Previews in androidMain ONLY

In Kotlin Multiplatform projects, **@Preview annotations ONLY work in `androidMain`**, not in
`commonMain`.

---

## ✅ Correct Structure

### 1. Components in commonMain (NO @Preview)

```kotlin
// composeApp/src/commonMain/kotlin/com/theauraflow/pos/ui/components/ProductCard.kt
package com.theauraflow.pos.ui.components

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

@Composable
fun ProductCard(
    product: Product,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    // Component implementation
    // ❌ NO @Preview annotation here
}
```

### 2. Previews in androidMain

```kotlin
// composeApp/src/androidMain/kotlin/com/theauraflow/pos/preview/ComponentPreviews.kt
package com.theauraflow.pos.preview

import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import com.theauraflow.pos.ui.components.ProductCard
import com.theauraflow.pos.ui.theme.AuraFlowTheme

// ✅ Previews in androidMain work!
@Preview(name = "Product Card - Light", showBackground = true)
@Composable
private fun ProductCardPreview() {
    AuraFlowTheme {
        ProductCard(
            product = sampleProduct,
            onClick = {}
        )
    }
}

@Preview(name = "Product Card - Dark", showBackground = true)
@Composable
private fun ProductCardPreviewDark() {
    AuraFlowTheme(darkTheme = true) {
        ProductCard(
            product = sampleProduct,
            onClick = {}
        )
    }
}
```

---

## ❌ Wrong Structure

```kotlin
// composeApp/src/commonMain/.../ProductCard.kt
@Composable
fun ProductCard(...) { }

@Preview  // ❌ This won't work in commonMain!
@Composable
private fun ProductCardPreview() { }
```

**Why it fails:**

- `@Preview` is an Android-specific annotation
- commonMain can't use Android-specific APIs
- Android Studio won't show these previews

---

## 📁 Recommended File Structure

```
composeApp/
├── src/
│   ├── commonMain/
│   │   └── kotlin/
│   │       └── com/theauraflow/pos/
│   │           ├── ui/
│   │           │   ├── components/
│   │           │   │   ├── ProductCard.kt       ✅ Component (no previews)
│   │           │   │   └── CartItemCard.kt      ✅ Component (no previews)
│   │           │   └── screen/
│   │           │       ├── POSScreen.kt         ✅ Screen (no previews)
│   │           │       └── LoginScreen.kt       ✅ Screen (no previews)
│   │           └── theme/
│   │               ├── Color.kt
│   │               └── Theme.kt
│   │
│   └── androidMain/
│       └── kotlin/
│           └── com/theauraflow/pos/
│               ├── MainActivity.kt
│               └── preview/                      ✅ All previews here!
│                   ├── ComponentPreviews.kt     ✅ Component previews
│                   ├── ScreenPreviews.kt        ✅ Screen previews
│                   └── ThemePreviews.kt         ✅ Theme previews
```

---

## 🎨 Preview Templates

### Component Preview

```kotlin
// androidMain/.../preview/ComponentPreviews.kt
package com.theauraflow.pos.preview

import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import com.theauraflow.pos.ui.components.MyComponent
import com.theauraflow.pos.ui.theme.AuraFlowTheme

@Preview(name = "My Component - Default", showBackground = true)
@Composable
private fun MyComponentPreview() {
    AuraFlowTheme {
        MyComponent(
            data = mockData,
            onClick = {}
        )
    }
}
```

### Screen Preview (with Mock ViewModels)

```kotlin
// androidMain/.../preview/ScreenPreviews.kt
package com.theauraflow.pos.preview

import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import com.theauraflow.pos.ui.screen.POSScreen
import com.theauraflow.pos.ui.theme.AuraFlowTheme

@Preview(name = "POS Screen", showBackground = true, device = "spec:width=1280dp,height=800dp")
@Composable
private fun POSScreenPreview() {
    AuraFlowTheme {
        // Use mock ViewModels for previews
        POSScreen(
            productViewModel = MockProductViewModel(),
            cartViewModel = MockCartViewModel()
        )
    }
}
```

### Theme Preview

```kotlin
// androidMain/.../preview/ThemePreviews.kt
package com.theauraflow.pos.preview

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.theauraflow.pos.ui.theme.*

@Preview(name = "Colors - Light", showBackground = true)
@Composable
private fun ColorsLightPreview() {
    AuraFlowTheme(darkTheme = false) {
        ColorPalette()
    }
}

@Preview(name = "Colors - Dark", showBackground = true)
@Composable
private fun ColorsDarkPreview() {
    AuraFlowTheme(darkTheme = true) {
        ColorPalette()
    }
}

@Composable
private fun ColorPalette() {
    Column(
        modifier = Modifier.padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Surface(color = Primary) { Box(Modifier.size(50.dp)) }
        Surface(color = Secondary) { Box(Modifier.size(50.dp)) }
        Surface(color = Tertiary) { Box(Modifier.size(50.dp)) }
        // ... more colors
    }
}
```

---

## 📱 Preview Parameters

Use `@Preview` parameters for better control:

```kotlin
@Preview(
    name = "Product Card - Tablet",
    showBackground = true,
    backgroundColor = 0xFFFAFAFA,
    widthDp = 600,
    heightDp = 400,
    device = "spec:width=600dp,height=800dp,dpi=240",
    showSystemUi = false,
    uiMode = Configuration.UI_MODE_NIGHT_YES
)
@Composable
private fun ProductCardTabletPreview() {
    // Preview content
}
```

---

## 🔄 Migration Checklist

If you have existing previews in commonMain:

- [ ] Create `androidMain/.../preview/` package
- [ ] Move all `@Preview` functions to androidMain
- [ ] Remove `@Preview` from commonMain components
- [ ] Update imports (use `androidx.compose.ui.tooling.preview.Preview`)
- [ ] Keep composables in commonMain (no changes needed)
- [ ] Rebuild project
- [ ] Verify previews show in Android Studio

---

## 🐛 Troubleshooting

### Preview Not Showing

**Problem:** Preview pane is empty or shows "No preview found"

**Solutions:**

1. Verify preview is in `androidMain` (not `commonMain`)
2. Rebuild project (`Build > Rebuild Project`)
3. Invalidate caches (`File > Invalidate Caches > Invalidate and Restart`)
4. Check the function is `private` or `internal`
5. Ensure `@Preview` is imported from `androidx.compose.ui.tooling.preview.Preview`

### Preview Shows Error

**Problem:** "Cannot resolve symbol" or "Unresolved reference"

**Solutions:**

1. Sync Gradle files
2. Check imports are correct
3. Verify mock data exists
4. Ensure theme is imported

### Interactive Mode Not Working

**Problem:** Clicks in preview don't work

**Solution:**

- Use "Deploy to Device" instead
- Previews are static by default
- Use `@Preview(showSystemUi = true)` for better interaction simulation

---

## 📚 Best Practices

1. **One preview file per feature area**
    - `ComponentPreviews.kt` for all components
    - `ScreenPreviews.kt` for all screens
    - `ThemePreviews.kt` for theme showcase

2. **Always show both light and dark modes**
   ```kotlin
   @Preview(name = "Light")
   @Preview(name = "Dark", uiMode = Configuration.UI_MODE_NIGHT_YES)
   @Composable
   fun MyPreview() { }
   ```

3. **Use descriptive names**
   ```kotlin
   @Preview(name = "Product Card - Out of Stock")
   ```

4. **Create mock data objects**
   ```kotlin
   private val sampleProduct = Product(/* ... */)
   private val sampleCartItem = CartItem(/* ... */)
   ```

5. **Keep preview functions private**
   ```kotlin
   @Preview
   @Composable
   private fun MyPreview() { } // ✅ Private
   ```

---

## 🎯 Summary

| Aspect | commonMain | androidMain |
|--------|------------|-------------|
| **@Composable components** | ✅ Yes | ❌ No (use commonMain) |
| **@Preview annotations** | ❌ No | ✅ Yes |
| **Preview functions** | ❌ No | ✅ Yes |
| **Mock data for previews** | ❌ No | ✅ Yes |
| **Theme usage** | ✅ Yes | ✅ Yes (for previews) |

**Remember:** Composables in `commonMain`, Previews in `androidMain`!

---

**Updated:** January 2025  
**Project:** AuraFlow POS - Kotlin Multiplatform
