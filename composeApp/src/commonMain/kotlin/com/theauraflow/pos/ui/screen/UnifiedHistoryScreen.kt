package com.theauraflow.pos.ui.screen

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.theauraflow.pos.domain.model.Order
import com.theauraflow.pos.presentation.viewmodel.OrderViewModel

/**
 * Unified History Screen with tabs for Orders, Returns, and Transactions.
 * Replaces separate buttons in ActionBar with a single entry point.
 */
@Composable
fun UnifiedHistoryScreen(
    orderViewModel: OrderViewModel,
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    var selectedTab by remember { mutableStateOf(0) }
    val tabs = listOf(
        TabInfo("Orders", Icons.Default.Receipt),
        TabInfo("Returns", Icons.Default.AssignmentReturn),
        TabInfo("Transactions", Icons.Default.Receipt)
    )

    Column(modifier = modifier.fillMaxSize()) {
        // Header with back button
        Surface(
            modifier = Modifier.fillMaxWidth(),
            color = MaterialTheme.colorScheme.surface,
            shadowElevation = 2.dp
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                IconButton(onClick = onBack) {
                    Icon(Icons.Default.ArrowBack, "Back")
                }
                Text(
                    text = "History",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold
                )
            }
        }

        // Tabs
        TabRow(
            selectedTabIndex = selectedTab,
            modifier = Modifier.fillMaxWidth()
        ) {
            tabs.forEachIndexed { index, tab ->
                Tab(
                    selected = selectedTab == index,
                    onClick = { selectedTab = index },
                    icon = { Icon(tab.icon, contentDescription = null) },
                    text = { Text(tab.title) }
                )
            }
        }

        // Tab content
        Box(modifier = Modifier.fillMaxSize().padding(16.dp)) {
            when (selectedTab) {
                0 -> OrdersTab(orderViewModel)
                1 -> ReturnsTab(orderViewModel)
                2 -> TransactionsTab()
            }
        }
    }
}

@Composable
private fun OrdersTab(orderViewModel: OrderViewModel) {
    OrdersScreen(
        orderViewModel = orderViewModel,
        onBack = {}, // No back button needed - handled by parent
        showBackButton = false
    )
}

@Composable
private fun ReturnsTab(orderViewModel: OrderViewModel) {
    val ordersState by orderViewModel.ordersState.collectAsState()
    val orders = remember(ordersState) {
        when (val state = ordersState) {
            is com.theauraflow.pos.presentation.base.UiState.Success -> {
                // Convert Order to ReturnOrder
                state.data.map { order ->
                    ReturnOrder(
                        id = order.id,
                        orderNumber = order.orderNumber,
                        dateCreated = order.createdAt.toString(), // Format as needed
                        total = order.total,
                        items = order.items.map { cartItem ->
                            ReturnOrderItem(
                                id = cartItem.id,
                                name = cartItem.product.name,
                                quantity = cartItem.quantity,
                                unitPrice = cartItem.total / cartItem.quantity
                            )
                        }
                    )
                }
            }
            else -> emptyList()
        }
    }

    ReturnsScreen(
        orders = orders,
        onBack = {}, // No back button needed - handled by parent
        onProcessReturn = { orderId, itemIds, reason ->
            // TODO: Process return
            println("Processing return for order $orderId: items=$itemIds, reason=$reason")
        },
        showBackButton = false
    )
}

@Composable
private fun TransactionsTab() {
    TransactionsScreen(
        transactions = emptyList(), // TODO: Get from shift data
        onBack = {}, // No back button needed - handled by parent
        showBackButton = false
    )
}

private data class TabInfo(val title: String, val icon: ImageVector)
