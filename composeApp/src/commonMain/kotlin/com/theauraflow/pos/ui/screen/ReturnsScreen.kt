package com.theauraflow.pos.ui.screen

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/**
 * Returns Screen matching web version design.
 * Allows searching for orders and processing returns.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ReturnsScreen(
    orders: List<ReturnOrder>,
    onBack: () -> Unit,
    onProcessReturn: (orderId: String, itemIds: List<String>, reason: String) -> Unit,
    modifier: Modifier = Modifier
) {
    var searchQuery by remember { mutableStateOf("") }
    var selectedOrder by remember { mutableStateOf<ReturnOrder?>(null) }
    var selectedItems by remember { mutableStateOf<Set<String>>(emptySet()) }
    var returnReason by remember { mutableStateOf("") }

    val filteredOrders = remember(orders, searchQuery) {
        if (searchQuery.isBlank()) {
            orders.take(20)
        } else {
            orders.filter { order ->
                order.orderNumber.contains(searchQuery, ignoreCase = true) ||
                        order.id.contains(searchQuery, ignoreCase = true)
            }
        }
    }

    val returnTotal = remember(selectedOrder, selectedItems) {
        selectedOrder?.items
            ?.filter { selectedItems.contains(it.id) }
            ?.sumOf { it.quantity * it.unitPrice } ?: 0.0
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
                        IconButton(onClick = onBack) {
                            Icon(
                                imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                                contentDescription = "Back",
                                modifier = Modifier.size(20.dp)
                            )
                        }
                        Column {
                            Text(
                                text = "Process Return",
                                style = MaterialTheme.typography.titleLarge,
                                fontWeight = FontWeight.SemiBold
                            )
                            Text(
                                text = "Search for the original order and select items to return",
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
        Box(
            modifier = modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(24.dp)
        ) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .widthIn(max = 1792.dp) // max-w-7xl
                    .align(Alignment.TopCenter)
            ) {
                if (selectedOrder == null) {
                    // Order search view
                    Column(
                        modifier = Modifier.fillMaxSize(),
                        verticalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        // Search bar
                        OutlinedTextField(
                            value = searchQuery,
                            onValueChange = { searchQuery = it },
                            modifier = Modifier
                                .fillMaxWidth()
                                .widthIn(max = 672.dp), // max-w-2xl
                            placeholder = { Text("Search by order number...") },
                            leadingIcon = {
                                Icon(
                                    Icons.Default.Search,
                                    contentDescription = null,
                                    modifier = Modifier.size(16.dp),
                                    tint = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            },
                            singleLine = true
                        )

                        // Order grid
                        if (filteredOrders.isEmpty()) {
                            Box(
                                modifier = Modifier
                                    .fillMaxSize()
                                    .weight(1f),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = "No orders found",
                                    style = MaterialTheme.typography.bodyMedium,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        } else {
                            LazyVerticalGrid(
                                columns = GridCells.Adaptive(minSize = 300.dp),
                                modifier = Modifier
                                    .fillMaxSize()
                                    .weight(1f),
                                horizontalArrangement = Arrangement.spacedBy(16.dp),
                                verticalArrangement = Arrangement.spacedBy(16.dp),
                                contentPadding = PaddingValues(bottom = 24.dp)
                            ) {
                                items(filteredOrders) { order ->
                                    OrderSearchCard(
                                        order = order,
                                        onClick = { selectedOrder = order }
                                    )
                                }
                            }
                        }
                    }
                } else {
                    // Return processing view
                    Column(
                        modifier = Modifier.fillMaxSize(),
                        verticalArrangement = Arrangement.spacedBy(24.dp)
                    ) {
                        // Order info card
                        val order = selectedOrder ?: return@Column
                        Card(
                            modifier = Modifier.fillMaxWidth().widthIn(max = 1024.dp),
                            shape = RoundedCornerShape(8.dp),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                            elevation = CardDefaults.cardElevation(1.dp)
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(24.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text(
                                        text = "Order #${order.orderNumber}",
                                        style = MaterialTheme.typography.titleLarge,
                                        fontWeight = FontWeight.Medium
                                    )
                                    Text(
                                        text = order.dateCreated,
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                                        modifier = Modifier.padding(top = 4.dp)
                                    )
                                }
                                OutlinedButton(
                                    onClick = {
                                        selectedOrder = null
                                        selectedItems = emptySet()
                                        returnReason = ""
                                    }
                                ) {
                                    Text("Change Order")
                                }
                            }
                        }

                        // Items selection
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .widthIn(max = 1024.dp)
                                .weight(1f),
                            shape = RoundedCornerShape(8.dp),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                            elevation = CardDefaults.cardElevation(1.dp)
                        ) {
                            Column(
                                modifier = Modifier
                                    .fillMaxSize()
                                    .padding(24.dp)
                            ) {
                                Text(
                                    text = "Select Items to Return",
                                    style = MaterialTheme.typography.titleMedium,
                                    fontWeight = FontWeight.Medium,
                                    modifier = Modifier.padding(bottom = 16.dp)
                                )
                                LazyColumn(
                                    modifier = Modifier.fillMaxWidth(),
                                    verticalArrangement = Arrangement.spacedBy(12.dp)
                                ) {
                                    items(order.items) { item ->
                                        ReturnItemCard(
                                            item = item,
                                            isSelected = selectedItems.contains(item.id),
                                            onToggle = {
                                                selectedItems =
                                                    if (selectedItems.contains(item.id)) {
                                                        selectedItems - item.id
                                                    } else {
                                                        selectedItems + item.id
                                                    }
                                            }
                                        )
                                    }
                                }
                            }
                        }

                        // Reason textarea
                        Card(
                            modifier = Modifier.fillMaxWidth().widthIn(max = 1024.dp),
                            shape = RoundedCornerShape(8.dp),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                            elevation = CardDefaults.cardElevation(1.dp)
                        ) {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(24.dp),
                                verticalArrangement = Arrangement.spacedBy(12.dp)
                            ) {
                                Text(
                                    text = "Return Reason *",
                                    style = MaterialTheme.typography.titleMedium,
                                    fontWeight = FontWeight.Medium
                                )
                                OutlinedTextField(
                                    value = returnReason,
                                    onValueChange = { returnReason = it },
                                    modifier = Modifier.fillMaxWidth().height(100.dp),
                                    placeholder = { Text("Enter reason for return...") },
                                    minLines = 3
                                )
                            }
                        }

                        // Return total
                        Card(
                            modifier = Modifier.fillMaxWidth().widthIn(max = 1024.dp),
                            shape = RoundedCornerShape(8.dp),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                            elevation = CardDefaults.cardElevation(1.dp)
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(24.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "Return Total:",
                                    style = MaterialTheme.typography.titleLarge
                                )
                                Text(
                                    text = buildString {
                                        append("$")
                                        val priceStr = returnTotal.toString()
                                        val parts = priceStr.split(".")
                                        append(parts.getOrNull(0) ?: "0")
                                        append(".")
                                        val decimal =
                                            parts.getOrNull(1)?.take(2)?.padEnd(2, '0') ?: "00"
                                        append(decimal)
                                    },
                                    style = MaterialTheme.typography.displaySmall,
                                    fontWeight = FontWeight.Medium
                                )
                            }
                        }

                        // Action buttons
                        Row(
                            modifier = Modifier.fillMaxWidth().widthIn(max = 1024.dp),
                            horizontalArrangement = Arrangement.spacedBy(16.dp)
                        ) {
                            OutlinedButton(
                                onClick = onBack,
                                modifier = Modifier.weight(1f).height(48.dp)
                            ) {
                                Text("Cancel")
                            }
                            Button(
                                onClick = {
                                    if (selectedOrder != null && selectedItems.isNotEmpty() && returnReason.isNotBlank()) {
                                        onProcessReturn(
                                            selectedOrder!!.id,
                                            selectedItems.toList(),
                                            returnReason
                                        )
                                        onBack()
                                    }
                                },
                                enabled = selectedItems.isNotEmpty() && returnReason.isNotBlank(),
                                modifier = Modifier.weight(1f).height(48.dp)
                            ) {
                                Text("Process Return")
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun OrderSearchCard(
    order: ReturnOrder,
    onClick: () -> Unit
) {
    Card(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(8.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(1.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(24.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Column {
                    Text(
                        text = "Order #${order.orderNumber}",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Medium
                    )
                    Text(
                        text = order.dateCreated,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(top = 4.dp)
                    )
                    Text(
                        text = "${order.items.size} item(s)",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
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
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Medium
                )
            }
        }
    }
}

@Composable
private fun ReturnItemCard(
    item: ReturnOrderItem,
    isSelected: Boolean,
    onToggle: () -> Unit
) {
    Surface(
        modifier = Modifier.fillMaxWidth().clickable(onClick = onToggle),
        shape = RoundedCornerShape(8.dp),
        color = MaterialTheme.colorScheme.surfaceVariant
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Checkbox(
                checked = isSelected,
                onCheckedChange = { onToggle() }
            )
            Column(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                Text(
                    text = item.name,
                    style = MaterialTheme.typography.bodyLarge,
                    fontWeight = FontWeight.Medium
                )
                Text(
                    text = "Qty: ${item.quantity} × ${
                        buildString {
                            append("$")
                            val priceStr = item.unitPrice.toString()
                            val parts = priceStr.split(".")
                            append(parts.getOrNull(0) ?: "0")
                            append(".")
                            val decimal = parts.getOrNull(1)?.take(2)?.padEnd(2, '0') ?: "00"
                            append(decimal)
                        }
                    }",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            Text(
                text = buildString {
                    append("$")
                    val total = item.quantity * item.unitPrice
                    val priceStr = total.toString()
                    val parts = priceStr.split(".")
                    append(parts.getOrNull(0) ?: "0")
                    append(".")
                    val decimal = parts.getOrNull(1)?.take(2)?.padEnd(2, '0') ?: "00"
                    append(decimal)
                },
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Medium
            )
        }
    }
}

/**
 * Data classes for returns.
 */
data class ReturnOrder(
    val id: String,
    val orderNumber: String,
    val dateCreated: String,
    val total: Double,
    val items: List<ReturnOrderItem>
)

data class ReturnOrderItem(
    val id: String,
    val name: String,
    val quantity: Int,
    val unitPrice: Double
)
