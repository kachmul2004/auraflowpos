package com.theauraflow.pos.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog

/**
 * Parked Sales Dialog matching web version design.
 * Shows list of parked sales with load and delete actions.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ParkedSalesDialog(
    open: Boolean,
    parkedSales: List<ParkedSale>,
    currentCartHasItems: Boolean,
    onClose: () -> Unit,
    onParkCurrent: () -> Unit,
    onLoadSale: (String) -> Unit,
    onDeleteSale: (String) -> Unit
) {
    if (!open) return

    var showConfirmDialog by remember { mutableStateOf(false) }
    var pendingLoadId by remember { mutableStateOf<String?>(null) }

    // Confirmation dialog for overwriting current cart
    if (showConfirmDialog && pendingLoadId != null) {
        AlertDialog(
            onDismissRequest = {
                showConfirmDialog = false
                pendingLoadId = null
            },
            title = { Text("Overwrite Current Cart?") },
            text = {
                Text("You have items in your current cart. Loading this parked sale will replace all current cart contents. This action cannot be undone.")
            },
            confirmButton = {
                TextButton(
                    onClick = {
                        pendingLoadId?.let { onLoadSale(it) }
                        showConfirmDialog = false
                        pendingLoadId = null
                        onClose()
                    }
                ) {
                    Text("Load Parked Sale")
                }
            },
            dismissButton = {
                TextButton(
                    onClick = {
                        showConfirmDialog = false
                        pendingLoadId = null
                    }
                ) {
                    Text("Cancel")
                }
            }
        )
    }

    Dialog(onDismissRequest = onClose) {
        Card(
            modifier = Modifier
                .width(672.dp) // max-w-2xl
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
                        text = if (parkedSales.isNotEmpty()) {
                            "Parked Sales (${parkedSales.size})"
                        } else {
                            "Parked Sales"
                        },
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.SemiBold
                    )
                    Text(
                        text = "Park the current sale or load a previously parked sale.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                    )
                }

                // Park Current Sale Button
                Button(
                    onClick = onParkCurrent,
                    enabled = currentCartHasItems,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("Park Current Sale")
                }

                // List of Parked Sales
                if (parkedSales.isEmpty()) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(384.dp), // h-96
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "No parked sales",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                        )
                    }
                } else {
                    LazyColumn(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(384.dp), // h-96
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        items(parkedSales) { sale ->
                            ParkedSaleCard(
                                sale = sale,
                                onLoad = {
                                    if (currentCartHasItems) {
                                        // Show confirmation dialog
                                        pendingLoadId = sale.id
                                        showConfirmDialog = true
                                    } else {
                                        // Load immediately
                                        onLoadSale(sale.id)
                                        onClose()
                                    }
                                },
                                onDelete = { onDeleteSale(sale.id) }
                            )
                        }
                    }
                }

                HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)

                // Close Button
                OutlinedButton(
                    onClick = onClose,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("Close")
                }
            }
        }
    }
}

/**
 * Individual parked sale card.
 */
@Composable
private fun ParkedSaleCard(
    sale: ParkedSale,
    onLoad: () -> Unit,
    onDelete: () -> Unit
) {
    Surface(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(8.dp),
        color = MaterialTheme.colorScheme.surfaceVariant
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            // Top row: Info and Total
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    Text(
                        text = sale.timestamp,
                        style = MaterialTheme.typography.bodySmall
                    )
                    Text(
                        text = "${sale.itemCount} item(s)",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                    )
                    if (sale.customerName != null) {
                        Text(
                            text = "Customer: ${sale.customerName}",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                        )
                    }
                }
                Text(
                    text = buildString {
                        append("$")
                        val priceStr = sale.total.toString()
                        val parts = priceStr.split(".")
                        append(parts.getOrNull(0) ?: "0")
                        append(".")
                        val decimal = parts.getOrNull(1)?.take(2)?.padEnd(2, '0') ?: "00"
                        append(decimal)
                    },
                    style = MaterialTheme.typography.bodyLarge,
                    fontWeight = FontWeight.Medium
                )
            }

            // Action buttons
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Button(
                    onClick = onLoad,
                    modifier = Modifier.weight(1f)
                ) {
                    Text("Load Sale")
                }
                OutlinedButton(
                    onClick = onDelete,
                    colors = ButtonDefaults.outlinedButtonColors(
                        contentColor = MaterialTheme.colorScheme.error
                    )
                ) {
                    Icon(
                        imageVector = Icons.Default.Delete,
                        contentDescription = "Delete",
                        modifier = Modifier.size(16.dp)
                    )
                }
            }
        }
    }
}

/**
 * Data class for parked sale.
 */
data class ParkedSale(
    val id: String,
    val timestamp: String,
    val itemCount: Int,
    val total: Double,
    val customerName: String? = null
)
