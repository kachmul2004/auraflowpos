package com.theauraflow.pos.ui.screen

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.theauraflow.pos.core.util.asString
import com.theauraflow.pos.presentation.viewmodel.ProductViewModel
import com.theauraflow.pos.presentation.viewmodel.CartViewModel
import com.theauraflow.pos.ui.components.ProductCard
import com.theauraflow.pos.ui.components.CartItemCard
import com.theauraflow.pos.core.util.formatCurrency
import com.theauraflow.pos.presentation.viewmodel.CartUiState

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
    val productState by productViewModel.productsState.collectAsState()
    val cartState by cartViewModel.cartState.collectAsState()

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
            when (val state = productState) {
                is com.theauraflow.pos.presentation.base.UiState.Loading -> {
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        CircularProgressIndicator()
                    }
                }
                is com.theauraflow.pos.presentation.base.UiState.Success -> {
                    LazyVerticalGrid(
                        columns = GridCells.Adaptive(minSize = 180.dp),
                        contentPadding = PaddingValues(8.dp),
                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        items(state.data) { product ->
                            ProductCard(
                                product = product,
                                onClick = {
                                    cartViewModel.addToCart(product)
                                }
                            )
                        }
                    }
                }
                is com.theauraflow.pos.presentation.base.UiState.Error -> {
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = state.message.asString(),
                            color = MaterialTheme.colorScheme.error
                        )
                    }
                }
                else -> {} // Handle Idle and Empty states
            }
        }

        // Divider
        VerticalDivider()

        // Right side - Shopping Cart
        Column(
            modifier = Modifier
                .weight(1f)
                .fillMaxHeight()
                .padding(16.dp)
        ) {
            Text(
                text = "Shopping Cart",
                style = MaterialTheme.typography.headlineSmall
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Cart items
            LazyColumn(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                when (val state = cartState) {
                    is com.theauraflow.pos.presentation.base.UiState.Success -> {
                        items(state.data.items) { item ->
                            CartItemCard(
                                cartItem = item,
                                onClick = {
                                    // TODO: Open edit dialog for this item
                                }
                            )
                        }
                    }

                    else -> {}
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Cart summary
            val cartData =
                (cartState as? com.theauraflow.pos.presentation.base.UiState.Success)?.data
                    ?: CartUiState()

            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer
                )
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("Subtotal:")
                        Text("$${cartData.subtotal.formatCurrency()}")
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("Tax:")
                        Text("$${cartData.tax.formatCurrency()}")
                    }

                    if (cartData.discount > 0) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                text = "Discount:",
                                color = MaterialTheme.colorScheme.secondary
                            )
                            Text(
                                text = "-$${cartData.discount.formatCurrency()}",
                                color = MaterialTheme.colorScheme.secondary
                            )
                        }
                    }

                    Divider()

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = "Total:",
                            style = MaterialTheme.typography.titleLarge
                        )
                        Text(
                            text = "$${cartData.total.formatCurrency()}",
                            style = MaterialTheme.typography.titleLarge,
                            color = MaterialTheme.colorScheme.primary
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Checkout button
            Button(
                onClick = { /* TODO: Navigate to checkout */ },
                modifier = Modifier.fillMaxWidth(),
                enabled = cartData.items.isNotEmpty()
            ) {
                Text("Checkout (${cartData.itemCount} items)")
            }
        }
    }
}
