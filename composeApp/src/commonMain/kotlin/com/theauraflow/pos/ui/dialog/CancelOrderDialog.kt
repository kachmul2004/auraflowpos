package com.theauraflow.pos.ui.dialog

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.theauraflow.pos.domain.model.Order
import com.theauraflow.pos.domain.model.PaymentMethod
import com.theauraflow.pos.core.util.formatCurrency

/**
 * Enterprise cancel order dialog with:
 * - Cancellation reason (required)
 * - Refund option (for paid orders)
 * - Restock inventory option
 * - Notifications option (email/SMS to customer)
 * - Audit trail notes
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CancelOrderDialog(
    order: Order,
    onDismiss: () -> Unit,
    onConfirm: (CancelOrderRequest) -> Unit
) {
    var reason by remember { mutableStateOf("") }
    var issueRefund by remember { mutableStateOf(order.isPaid) }
    var restockItems by remember { mutableStateOf(true) }
    var notifyCustomer by remember { mutableStateOf(order.customerName != null) }
    var additionalNotes by remember { mutableStateOf("") }

    val focusManager = LocalFocusManager.current

    val canConfirm = reason.isNotBlank()

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
                .widthIn(max = 600.dp)
                .heightIn(max = 700.dp)
                .clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null
                ) { focusManager.clearFocus() },
            shape = RoundedCornerShape(16.dp),
            color = MaterialTheme.colorScheme.surface
        ) {
            Column(modifier = Modifier.fillMaxSize()) {
                // Header
                Surface(
                    color = MaterialTheme.colorScheme.errorContainer,
                    shape = RoundedCornerShape(topStart = 16.dp, topEnd = 16.dp)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(24.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                Icons.Default.Warning,
                                contentDescription = null,
                                modifier = Modifier.size(28.dp),
                                tint = MaterialTheme.colorScheme.onErrorContainer
                            )
                            Column {
                                Text(
                                    text = "Cancel Order",
                                    style = MaterialTheme.typography.headlineSmall,
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.onErrorContainer
                                )
                                Text(
                                    text = order.orderNumber,
                                    style = MaterialTheme.typography.titleMedium,
                                    color = MaterialTheme.colorScheme.onErrorContainer.copy(alpha = 0.8f)
                                )
                            }
                        }
                        IconButton(onClick = onDismiss) {
                            Icon(
                                Icons.Default.Close,
                                "Close",
                                tint = MaterialTheme.colorScheme.onErrorContainer
                            )
                        }
                    }
                }

                // Warning message
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(24.dp),
                    shape = RoundedCornerShape(8.dp),
                    color = MaterialTheme.colorScheme.errorContainer.copy(alpha = 0.5f)
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Icon(
                            Icons.Default.Warning,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.error
                        )
                        Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                            Text(
                                "Warning: This action cannot be undone",
                                style = MaterialTheme.typography.bodyMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.error
                            )
                            Text(
                                "• Order will be permanently marked as cancelled\n" +
                                        "• Transaction records will be updated\n" +
                                        "• This will be logged in the audit trail",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onErrorContainer
                            )
                        }
                    }
                }

                // Content
                LazyColumn(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f)
                        .padding(horizontal = 24.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    // Order summary
                    item {
                        Card(
                            colors = CardDefaults.cardColors(
                                containerColor = MaterialTheme.colorScheme.surfaceVariant
                            )
                        ) {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(16.dp),
                                verticalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Text(
                                    "Order Summary",
                                    style = MaterialTheme.typography.labelMedium,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text("Customer:")
                                    Text(
                                        order.customerName ?: "Walk-in",
                                        fontWeight = FontWeight.Medium
                                    )
                                }
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text("Total Amount:")
                                    Text(
                                        "$${order.total.formatCurrency()}",
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text("Payment Status:")
                                    Text(
                                        order.paymentStatus.name,
                                        fontWeight = FontWeight.Medium,
                                        color = if (order.isPaid) MaterialTheme.colorScheme.primary
                                        else MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                            }
                        }
                    }

                    // Cancellation reason (required)
                    item {
                        Text(
                            "Cancellation Reason *",
                            style = MaterialTheme.typography.labelLarge,
                            fontWeight = FontWeight.SemiBold
                        )
                        OutlinedTextField(
                            value = reason,
                            onValueChange = { reason = it },
                            modifier = Modifier.fillMaxWidth(),
                            placeholder = { Text("Enter reason for cancellation...") },
                            minLines = 3,
                            maxLines = 5,
                            isError = reason.isBlank()
                        )
                        if (reason.isBlank()) {
                            Text(
                                "Reason is required for audit purposes",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.error
                            )
                        }
                    }

                    // Refund option (if order is paid)
                    if (order.isPaid) {
                        item {
                            Card(
                                colors = CardDefaults.cardColors(
                                    containerColor = MaterialTheme.colorScheme.primaryContainer
                                )
                            ) {
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clickable { issueRefund = !issueRefund }
                                        .padding(16.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(
                                            "Issue Refund",
                                            style = MaterialTheme.typography.bodyLarge,
                                            fontWeight = FontWeight.SemiBold
                                        )
                                        Text(
                                            "Refund $${order.total.formatCurrency()} to ${order.paymentMethod.name}",
                                            style = MaterialTheme.typography.bodySmall,
                                            color = MaterialTheme.colorScheme.onPrimaryContainer.copy(
                                                alpha = 0.7f
                                            )
                                        )
                                    }
                                    Checkbox(
                                        checked = issueRefund,
                                        onCheckedChange = { issueRefund = it }
                                    )
                                }
                            }
                        }
                    }

                    // Restock items option
                    item {
                        Card(
                            colors = CardDefaults.cardColors(
                                containerColor = MaterialTheme.colorScheme.secondaryContainer
                            )
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable { restockItems = !restockItems }
                                    .padding(16.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        "Restock Inventory",
                                        style = MaterialTheme.typography.bodyLarge,
                                        fontWeight = FontWeight.SemiBold
                                    )
                                    Text(
                                        "Add ${order.itemCount} items back to inventory",
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.onSecondaryContainer.copy(
                                            alpha = 0.7f
                                        )
                                    )
                                }
                                Checkbox(
                                    checked = restockItems,
                                    onCheckedChange = { restockItems = it }
                                )
                            }
                        }
                    }

                    // Notify customer option
                    if (order.customerName != null) {
                        item {
                            Card(
                                colors = CardDefaults.cardColors(
                                    containerColor = MaterialTheme.colorScheme.tertiaryContainer
                                )
                            ) {
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clickable { notifyCustomer = !notifyCustomer }
                                        .padding(16.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(
                                            "Notify Customer",
                                            style = MaterialTheme.typography.bodyLarge,
                                            fontWeight = FontWeight.SemiBold
                                        )
                                        Text(
                                            "Send cancellation notification via email/SMS",
                                            style = MaterialTheme.typography.bodySmall,
                                            color = MaterialTheme.colorScheme.onTertiaryContainer.copy(
                                                alpha = 0.7f
                                            )
                                        )
                                    }
                                    Checkbox(
                                        checked = notifyCustomer,
                                        onCheckedChange = { notifyCustomer = it }
                                    )
                                }
                            }
                        }
                    }

                    // Additional notes
                    item {
                        Text(
                            "Additional Notes (Optional)",
                            style = MaterialTheme.typography.labelLarge,
                            fontWeight = FontWeight.SemiBold
                        )
                        OutlinedTextField(
                            value = additionalNotes,
                            onValueChange = { additionalNotes = it },
                            modifier = Modifier.fillMaxWidth(),
                            placeholder = { Text("Add any additional information for audit trail...") },
                            minLines = 2,
                            maxLines = 4
                        )
                    }

                    item { Spacer(Modifier.height(8.dp)) }
                }

                // Actions footer
                Surface(
                    color = MaterialTheme.colorScheme.surfaceVariant
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(24.dp),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        OutlinedButton(
                            onClick = onDismiss,
                            modifier = Modifier.weight(1f)
                        ) {
                            Text("Go Back")
                        }
                        Button(
                            onClick = {
                                onConfirm(
                                    CancelOrderRequest(
                                        orderId = order.id,
                                        reason = reason,
                                        issueRefund = issueRefund,
                                        restockItems = restockItems,
                                        notifyCustomer = notifyCustomer,
                                        additionalNotes = additionalNotes.takeIf { it.isNotBlank() }
                                    )
                                )
                            },
                            enabled = canConfirm,
                            modifier = Modifier.weight(1f),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = MaterialTheme.colorScheme.error
                            )
                        ) {
                            Text("Confirm Cancellation")
                        }
                    }
                }
            }
        }
    }
}

/**
 * Request data for cancelling an order.
 */
data class CancelOrderRequest(
    val orderId: String,
    val reason: String,
    val issueRefund: Boolean,
    val restockItems: Boolean,
    val notifyCustomer: Boolean,
    val additionalNotes: String?
)
