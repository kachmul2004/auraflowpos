package com.theauraflow.pos.preview.cart

import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import com.theauraflow.pos.domain.model.CartItem
import com.theauraflow.pos.domain.model.Modifier as ProductModifier
import com.theauraflow.pos.domain.model.Product
import com.theauraflow.pos.ui.components.ShoppingCart
import com.theauraflow.pos.ui.theme.AuraFlowTheme

/**
 * Android Previews for ShoppingCart Component
 */

@Preview(name = "Shopping Cart - Empty", showBackground = true, heightDp = 600)
@Composable
private fun ShoppingCartEmptyPreview() {
    AuraFlowTheme {
        ShoppingCart(
            items = emptyList(),
            subtotal = 0.0,
            tax = 0.0,
            total = 0.0,
            onClearCart = {},
            onCheckout = { _, _ -> },
            customerName = null,
            onAddCustomer = {},
            onAddNotes = {}
        )
    }
}

@Preview(name = "Shopping Cart - With Items", showBackground = true, heightDp = 600)
@Composable
private fun ShoppingCartWithItemsPreview() {
    AuraFlowTheme {
        ShoppingCart(
            items = listOf(
                CartItem(
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
                CartItem(
                    id = "cart2",
                    product = Product(
                        id = "2",
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
                        )
                    ),
                    discount = null
                )
            ),
            subtotal = 12.00,
            tax = 0.96,
            discount = 0.0,
            total = 12.96,
            onClearCart = {},
            onCheckout = { _, _ -> },
            customerName = "John Doe",
            onAddCustomer = {},
            onAddNotes = {}
        )
    }
}

@Preview(name = "Shopping Cart - With Discount", showBackground = true, heightDp = 600)
@Composable
private fun ShoppingCartWithDiscountPreview() {
    AuraFlowTheme {
        ShoppingCart(
            items = listOf(
                CartItem(
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
                    discount = null
                )
            ),
            subtotal = 12.00,
            tax = 0.80,
            discount = 1.50,
            total = 11.30,
            onClearCart = {},
            onCheckout = { _, _ -> },
            customerName = null,
            onAddCustomer = {},
            onAddNotes = {}
        )
    }
}

@Preview(name = "Shopping Cart - Dark Mode", showBackground = true, heightDp = 600)
@Composable
private fun ShoppingCartDarkPreview() {
    AuraFlowTheme(darkTheme = true) {
        ShoppingCart(
            items = listOf(
                CartItem(
                    id = "cart1",
                    product = Product(
                        id = "1",
                        name = "Cappuccino",
                        price = 4.00,
                        stockQuantity = 50,
                        categoryId = "coffee"
                    ),
                    quantity = 1,
                    modifiers = listOf(
                        ProductModifier(
                            id = "mod1",
                            name = "Oat Milk",
                            price = 0.75
                        )
                    ),
                    discount = null
                )
            ),
            subtotal = 4.75,
            tax = 0.38,
            discount = 0.0,
            total = 5.13,
            onClearCart = {},
            onCheckout = { _, _ -> },
            customerName = "Sarah Smith",
            onAddCustomer = {},
            onAddNotes = {}
        )
    }
}
