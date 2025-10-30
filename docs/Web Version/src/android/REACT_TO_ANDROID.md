# React to Android Migration Guide

## 📱 Overview

This guide helps you understand how the React/TypeScript web app maps to the Android/Kotlin implementation. Both share the same business logic, data models, and design principles.

## 🗺️ Directory Mapping

| React Web (`/`) | Android (`/android/`) | Notes |
|-----------------|----------------------|-------|
| `/lib/types.ts` | `/data/models/Models.kt` | All TypeScript interfaces → Kotlin data classes |
| `/lib/mockData.ts` | `/data/SampleData.kt` | Sample data for development |
| `/lib/store.ts` | `/data/repository/POSRepository.kt` | Zustand store → Repository pattern |
| `/lib/` utilities | `/core/Utils.kt` | Helper functions |
| `/components/` | `/components/` | React components → Composables |
| `/components/ui/` | `/ui/` | Basic UI components |
| `/App.tsx` | `/screens/POSScreen.kt` | Main app screen |
| `/styles/globals.css` | `/theme/Color.kt`, `Type.kt` | CSS → Material3 theme |
| `/presets/` | `/domain/subscription/SubscriptionManager.kt` | Subscription presets |
| `/plugins/` | `/domain/plugins/PluginManager.kt` | Plugin system |

## 🔄 Concept Mapping

### State Management

#### React (Zustand)

```typescript
// React with Zustand
const cart = useStore(state => state.cart);
const addToCart = useStore(state => state.addToCart);

// Update state
addToCart(product, quantity);
```

#### Android (StateFlow)

```kotlin
// Android with StateFlow
val cart by repository.cart.collectAsState()
val viewModel = viewModel<POSViewModel>()

// Update state
viewModel.addToCart(product, quantity)
```

### Component Pattern

#### React Component

```typescript
// React Component
interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <div onClick={() => onClick(product)}>
      <h3>{product.name}</h3>
      <p>${product.price.toFixed(2)}</p>
    </div>
  );
}
```

#### Android Composable

```kotlin
// Android Composable
@Composable
fun ProductCard(
    product: Product,
    onClick: (Product) -> Unit
) {
    Column(
        modifier = Modifier.clickable { onClick(product) }
    ) {
        Text(text = product.name)
        Text(text = Utils.formatCurrency(product.price))
    }
}
```

### Data Models

#### TypeScript Interface

```typescript
// TypeScript
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl?: string;
  stock: number;
}
```

#### Kotlin Data Class

```kotlin
// Kotlin
data class Product(
    val id: String,
    val name: String,
    val price: Double,
    val category: String,
    val imageUrl: String? = null,
    val stock: Int
)
```

### Business Logic

#### React Hook

```typescript
// React
function useCart() {
  const cart = useStore(state => state.cart);
  const addToCart = useStore(state => state.addToCart);
  
  const total = cart.items.reduce((sum, item) => 
    sum + item.totalPrice, 0
  );
  
  return { cart, addToCart, total };
}
```

#### Android ViewModel

```kotlin
// Android
class POSViewModel(
    private val repository: POSRepository
) : ViewModel() {
    
    val cart = repository.cart
    
    fun addToCart(product: Product, quantity: Int) {
        repository.addToCart(product, quantity)
    }
    
    val total: StateFlow<Double> = cart.map { items ->
        items.sumOf { it.totalPrice }
    }.stateIn(viewModelScope, SharingStarted.Lazily, 0.0)
}
```

## 📦 Type/Class Equivalents

### Basic Types

| TypeScript | Kotlin | Notes |
|------------|--------|-------|
| `string` | `String` | |
| `number` | `Double` | For decimals (prices) |
| `number` | `Int` | For whole numbers (quantities) |
| `boolean` | `Boolean` | |
| `Date` | `LocalDateTime` | Import from `java.time` |
| `undefined` | `null` | Kotlin uses null instead |
| `string?` | `String?` | Nullable string |
| `Array<T>` | `List<T>` | Immutable list |
| `interface` | `data class` | For data structures |
| `enum` | `enum class` | |
| `type Union = A \| B` | `sealed class` | For union types |

