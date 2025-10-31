package com.theauraflow.pos.preview.dialog

import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import com.theauraflow.pos.ui.dialog.EditProfileDialog
import com.theauraflow.pos.ui.theme.AuraFlowTheme

@Preview(name = "Edit Profile Dialog", showBackground = true)
@Composable
fun PreviewEditProfileDialog() {
    AuraFlowTheme {
        EditProfileDialog(
            open = true,
            userFirstName = "John",
            userLastName = "Cashier",
            userEmail = "john.cashier@auraflow.com",
            userPin = "123456",
            onDismiss = {},
            onSave = { _, _, _ -> },
            onChangePin = {}
        )
    }
}

@Preview(name = "Edit Profile Dialog - Dark", showBackground = true)
@Composable
fun PreviewEditProfileDialogDark() {
    AuraFlowTheme(darkTheme = true) {
        EditProfileDialog(
            open = true,
            userFirstName = "Jane",
            userLastName = "Manager",
            userEmail = "jane.manager@auraflow.com",
            userPin = "654321",
            onDismiss = {},
            onSave = { _, _, _ -> },
            onChangePin = {}
        )
    }
}
