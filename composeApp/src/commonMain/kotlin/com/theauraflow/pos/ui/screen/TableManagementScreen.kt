package com.theauraflow.pos.ui.screen

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.theauraflow.pos.domain.model.Table
import com.theauraflow.pos.domain.model.TableStatus
import com.theauraflow.pos.presentation.base.UiState
import com.theauraflow.pos.presentation.viewmodel.CartViewModel
import com.theauraflow.pos.presentation.viewmodel.TableViewModel

/**
 * Full-screen Table Management page for restaurant/dining POS.
 * Matches web version: docs/Web Version/src/plugins/table-management/components/TableFloorPlan.tsx
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TableManagementScreen(
    tableViewModel: TableViewModel,
    cartViewModel: CartViewModel,
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    // Get tables from ViewModel
    val tablesState by tableViewModel.tablesState.collectAsState()
    val tables = when (val s = tablesState) {
        is UiState.Success -> s.data
        else -> emptyList()
    }

    val currentTableId by cartViewModel.tableId.collectAsState()
    val cartState by cartViewModel.cartState.collectAsState()
    val cartItems = when (val state = cartState) {
        is UiState.Success -> state.data.items
        else -> emptyList()
    }

    // Group tables by section
    val tablesBySection = remember(tables) {
        tables.groupBy { it.section }
    }
    val sections = tablesBySection.keys.toList()
    var selectedSection by remember { mutableStateOf(sections.firstOrNull() ?: "Main Dining") }

    // Statistics
    val availableCount = tables.count { it.status == TableStatus.AVAILABLE }
    val occupiedCount = tables.count { it.status == TableStatus.OCCUPIED }
    val reservedCount = tables.count { it.status == TableStatus.RESERVED }
    val cleaningCount = tables.count { it.status == TableStatus.CLEANING }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        // Header
        Surface(
            modifier = Modifier.fillMaxWidth(),
            color = MaterialTheme.colorScheme.surface,
            shadowElevation = 2.dp
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    // Back Button
                    TextButton(
                        onClick = onBack,
                        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.ArrowBack,
                            contentDescription = null,
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(Modifier.width(6.dp))
                        Text("Back to POS", fontSize = 13.sp)
                    }

                    Column {
                        Text(
                            text = "Table Management",
                            style = MaterialTheme.typography.headlineMedium,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "View and manage restaurant tables, assign orders to tables",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }

                // User/Shift Info
                Row(
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(horizontalAlignment = Alignment.End) {
                        Text(
                            text = "Server",
                            fontSize = 11.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Text(
                            text = "John Cashier",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Medium
                        )
                    }
                    Column(horizontalAlignment = Alignment.End) {
                        Text(
                            text = "Shift",
                            fontSize = 11.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Text(
                            text = "09:00 AM",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Medium
                        )
                    }
                }
            }
        }

        // Statistics Cards
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            StatCard(
                label = "Total Tables",
                value = tables.size.toString(),
                icon = Icons.Default.Chair,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                backgroundColor = MaterialTheme.colorScheme.surfaceVariant,
                modifier = Modifier.weight(1f)
            )
            StatCard(
                label = "Available",
                value = availableCount.toString(),
                icon = Icons.Default.CheckCircle,
                color = Color(0xFF059669),
                backgroundColor = Color(0xFF10B981).copy(alpha = 0.1f),
                modifier = Modifier.weight(1f)
            )
            StatCard(
                label = "Occupied",
                value = occupiedCount.toString(),
                icon = Icons.Default.Cancel,
                color = Color(0xFFDC2626),
                backgroundColor = Color(0xFFEF4444).copy(alpha = 0.1f),
                modifier = Modifier.weight(1f)
            )
            StatCard(
                label = "Reserved",
                value = reservedCount.toString(),
                icon = Icons.Default.AccessTime,
                color = Color(0xFFD97706),
                backgroundColor = Color(0xFFF59E0B).copy(alpha = 0.1f),
                modifier = Modifier.weight(1f)
            )
        }

        HorizontalDivider()

        // Section Tabs
        if (sections.isNotEmpty()) {
            ScrollableTabRow(
                selectedTabIndex = sections.indexOf(selectedSection).coerceAtLeast(0),
                modifier = Modifier.fillMaxWidth(),
                edgePadding = 16.dp
            ) {
                sections.forEach { section ->
                    Tab(
                        selected = selectedSection == section,
                        onClick = { selectedSection = section ?: "Main Dining" },
                        text = {
                            Row(
                                horizontalArrangement = Arrangement.spacedBy(8.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(section ?: "Unknown")
                                Badge {
                                    Text(
                                        text = (tablesBySection[section]?.size ?: 0).toString(),
                                        fontSize = 11.sp
                                    )
                                }
                            }
                        }
                    )
                }
            }
        }

        // Table Grid
        LazyVerticalGrid(
            columns = GridCells.Adaptive(minSize = 220.dp),
            contentPadding = PaddingValues(16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            modifier = Modifier.weight(1f)
        ) {
            val tablesInSection = tablesBySection[selectedSection] ?: emptyList()
            items(
                items = tablesInSection,
                key = { it.id }
            ) { table ->
                TableCardModern(
                    table = table,
                    isCurrentCart = table.id == currentTableId,
                    hasCartItems = cartItems.isNotEmpty(),
                    onSingleClick = { /* TODO: Show details */ },
                    onDoubleClick = {
                        // Assign table to cart
                        if (cartItems.isEmpty()) {
                            // TODO: Show error toast: "Add items to cart first"
                        } else if (table.status == TableStatus.AVAILABLE || table.id == currentTableId) {
                            // Assign cart to table
                            cartViewModel.assignToTable(table.id)
                            // Update table status to occupied
                            tableViewModel.updateTableStatus(table.id, TableStatus.OCCUPIED)
                            // Navigate back to POS
                            onBack()
                        }
                    },
                    onAssignClick = {
                        if (cartItems.isEmpty()) {
                            // TODO: Show error toast
                        } else {
                            // Assign cart to table
                            cartViewModel.assignToTable(table.id)
                            // Update table status to occupied
                            tableViewModel.updateTableStatus(table.id, TableStatus.OCCUPIED)
                            // Navigate back to POS
                            onBack()
                        }
                    }
                )
            }
        }

        // Help Text
        Surface(
            modifier = Modifier.fillMaxWidth(),
            color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
        ) {
            Text(
                text = if (cartItems.isEmpty()) {
                    "💡 Tip: Add items to cart before assigning to a table."
                } else {
                    "💡 Tip: Click a table to select, double-click to assign."
                },
                modifier = Modifier.padding(12.dp),
                fontSize = 13.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                textAlign = androidx.compose.ui.text.style.TextAlign.Center
            )
        }
    }
}

