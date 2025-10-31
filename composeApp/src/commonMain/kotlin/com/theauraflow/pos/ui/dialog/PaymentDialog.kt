package com.theauraflow.pos.ui.dialog

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties

/**
 * Payment dialog for processing transactions.
 * Matches web version: docs/Web Version/src/components/PaymentDialog.tsx
 *
 * Features:
 * - 3 payment methods: Cash, Card, Other
 * - Amount received input with validation
 * - Quick amount buttons ($5, $10, $20, $50, $100, Exact)
 * - Change calculation for cash payments
 * - Order totals display (Subtotal, Discount, Tax, Total)
 * - Complete payment button
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PaymentDialog(
    open: Boolean,
    subtotal: Double,
    discount: Double,
    tax: Double,
    total: Double,
    onDismiss: () -> Unit,
    onCompletePayment: (paymentMethod: String, amountReceived: Double) -> Unit,
    modifier: Modifier = Modifier
) {
    var selectedPaymentMethod by remember { mutableStateOf(0) } // 0=Cash, 1=Card, 2=Other
    var amountReceived by remember { mutableStateOf("") }

    val paymentMethods = listOf("Cash", "Card", "Other")
    val isCashPayment = selectedPaymentMethod == 0

    val receivedAmount = amountReceived.toDoubleOrNull() ?: 0.0
    val changeDue = if (isCashPayment) (receivedAmount - total).coerceAtLeast(0.0) else 0.0
    val isPaymentValid = if (isCashPayment) receivedAmount >= total else true

    // Reset amount when dialog opens/closes
    LaunchedEffect(open) {
        if (open) {
            amountReceived = ""
            selectedPaymentMethod = 0
        }
    }

    if (open) {
        Dialog(
            onDismissRequest = onDismiss,
            properties = DialogProperties(usePlatformDefaultWidth = false)
        ) {
            Surface(
                modifier = modifier
                    .width(448.dp)
                    .wrapContentHeight(),
                shape = MaterialTheme.shapes.large,
                tonalElevation = 6.dp
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .verticalScroll(rememberScrollState())
                        .padding(24.dp),
                    verticalArrangement = Arrangement.spacedBy(20.dp)
                ) {
                    // Header
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "Payment",
                                style = MaterialTheme.typography.headlineSmall,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = "Select payment method and complete transaction",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                        IconButton(onClick = onDismiss) {
                            Icon(Icons.Default.Close, "Close")
                        }
                    }

                    // Order Summary Card
                    Card(
                        modifier = Modifier.fillMaxWidth(),
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
                            // Subtotal
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text("Subtotal:", fontSize = 14.sp)
                                Text("$${subtotal.formatPrice()}", fontSize = 14.sp)
                            }

                            // Discount
                            if (discount > 0) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text("Discount:", fontSize = 14.sp)
                                    Text(
                                        "-$${discount.formatPrice()}",
                                        fontSize = 14.sp,
                                        color = MaterialTheme.colorScheme.error
                                    )
                                }
                            }

                            // Tax
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text("Tax:", fontSize = 14.sp)
                                Text("$${tax.formatPrice()}", fontSize = 14.sp)
                            }

                            HorizontalDivider(
                                modifier = Modifier.padding(vertical = 4.dp),
                                color = MaterialTheme.colorScheme.outline.copy(alpha = 0.3f)
                            )

                            // Total
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(
                                    "Total:",
                                    fontSize = 18.sp,
                                    fontWeight = FontWeight.Bold
                                )
                                Text(
                                    "$${total.formatPrice()}",
                                    fontSize = 18.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.primary
                                )
                            }
                        }
                    }

                    // Payment Method Tabs
                    TabRow(
                        selectedTabIndex = selectedPaymentMethod,
                        containerColor = MaterialTheme.colorScheme.surfaceVariant,
                        contentColor = MaterialTheme.colorScheme.onSurface
                    ) {
                        paymentMethods.forEachIndexed { index, method ->
                            Tab(
                                selected = selectedPaymentMethod == index,
                                onClick = { selectedPaymentMethod = index },
                                text = {
                                    Row(
                                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Icon(
                                            when (index) {
                                                0 -> Icons.Default.Money
                                                1 -> Icons.Default.CreditCard
                                                else -> Icons.Default.Payment
                                            },
                                            contentDescription = method,
                                            modifier = Modifier.size(20.dp)
                                        )
                                        Text(method)
                                    }
                                }
                            )
                        }
                    }

                    // Payment Method Content
                    when (selectedPaymentMethod) {
                        0 -> CashPaymentContent(
                            amountReceived = amountReceived,
                            onAmountChange = { amountReceived = it },
                            total = total,
                            changeDue = changeDue
                        )

                        1 -> CardPaymentContent()
                        2 -> OtherPaymentContent()
                    }

                    // Action Buttons
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        OutlinedButton(
                            onClick = onDismiss,
                            modifier = Modifier.weight(1f)
                        ) {
                            Text("Cancel")
                        }

                        Button(
                            onClick = {
                                val method = paymentMethods[selectedPaymentMethod].lowercase()
                                val amount = if (isCashPayment) receivedAmount else total
                                onCompletePayment(method, amount)
                            },
                            enabled = isPaymentValid,
                            modifier = Modifier.weight(1f),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = Color(0xFF22C55E),
                                contentColor = Color.White
                            )
                        ) {
                            Icon(
                                Icons.Default.Check,
                                contentDescription = null,
                                modifier = Modifier.size(20.dp)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Complete Payment")
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun CashPaymentContent(
    amountReceived: String,
    onAmountChange: (String) -> Unit,
    total: Double,
    changeDue: Double
) {
    Column(
        modifier = Modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // Amount Received Input
        OutlinedTextField(
            value = amountReceived,
            onValueChange = onAmountChange,
            label = { Text("Amount Received") },
            placeholder = { Text("0.00") },
            leadingIcon = {
                Icon(Icons.Default.Money, null)
            },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
            modifier = Modifier.fillMaxWidth(),
            singleLine = true
        )

        // Quick Amount Buttons
        Column(
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                listOf(5, 10, 20).forEach { amount ->
                    OutlinedButton(
                        onClick = { onAmountChange(amount.toString()) },
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("$$amount")
                    }
                }
            }
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                listOf(50, 100).forEach { amount ->
                    OutlinedButton(
                        onClick = { onAmountChange(amount.toString()) },
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("$$amount")
                    }
                }
                OutlinedButton(
                    onClick = { onAmountChange(total.toString()) },
                    modifier = Modifier.weight(1f)
                ) {
                    Text("Exact")
                }
            }
        }

        // Change Due Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(
                containerColor = if (changeDue < 0) {
                    MaterialTheme.colorScheme.errorContainer
                } else {
                    MaterialTheme.colorScheme.primaryContainer
                }
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
                    "Change Due:",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Medium
                )
                Text(
                    "$${changeDue.formatPrice()}",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = if (changeDue < 0) {
                        MaterialTheme.colorScheme.error
                    } else {
                        MaterialTheme.colorScheme.primary
                    }
                )
            }
        }
    }
}

@Composable
private fun CardPaymentContent() {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Icon(
            Icons.Default.CreditCard,
            contentDescription = null,
            modifier = Modifier.size(64.dp),
            tint = MaterialTheme.colorScheme.primary
        )
        Text(
            "Process card payment through your payment terminal",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            textAlign = TextAlign.Center
        )
    }
}

@Composable
private fun OtherPaymentContent() {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Icon(
            Icons.Default.Payment,
            contentDescription = null,
            modifier = Modifier.size(64.dp),
            tint = MaterialTheme.colorScheme.primary
        )
        Text(
            "Other payment methods (check, mobile payment, etc.)",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            textAlign = TextAlign.Center
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
