package com.theauraflow.pos.ui.screen

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.theauraflow.pos.core.util.formatCurrency
import com.theauraflow.pos.domain.model.Order
import com.theauraflow.pos.presentation.viewmodel.OrderViewModel
import com.theauraflow.pos.ui.dialog.CancelOrderDialog
import com.theauraflow.pos.ui.dialog.DeleteOrderDialog
import kotlinx.datetime.Instant
import kotlinx.datetime.TimeZone
import kotlinx.datetime.toLocalDateTime

/**
 * Orders Screen with enterprise table layout.
 * Features:
 * - Searchable table by order number or customer name
 * - Sortable columns
 * - Order detail dialog with View, Return, Cancel, Delete actions
 * - Shows variations and modifiers in detail view
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

    var searchQuery by remember { mutableStateOf("") }
    var selectedOrder by remember { mutableStateOf<Order?>(null) }
    var showCancelDialog by remember { mutableStateOf(false) }
    var showDeleteDialog by remember { mutableStateOf(false) }
    var currentPage by remember { mutableStateOf(0) }
    val itemsPerPage = 25
    val focusManager = LocalFocusManager.current

    // Filter orders based on search query
    val filteredOrders = remember(orders, searchQuery) {
        if (searchQuery.isBlank()) {
            orders
        } else {
            orders.filter { order ->
                order.orderNumber.contains(searchQuery, ignoreCase = true) ||
                        order.id.contains(searchQuery, ignoreCase = true) ||
                        order.customerName?.contains(searchQuery, ignoreCase = true) == true
            }
        }
    }

    // Paginate filtered orders
    val totalPages = remember(filteredOrders) {
        (filteredOrders.size + itemsPerPage - 1) / itemsPerPage
    }

    val paginatedOrders = remember(filteredOrders, currentPage) {
        val startIndex = currentPage * itemsPerPage
        val endIndex = minOf(startIndex + itemsPerPage, filteredOrders.size)
        if (startIndex < filteredOrders.size) {
            filteredOrders.subList(startIndex, endIndex)
        } else {
            emptyList()
        }
    }

    // Reset to first page when search changes
    LaunchedEffect(searchQuery) {
        currentPage = 0
    }

    LaunchedEffect(Unit) {
        println("📜 DEBUG: OrdersScreen launched")
        // Don't call loadTodayOrders() - orders are already loaded from localStorage 
        // via OrderRepository.init() and the observable flow in OrderViewModel.init()
        // Calling the API just replaces local data with loading state, then fails
    }

    // Continuously observe orders from repository
    LaunchedEffect(Unit) {
        orderViewModel.ordersState.collect { state ->
            println("📜 DEBUG: Orders state changed: ${state::class.simpleName}")
            when (state) {
                is com.theauraflow.pos.presentation.base.UiState.Success -> {
                    println("   Orders count: ${state.data.size}")
                }

                is com.theauraflow.pos.presentation.base.UiState.Error -> {
                    println("   Error: ${state.message}")
                }

                else -> println("   State: Loading or initial")
            }
        }
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
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "Orders",
                                style = MaterialTheme.typography.titleLarge,
                                fontWeight = FontWeight.SemiBold
                            )
                            Text(
                                text = "View, manage, and track order history",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }

                        // Search field
                        OutlinedTextField(
                            value = searchQuery,
                            onValueChange = { searchQuery = it },
                            modifier = Modifier.widthIn(min = 300.dp, max = 600.dp),
                            placeholder = { Text("Search by order #, customer...") },
                            leadingIcon = {
                                Icon(
                                    Icons.Default.Search,
                                    contentDescription = null,
                                    modifier = Modifier.size(20.dp)
                                )
                            },
                            trailingIcon = {
                                if (searchQuery.isNotEmpty()) {
                                    IconButton(onClick = { searchQuery = "" }) {
                                        Icon(
                                            Icons.Default.Close,
                                            contentDescription = "Clear",
                                            modifier = Modifier.size(18.dp)
                                        )
                                    }
                                }
                            },
                            singleLine = true,
                            shape = RoundedCornerShape(8.dp)
                        )
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
                .clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null
                ) { focusManager.clearFocus() }
        ) {
            if (paginatedOrders.isEmpty()) {
                // Empty state
                Column(
                    modifier = Modifier.fillMaxSize(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Receipt,
                        contentDescription = null,
                        modifier = Modifier.size(64.dp),
                        tint = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.3f)
                    )
                    Spacer(Modifier.height(16.dp))
                    Text(
                        text = if (searchQuery.isEmpty()) "No orders yet" else "No orders found",
                        style = MaterialTheme.typography.titleMedium,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                    )
                }
            } else {
                // Orders table
                Card(
                    modifier = Modifier.fillMaxSize(),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.surface
                    ),
                    elevation = CardDefaults.cardElevation(2.dp)
                ) {
                    Column(modifier = Modifier.fillMaxSize()) {
                        // Table header
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(MaterialTheme.colorScheme.surfaceVariant)
                                .padding(horizontal = 16.dp, vertical = 12.dp),
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            Text(
                                "Order #",
                                modifier = Modifier.weight(0.12f),
                                style = MaterialTheme.typography.labelMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Text(
                                "Date",
                                modifier = Modifier.weight(0.13f),
                                style = MaterialTheme.typography.labelMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Text(
                                "Customer",
                                modifier = Modifier.weight(0.18f),
                                style = MaterialTheme.typography.labelMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Text(
                                "Items",
                                modifier = Modifier.weight(0.08f),
                                style = MaterialTheme.typography.labelMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Text(
                                "Total",
                                modifier = Modifier.weight(0.12f),
                                style = MaterialTheme.typography.labelMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Text(
                                "Payment",
                                modifier = Modifier.weight(0.12f),
                                style = MaterialTheme.typography.labelMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Text(
                                "Status",
                                modifier = Modifier.weight(0.15f),
                                style = MaterialTheme.typography.labelMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Box(modifier = Modifier.weight(0.1f))  // Actions column
                        }

                        HorizontalDivider()

                        // Table rows
                        LazyColumn(
                            modifier = Modifier
                                .fillMaxSize()
                                .weight(1f),
                            contentPadding = PaddingValues(vertical = 8.dp)
                        ) {
                            items(
                                items = paginatedOrders,
                                key = { it.id }
                            ) { order ->
                                OrderTableRow(
                                    order = order,
                                    onClick = { selectedOrder = order }
                                )
                                HorizontalDivider(
                                    color = MaterialTheme.colorScheme.outlineVariant.copy(
                                        alpha = 0.3f
                                    )
                                )
                            }
                        }

                        // Pagination
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 16.dp, vertical = 12.dp),
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            Button(
                                onClick = { if (currentPage > 0) currentPage-- },
                                enabled = currentPage > 0
                            ) {
                                Icon(Icons.Default.ChevronLeft, null, Modifier.size(18.dp))
                            }
                            Text(
                                text = "${currentPage + 1} / $totalPages",
                                style = MaterialTheme.typography.bodyMedium
                            )
                            Button(
                                onClick = { if (currentPage < totalPages - 1) currentPage++ },
                                enabled = currentPage < totalPages - 1
                            ) {
                                Icon(Icons.Default.ChevronRight, null, Modifier.size(18.dp))
                            }
                        }
                    }
                }
            }
        }
    }

    // Order detail dialog
    if (selectedOrder != null) {
        OrderDetailDialog(
            order = selectedOrder!!,
            onDismiss = { selectedOrder = null },
            onView = {
                // TODO: Open full order view
            },
            onReturn = {
                // TODO: Process return
            },
            onCancel = {
                showCancelDialog = true
            },
            onDelete = {
                showDeleteDialog = true
            },
            onPrint = {
                // TODO: Print receipt
            }
        )
    }

    // Cancel order dialog
    if (showCancelDialog && selectedOrder != null) {
        CancelOrderDialog(
            order = selectedOrder!!,
            onDismiss = { showCancelDialog = false },
            onConfirm = { request ->
                orderViewModel.cancelOrder(
                    orderId = request.orderId,
                    reason = request.reason,
                    issueRefund = request.issueRefund,
                    restockItems = request.restockItems,
                    notifyCustomer = request.notifyCustomer,
                    additionalNotes = request.additionalNotes,
                    userId = "current_user", // TODO: Get from auth
                    userName = "Current User" // TODO: Get from auth
                )
                showCancelDialog = false
                selectedOrder = null
            }
        )
    }

    // Delete order dialog
    if (showDeleteDialog && selectedOrder != null) {
        DeleteOrderDialog(
            order = selectedOrder!!,
            onDismiss = { showDeleteDialog = false },
            onConfirm = { password ->
                orderViewModel.deleteOrder(
                    orderId = selectedOrder!!.id,
                    password = password,
                    userId = "current_user", // TODO: Get from auth
                    userName = "Current User", // TODO: Get from auth
                    onPasswordVerified = { isValid ->
                        if (isValid) {
                            showDeleteDialog = false
                            selectedOrder = null
                        }
                    }
                )
            }
        )
    }
}

/**
 * Table row for an order.
 */
