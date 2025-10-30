# Next Steps: UI Redesign to Match Web Repo

## 🎯 Goal

Redesign ALL UI components to **pixel-perfect match** the original AuraFlow POS web app designs
found in **`docs/Web Version/src/`**.

---

## 📋 Action Plan

### Phase 1: Reference Analysis (NEXT)

1. **Read Original Design Files**
   - Read: `docs/Web Version/src/components/`
   - Read: `docs/Web Version/src/styles/`
   - Analyze: Component layouts, spacing, colors, typography

2. **Extract Design Specs**
   - Document exact color hex values from CSS
   - Note spacing/padding values
   - List typography specifications
   - Capture corner radius values
   - Document icon sizes

### Phase 2: Theme System Update

Update our theme files to match:

- `composeApp/src/commonMain/kotlin/com/theauraflow/pos/ui/theme/Color.kt`
- `composeApp/src/commonMain/kotlin/com/theauraflow/pos/ui/theme/Theme.kt`
- `composeApp/src/commonMain/kotlin/com/theauraflow/pos/ui/theme/Type.kt`

### Phase 3: Component Redesign

Rebuild components to match TypeScript reference files in `docs/Web Version/src/`:

1. **ProductCard.tsx**
   - Match card design exactly
   - Same image aspect ratio
   - Identical text sizes/weights
   - Matching button styles
   - Same hover/press states

2. **CartItem.tsx / CheckoutItems.tsx**
   - Match item layout
   - Same action buttons
   - Identical spacing
   - Matching typography

3. **POSView.tsx**
   - Match overall layout structure
   - Same grid/cart split ratio
   - Identical action bar
   - Matching category filters

4. **LoginView.tsx**
   - Match form layout
   - Same input field styles
   - Identical button design
   - Matching branding

5. **CheckoutView.tsx**
   - Payment method selection matching web
   - Same keypad layout
   - Identical total display
   - Matching action buttons

6. **OrderHistoryView.tsx**
   - Match list item design
   - Same filter options
   - Identical status badges
   - Matching date formatting

### Phase 4: Verification

- Generate screenshots of each component
- Compare side-by-side with reference files
- Measure pixel differences
- Validate color accuracy
- Check spacing precision

---

## 🛠️ Technical Approach

### Reading Reference Files

We'll read files directly from `docs/Web Version/src/`:

1. Use file reading tools to access TypeScript/TSX files
2. Extract design patterns and specifications
3. Document measurements and values
4. Cross-reference with CSS files

### Conversion Strategy

**TypeScript/React → KMP Compose:**
```kotlin
// Reference file (TypeScript/React)
// docs/Web Version/src/components/ProductCard.tsx
export function ProductCard({ product }: Props) {
    return (
        <div className="product-card">
            <div className="product-info">...</div>
            <img src={product.image} />
        </div>
    )
}

// Our KMP version (matching design)
// composeApp/src/commonMain/kotlin/.../ProductCard.kt
@Composable
fun ProductCard(product: Product, modifier: Modifier = Modifier) {
    Card(
        modifier = modifier,
        // ... matching dimensions from TypeScript version
    ) { ... }
}
```

### Key Differences to Handle

1. **HTML/CSS → Compose:**
   - CSS properties to Compose modifiers
   - Flexbox to Row/Column layouts
   - CSS Grid to LazyGrid

2. **React → Compose:**
   - React hooks to Compose state (StateFlow)
   - Props to Composable parameters
   - JSX to Compose DSL

3. **TypeScript → Kotlin:**
   - Type interfaces to data classes
   - TypeScript generics to Kotlin generics
   - Async/Promise to Coroutines

---

## 📊 Current Status

| Component          | Status           | Notes                                |
|--------------------|------------------|--------------------------------------|
| Color.kt           | ⚠️ Partial       | Uses web colors, may need updates    |
| ProductCard        | ✅ In Progress    | Layout matches web, needs refinement |
| CartItemCard       | ✅ In Progress    | Layout matches web, needs refinement |
| POSScreen          | ⚠️ Needs work    | Structure doesn't match web          |
| LoginScreen        | ❌ Needs redesign | Form layout differs                  |
| CheckoutScreen     | ⚠️ In progress   | Incomplete, needs reference          |
| OrderHistoryScreen | ⚠️ In progress   | Incomplete, needs reference          |

---

## 🎯 Success Criteria

✅ **Visual Match:**
- Colors within 1% of original
- Spacing within 2dp of original
- Typography matches exactly
- Corner radius matches exactly

✅ **Functional Match:**
- Same interactions
- Same animations (if any)
- Same state handling
- Same user flow

✅ **Code Quality:**
- Clean Architecture maintained
- KMP best practices followed
- Well-documented components
- Preview functions for all composables

---

## 🚀 Ready to Start!

**Next immediate action:**
I'll read the TypeScript/React reference files in `docs/Web Version/src/` to begin matching the
designs
exactly!

**Reference Location:** `docs/Web Version/src/components/` and `docs/Web Version/src/styles/`

Want me to proceed with Phase 1?

