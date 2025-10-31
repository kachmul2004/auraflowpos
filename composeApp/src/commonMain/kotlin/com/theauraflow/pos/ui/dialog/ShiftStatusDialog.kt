package com.theauraflow.pos.ui.dialog

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Print
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import kotlinx.datetime.Clock
import kotlinx.datetime.Instant
import kotlinx.datetime.TimeZone
import kotlinx.datetime.toLocalDateTime

/**
 * Shift Status Dialog with detailed shift summary
 * Matches web: ShiftDialog.tsx
 */
@Composable
fun ShiftStatusDialog(
    open: Boolean,
    terminalName: String = "Terminal #1",
    clockInTime: Long = 0L,
    clockOutTime: Long? = null,
    openingBalance: Double = 0.0,
    totalOrders: Int = 0,
    totalSales: Double = 0.0,
    cashSales: Double = 0.0,
    cashIn: Double = 0.0,
    cashOut: Double = 0.0,
    closingBalance: Double? = null,
    totalTransactions: Int = 0,
    noSaleCount: Int = 0,
    cashMovementCount: Int = 0,
    onDismiss: () -> Unit,
    onClockOut: () -> Unit = {},
    onPrintReport: () -> Unit = {}
) {
    val expectedCash = openingBalance + cashSales + cashIn - cashOut
    val variance = if (closingBalance != null) closingBalance - expectedCash else 0.0

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
                .widthIn(max = 500.dp)
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
                    text = "Shift Status Summary",
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.SemiBold
                )
                Text(
                    text = "Current session details and transaction summary.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.padding(top = 4.dp)
                )

                Spacer(Modifier.height(24.dp))

                // Scrollable content
                Column(
                    modifier = Modifier
                        .weight(1f, fill = false)
                        .verticalScroll(rememberScrollState()),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    // Terminal & Time Info
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        InfoRow("Terminal:", terminalName)
                        InfoRow("Clocked In:", formatDateTime(clockInTime))
                        if (clockOutTime != null) {
                            InfoRow("Clocked Out:", formatDateTime(clockOutTime))
                        }
                    }

                    HorizontalDivider()

                    // Sales Summary
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        InfoRow("Opening Balance:", formatMoney(openingBalance))
                        InfoRow("Total Orders:", totalOrders.toString())
                        InfoRow("Total Sales:", formatMoney(totalSales))
                        InfoRow("Cash Sales:", formatMoney(cashSales))

                        if (cashIn > 0.0) {
                            InfoRow(
                                "Cash In:",
                                "+${formatMoney(cashIn)}",
                                valueColor = MaterialTheme.colorScheme.tertiary
                            )
                        }
                        if (cashOut > 0.0) {
                            InfoRow(
                                "Cash Out:",
                                "-${formatMoney(cashOut)}",
                                valueColor = MaterialTheme.colorScheme.error
                            )
                        }
                    }

                    HorizontalDivider()

                    // Expected Cash (larger text)
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Expected Cash:",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                        Text(
                            text = formatMoney(expectedCash),
                            fontSize = 18.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                    }

                    // Closing Balance & Variance (if shift ended)
                    if (closingBalance != null) {
                        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            InfoRow("Closing Balance:", formatMoney(closingBalance))
                            InfoRow(
                                "Variance:",
                                formatMoney(variance),
                                valueColor = if (variance != 0.0)
                                    MaterialTheme.colorScheme.error
                                else
                                    MaterialTheme.colorScheme.onSurface
                            )
                        }
                    }

                    HorizontalDivider()

                    // Transaction Details
                    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        Text(
                            text = "Transaction Details",
                            fontSize = 12.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            fontWeight = FontWeight.Medium
                        )
                        Text(
                            text = "Total Transactions: $totalTransactions",
                            fontSize = 12.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Text(
                            text = "Orders: $totalOrders",
                            fontSize = 12.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Text(
                            text = "No Sales: $noSaleCount",
                            fontSize = 12.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Text(
                            text = "Cash Movements: $cashMovementCount",
                            fontSize = 12.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }

                Spacer(Modifier.height(24.dp))

                // Action buttons
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Print Report button on left
                    OutlinedButton(
                        onClick = onPrintReport,
                        contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Print,
                            contentDescription = null,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(Modifier.width(8.dp))
                        Text("Print Report")
                    }

                    // Cancel + Clock Out buttons on right
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        OutlinedButton(onClick = onDismiss) {
                            Text("Cancel")
                        }

                        // Only show Clock Out if shift is still active
                        if (clockOutTime == null) {
                            Button(onClick = onClockOut) {
                                Text("Clock Out")
                            }
                        }
                    }
                }
            }
        }
    }
}

/**
 * Format money amount to $X.XX
 */
private fun formatMoney(amount: Double): String {
    val wholePart = amount.toInt()
    val decimalPart = ((amount - wholePart) * 100).toInt().toString().padStart(2, '0')
    return "$$wholePart.$decimalPart"
}

/**
 * Format timestamp to readable date/time string
 * Format: MM/dd/yyyy hh:mm a
 */
@OptIn(kotlin.time.ExperimentalTime::class)
private fun formatDateTime(timestamp: Long): String {
    val instant = Instant.fromEpochMilliseconds(timestamp)
    val dateTime = instant.toLocalDateTime(TimeZone.currentSystemDefault())

    val month = dateTime.monthNumber.toString().padStart(2, '0')
    val day = dateTime.dayOfMonth.toString().padStart(2, '0')
    val year = dateTime.year

    val hour12 = when {
        dateTime.hour == 0 -> 12
        dateTime.hour > 12 -> dateTime.hour - 12
        else -> dateTime.hour
    }
    val minute = dateTime.minute.toString().padStart(2, '0')
    val amPm = if (dateTime.hour < 12) "AM" else "PM"

    return "$month/$day/$year ${hour12.toString().padStart(2, '0')}:$minute $amPm"
}

@Composable
private fun InfoRow(
    label: String,
    value: String,
    valueColor: androidx.compose.ui.graphics.Color = MaterialTheme.colorScheme.onSurface
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = label,
            fontSize = 14.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Text(
            text = value,
            fontSize = 14.sp,
            color = valueColor,
            fontWeight = FontWeight.Medium
        )
    }
}
