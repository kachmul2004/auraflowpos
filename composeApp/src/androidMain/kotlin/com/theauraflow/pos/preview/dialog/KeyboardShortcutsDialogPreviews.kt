package com.theauraflow.pos.preview.dialog

import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import com.theauraflow.pos.ui.dialog.KeyboardShortcutsDialog
import com.theauraflow.pos.ui.theme.AuraFlowTheme

@Preview(name = "Keyboard Shortcuts Dialog", showBackground = true, widthDp = 700, heightDp = 600)
@Composable
fun PreviewKeyboardShortcutsDialog() {
    AuraFlowTheme {
        KeyboardShortcutsDialog(
            open = true,
            onDismiss = {}
        )
    }
}

@Preview(
    name = "Keyboard Shortcuts Dialog - Dark",
    showBackground = true,
    widthDp = 700,
    heightDp = 600
)
@Composable
fun PreviewKeyboardShortcutsDialogDark() {
    AuraFlowTheme(darkTheme = true) {
        KeyboardShortcutsDialog(
            open = true,
            onDismiss = {}
        )
    }
}
