package com.theauraflow.pos.ui.screen

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.theauraflow.pos.presentation.viewmodel.ProductViewModel
import com.theauraflow.pos.presentation.viewmodel.CartViewModel
import com.theauraflow.pos.ui.components.ProductGrid
import com.theauraflow.pos.ui.components.ShoppingCart

/**
 * Main POS screen with product grid and shopping cart.
 * Uses split layout: Product grid on left (70%), cart on right (30%).
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun POSScreen(
    productViewModel: ProductViewModel,
    cartViewModel: CartViewModel,
    modifier: Modifier = Modifier
) {
    val productsState by productViewModel.productsState.collectAsState()
    val products = when (val s = productsState) {
        is com.theauraflow.pos.presentation.base.UiState.Success -> s.data
        else -> emptyList()
    }

    val cartState by cartViewModel.cartState.collectAsState()
    val cartUi = when (val s = cartState) {
        is com.theauraflow.pos.presentation.base.UiState.Success -> s.data
        else -> com.theauraflow.pos.presentation.viewmodel.CartUiState()
    }

    val cartItems = cartUi.items
    val subtotal = cartUi.subtotal
    val tax = cartUi.tax
    val discount = cartUi.discount
    val total = cartUi.total

    var searchQuery by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf("All") }

    // Filter products by search query
    val filteredProducts = remember(products, searchQuery) {
        if (searchQuery.isBlank()) products
        else products.filter {
            it.name.contains(searchQuery, ignoreCase = true) ||
                    it.sku?.contains(searchQuery, ignoreCase = true) == true
        }
    }

    Row(
        modifier = modifier.fillMaxSize()
    ) {
        // Left side - Product Grid (70%)
        Column(
            modifier = Modifier
                .weight(7f)
                .fillMaxHeight()
        ) {
            // Search bar
            Surface(
                modifier = Modifier.fillMaxWidth(),
                color = MaterialTheme.colorScheme.surface,
                shadowElevation = 2.dp
            ) {
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = {
                        searchQuery = it
                        productViewModel.searchProducts(it)
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    placeholder = { Text("Search products by name or SKU...") },
                    leadingIcon = {
                        Icon(Icons.Default.Search, "Search")
                    },
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = MaterialTheme.colorScheme.primary,
                        unfocusedBorderColor = MaterialTheme.colorScheme.outline
                    )
                )
            }

            // Product grid with category filtering and pagination
            ProductGrid(
                products = filteredProducts,
                selectedCategory = selectedCategory,
                onCategoryChange = { selectedCategory = it },
                onProductClick = { product ->
                    cartViewModel.addToCart(product)
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f)
            )
        }

        // Divider
        VerticalDivider()

        // Right side - Shopping Cart (30%)
        ShoppingCart(
            items = cartItems,
            subtotal = subtotal,
            tax = tax,
            discount = discount,
            total = total,
            onUpdateItem = { cartItem, newQuantity, itemDiscount, priceOverride ->
                // Update quantity
                if (newQuantity != cartItem.quantity) {
                    cartViewModel.updateQuantity(cartItem.id, newQuantity)
                }
                // TODO: Handle itemDiscount and priceOverride when CartViewModel supports them
                // For now, we'll need to update the CartViewModel to support these
            },
            onVoidItem = { cartItem ->
                cartViewModel.removeFromCart(cartItem.id)
            },
            onClearCart = {
                cartViewModel.clearCart()
            },
            onCheckout = { paymentMethod, amountReceived ->
                // TODO: Create order with payment details
                // For now, just clear the cart to simulate successful payment
                cartViewModel.clearCart()
                // Future: Navigate to receipt screen or show success message
            },
            modifier = Modifier
                .weight(3f)
                .fillMaxHeight()
        )
    }
}
