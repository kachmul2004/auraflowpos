package com.theauraflow.pos.preview.components

import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import com.theauraflow.pos.ui.components.POSTopAppBar
import com.theauraflow.pos.ui.theme.AuraFlowTheme

@Preview(name = "Top App Bar - Standard", showBackground = true, widthDp = 1200)
@Composable
private fun POSTopAppBarPreviewStandard() {
    AuraFlowTheme(darkTheme = false) {
        POSTopAppBar(
            userName = "John Cashier",
            userRole = "Cashier"
        )
    }
}

@Preview(name = "Top App Bar - Training Mode", showBackground = true, widthDp = 1200)
@Composable
private fun POSTopAppBarPreviewTraining() {
    AuraFlowTheme(darkTheme = false) {
        POSTopAppBar(
            userName = "John Cashier",
            userRole = "Cashier",
            isTrainingMode = true,
            isClockedIn = true,
            terminalName = "Terminal 1"
        )
    }
}

@Preview(name = "Top App Bar - With Subscriptions", showBackground = true, widthDp = 1200)
@Composable
private fun POSTopAppBarPreviewSubscriptions() {
    AuraFlowTheme(darkTheme = true) {
        POSTopAppBar(
            userName = "Sarah Manager",
            userRole = "Manager",
            isClockedIn = true,
            terminalName = "Main Terminal",
            subscriptions = listOf("Restaurant", "Bar", "Retail"),
            hasTableManagement = true
        )
    }
}

@Preview(name = "Top App Bar - Full Features", showBackground = true, widthDp = 1200)
@Composable
private fun POSTopAppBarPreviewFull() {
    AuraFlowTheme(darkTheme = true) {
        POSTopAppBar(
            userName = "Alex Smith",
            userRole = "Manager",
            isTrainingMode = true,
            isClockedIn = true,
            terminalName = "Downtown Store - T1",
            subscriptions = listOf("Restaurant", "Bar", "Cafe", "Retail"),
            hasTableManagement = true,
            isFullscreen = false,
            isDarkTheme = true
        )
    }
}
