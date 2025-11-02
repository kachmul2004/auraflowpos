package com.theauraflow.pos.ui.dialog

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties

/**
 * Dialog for managing cash drawer operations.
 *
 * Features:
 * - Add cash (Cash In)
 * - Remove cash (Cash Out)
 * - Display current balance
 * - Reason/notes for transactions
 */
@Composable
fun CashDrawerDialog(
    show: Boolean,
    currentBalance: Double,
    onDismiss: () -> Unit,
    onCashIn: (amount: Double, reason: String) -> Unit,
    onCashOut: (amount: Double, reason: String) -> Unit
) {
    var selectedTab by remember { mutableStateOf(0) } // 0 = Cash In, 1 = Cash Out
    var amount by remember { mutableStateOf("") }
    var reason by remember { mutableStateOf("") }

    // Reset on open
    LaunchedEffect(show) {
        if (show) {
            selectedTab = 0
            amount = ""
            reason = ""
        }
    }

    if (show) {
        Dialog(
            onDismissRequest = onDismiss,
            properties = DialogProperties(
                dismissOnBackPress = true,
                dismissOnClickOutside = false,
                usePlatformDefaultWidth = false
            )
        ) {
            Surface(
                modifier = Modifier
                    .width(448.dp)
                    .heightIn(max = 600.dp),
                shape = RoundedCornerShape(16.dp),
                color = MaterialTheme.colorScheme.surface,
                tonalElevation = 8.dp
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(24.dp)
                ) {
                    // Header
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "Cash Drawer",
                                style = MaterialTheme.typography.headlineSmall,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = "Add or remove cash from the drawer.",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                        IconButton(onClick = onDismiss) {
                            Icon(Icons.Default.Close, contentDescription = "Close")
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // Current Balance Display
                    Surface(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        color = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.3f),
                        border = androidx.compose.foundation.BorderStroke(
                            1.dp,
                            MaterialTheme.colorScheme.primary.copy(alpha = 0.2f)
                        )
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "Current Balance:",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Text(
                                text = "$${currentBalance.formatPrice()}",
                                style = MaterialTheme.typography.headlineMedium,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // Tabs
                    TabRow(
                        selectedTabIndex = selectedTab,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Tab(
                            selected = selectedTab == 0,
                            onClick = { selectedTab = 0 },
                            text = { Text("Cash In") }
                        )
                        Tab(
                            selected = selectedTab == 1,
                            onClick = { selectedTab = 1 },
                            text = { Text("Cash Out") }
                        )
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // Tab Content
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .weight(1f),
                        verticalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        // Description
                        Text(
                            text = if (selectedTab == 0) {
                                "Add cash to the drawer (e.g., for making change)."
                            } else {
                                "Remove cash from the drawer (e.g., for deposits, petty cash)."
                            },
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )

                        // Amount Input
                        OutlinedTextField(
                            value = amount,
                            onValueChange = { newValue ->
                                // Only allow valid decimal numbers
                                if (newValue.isEmpty() || newValue.matches(Regex("^\\d*\\.?\\d{0,2}$"))) {
                                    amount = newValue
                                }
                            },
                            label = { Text("Amount") },
                            placeholder = { Text("0.00") },
                            modifier = Modifier.fillMaxWidth(),
                            singleLine = true,
                            shape = RoundedCornerShape(12.dp)
                        )

                        // Reason Input
                        OutlinedTextField(
                            value = reason,
                            onValueChange = { reason = it },
                            label = { Text("Reason") },
                            placeholder = {
                                Text(
                                    if (selectedTab == 0)
                                        "Reason for cash in..."
                                    else
                                        "Reason for cash out..."
                                )
                            },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(120.dp),
                            maxLines = 4,
                            shape = RoundedCornerShape(12.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    HorizontalDivider()

                    Spacer(modifier = Modifier.height(16.dp))

                    // Action Buttons
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        OutlinedButton(
                            onClick = onDismiss,
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text("Cancel")
                        }

                        val amountValue = amount.toDoubleOrNull()
                        Button(
                            onClick = {
                                amountValue?.let {
                                    if (it > 0) {
                                        if (selectedTab == 0) {
                                            onCashIn(it, reason.ifBlank { "Cash In" })
                                        } else {
                                            onCashOut(it, reason.ifBlank { "Cash Out" })
                                        }
                                        onDismiss()
                                    }
                                }
                            },
                            enabled = amountValue != null && amountValue > 0,
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text("Confirm")
                        }
                    }
                }
            }
        }
    }
}

/**
 * Format double to 2 decimal places for currency display.
 */
private fun Double.formatPrice(): String {
    val str = this.toString()
    return if (str.contains('.')) {
        val parts = str.split('.')
        "${parts[0]}.${parts[1].padEnd(2, '0').take(2)}"
    } else {
        "$str.00"
    }
}