### React Hooks → Kotlin

| React Hook | Kotlin Equivalent | Usage |
|------------|-------------------|-------|
| `useState` | `MutableStateFlow` | Local state |
| `useEffect` | `LaunchedEffect` | Side effects |
| `useMemo` | `remember { }` | Memoization |
| `useCallback` | `remember { }` | Function memoization |
| `useContext` | `CompositionLocal` | Shared state |
| `useRef` | `remember { mutableStateOf() }` | Ref to value |

### Common Patterns

#### Conditional Rendering

```typescript
// React
{isLoading && <Spinner />}
{error && <ErrorMessage />}
```

```kotlin
// Android
if (isLoading) {
    CircularProgressIndicator()
}
if (error != null) {
    ErrorMessage(error)
}
```

#### List Rendering

```typescript
// React
{products.map(product => (
  <ProductCard key={product.id} product={product} />
))}
```

```kotlin
// Android
products.forEach { product ->
    ProductCard(product = product)
}
// OR
LazyColumn {
    items(products, key = { it.id }) { product ->
        ProductCard(product = product)
    }
}
```

#### Event Handlers

```typescript
// React
<button onClick={() => handleClick(item)}>
  Click Me
</button>
```

```kotlin
// Android
Button(
    onClick = { handleClick(item) }
) {
    Text("Click Me")
}
```

## 🎨 Styling Comparison

### Tailwind CSS → Compose Modifiers

| Tailwind Class | Compose Modifier | Example |
|----------------|------------------|---------|
| `p-4` | `padding(16.dp)` | `Modifier.padding(16.dp)` |
| `m-4` | `padding(16.dp)` | Outside component |
| `w-full` | `fillMaxWidth()` | `Modifier.fillMaxWidth()` |
| `h-full` | `fillMaxHeight()` | `Modifier.fillMaxHeight()` |
| `bg-blue-500` | `background(Color.Blue)` | `Modifier.background(Primary)` |
| `text-white` | `color = Color.White` | In `Text()` |
| `rounded-lg` | `clip(RoundedCornerShape(8.dp))` | |
| `flex` | `Row { }` or `Column { }` | Layout composable |
| `grid` | `LazyVerticalGrid { }` | Grid layout |
| `hover:bg-blue-600` | `clickable { }` | Add interaction |

### Example Conversion

#### React with Tailwind

```typescript
<div className="p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-bold">Product Name</h2>
  <p className="text-gray-600">$49.99</p>
</div>
```

#### Android with Compose

```kotlin
Card(
    modifier = Modifier.padding(16.dp),
    shape = RoundedCornerShape(8.dp)
) {
    Column(modifier = Modifier.padding(16.dp)) {
        Text(
            text = "Product Name",
            style = MaterialTheme.typography.titleLarge
        )
        Text(
            text = "$49.99",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}
```

## 🔧 Common Operations

### Formatting

```typescript
// React
const formatted = price.toFixed(2);
const date = new Date().toLocaleDateString();
```

```kotlin
// Android
val formatted = Utils.formatCurrency(price)
val date = Utils.formatDate(LocalDateTime.now())
```

### Validation

```typescript
// React
const isValid = email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
```

```kotlin
// Android
val isValid = Utils.isValidEmail(email)
```

### Async Operations

```typescript
// React
async function fetchData() {
  const data = await api.getProducts();
  setProducts(data);
}

useEffect(() => {
  fetchData();
}, []);
```

```kotlin
// Android
viewModelScope.launch {
    val data = api.getProducts()
    _products.value = data
}

// In Composable
LaunchedEffect(Unit) {
    viewModel.fetchProducts()
}
```

## 📁 File Structure Comparison

### React Project

