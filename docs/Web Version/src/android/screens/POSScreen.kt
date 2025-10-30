package com.auraflow.pos.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.auraflow.pos.components.*
import com.auraflow.pos.models.CartItem
import com.auraflow.pos.models.Product
import com.auraflow.pos.theme.AuraFlowPOSTheme
import com.auraflow.pos.theme.Background

/**
 * Main POS Screen
 * Layout: Product area on left, shopping cart on right
 */

@Composable
fun POSScreen(
    products: List<Product>,
    cartItems: List<CartItem>,
    stockMap: Map<String, Int>,
    onProductClick: (Product) -> Unit,
    onQuantityChange: (CartItem, Int) -> Unit,
    onRemoveItem: (CartItem) -> Unit,
    onCheckout: () -> Unit,
    onClearCart: () -> Unit,
    modifier: Modifier = Modifier
) {
    var selectedCategory by remember { mutableStateOf<String?>(null) }
    
    val categories = products.map { it.category }.distinct().sorted()
    val filteredProducts = if (selectedCategory != null) {
        products.filter { it.category == selectedCategory }
    } else {
        products
    }
    
    val subtotal = cartItems.sumOf { it.subtotal }
    val tax = subtotal * 0.08 // 8% tax
    val total = subtotal + tax
    
    Surface(
        modifier = modifier.fillMaxSize(),
        color = Background
    ) {
        Row(modifier = Modifier.fillMaxSize()) {
            // Left Side: Product Area (65%)
            Column(
                modifier = Modifier
                    .weight(0.65f)
                    .fillMaxHeight()
            ) {
                // Category Filter
                CategoryFilter(
                    categories = categories,
                    selectedCategory = selectedCategory,
                    onCategorySelected = { selectedCategory = it }
                )
                
                // Product Grid
                ProductGrid(
                    products = filteredProducts,
                    stockMap = stockMap,
                    onProductClick = onProductClick,
                    modifier = Modifier.weight(1f)
                )
            }
            
            // Right Side: Shopping Cart (35%)
            ShoppingCart(
                cartItems = cartItems,
                subtotal = subtotal,
                tax = tax,
                total = total,
                onQuantityChange = onQuantityChange,
                onRemoveItem = onRemoveItem,
                onCheckout = onCheckout,
                onClearCart = onClearCart,
                modifier = Modifier
                    .weight(0.35f)
                    .fillMaxHeight()
            )
        }
    }
}

@Composable
fun POSScreenPreview() {
    val sampleProducts = listOf(
        Product(
            id = "1",
            name = "Organic Bananas",
            price = 2.99,
            priceDisplay = "$2.99",
            category = "Produce",
            stock = 50
        ),
        Product(
            id = "2",
            name = "Whole Milk",
            price = 3.49,
            priceDisplay = "$3.49",
            category = "Dairy",
            stock = 30
        ),
        Product(
            id = "3",
            name = "French Bread",
            price = 2.49,
            priceDisplay = "$2.49",
            category = "Bakery",
            stock = 3
        )
    )
    
    val sampleCartItems = listOf(
        CartItem(
            id = "1",
            product = sampleProducts[0],
            quantity = 2,
            price = sampleProducts[0].price
        )
    )
    
    val sampleStockMap = sampleProducts.associate { it.id to it.stock }
    
    AuraFlowPOSTheme {
        POSScreen(
            products = sampleProducts,
            cartItems = sampleCartItems,
            stockMap = sampleStockMap,
            onProductClick = {},
            onQuantityChange = { _, _ -> },
            onRemoveItem = {},
            onCheckout = {},
            onClearCart = {}
        )
    }
}
