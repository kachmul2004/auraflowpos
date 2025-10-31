package com.theauraflow.pos.preview.dialog

import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import com.theauraflow.pos.ui.dialog.ShiftStatusDialog
import com.theauraflow.pos.ui.theme.AuraFlowTheme

@Preview(name = "Shift Status Dialog - Active", showBackground = true)
@Composable
fun PreviewShiftStatusDialogActive() {
    AuraFlowTheme {
        ShiftStatusDialog(
            open = true,
            terminalName = "Terminal #1",
            clockInTime = 1699012800000L, // Nov 3, 2023 9:00 AM
            clockOutTime = null,
            openingBalance = 100.0,
            totalOrders = 15,
            totalSales = 1250.75,
            cashSales = 450.50,
            cashIn = 50.0,
            cashOut = 25.0,
            closingBalance = null,
            totalTransactions = 20,
            noSaleCount = 3,
            cashMovementCount = 2,
            onDismiss = {},
            onClockOut = {},
            onPrintReport = {}
        )
    }
}

@Preview(name = "Shift Status Dialog - Completed", showBackground = true)
@Composable
fun PreviewShiftStatusDialogCompleted() {
    AuraFlowTheme {
        ShiftStatusDialog(
            open = true,
            terminalName = "Terminal #2",
            clockInTime = 1699012800000L, // Nov 3, 2023 9:00 AM
            clockOutTime = 1699041600000L, // Nov 3, 2023 5:00 PM
            openingBalance = 100.0,
            totalOrders = 45,
            totalSales = 3580.25,
            cashSales = 1250.75,
            cashIn = 100.0,
            cashOut = 50.0,
            closingBalance = 1400.75,
            totalTransactions = 58,
            noSaleCount = 5,
            cashMovementCount = 4,
            onDismiss = {},
            onClockOut = {},
            onPrintReport = {}
        )
    }
}

@Preview(name = "Shift Status Dialog - Dark", showBackground = true)
@Composable
fun PreviewShiftStatusDialogDark() {
    AuraFlowTheme(darkTheme = true) {
        ShiftStatusDialog(
            open = true,
            terminalName = "Terminal #1",
            clockInTime = 1699012800000L,
            clockOutTime = null,
            openingBalance = 100.0,
            totalOrders = 15,
            totalSales = 1250.75,
            cashSales = 450.50,
            cashIn = 50.0,
            cashOut = 25.0,
            closingBalance = null,
            totalTransactions = 20,
            noSaleCount = 3,
            cashMovementCount = 2,
            onDismiss = {},
            onClockOut = {},
            onPrintReport = {}
        )
    }
}
