package com.theauraflow.pos.preview.dialog

import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import com.theauraflow.pos.ui.dialog.OrderNotesDialog

@Preview(name = "Order Notes - Empty", showBackground = true)
@Composable
private fun OrderNotesDialogEmptyPreview() {
    OrderNotesDialog(
        show = true,
        currentNotes = "",
        onDismiss = {},
        onSaveNotes = {}
    )
}

@Preview(name = "Order Notes - With Notes", showBackground = true)
@Composable
private fun OrderNotesDialogWithNotesPreview() {
    OrderNotesDialog(
        show = true,
        currentNotes = "Extra sauce on the side\nNo onions\nWell done",
        onDismiss = {},
        onSaveNotes = {}
    )
}

@Preview(name = "Order Notes - Long Text", showBackground = true)
@Composable
private fun OrderNotesDialogLongTextPreview() {
    OrderNotesDialog(
        show = true,
        currentNotes = "Please make sure the steak is cooked medium-rare. " +
                "Add extra garlic butter on top. No vegetables on the plate. " +
                "Fries should be extra crispy. Bring ketchup and mayo on the side.",
        onDismiss = {},
        onSaveNotes = {}
    )
}