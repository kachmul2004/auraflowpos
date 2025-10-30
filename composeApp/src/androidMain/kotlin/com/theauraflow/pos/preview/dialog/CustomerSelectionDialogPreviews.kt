package com.theauraflow.pos.preview.dialog

import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import com.theauraflow.pos.domain.model.Customer
import com.theauraflow.pos.ui.dialog.CustomerSelectionDialog

@Preview(name = "Customer Selection - Empty", showBackground = true)
@Composable
private fun CustomerSelectionDialogEmptyPreview() {
    CustomerSelectionDialog(
        show = true,
        customers = emptyList(),
        currentCustomer = null,
        onDismiss = {},
        onSelectCustomer = {}
    )
}

@Preview(name = "Customer Selection - With Customers", showBackground = true)
@Composable
private fun CustomerSelectionDialogWithCustomersPreview() {
    val customers = listOf(
        Customer(
            id = "1",
            name = "John Smith",
            email = "john.smith@email.com",
            phone = "(555) 123-4567",
            totalSpent = 2500.00,
            orderCount = 15,
            loyaltyPoints = 250
        ),
        Customer(
            id = "2",
            name = "Jane Doe",
            email = "jane.doe@email.com",
            phone = "(555) 234-5678",
            totalSpent = 1200.00,
            orderCount = 8,
            loyaltyPoints = 120
        ),
        Customer(
            id = "3",
            name = "Robert Johnson",
            email = "robert.j@email.com",
            phone = "(555) 345-6789",
            totalSpent = 850.00,
            orderCount = 5,
            loyaltyPoints = 85
        ),
        Customer(
            id = "4",
            name = "Alice Williams",
            email = "alice.w@email.com",
            phone = "(555) 456-7890",
            totalSpent = 450.00,
            orderCount = 3,
            loyaltyPoints = 45
        )
    )

    CustomerSelectionDialog(
        show = true,
        customers = customers,
        currentCustomer = null,
        onDismiss = {},
        onSelectCustomer = {}
    )
}

@Preview(name = "Customer Selection - With Selected Customer", showBackground = true)
@Composable
private fun CustomerSelectionDialogWithSelectedPreview() {
    val customers = listOf(
        Customer(
            id = "1",
            name = "John Smith",
            email = "john.smith@email.com",
            phone = "(555) 123-4567",
            totalSpent = 2500.00,
            orderCount = 15,
            loyaltyPoints = 250
        ),
        Customer(
            id = "2",
            name = "Jane Doe",
            email = "jane.doe@email.com",
            phone = "(555) 234-5678",
            totalSpent = 1200.00,
            orderCount = 8,
            loyaltyPoints = 120
        )
    )

    CustomerSelectionDialog(
        show = true,
        customers = customers,
        currentCustomer = customers[0],
        onDismiss = {},
        onSelectCustomer = {}
    )
}

@Preview(name = "Customer Selection - VIP Customer", showBackground = true)
@Composable
private fun CustomerSelectionDialogVIPPreview() {
    val customers = listOf(
        Customer(
            id = "1",
            name = "VIP Customer",
            email = "vip@email.com",
            phone = "(555) 999-9999",
            totalSpent = 5000.00,
            orderCount = 50,
            loyaltyPoints = 1000
        )
    )

    CustomerSelectionDialog(
        show = true,
        customers = customers,
        currentCustomer = null,
        onDismiss = {},
        onSelectCustomer = {}
    )
}