@OptIn(kotlin.time.ExperimentalTime::class)
@Composable
private fun OrderTableRow(
    order: Order,
    onClick: () -> Unit
) {
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        color = Color.Transparent
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 12.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Order number
            Text(
                text = order.orderNumber,
                modifier = Modifier.weight(0.12f),
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.SemiBold
            )

            // Date
            val formattedDate = remember(order.createdAt) {
                try {
                    val instant = Instant.fromEpochMilliseconds(order.createdAt)
                    val localDateTime = instant.toLocalDateTime(TimeZone.currentSystemDefault())
                    val day = localDateTime.dayOfMonth.toString().padStart(2, '0')
                    val month = localDateTime.monthNumber.toString().padStart(2, '0')
                    val year = localDateTime.year
                    val hour = localDateTime.hour.toString().padStart(2, '0')
                    val minute = localDateTime.minute.toString().padStart(2, '0')
                    "$day/$month/$year $hour:$minute"
                } catch (e: Exception) {
                    order.createdAt.toString() // fallback
                }
            }
            Text(
                text = formattedDate,
                modifier = Modifier.weight(0.13f),
                style = MaterialTheme.typography.bodyMedium
            )

            // Customer
            Text(
                text = order.customerName ?: "Walk-in",
                modifier = Modifier.weight(0.18f),
                style = MaterialTheme.typography.bodyMedium
            )

            // Items count
            Text(
                text = "${order.itemCount}",
                modifier = Modifier.weight(0.08f),
                style = MaterialTheme.typography.bodyMedium
            )

            // Total
            Text(
                text = "$${order.total.formatCurrency()}",
                modifier = Modifier.weight(0.12f),
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.Medium
            )

            // Payment method
            Text(
                text = order.paymentMethod.name,
                modifier = Modifier.weight(0.12f),
                style = MaterialTheme.typography.bodyMedium
            )

            // Status
            Surface(
                modifier = Modifier.weight(0.15f),
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
                    fontSize = 11.sp,
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

            // View button
            IconButton(
                onClick = onClick,
                modifier = Modifier.weight(0.1f).size(32.dp)
            ) {
                Icon(
                    Icons.Default.Visibility,
                    contentDescription = "View",
                    modifier = Modifier.size(18.dp)
                )
            }
        }
    }
}

