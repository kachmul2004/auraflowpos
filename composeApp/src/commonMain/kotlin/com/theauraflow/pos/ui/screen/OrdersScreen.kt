package com.theauraflow.pos.ui.screen

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Print
import androidx.compose.material.icons.filled.Receipt
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.theauraflow.pos.domain.model.Order
import com.theauraflow.pos.presentation.viewmodel.OrderViewModel

/**
 * Orders Screen matching web version design.
 * Shows order history with ability to view details and reprint receipts.
 *
 * Web reference: docs/Web Version/src/components/OrdersPage.tsx
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OrdersScreen(
    orderViewModel: OrderViewModel,
    onBack: () -> Unit,
    showBackButton: Boolean = true,
    modifier: Modifier = Modifier
) {
    val ordersState by orderViewModel.ordersState.collectAsState()
    val orders = when (val s = ordersState) {
        is com.theauraflow.pos.presentation.base.UiState.Success -> s.data
        else -> emptyList()
    }

    var selectedOrder by remember { mutableStateOf<Order?>(null) }

    LaunchedEffect(Unit) {
        orderViewModel.loadTodayOrders()
    }

    Scaffold(
        topBar = {
            Surface(
                modifier = Modifier.fillMaxWidth(),
                tonalElevation = 1.dp,
                shadowElevation = 1.dp
            ) {
                Column {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 24.dp, vertical = 16.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        if (showBackButton) {
                            IconButton(onClick = onBack) {
                                Icon(
                                    imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                                    contentDescription = "Back",
                                    modifier = Modifier.size(20.dp)
                                )
                            }
                        }
                        Column {
                            Text(
                                text = "Recent Orders",
                                style = MaterialTheme.typography.titleLarge,
                                fontWeight = FontWeight.SemiBold
                            )
                            Text(
                                text = "View and reprint receipts for recent orders",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                    HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
                }
            }
        }
    ) { paddingValues ->
        Row(
            modifier = modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            // Left: Order List (40%)
            Surface(
                modifier = Modifier
                    .weight(0.4f)
                    .fillMaxHeight(),
                color = MaterialTheme.colorScheme.surface
            ) {
                Column(modifier = Modifier.fillMaxSize()) {
                    // Header
                    Surface(
                        modifier = Modifier.fillMaxWidth(),
                        color = MaterialTheme.colorScheme.surfaceVariant
                    ) {
                        Text(
                            text = "Today's Orders (${orders.size})",
                            modifier = Modifier.padding(16.dp),
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Medium
                        )
                    }

                    // Order list
                    if (orders.isEmpty()) {
                        Box(
                            modifier = Modifier.fillMaxSize(),
                            contentAlignment = Alignment.Center
                        ) {
                            Column(
                                horizontalAlignment = Alignment.CenterHorizontally,
                                verticalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Receipt,
                                    contentDescription = null,
                                    modifier = Modifier.size(48.dp),
                                    tint = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.3f)
                                )
                                Text(
                                    text = "No orders yet",
                                    style = MaterialTheme.typography.bodyMedium,
                                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                                )
                            }
                        }
                    } else {
                        LazyColumn(
                            modifier = Modifier.fillMaxSize(),
                            contentPadding = PaddingValues(16.dp),
                            verticalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            items(orders) { order ->
                                OrderListItem(
                                    order = order,
                                    isSelected = selectedOrder?.id == order.id,
                                    onClick = { selectedOrder = order }
                                )
                            }
                        }
                    }
                }
            }

            VerticalDivider(color = MaterialTheme.colorScheme.outlineVariant)

            // Right: Order Details (60%)
            Surface(
                modifier = Modifier
                    .weight(0.6f)
                    .fillMaxHeight(),
                color = MaterialTheme.colorScheme.background
            ) {
                if (selectedOrder != null) {
                    OrderDetailView(
                        order = selectedOrder!!,
                        onPrintReceipt = {
                            // TODO: Print receipt
                        }
                    )
                } else {
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "Select an order to view details",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                        )
                    }
                }
            }
        }
    }
}

/**
 * Order list item card.
 */
@Composable
private fun OrderListItem(
    order: Order,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(8.dp),
        color = if (isSelected) {
            MaterialTheme.colorScheme.primaryContainer
        } else {
            MaterialTheme.colorScheme.surfaceVariant
        },
        border = if (isSelected) {
            androidx.compose.foundation.BorderStroke(
                2.dp,
                MaterialTheme.colorScheme.primary
            )
        } else null
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            // Order number and status
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = order.orderNumber,
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.SemiBold
                )
                Surface(
                    shape = RoundedCornerShape(4.dp),
                    color = when (order.orderStatus) {
                        com.theauraflow.pos.domain.model.OrderStatus.COMPLETED ->
                            MaterialTheme.colorScheme.primaryContainer

                        com.theauraflow.pos.domain.model.OrderStatus.CANCELLED ->
                            MaterialTheme.colorScheme.errorContainer

                        else -> MaterialTheme.colorScheme.secondaryContainer
                    }
                ) {
                    Text(
                        text = order.orderStatus.name,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Medium,
                        color = when (order.orderStatus) {
                            com.theauraflow.pos.domain.model.OrderStatus.COMPLETED ->
                                MaterialTheme.colorScheme.onPrimaryContainer

                            com.theauraflow.pos.domain.model.OrderStatus.CANCELLED ->
                                MaterialTheme.colorScheme.onErrorContainer

                            else -> MaterialTheme.colorScheme.onSecondaryContainer
                        }
                    )
                }
            }

            // Items count and payment method
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "${order.itemCount} item(s)",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                )
                Text(
                    text = order.paymentMethod.name,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                )
            }

            // Total
            Text(
                text = buildString {
                    append("$")
                    val priceStr = order.total.toString()
                    val parts = priceStr.split(".")
                    append(parts.getOrNull(0) ?: "0")
                    append(".")
                    val decimal = parts.getOrNull(1)?.take(2)?.padEnd(2, '0') ?: "00"
                    append(decimal)
                },
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
        }
    }
}

