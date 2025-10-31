package com.theauraflow.pos.preview.components

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.theauraflow.pos.ui.components.*
import com.theauraflow.pos.ui.theme.AuraFlowTheme

// ==================== EMPTY STATE PREVIEWS ====================

@Preview(name = "Empty Cart", showBackground = true)
@Composable
private fun EmptyStateCartPreview() {
    AuraFlowTheme {
        EmptyState(
            icon = Icons.Default.ShoppingCart,
            title = "Your cart is empty",
            description = "Start adding products to begin a new order"
        )
    }
}

@Preview(name = "No Products Found", showBackground = true)
@Composable
private fun EmptyStateNoProductsPreview() {
    AuraFlowTheme {
        EmptyState(
            icon = Icons.Default.Search,
            title = "No products found",
            description = "Try a different search term or browse all products",
            actionLabel = "Clear Search",
            onAction = {}
        )
    }
}

@Preview(name = "No Customers", showBackground = true)
@Composable
private fun EmptyStateNoCustomersPreview() {
    AuraFlowTheme {
        EmptyState(
            icon = Icons.Default.Person,
            title = "No customers found",
            description = "Create a new customer to get started",
            actionLabel = "Add Customer",
            onAction = {}
        )
    }
}

@Preview(name = "No Orders", showBackground = true)
@Composable
private fun EmptyStateNoOrdersPreview() {
    AuraFlowTheme(darkTheme = true) {
        EmptyState(
            icon = Icons.Default.Receipt,
            title = "No orders yet",
            description = "Completed orders will appear here"
        )
    }
}

// ==================== SKELETON PREVIEWS ====================

@Preview(name = "Product Card Skeleton", showBackground = true, widthDp = 200, heightDp = 240)
@Composable
private fun ProductCardSkeletonPreview() {
    AuraFlowTheme {
        ProductCardSkeleton(
            modifier = Modifier
                .width(200.dp)
                .height(240.dp)
        )
    }
}

@Preview(name = "Product Grid Skeleton", showBackground = true)
@Composable
private fun ProductGridSkeletonPreview() {
    AuraFlowTheme {
        LazyVerticalGrid(
            columns = GridCells.Fixed(5),
            contentPadding = PaddingValues(16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(10) {
                ProductCardSkeleton(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(240.dp)
                )
            }
        }
    }
}

@Preview(name = "Cart Item Skeleton", showBackground = true)
@Composable
private fun CartItemSkeletonPreview() {
    AuraFlowTheme(darkTheme = true) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            repeat(3) {
                CartItemSkeleton()
            }
        }
    }
}

@Preview(name = "Order Card Skeleton", showBackground = true)
@Composable
private fun OrderCardSkeletonPreview() {
    AuraFlowTheme {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            repeat(3) {
                OrderCardSkeleton()
            }
        }
    }
}
