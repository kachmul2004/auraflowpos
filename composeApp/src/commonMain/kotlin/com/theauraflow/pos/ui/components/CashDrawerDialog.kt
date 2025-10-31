package com.theauraflow.pos.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import kotlin.math.roundToInt

/**
 * Cash Drawer Dialog matching web version design.
 * Allows adding or removing cash from the drawer with tabs for Cash In/Cash Out.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CashDrawerDialog(
    open: Boolean,
    currentBalance: Double = 100.0, // Mock current balance
    isDarkTheme: Boolean = false,
    onClose: () -> Unit,
    onConfirm: (type: String, amount: Double, reason: String) -> Unit
) {
    if (!open) return

    var selectedTab by remember { mutableStateOf(0) } // 0 = Cash In, 1 = Cash Out
    var amount by remember { mutableStateOf("") }
    var reason by remember { mutableStateOf("") }

    Dialog(onDismissRequest = onClose) {
        Card(
            modifier = Modifier
                .width(448.dp)
                .wrapContentHeight(),
            shape = RoundedCornerShape(8.dp),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.surface
            )
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Header
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        text = "Cash Drawer",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.SemiBold
                    )
                    Text(
                        text = "Add or remove cash from the drawer.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                    )
                }

                // Current Balance Display
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(8.dp),
                    color = MaterialTheme.colorScheme.primary.copy(alpha = 0.1f),
                    border = androidx.compose.foundation.BorderStroke(
                        width = 1.dp,
                        color = MaterialTheme.colorScheme.primary.copy(alpha = 0.2f)
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
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                        )
                        Text(
                            text = buildString {
                                append("$")
                                val priceStr = currentBalance.toString()
                                val parts = priceStr.split(".")
                                append(parts.getOrNull(0) ?: "0")
                                append(".")
                                val decimal = parts.getOrNull(1)?.take(2)?.padEnd(2, '0') ?: "00"
                                append(decimal)
                            },
                            style = MaterialTheme.typography.headlineMedium,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                }

                // Tabs
                TabRow(
                    selectedTabIndex = selectedTab,
                    modifier = Modifier.fillMaxWidth(),
                    containerColor = MaterialTheme.colorScheme.surface,
                    divider = {}
                ) {
                    Tab(
                        selected = selectedTab == 0,
                        onClick = {
                            selectedTab = 0
                            amount = ""
                            reason = ""
                        },
                        text = { Text("Cash In") }
                    )
                    Tab(
                        selected = selectedTab == 1,
                        onClick = {
                            selectedTab = 1
                            amount = ""
                            reason = ""
                        },
                        text = { Text("Cash Out") }
                    )
                }

                // Tab Content
                Column(
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
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                    )

                    // Amount Input
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text(
                            text = "Amount",
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.Medium
                        )
                        OutlinedTextField(
                            value = amount,
                            onValueChange = {
                                // Only allow numbers and decimal point
                                if (it.isEmpty() || it.matches(Regex("^\\d*\\.?\\d{0,2}$"))) {
                                    amount = it
                                }
                            },
                            placeholder = { Text("0.00") },
                            modifier = Modifier.fillMaxWidth(),
                            singleLine = true,
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedContainerColor = if (isDarkTheme) Color(0xFF334155) else MaterialTheme.colorScheme.surface,
                                unfocusedContainerColor = if (isDarkTheme) Color(0xFF334155) else MaterialTheme.colorScheme.surface
                            )
                        )
                    }

                    // Reason Input
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text(
                            text = "Reason",
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.Medium
                        )
                        OutlinedTextField(
                            value = reason,
                            onValueChange = { reason = it },
                            placeholder = {
                                Text(
                                    if (selectedTab == 0) {
                                        "Reason for cash in..."
                                    } else {
                                        "Reason for cash out..."
                                    }
                                )
                            },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(100.dp),
                            minLines = 3,
                            maxLines = 3,
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedContainerColor = if (isDarkTheme) Color(0xFF334155) else MaterialTheme.colorScheme.surface,
                                unfocusedContainerColor = if (isDarkTheme) Color(0xFF334155) else MaterialTheme.colorScheme.surface
                            )
                        )
                    }
                }

                HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)

                // Action Buttons
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    OutlinedButton(
                        onClick = onClose,
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("Cancel")
                    }
                    Button(
                        onClick = {
                            val amountValue = amount.toDoubleOrNull()
                            if (amountValue != null && amountValue > 0) {
                                val type = if (selectedTab == 0) "cashIn" else "cashOut"
                                onConfirm(type, amountValue, reason.ifEmpty {
                                    if (selectedTab == 0) "Cash In" else "Cash Out"
                                })
                                onClose()
                            }
                        },
                        enabled = amount.toDoubleOrNull()?.let { it > 0 } ?: false,
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("Confirm")
                    }
                }
            }
        }
    }
}
