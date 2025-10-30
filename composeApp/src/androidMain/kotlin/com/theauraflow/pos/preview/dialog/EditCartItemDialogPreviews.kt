package com.theauraflow.pos.preview.dialog

import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import com.theauraflow.pos.domain.model.CartItem
import com.theauraflow.pos.domain.model.Product
import com.theauraflow.pos.ui.dialog.EditCartItemDialog
import com.theauraflow.pos.ui.theme.AuraFlowTheme

/**
 * Android Previews for EditCartItemDialog
 */

@Preview(name = "Edit Cart Item Dialog - Basic Product", showSystemUi = true)
@Composable
private fun EditCartItemDialogPreview() {
    AuraFlowTheme {
        EditCartItemDialog(
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
            onDismiss = {},
            onSave = { _, _, _ -> },
            onVoid = {}
        )
    }
}

@Preview(name = "Edit Cart Item Dialog - Low Stock", showSystemUi = true)
@Composable
private fun EditCartItemDialogLowStockPreview() {
    AuraFlowTheme {
        EditCartItemDialog(
            cartItem = CartItem(
                id = "cart1",
                product = Product(
                    id = "1",
                    name = "Limited Edition Coffee",
                    price = 12.99,
                    stockQuantity = 5,
                    categoryId = "coffee"
                ),
                quantity = 3,
                modifiers = emptyList(),
                discount = null
            ),
            onDismiss = {},
            onSave = { _, _, _ -> },
            onVoid = {}
        )
    }
}

@Preview(name = "Edit Cart Item Dialog - High Quantity", showSystemUi = true)
@Composable
private fun EditCartItemDialogHighQuantityPreview() {
    AuraFlowTheme(darkTheme = true) {
        EditCartItemDialog(
            cartItem = CartItem(
                id = "cart1",
                product = Product(
                    id = "1",
                    name = "Bottled Water",
                    price = 1.50,
                    stockQuantity = 500,
                    categoryId = "beverages"
                ),
                quantity = 10,
                modifiers = emptyList(),
                discount = null
            ),
            onDismiss = {},
            onSave = { _, _, _ -> },
            onVoid = {}
        )
    }
}