```
src/
├── components/          # UI components
├── lib/
│   ├── types.ts        # Type definitions
│   ├── store.ts        # State management
│   ├── mockData.ts     # Sample data
│   └── utils.ts        # Utilities
├── presets/            # Subscription presets
├── plugins/            # Plugin system
└── App.tsx             # Main app
```

### Android Project

```
android/
├── components/         # UI components
├── data/
│   ├── models/        # Data models
│   ├── repository/    # State management
│   └── SampleData.kt  # Sample data
├── domain/
│   ├── subscription/  # Presets
│   ├── plugins/       # Plugin system
│   └── usecase/       # Business logic
├── ui/
│   └── viewmodel/     # ViewModels
├── core/
│   └── Utils.kt       # Utilities
└── screens/
    └── POSScreen.kt   # Main app
```

## 🎯 Key Differences

### 1. Null Safety

```typescript
// React - Runtime null checks
if (product) {
  console.log(product.name);
}
```

```kotlin
// Android - Compile-time null safety
product?.let {
    println(it.name)
}
// OR
if (product != null) {
    println(product.name)
}
```

### 2. Collections

```typescript
// React - Array methods
const filtered = products.filter(p => p.stock > 0);
const mapped = products.map(p => p.name);
const sum = prices.reduce((a, b) => a + b, 0);
```

```kotlin
// Android - Collection functions
val filtered = products.filter { it.stock > 0 }
val mapped = products.map { it.name }
val sum = prices.sum()
```

### 3. Destructuring

```typescript
// React
const { name, price } = product;
```

```kotlin
// Android
val (name, price) = product  // If data class has componentN functions
// OR
val name = product.name
val price = product.price
```

### 4. Spread Operator

```typescript
// React
const newArray = [...oldArray, newItem];
const newObject = { ...oldObject, name: "New" };
```

```kotlin
// Android
val newList = oldList + newItem
val newObject = oldObject.copy(name = "New")
```

## 🚀 Migration Steps

### Step 1: Models

1. Copy TypeScript interfaces from `/lib/types.ts`
2. Convert to Kotlin data classes in `/android/data/models/Models.kt`
3. Add default values where appropriate
4. Use `?` for nullable fields

### Step 2: Sample Data

1. Copy mock data from `/lib/mockData.ts`
2. Convert to Kotlin objects in `/android/data/SampleData.kt`
3. Update syntax (array literals → `listOf()`)

### Step 3: Business Logic

1. Extract business logic from Zustand store
2. Move to `/android/data/repository/POSRepository.kt`
3. Create use cases in `/android/domain/usecase/`
4. Use StateFlow for reactive updates

### Step 4: UI Components

1. Convert React components to Composables
2. Replace JSX with Compose DSL
3. Map Tailwind classes to Compose modifiers
4. Use Material3 components

### Step 5: State Management

1. Create ViewModel in `/android/ui/viewmodel/`
2. Connect to repository
3. Expose StateFlow for UI
4. Handle user actions

## 💡 Tips

1. **Think in immutability**: Kotlin encourages immutable data (val vs var)
2. **Use data classes**: Perfect for DTOs and models
3. **Leverage extension functions**: Add functionality to existing classes
4. **StateFlow is your friend**: Similar to React state but with Kotlin coroutines
5. **Compose is declarative**: Just like React, describe what you want, not how
6. **Preview everything**: Use `@Preview` to see components without running app
7. **Type safety**: Let Kotlin's type system catch errors at compile time

## 📚 Resources

- [Compose for React Developers](https://developer.android.com/jetpack/compose/mental-model)
- [Kotlin for JavaScript Developers](https://kotlinlang.org/docs/js-to-kotlin-interop.html)
- [StateFlow vs useState](https://developer.android.com/kotlin/flow/stateflow-and-sharedflow)

## 🤝 Need Help?

Check the documentation files:
- **README.md**: Quick start
- **IMPLEMENTATION_GUIDE.md**: Step-by-step setup
- **COMPLETE_GUIDE.md**: Comprehensive reference
- **INDEX.md**: File directory

---

**Happy Coding!** 🎉