@OptIn(ExperimentalFoundationApi::class)
@Composable
private fun TableCardModern(
    table: Table,
    isCurrentCart: Boolean,
    hasCartItems: Boolean,
    onSingleClick: () -> Unit,
    onDoubleClick: () -> Unit,
    onAssignClick: () -> Unit
) {
    // Status-specific colors matching web version
    val colors = when (table.status) {
        TableStatus.AVAILABLE -> TableColors(
            background = Color(0xFF10B981).copy(alpha = 0.2f),
            border = Color(0xFF10B981),
            text = Color(0xFF059669)
        )
        TableStatus.OCCUPIED -> TableColors(
            background = Color(0xFFEF4444).copy(alpha = 0.2f),
            border = Color(0xFFEF4444),
            text = Color(0xFFDC2626)
        )
        TableStatus.RESERVED -> TableColors(
            background = Color(0xFFF59E0B).copy(alpha = 0.2f),
            border = Color(0xFFF59E0B),
            text = Color(0xFFD97706)
        )
        TableStatus.CLEANING -> TableColors(
            background = Color(0xFF3B82F6).copy(alpha = 0.2f),
            border = Color(0xFF3B82F6),
            text = Color(0xFF2563EB)
        )
    }

    // Status icon
    val statusIcon = when (table.status) {
        TableStatus.AVAILABLE -> Icons.Default.CheckCircle
        TableStatus.OCCUPIED -> Icons.Default.Cancel
        TableStatus.RESERVED -> Icons.Default.AccessTime
        TableStatus.CLEANING -> Icons.Default.CleaningServices
    }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .combinedClickable(
                onClick = onSingleClick,
                onDoubleClick = onDoubleClick
            ),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(
            containerColor = colors.background
        ),
        border = BorderStroke(
            width = if (isCurrentCart) 3.dp else 2.dp,
            color = if (isCurrentCart) Color(0xFF2563EB) else colors.border
        ),
        elevation = CardDefaults.cardElevation(
            defaultElevation = 0.dp,
            pressedElevation = 4.dp
        )
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Header: Table Number + Status Badge
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Large table number
                    Text(
                        text = table.number.toString(),
                        fontSize = 28.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.text
                    )

                    // "Current" badge if this is the current cart's table
                    if (isCurrentCart) {
                        Surface(
                            shape = RoundedCornerShape(4.dp),
                            color = Color(0xFF2563EB)
                        ) {
                            Text(
                                text = "Current",
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp),
                                fontSize = 11.sp,
                                color = Color.White,
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                    }
                }

                // Status badge with icon
                Surface(
                    shape = RoundedCornerShape(6.dp),
                    color = Color.Transparent,
                    border = BorderStroke(1.dp, colors.border)
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                        horizontalArrangement = Arrangement.spacedBy(4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = statusIcon,
                            contentDescription = null,
                            modifier = Modifier.size(14.dp),
                            tint = colors.text
                        )
                        Text(
                            text = table.status.name.lowercase()
                                .replaceFirstChar { it.uppercase() },
                            fontSize = 12.sp,
                            color = colors.text,
                            fontWeight = FontWeight.Medium
                        )
                    }
                }
            }

            // Table Info
            Column(
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // Seats
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.People,
                        contentDescription = null,
                        modifier = Modifier.size(16.dp),
                        tint = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        text = "${table.seats} seats",
                        fontSize = 14.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }

                // Server (if assigned)
                table.server?.let { server ->
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.Person,
                            contentDescription = null,
                            modifier = Modifier.size(16.dp),
                            tint = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Text(
                            text = server,
                            fontSize = 14.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                    }
                }

                // Reserved status indicator
                if (table.status == TableStatus.RESERVED) {
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.Warning,
                            contentDescription = null,
                            modifier = Modifier.size(16.dp),
                            tint = Color(0xFFD97706)
                        )
                        Text(
                            text = "Reserved",
                            fontSize = 14.sp,
                            color = Color(0xFFD97706),
                            fontWeight = FontWeight.Medium
                        )
                    }
                }
            }

            // Action Button
            Button(
                onClick = { onAssignClick() },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(8.dp),
                colors = when {
                    isCurrentCart -> ButtonDefaults.buttonColors(
                        containerColor = MaterialTheme.colorScheme.secondary
                    )
                    table.status == TableStatus.AVAILABLE && hasCartItems -> ButtonDefaults.buttonColors()
                    else -> ButtonDefaults.outlinedButtonColors()
                },
                enabled = (table.status == TableStatus.AVAILABLE && hasCartItems) || isCurrentCart
            ) {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    val (icon, text) = when {
                        isCurrentCart -> Icons.Default.CheckCircle to "Current Table"
                        table.status == TableStatus.AVAILABLE && hasCartItems -> Icons.Default.AddCircle to "Assign Table"
                        else -> Icons.Default.Info to "View Details"
                    }
                    Icon(
                        imageVector = icon,
                        contentDescription = null,
                        modifier = Modifier.size(16.dp)
                    )
                    Text(text, fontSize = 14.sp, fontWeight = FontWeight.Medium)
                }
            }
        }
    }
}

@Composable
private fun StatCard(
    label: String,
    value: String,
    icon: ImageVector,
    color: Color,
    backgroundColor: Color,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(
            containerColor = backgroundColor
        ),
        border = BorderStroke(1.dp, color.copy(alpha = 0.3f))
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = label,
                    fontSize = 13.sp,
                    color = color,
                    fontWeight = FontWeight.Medium
                )
                Text(
                    text = value,
                    fontSize = 28.sp,
                    color = color,
                    fontWeight = FontWeight.Bold
                )
            }
            Icon(
                imageVector = icon,
                contentDescription = null,
                modifier = Modifier.size(32.dp),
                tint = color.copy(alpha = 0.5f)
            )
        }
    }
}

private data class TableColors(
    val background: Color,
    val border: Color,
    val text: Color
)
