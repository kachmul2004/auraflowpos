package com.theauraflow.pos.ui.dialog

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties

/**
 * Keyboard Shortcuts Dialog with comprehensive shortcut reference
 * Matches web: KeyboardShortcutsDialog.tsx
 */
@Composable
fun KeyboardShortcutsDialog(
    open: Boolean,
    onDismiss: () -> Unit
) {
    if (!open) return

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(
            dismissOnBackPress = true,
            dismissOnClickOutside = false,
            usePlatformDefaultWidth = false
        )
    ) {
        Card(
            modifier = Modifier
                .widthIn(max = 700.dp)
                .heightIn(max = 600.dp)
                .padding(16.dp),
            shape = MaterialTheme.shapes.large,
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.surface
            )
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(24.dp)
            ) {
                // Header
                Text(
                    text = "Keyboard Shortcuts",
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.SemiBold
                )
                Text(
                    text = "Speed up your workflow with these keyboard shortcuts",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.padding(top = 4.dp)
                )

                Spacer(Modifier.height(24.dp))

                // Scrollable shortcuts list
                Column(
                    modifier = Modifier
                        .weight(1f)
                        .verticalScroll(rememberScrollState()),
                    verticalArrangement = Arrangement.spacedBy(24.dp)
                ) {
                    // General
                    ShortcutCategory(
                        title = "General",
                        shortcuts = listOf(
                            ShortcutItem(listOf("F1"), "Show keyboard shortcuts"),
                            ShortcutItem(listOf("F2"), "Quick payment (Cash)"),
                            ShortcutItem(listOf("F3"), "Search products"),
                            ShortcutItem(listOf("Ctrl", "K"), "Quick search"),
                            ShortcutItem(listOf("Ctrl", "P"), "Print receipt"),
                            ShortcutItem(listOf("Esc"), "Close dialogs / Clear search")
                        )
                    )

                    // Payment
                    ShortcutCategory(
                        title = "Payment",
                        shortcuts = listOf(
                            ShortcutItem(listOf("F4"), "Cash payment"),
                            ShortcutItem(listOf("F5"), "Card payment"),
                            ShortcutItem(listOf("F6"), "Process payment"),
                            ShortcutItem(listOf("Ctrl", "T"), "Add tip")
                        )
                    )

                    // Orders
                    ShortcutCategory(
                        title = "Orders",
                        shortcuts = listOf(
                            ShortcutItem(listOf("F7"), "Recent orders"),
                            ShortcutItem(listOf("F8"), "Process return"),
                            ShortcutItem(listOf("Ctrl", "R"), "Reload parked sale"),
                            ShortcutItem(listOf("Ctrl", "N"), "Clear cart / New order")
                        )
                    )

                    // Cash Drawer
                    ShortcutCategory(
                        title = "Cash Drawer",
                        shortcuts = listOf(
                            ShortcutItem(listOf("F9"), "Open cash drawer"),
                            ShortcutItem(listOf("F10"), "No sale (open drawer)"),
                            ShortcutItem(listOf("Ctrl", "D"), "Cash in/out")
                        )
                    )

                    // Cart Actions
                    ShortcutCategory(
                        title = "Cart Actions",
                        shortcuts = listOf(
                            ShortcutItem(listOf("Delete"), "Remove selected item"),
                            ShortcutItem(listOf("Ctrl", "+"), "Increase quantity"),
                            ShortcutItem(listOf("Ctrl", "-"), "Decrease quantity"),
                            ShortcutItem(listOf("Ctrl", "I"), "Apply item discount"),
                            ShortcutItem(listOf("Ctrl", "P"), "Price override")
                        )
                    )

                    // Admin
                    ShortcutCategory(
                        title = "Admin",
                        shortcuts = listOf(
                            ShortcutItem(listOf("F11"), "Toggle fullscreen mode"),
                            ShortcutItem(listOf("F12"), "View transactions"),
                            ShortcutItem(listOf("Ctrl", "L"), "Lock screen"),
                            ShortcutItem(listOf("Ctrl", "Shift", "T"), "Toggle training mode")
                        )
                    )
                }
            }
        }
    }
}

private data class ShortcutItem(
    val keys: List<String>,
    val description: String
)

@Composable
private fun ShortcutCategory(
    title: String,
    shortcuts: List<ShortcutItem>
) {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text(
            text = title,
            fontSize = 16.sp,
            fontWeight = FontWeight.SemiBold,
            color = MaterialTheme.colorScheme.primary
        )

        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            shortcuts.forEach { shortcut ->
                ShortcutRow(
                    keys = shortcut.keys,
                    description = shortcut.description
                )
            }
        }
    }
}

@Composable
private fun ShortcutRow(
    keys: List<String>,
    description: String
) {
    Surface(
        modifier = Modifier.fillMaxWidth(),
        shape = MaterialTheme.shapes.small,
        color = MaterialTheme.colorScheme.surfaceVariant
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(8.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = description,
                fontSize = 14.sp,
                modifier = Modifier.weight(1f)
            )

            Row(
                horizontalArrangement = Arrangement.spacedBy(4.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                keys.forEachIndexed { index, key ->
                    KeyBadge(key)
                    if (index < keys.size - 1) {
                        Text(
                            text = "+",
                            fontSize = 12.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun KeyBadge(key: String) {
    Surface(
        shape = MaterialTheme.shapes.extraSmall,
        border = androidx.compose.foundation.BorderStroke(
            1.dp,
            MaterialTheme.colorScheme.outline
        ),
        color = MaterialTheme.colorScheme.surface
    ) {
        Text(
            text = key,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
            fontSize = 12.sp,
            fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace,
            fontWeight = FontWeight.Medium
        )
    }
}