/**
 * Order detail dialog with full order information and actions.
 */
@Composable
private fun OrderDetailDialog(
    order: Order,
    onDismiss: () -> Unit,
    onView: () -> Unit,
    onReturn: () -> Unit,
    onCancel: () -> Unit,
    onDelete: () -> Unit,
    onPrint: () -> Unit
) {
    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(
            dismissOnBackPress = true,
            dismissOnClickOutside = true,
            usePlatformDefaultWidth = false
        )
    ) {
        Surface(
            modifier = Modifier
                .widthIn(max = 800.dp)
                .heightIn(max = 700.dp),
            shape = RoundedCornerShape(16.dp),
            color = MaterialTheme.colorScheme.surface
        ) {
            Column(modifier = Modifier.fillMaxSize()) {
                // Header
                Surface(
                    color = MaterialTheme.colorScheme.primaryContainer,
                    shape = RoundedCornerShape(topStart = 16.dp, topEnd = 16.dp)
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
                                text = "Order Details",
                                style = MaterialTheme.typography.headlineSmall,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = order.orderNumber,
                                style = MaterialTheme.typography.titleMedium,
                                color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.8f)
                            )
                        }
                        IconButton(onClick = onDismiss) {
                            Icon(Icons.Default.Close, "Close")
                        }
                    }
                }

                // Content
                LazyColumn(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f)
                        .padding(24.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    // Customer info
                    item {
                        Card(colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(16.dp),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Column {
                                    Text(
                                        "Customer",
                                        style = MaterialTheme.typography.labelSmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                    Text(
                                        order.customerName ?: "Walk-in Customer",
                                        style = MaterialTheme.typography.bodyLarge,
                                        fontWeight = FontWeight.Medium
                                    )
                                }
                                Column(horizontalAlignment = Alignment.End) {
                                    Text(
                                        "Payment Method",
                                        style = MaterialTheme.typography.labelSmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                    Text(
                                        order.paymentMethod.name,
                                        style = MaterialTheme.typography.bodyLarge,
                                        fontWeight = FontWeight.Medium
                                    )
                                }
                            }
                        }
                    }

                    // Items header
                    item {
                        Text(
                            "Order Items (${order.itemCount})",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.SemiBold
                        )
                    }

                    // Items with modifiers and variations
                    items(
                        items = order.items,
                        key = { it.id }
                    ) { item ->
                        Card(colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)) {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(16.dp),
                                verticalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(
                                            item.product.name,
                                            style = MaterialTheme.typography.bodyLarge,
                                            fontWeight = FontWeight.SemiBold
                                        )

                                        // Show variation if present
                                        val itemVariation = item.variation
                                        if (itemVariation != null) {
                                            Text(
                                                "• ${itemVariation.name}",
                                                style = MaterialTheme.typography.bodySmall,
                                                color = MaterialTheme.colorScheme.primary
                                            )
                                        }

                                        // Show modifiers if present
                                        if (item.modifiers.isNotEmpty()) {
                                            Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                                                item.modifiers.forEach { modifier ->
                                                    Text(
                                                        "  + ${modifier.quantity}x ${modifier.name} (+$${modifier.totalCost.formatCurrency()})",
                                                        style = MaterialTheme.typography.bodySmall,
                                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                                    )
                                                }
                                            }
                                        }

                                        Text(
                                            "Qty: ${item.quantity}",
                                            style = MaterialTheme.typography.bodySmall,
                                            color = MaterialTheme.colorScheme.onSurfaceVariant
                                        )
                                    }
                                    Text(
                                        "$${item.total.formatCurrency()}",
                                        style = MaterialTheme.typography.bodyLarge,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                            }
                        }
                    }

                    // Totals
                    item {
                        Card(colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer)) {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(16.dp),
                                verticalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text("Subtotal:")
                                    Text("$${order.subtotal.formatCurrency()}")
                                }
                                if (order.discount > 0) {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween
                                    ) {
                                        Text("Discount:")
                                        Text(
                                            "-$${order.discount.formatCurrency()}",
                                            color = MaterialTheme.colorScheme.error
                                        )
                                    }
                                }
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text("Tax:")
                                    Text("$${order.tax.formatCurrency()}")
                                }
                                HorizontalDivider()
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text(
                                        "Total:",
                                        style = MaterialTheme.typography.titleLarge,
                                        fontWeight = FontWeight.Bold
                                    )
                                    Text(
                                        "$${order.total.formatCurrency()}",
                                        style = MaterialTheme.typography.titleLarge,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                            }
                        }
                    }
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
                            onClick = onPrint,
                            modifier = Modifier.weight(1f)
                        ) {
                            Icon(Icons.Default.Print, null, Modifier.size(18.dp))
                            Spacer(Modifier.width(8.dp))
                            Text("Print")
                        }
                        if (order.orderStatus == com.theauraflow.pos.domain.model.OrderStatus.COMPLETED) {
                            Button(
                                onClick = onReturn,
                                modifier = Modifier.weight(1f),
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = MaterialTheme.colorScheme.tertiary
                                )
                            ) {
                                Icon(Icons.Default.Undo, null, Modifier.size(18.dp))
                                Spacer(Modifier.width(8.dp))
                                Text("Return")
                            }
                        }
                        if (order.orderStatus != com.theauraflow.pos.domain.model.OrderStatus.CANCELLED) {
                            Button(
                                onClick = onCancel,
                                modifier = Modifier.weight(1f),
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = MaterialTheme.colorScheme.error
                                )
                            ) {
                                Icon(Icons.Default.Cancel, null, Modifier.size(18.dp))
                                Spacer(Modifier.width(8.dp))
                                Text("Cancel")
                            }
                        }
                        Button(
                            onClick = onDelete,
                            modifier = Modifier.weight(1f),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = MaterialTheme.colorScheme.error
                            )
                        ) {
                            Icon(Icons.Default.Delete, null, Modifier.size(18.dp))
                            Spacer(Modifier.width(8.dp))
                            Text("Delete")
                        }
                    }
                }
            }
        }
    }
}
