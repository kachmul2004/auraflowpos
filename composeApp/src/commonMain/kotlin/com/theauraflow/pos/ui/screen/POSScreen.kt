package com.theauraflow.pos.ui.screen

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.theauraflow.pos.presentation.viewmodel.ProductViewModel
import com.theauraflow.pos.presentation.viewmodel.CartViewModel
import com.theauraflow.pos.ui.components.ProductCard
import com.theauraflow.pos.ui.components.ShoppingCart

/**
 * Main POS screen with product grid and shopping cart.
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

    Row(
        modifier = modifier.fillMaxSize()
    ) {
        // Left side - Product Grid
        Column(
            modifier = Modifier
                .weight(2f)
                .fillMaxHeight()
                .padding(16.dp)
        ) {
            // Search bar
            OutlinedTextField(
                value = searchQuery,
                onValueChange = {
                    searchQuery = it
                    productViewModel.searchProducts(it)
                },
                modifier = Modifier.fillMaxWidth(),
                placeholder = { Text("Search products...") },
                leadingIcon = {
                    Icon(Icons.Default.Search, "Search")
                },
                singleLine = true
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Product grid
            if (products.isEmpty()) {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Text("No products available")
                }
            } else {
                LazyVerticalGrid(
                    columns = GridCells.Adaptive(minSize = 180.dp),
                    contentPadding = PaddingValues(8.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(products) { product ->
                        ProductCard(
                            product = product,
                            onClick = {
                                cartViewModel.addToCart(product)
                            }
                        )
                    }
                }
            }
        }

        // Divider
        VerticalDivider()

        // Right side - Shopping Cart
        ShoppingCart(
            items = cartItems,
            subtotal = subtotal,
            tax = tax,
            discount = discount,
            total = total,
            onClearCart = {
                cartViewModel.clearCart()
            },
            onCheckout = {
                // TODO: Navigate to checkout screen
            },
            modifier = Modifier
                .weight(1f)
                .fillMaxHeight()
        )
    }
}