/**
 * Order detail view (right panel).
 */
@Composable
private fun OrderDetailView(
    order: Order,
    onPrintReceipt: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Header with print button
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                Text(
                    text = order.orderNumber,
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = "Order #${order.id.takeLast(6)}",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                )
            }
            Button(
                onClick = onPrintReceipt,
                colors = ButtonDefaults.buttonColors(
                    containerColor = MaterialTheme.colorScheme.primary
                )
            ) {
                Icon(
                    imageVector = Icons.Default.Print,
                    contentDescription = null,
                    modifier = Modifier.size(18.dp)
                )
                Spacer(Modifier.width(8.dp))
                Text("Print Receipt")
            }
        }

        HorizontalDivider()

        // Order items
        Text(
            text = "Items (${order.itemCount})",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.SemiBold
        )

        LazyColumn(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(order.items) { item ->
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(8.dp),
                    color = MaterialTheme.colorScheme.surfaceVariant
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(12.dp),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column(
                            modifier = Modifier.weight(1f),
                            verticalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            Text(
                                text = item.product.name,
                                style = MaterialTheme.typography.bodyMedium,
                                fontWeight = FontWeight.Medium
                            )
                            Text(
                                text = "Qty: ${item.quantity}",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                            )
                        }
                        Text(
                            text = buildString {
                                append("$")
                                val priceStr = item.total.toString()
                                val parts = priceStr.split(".")
                                append(parts.getOrNull(0) ?: "0")
                                append(".")
                                val decimal = parts.getOrNull(1)?.take(2)?.padEnd(2, '0') ?: "00"
                                append(decimal)
                            },
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }
            }
        }

        HorizontalDivider()

        // Totals
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text("Subtotal:", style = MaterialTheme.typography.bodyMedium)
                Text(
                    text = buildString {
                        append("$")
                        val priceStr = order.subtotal.toString()
                        val parts = priceStr.split(".")
                        append(parts.getOrNull(0) ?: "0")
                        append(".")
                        val decimal = parts.getOrNull(1)?.take(2)?.padEnd(2, '0') ?: "00"
                        append(decimal)
                    },
                    style = MaterialTheme.typography.bodyMedium
                )
            }
            if (order.discount > 0) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text("Discount:", style = MaterialTheme.typography.bodyMedium)
                    Text(
                        text = buildString {
                            append("-$")
                            val priceStr = order.discount.toString()
                            val parts = priceStr.split(".")
                            append(parts.getOrNull(0) ?: "0")
                            append(".")
                            val decimal = parts.getOrNull(1)?.take(2)?.padEnd(2, '0') ?: "00"
                            append(decimal)
                        },
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.error
                    )
                }
            }
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text("Tax:", style = MaterialTheme.typography.bodyMedium)
                Text(
                    text = buildString {
                        append("$")
                        val priceStr = order.tax.toString()
                        val parts = priceStr.split(".")
                        append(parts.getOrNull(0) ?: "0")
                        append(".")
                        val decimal = parts.getOrNull(1)?.take(2)?.padEnd(2, '0') ?: "00"
                        append(decimal)
                    },
                    style = MaterialTheme.typography.bodyMedium
                )
            }
            HorizontalDivider()
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "Total:",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = buildString {
                        append("$")
                        val priceStr = order.total.toString()
                        val parts = priceStr.split(".")
                        append(parts.getOrNull(0) ?: "0")
                        append(".")
                        val decimal = parts.getOrNull(1)?.take(2)?.padEnd(2, '0') ?: "00"
                        append(decimal)
                    },
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
            }
        }

        HorizontalDivider()

        // Payment info
        Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Text(
                text = "Payment Information",
                style = MaterialTheme.typography.titleSmall,
                fontWeight = FontWeight.SemiBold
            )
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text("Method:", style = MaterialTheme.typography.bodyMedium)
                Text(
                    text = order.paymentMethod.name,
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.Medium
                )
            }
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text("Status:", style = MaterialTheme.typography.bodyMedium)
                Text(
                    text = order.paymentStatus.name,
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.Medium,
                    color = if (order.isPaid) {
                        MaterialTheme.colorScheme.primary
                    } else {
                        MaterialTheme.colorScheme.error
                    }
                )
            }
        }
    }
}
