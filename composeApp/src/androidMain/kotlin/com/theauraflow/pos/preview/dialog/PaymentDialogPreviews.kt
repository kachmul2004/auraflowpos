package com.theauraflow.pos.preview.dialog

import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import com.theauraflow.pos.ui.dialog.PaymentDialog
import com.theauraflow.pos.ui.theme.AuraFlowTheme

/**
 * Android Previews for PaymentDialog
 */

@Preview(name = "Payment Dialog - Small Order", showSystemUi = true)
@Composable
private fun PaymentDialogSmallOrderPreview() {
    AuraFlowTheme {
        PaymentDialog(
            open = true,
            subtotal = 12.50,
            discount = 0.0,
            tax = 1.00,
            total = 13.50,
            onDismiss = {},
            onCompletePayment = { _, _ -> }
        )
    }
}

@Preview(name = "Payment Dialog - With Discount", showSystemUi = true)
@Composable
private fun PaymentDialogWithDiscountPreview() {
    AuraFlowTheme {
        PaymentDialog(
            open = true,
            subtotal = 50.00,
            discount = 5.00,
            tax = 3.60,
            total = 48.60,
            onDismiss = {},
            onCompletePayment = { _, _ -> }
        )
    }
}

@Preview(name = "Payment Dialog - Large Order", showSystemUi = true)
@Composable
private fun PaymentDialogLargeOrderPreview() {
    AuraFlowTheme {
        PaymentDialog(
            open = true,
            subtotal = 156.75,
            discount = 15.68,
            tax = 11.29,
            total = 152.36,
            onDismiss = {},
            onCompletePayment = { _, _ -> }
        )
    }
}

@Preview(name = "Payment Dialog - Dark Mode", showSystemUi = true)
@Composable
private fun PaymentDialogDarkPreview() {
    AuraFlowTheme(darkTheme = true) {
        PaymentDialog(
            open = true,
            subtotal = 25.99,
            discount = 2.50,
            tax = 1.88,
            total = 25.37,
            onDismiss = {},
            onCompletePayment = { _, _ -> }
        )
    }
}
