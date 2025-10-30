# Compose UI Guidelines for AuraFlow POS

## 🎨 Design Principles

### Color Palette

- **Primary:** Purple (#8B5CF6) - Main brand color
- **Secondary:** Pink (#EC4899) - Accent color
- **Tertiary:** Blue (#3B82F6) - Info/highlights
- **Success:** Green (#10B981)
- **Error:** Red (#EF4444)
- **Warning:** Amber (#F59E0B)

### Spacing

Use consistent spacing throughout:

- **Small:** 8.dp
- **Medium:** 12.dp
- **Large:** 16.dp
- **XLarge:** 24.dp
- **XXLarge:** 32.dp

### Typography

Follow Material3 typography scale:

- `displayLarge`, `displayMedium`, `displaySmall` - For headlines
- `headlineLarge`, `headlineMedium`, `headlineSmall` - For section headers
- `titleLarge`, `titleMedium`, `titleSmall` - For card titles
- `bodyLarge`, `bodyMedium`, `bodySmall` - For body text
- `labelLarge`, `labelMedium`, `labelSmall` - For labels and captions

---

## 🔧 Composable Function Requirements

### 1. Always Include @Preview (in androidMain for KMP)

**IMPORTANT FOR KOTLIN MULTIPLATFORM:** Previews MUST be in `androidMain` source set, NOT in
`commonMain`.

#### Why?

- Compose Multiplatform previews only work on Android
- Preview annotations in `commonMain` are ignored
- Keep composables in `commonMain`, previews in `androidMain`

#### Example Structure:

**Component in commonMain:**
```kotlin
// composeApp/src/commonMain/.../ProductCard.kt
@Composable
fun ProductCard(
    product: Product,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    // Component implementation - NO @Preview here
}
```

**Previews in androidMain:**

```kotlin
// composeApp/src/androidMain/.../preview/ComponentPreviews.kt
@Preview(name = "Product Card - Light", showBackground = true)
@Composable
private fun ProductCardPreview() {
    AuraFlowTheme {
        ProductCard(
            product = Product(
                id = "1",
                name = "Sample Product",
                price = 19.99,
                stockQuantity = 10,
                categoryId = "cat1"
            ),
            onClick = {}
        )
    }
}
```

### 2. Preview Best Practices

#### Organize Previews by Feature

Create preview files in `androidMain/kotlin/com/yourapp/preview/`:

```
androidMain/
└── kotlin/
    └── com/theauraflow/pos/
        └── preview/
            ├── ComponentPreviews.kt
            ├── ScreenPreviews.kt
            └── ThemePreviews.kt
```

#### Multiple State Previews

Show different states of your component:

```kotlin
@Preview
@Composable
private fun ProductCardLoadingPreview() {
    AuraFlowTheme {
        // Show loading state
    }
}

@Preview
@Composable
private fun ProductCardErrorPreview() {
    AuraFlowTheme {
        // Show error state
    }
}

@Preview
@Composable
private fun ProductCardEmptyPreview() {
    AuraFlowTheme {
        // Show empty state
    }
}
```

#### Dark Mode Preview

Always include dark mode preview:

```kotlin
@Preview
@Composable
private fun ProductCardPreviewLight() {
    AuraFlowTheme(darkTheme = false) {
        ProductCard(/* ... */)
    }
}

@Preview
@Composable
private fun ProductCardPreviewDark() {
    AuraFlowTheme(darkTheme = true) {
        ProductCard(/* ... */)
    }
}
```

### 3. Preview Data

Create mock data for previews:

```kotlin
object PreviewData {
    val sampleProduct = Product(
        id = "1",
        name = "Espresso",
        price = 3.50,
        stockQuantity = 50,
        categoryId = "coffee"
    )
    
    val sampleCartItem = CartItem(
        id = "cart1",
        product = sampleProduct,
        quantity = 2,
        modifiers = emptyList(),
        discount = null
    )
}
```

---

## 📋 Component Structure

### Standard Component Template

```kotlin
package com.theauraflow.pos.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import org.jetbrains.compose.ui.tooling.preview.Preview
import com.theauraflow.pos.ui.theme.AuraFlowTheme

/**
 * Brief description of what the component does.
 *
 * @param param1 Description of parameter
 * @param modifier Standard modifier for customization
 */
@Composable
fun MyComponent(
    param1: String,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        // ... component implementation
    ) {
        // Content
    }
}

// ========== PREVIEWS ==========

@Preview
@Composable
private fun MyComponentPreview() {
    AuraFlowTheme {
        MyComponent(
            param1 = "Sample"
        )
    }
}

@Preview
@Composable
private fun MyComponentPreviewDark() {
    AuraFlowTheme(darkTheme = true) {
        MyComponent(
            param1 = "Sample"
        )
    }
}
```

---

## 🎯 Screen Structure

### Standard Screen Template

```kotlin
package com.theauraflow.pos.ui.screen

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import org.jetbrains.compose.ui.tooling.preview.Preview
import com.theauraflow.pos.presentation.viewmodel.MyViewModel
import com.theauraflow.pos.ui.theme.AuraFlowTheme

/**
 * Screen description.
 */
@Composable
fun MyScreen(
    viewModel: MyViewModel,
    modifier: Modifier = Modifier
) {
    val state by viewModel.state.collectAsState()
    
    Scaffold(
        topBar = { /* Top bar */ },
        modifier = modifier
    ) { paddingValues ->
        // Screen content
    }
}

// ========== PREVIEWS ==========

@Preview
@Composable
private fun MyScreenPreview() {
    AuraFlowTheme {
        // Use mock ViewModel for preview
        MyScreen(
            viewModel = MockMyViewModel()
        )
    }
}
```

---

## ✅ Checklist for Every Composable

- [ ] KDoc comment describing the component
- [ ] Parameters documented with @param
- [ ] Modifier parameter with default value
- [ ] At least one @Preview function (in androidMain for KMP)
- [ ] Dark mode preview (if applicable)
- [ ] Different state previews (loading, error, empty)
- [ ] Proper spacing using .dp values
- [ ] Material3 components used
- [ ] Theme colors from MaterialTheme.colorScheme
- [ ] Typography from MaterialTheme.typography

---

## 🚫 Common Mistakes to Avoid

1. ❌ No preview function
2. ❌ Hardcoded colors instead of theme colors
3. ❌ Hardcoded sizes instead of .dp values
4. ❌ Missing modifier parameter
5. ❌ No KDoc comments
6. ❌ Direct platform dependencies in commonMain
7. ❌ Mutable state without remember
8. ❌ Side effects in composition

---

## 📚 Additional Resources

- [Material3 Design Guidelines](https://m3.material.io/)
- [Compose Multiplatform Docs](https://www.jetbrains.com/compose-multiplatform/)
- [Compose UI Guidelines](https://developer.android.com/jetpack/compose/guidelines)
- AuraFlow Web App: https://github.com/kachmul2004/Auraflowposweb

---

**Remember: Every Composable needs a Preview! 🎨**
