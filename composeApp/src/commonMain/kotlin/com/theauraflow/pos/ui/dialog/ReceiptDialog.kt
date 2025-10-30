package com.theauraflow.pos.ui.dialog

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.theauraflow.pos.domain.model.CartItem

/**
 * Receipt dialog showing order confirmation after successful payment.
 * Matches web version: docs/Web Version/src/components/ReceiptDialog.tsx
 *
 * Features:
 * - Business name and order details header
 * - Complete item list with modifiers
 * - Payment totals (Subtotal, Discount, Tax, Total)
 * - Payment method and change (if cash)
 * - Action buttons: Email, Print, New Order
 * - Thank you message
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ReceiptDialog(
    open: Boolean,
    orderNumber: String,
    items: List<CartItem>,
    subtotal: Double,
    discount: Double,
    tax: Double,
    total: Double,
    paymentMethod: String,
    amountReceived: Double,
    customerName: String? = null,
    notes: String? = null,
    timestamp: String = "Today", // TODO: Use kotlinx-datetime when available
    onDismiss: () -> Unit,
    onNewOrder: () -> Unit,
    onPrint: () -> Unit = {},
    onEmail: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    val changeDue = if (paymentMethod.equals("cash", ignoreCase = true)) {
        (amountReceived - total).coerceAtLeast(0.0)
    } else 0.0

    if (open) {
        Dialog(
            onDismissRequest = onDismiss,
            properties = DialogProperties(usePlatformDefaultWidth = false)
        ) {
            Surface(
                modifier = modifier
                    .fillMaxWidth(0.85f)
                    .fillMaxHeight(0.9f),
                shape = MaterialTheme.shapes.large,
                tonalElevation = 6.dp
            ) {
                Column(
                    modifier = Modifier.fillMaxSize()
                ) {
                    // Fixed Header
                    Surface(
                        modifier = Modifier.fillMaxWidth(),
                        color = MaterialTheme.colorScheme.surfaceVariant,
                        tonalElevation = 2.dp
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(24.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "Receipt",
                                    style = MaterialTheme.typography.headlineSmall,
                                    fontWeight = FontWeight.Bold
                                )
                                IconButton(onClick = onDismiss) {
                                    Icon(Icons.Default.Close, "Close")
                                }
                            }
                            Text(
                                text = "Transaction completed successfully",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                textAlign = TextAlign.Center
                            )
                        }
                    }

                    // Scrollable Content
                    Column(
                        modifier = Modifier
                            .weight(1f)
                            .fillMaxWidth()
                            .verticalScroll(rememberScrollState())
                            .padding(24.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        // Business Header
                        Column(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            Text(
                                text = "AuraFlow POS",
                                style = MaterialTheme.typography.titleLarge,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = timestamp,
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Text(
                                text = "Order #$orderNumber",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }

                        HorizontalDivider()

                        // Customer Info (if present)
                        if (customerName != null) {
                            Column(
                                modifier = Modifier.fillMaxWidth(),
                                verticalArrangement = Arrangement.spacedBy(4.dp)
                            ) {
                                Text(
                                    text = "Customer: $customerName",
                                    style = MaterialTheme.typography.bodyMedium
                                )
                            }
                            HorizontalDivider()
                        }

                        // Items List
                        Column(
                            modifier = Modifier.fillMaxWidth(),
                            verticalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            items.forEach { item ->
                                ReceiptItem(item = item)
                            }
                        }

                        HorizontalDivider()

                        // Totals
                        Column(
                            modifier = Modifier.fillMaxWidth(),
                            verticalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            TotalRow(label = "Subtotal:", amount = subtotal)

                            if (discount > 0) {
                                TotalRow(
                                    label = "Discount:",
                                    amount = -discount,
                                    color = MaterialTheme.colorScheme.error
                                )
                            }

                            TotalRow(label = "Tax:", amount = tax)

                            HorizontalDivider()

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(
                                    "Total:",
                                    style = MaterialTheme.typography.titleMedium,
                                    fontWeight = FontWeight.Bold
                                )
                                Text(
                                    "$${total.formatPrice()}",
                                    style = MaterialTheme.typography.titleMedium,
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.primary
                                )
                            }
                        }

                        // Payment Details (Cash only shows change)
                        if (paymentMethod.equals("cash", ignoreCase = true)) {
                            HorizontalDivider()
                            Column(
                                modifier = Modifier.fillMaxWidth(),
                                verticalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                TotalRow(label = "Cash Received:", amount = amountReceived)
                                if (changeDue > 0) {
                                    TotalRow(
                                        label = "Change:",
                                        amount = changeDue,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                            }
                        }

                        HorizontalDivider()

                        // Payment Method & Thank You
                        Column(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Text(
                                text = "Payment: ${paymentMethod.uppercase()}",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )

                            if (notes != null) {
                                Text(
                                    text = notes,
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    textAlign = TextAlign.Center
                                )
                            }

                            Spacer(modifier = Modifier.height(8.dp))

                            Text(
                                text = "Thank you for your purchase!",
                                style = MaterialTheme.typography.bodyMedium,
                                fontWeight = FontWeight.Medium,
                                textAlign = TextAlign.Center
                            )
                        }
                    }

                    // Fixed Footer - Action Buttons
                    Surface(
                        modifier = Modifier.fillMaxWidth(),
                        color = MaterialTheme.colorScheme.surface,
                        tonalElevation = 2.dp,
                        shadowElevation = 8.dp
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(24.dp),
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            OutlinedButton(
                                onClick = onEmail,
                                modifier = Modifier.weight(1f)
                            ) {
                                Icon(
                                    Icons.Default.Mail,
                                    contentDescription = null,
                                    modifier = Modifier.size(18.dp)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text("Email")
                            }

                            OutlinedButton(
                                onClick = onPrint,
                                modifier = Modifier.weight(1f)
                            ) {
                                Icon(
                                    Icons.Default.Print,
                                    contentDescription = null,
                                    modifier = Modifier.size(18.dp)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text("Print")
                            }

                            Button(
                                onClick = {
                                    onNewOrder()
                                    onDismiss()
                                },
                                modifier = Modifier.weight(1f)
                            ) {
                                Icon(
                                    Icons.Default.AddCircle,
                                    contentDescription = null,
                                    modifier = Modifier.size(18.dp)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text("New Order")
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun ReceiptItem(item: CartItem) {
    Column(
        modifier = Modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        // Item name and total
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.Top
        ) {
            Column(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(2.dp)
            ) {
                Text(
                    text = item.product.name,
                    style = MaterialTheme.typography.bodyMedium
                )
                Text(
                    text = "$${item.product.price.formatPrice()} × ${item.quantity}",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )

                // Modifiers
                if (item.modifiers.isNotEmpty()) {
                    Column(
                        modifier = Modifier.padding(start = 8.dp, top = 4.dp),
                        verticalArrangement = Arrangement.spacedBy(2.dp)
                    ) {
                        item.modifiers.forEach { modifier ->
                            Text(
                                text = "+ ${modifier.name}${
                                    if ((modifier.price ?: 0.0) > 0)
                                        " (+$${modifier.price.formatPrice()})"
                                    else ""
                                }",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }
            }

            Text(
                text = "$${item.subtotal.formatPrice()}",
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.Medium
            )
        }
    }
}

@Composable
private fun TotalRow(
    label: String,
    amount: Double,
    color: androidx.compose.ui.graphics.Color = MaterialTheme.colorScheme.onSurface,
    fontWeight: FontWeight? = null
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.bodyMedium,
            color = color,
            fontWeight = fontWeight
        )
        Text(
            text = if (amount < 0) "-$${(-amount).formatPrice()}" else "$${amount.formatPrice()}",
            style = MaterialTheme.typography.bodyMedium,
            color = color,
            fontWeight = fontWeight
        )
    }
}

/**
 * Format double to 2 decimal places.
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
