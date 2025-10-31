package com.theauraflow.pos.preview.dialog

import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import com.theauraflow.pos.ui.dialog.QuickSettingsDialog
import com.theauraflow.pos.ui.theme.AuraFlowTheme

@Preview(name = "Quick Settings Dialog - Default", showBackground = true)
@Composable
fun PreviewQuickSettingsDialog() {
    AuraFlowTheme {
        QuickSettingsDialog(
            open = true,
            autoPrintReceipts = false,
            soundEnabled = true,
            darkMode = true,
            onDismiss = {},
            onToggleAutoPrint = {},
            onToggleSoundEnabled = {},
            onToggleDarkMode = {}
        )
    }
}

@Preview(name = "Quick Settings Dialog - All Enabled", showBackground = true)
@Composable
fun PreviewQuickSettingsDialogAllEnabled() {
    AuraFlowTheme {
        QuickSettingsDialog(
            open = true,
            autoPrintReceipts = true,
            soundEnabled = true,
            darkMode = true,
            onDismiss = {},
            onToggleAutoPrint = {},
            onToggleSoundEnabled = {},
            onToggleDarkMode = {}
        )
    }
}

@Preview(name = "Quick Settings Dialog - Dark", showBackground = true)
@Composable
fun PreviewQuickSettingsDialogDark() {
    AuraFlowTheme(darkTheme = true) {
        QuickSettingsDialog(
            open = true,
            autoPrintReceipts = false,
            soundEnabled = true,
            darkMode = true,
            onDismiss = {},
            onToggleAutoPrint = {},
            onToggleSoundEnabled = {},
            onToggleDarkMode = {}
        )
    }
}
