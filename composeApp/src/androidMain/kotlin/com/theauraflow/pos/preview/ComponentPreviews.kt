package com.theauraflow.pos.preview

import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import com.theauraflow.pos.domain.model.Product
import com.theauraflow.pos.domain.model.CartItem
import com.theauraflow.pos.domain.model.Discount
import com.theauraflow.pos.domain.model.DiscountType
import com.theauraflow.pos.domain.model.Modifier as ProductModifier
import com.theauraflow.pos.ui.components.ProductCard
import com.theauraflow.pos.ui.components.CartItemCard
import com.theauraflow.pos.ui.theme.AuraFlowTheme

/**
 * Android Previews for AuraFlow POS Components
 *
 * Note: Previews must be in androidMain for Kotlin Multiplatform projects.
 * They cannot be in commonMain.
 */

// ========== PRODUCT CARD PREVIEWS ==========

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

// ========== CART ITEM CARD PREVIEWS ==========

@Preview(name = "Cart Item - Basic", showBackground = true)
@Composable
private fun CartItemCardPreview() {
    AuraFlowTheme {
        CartItemCard(
            cartItem = CartItem(
                id = "cart1",
                product = Product(
                    id = "1",
                    name = "Espresso",
                    price = 3.50,
                    stockQuantity = 50,
                    categoryId = "coffee"
                ),
                quantity = 2,
                modifiers = emptyList(),
                discount = null
            ),
            onClick = {}
        )
    }
}

@Preview(name = "Cart Item - With Modifiers", showBackground = true)
@Composable
private fun CartItemCardWithModifiersPreview() {
    AuraFlowTheme {
        CartItemCard(
            cartItem = CartItem(
                id = "cart1",
                product = Product(
                    id = "1",
                    name = "Latte",
                    price = 4.50,
                    stockQuantity = 50,
                    categoryId = "coffee"
                ),
                quantity = 1,
                modifiers = listOf(
                    ProductModifier(
                        id = "mod1",
                        name = "Extra Shot",
                        price = 0.50
                    ),
                    ProductModifier(
                        id = "mod2",
                        name = "Oat Milk",
                        price = 0.75
                    )
                ),
                discount = null
            ),
            onClick = {}
        )
    }
}

@Preview(name = "Cart Item - With Discount", showBackground = true)
@Composable
private fun CartItemCardWithDiscountPreview() {
    AuraFlowTheme(darkTheme = true) {
        CartItemCard(
            cartItem = CartItem(
                id = "cart1",
                product = Product(
                    id = "1",
                    name = "Cappuccino",
                    price = 4.00,
                    stockQuantity = 50,
                    categoryId = "coffee"
                ),
                quantity = 3,
                modifiers = emptyList(),
                discount = Discount(
                    id = "disc1",
                    name = "10% Off",
                    type = DiscountType.PERCENTAGE,
                    value = 10.0
                )
            ),
            onClick = {}
        )
    }
}
