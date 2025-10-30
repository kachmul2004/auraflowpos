package com.theauraflow.pos.preview.product

import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import com.theauraflow.pos.domain.model.Product
import com.theauraflow.pos.ui.components.ProductCard
import com.theauraflow.pos.ui.theme.AuraFlowTheme

/**
 * Android Previews for Product Components
 */

@Preview(name = "Product Card - Light", showBackground = true)
@Composable
private fun ProductCardPreview() {
    AuraFlowTheme(darkTheme = false) {
        ProductCard(
            product = Product(
                id = "1",
                name = "Espresso",
                price = 3.50,
                stockQuantity = 50,
                categoryId = "coffee",
                categoryName = "Coffee"
            ),
            onClick = {}
        )
    }
}

@Preview(name = "Product Card - Dark", showBackground = true)
@Composable
private fun ProductCardPreviewDark() {
    AuraFlowTheme(darkTheme = true) {
        ProductCard(
            product = Product(
                id = "1",
                name = "Espresso",
                price = 3.50,
                stockQuantity = 50,
                categoryId = "coffee",
                categoryName = "Coffee"
            ),
            onClick = {}
        )
    }
}

@Preview(name = "Product Card - Out of Stock", showBackground = true)
@Composable
private fun ProductCardOutOfStockPreview() {
    AuraFlowTheme {
        ProductCard(
            product = Product(
                id = "2",
                name = "Latte",
                price = 4.50,
                stockQuantity = 0,
                categoryId = "coffee",
                categoryName = "Coffee"
            ),
            onClick = {}
        )
    }
}

@Preview(name = "Product Card - Low Stock", showBackground = true)
@Composable
private fun ProductCardLowStockPreview() {
    AuraFlowTheme {
        ProductCard(
            product = Product(
                id = "3",
                name = "Cappuccino",
                price = 4.00,
                stockQuantity = 3,
                categoryId = "coffee",
                categoryName = "Coffee"
            ),
            onClick = {}
        )
    }
}
