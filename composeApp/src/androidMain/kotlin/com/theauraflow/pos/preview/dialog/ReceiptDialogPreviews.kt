package com.theauraflow.pos.preview.dialog

import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import com.theauraflow.pos.domain.model.CartItem
import com.theauraflow.pos.domain.model.Modifier as ProductModifier
import com.theauraflow.pos.domain.model.Product
import com.theauraflow.pos.ui.dialog.ReceiptDialog
import com.theauraflow.pos.ui.theme.AuraFlowTheme

/**
 * Android Previews for ReceiptDialog
 */

@Preview(name = "Receipt Dialog - Cash Payment", showSystemUi = true)
@Composable
private fun ReceiptDialogCashPreview() {
    AuraFlowTheme {
        ReceiptDialog(
            open = true,
            orderNumber = "ORD-12345",
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
                        name = "Croissant",
                        price = 4.50,
                        stockQuantity = 20,
                        categoryId = "food"
                    ),
                    quantity = 1,
                    modifiers = emptyList(),
                    discount = null
                )
            ),
            subtotal = 11.50,
            discount = 0.0,
            tax = 0.92,
            total = 12.42,
            paymentMethod = "cash",
            amountReceived = 20.00,
            timestamp = "2025-10-30 20:30",
            onDismiss = {},
            onNewOrder = {},
            onPrint = {},
            onEmail = {}
        )
    }
}

@Preview(name = "Receipt Dialog - Card Payment", showSystemUi = true)
@Composable
private fun ReceiptDialogCardPreview() {
    AuraFlowTheme {
        ReceiptDialog(
            open = true,
            orderNumber = "ORD-67890",
            items = listOf(
                CartItem(
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
                )
            ),
            subtotal = 5.75,
            discount = 0.0,
            tax = 0.46,
            total = 6.21,
            paymentMethod = "card",
            amountReceived = 6.21,
            customerName = "John Doe",
            timestamp = "2025-10-30 14:15",
            onDismiss = {},
            onNewOrder = {},
            onPrint = {},
            onEmail = {}
        )
    }
}

@Preview(name = "Receipt Dialog - With Discount", showSystemUi = true)
@Composable
private fun ReceiptDialogDiscountPreview() {
    AuraFlowTheme {
        ReceiptDialog(
            open = true,
            orderNumber = "ORD-55555",
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
            discount = 1.50,
            tax = 0.84,
            total = 11.34,
            paymentMethod = "cash",
            amountReceived = 15.00,
            timestamp = "2025-10-30 16:45",
            onDismiss = {},
            onNewOrder = {},
            onPrint = {},
            onEmail = {}
        )
    }
}

@Preview(name = "Receipt Dialog - Dark Mode", showSystemUi = true)
@Composable
private fun ReceiptDialogDarkPreview() {
    AuraFlowTheme(darkTheme = true) {
        ReceiptDialog(
            open = true,
            orderNumber = "ORD-99999",
            items = listOf(
                CartItem(
                    id = "cart1",
                    product = Product(
                        id = "1",
                        name = "Americano",
                        price = 3.00,
                        stockQuantity = 50,
                        categoryId = "coffee"
                    ),
                    quantity = 1,
                    modifiers = emptyList(),
                    discount = null
                )
            ),
            subtotal = 3.00,
            discount = 0.0,
            tax = 0.24,
            total = 3.24,
            paymentMethod = "card",
            amountReceived = 3.24,
            customerName = "Sarah Smith",
            notes = "Extra hot, please",
            timestamp = "2025-10-30 09:00",
            onDismiss = {},
            onNewOrder = {},
            onPrint = {},
            onEmail = {}
        )
    }
}
