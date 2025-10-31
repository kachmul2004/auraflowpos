package com.theauraflow.pos.ui.dialog

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties

/**
 * Tables management dialog for restaurant/dining POS.
 * Shows floor plan with table status and allows assigning orders to tables.
 */
@Composable
fun TablesDialog(
    onDismiss: () -> Unit,
    modifier: Modifier = Modifier
) {
    // Sample table data
    val tables = remember {
        listOf(
            TableInfo(id = "1", number = 1, status = TableStatus.Available, seats = 4),
            TableInfo(
                id = "2",
                number = 2,
                status = TableStatus.Occupied,
                seats = 2,
                orderTotal = 45.50
            ),
            TableInfo(id = "3", number = 3, status = TableStatus.Reserved, seats = 6),
            TableInfo(id = "4", number = 4, status = TableStatus.Available, seats = 4),
            TableInfo(
                id = "5",
                number = 5,
                status = TableStatus.Occupied,
                seats = 8,
                orderTotal = 120.00
            ),
            TableInfo(id = "6", number = 6, status = TableStatus.Available, seats = 2),
            TableInfo(id = "7", number = 7, status = TableStatus.Cleaning, seats = 4),
            TableInfo(id = "8", number = 8, status = TableStatus.Available, seats = 6),
            TableInfo(
                id = "9",
                number = 9,
                status = TableStatus.Occupied,
                seats = 4,
                orderTotal = 67.25
            ),
            TableInfo(id = "10", number = 10, status = TableStatus.Available, seats = 2),
        )
    }

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(
            dismissOnBackPress = true,
            dismissOnClickOutside = false
        )
    ) {
        Surface(
            modifier = modifier
                .fillMaxWidth(0.9f)
                .fillMaxHeight(0.85f),
            shape = MaterialTheme.shapes.large,
            color = MaterialTheme.colorScheme.surface,
            tonalElevation = 6.dp
        ) {
            Column(modifier = Modifier.fillMaxSize()) {
                // Header
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(24.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.TableChart,
                                contentDescription = null,
                                tint = MaterialTheme.colorScheme.primary,
                                modifier = Modifier.size(24.dp)
                            )
                            Text(
                                text = "Table Management",
                                style = MaterialTheme.typography.headlineSmall,
                                fontWeight = FontWeight.Bold
                            )
                        }
                        Text(
                            text = "View and manage restaurant tables, assign orders to tables",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.padding(top = 4.dp)
                        )
                    }

                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Default.Close, "Close")
                    }
                }

                HorizontalDivider()

                // Status Legend
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 24.dp, vertical = 16.dp),
                    horizontalArrangement = Arrangement.spacedBy(20.dp)
                ) {
                    StatusLegend(
                        TableStatus.Available,
                        "Available",
                        tables.count { it.status == TableStatus.Available })
                    StatusLegend(
                        TableStatus.Occupied,
                        "Occupied",
                        tables.count { it.status == TableStatus.Occupied })
                    StatusLegend(
                        TableStatus.Reserved,
                        "Reserved",
                        tables.count { it.status == TableStatus.Reserved })
                    StatusLegend(
                        TableStatus.Cleaning,
                        "Cleaning",
                        tables.count { it.status == TableStatus.Cleaning })
                }

                HorizontalDivider()

                // Table Grid
                LazyVerticalGrid(
                    columns = GridCells.Adaptive(minSize = 150.dp),
                    contentPadding = PaddingValues(24.dp),
                    horizontalArrangement = Arrangement.spacedBy(16.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp),
                    modifier = Modifier.weight(1f)
                ) {
                    items(tables) { table ->
                        TableCard(
                            table = table,
                            onClick = {
                                // TODO: Handle table selection
                            }
                        )
                    }
                }

                HorizontalDivider()

                // Footer Actions
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(24.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    OutlinedButton(
                        onClick = { /* TODO: Add new table */ },
                        modifier = Modifier.weight(1f)
                    ) {
                        Icon(
                            Icons.Default.Add,
                            contentDescription = null,
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Add Table")
                    }

                    Button(
                        onClick = onDismiss,
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("Close")
                    }
                }
            }
        }
    }
}

@Composable
private fun TableCard(
    table: TableInfo,
    onClick: () -> Unit
) {
    val backgroundColor = when (table.status) {
        TableStatus.Available -> MaterialTheme.colorScheme.surfaceVariant
        TableStatus.Occupied -> MaterialTheme.colorScheme.surfaceVariant
        TableStatus.Reserved -> MaterialTheme.colorScheme.surfaceVariant
        TableStatus.Cleaning -> MaterialTheme.colorScheme.surfaceVariant
    }

    val borderColor = when (table.status) {
        TableStatus.Available -> Color(0xFF10B981)
        TableStatus.Occupied -> Color(0xFFEF4444)
        TableStatus.Reserved -> Color(0xFF3B82F6)
        TableStatus.Cleaning -> Color(0xFFF59E0B)
    }

    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .aspectRatio(1f)
            .clickable(onClick = onClick),
        shape = MaterialTheme.shapes.medium,
        color = backgroundColor,
        border = androidx.compose.foundation.BorderStroke(2.dp, borderColor)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(12.dp),
            verticalArrangement = Arrangement.SpaceBetween,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Table Number
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .clip(CircleShape)
                    .background(borderColor),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = table.number.toString(),
                    color = Color.White,
                    fontWeight = FontWeight.Bold,
                    fontSize = 18.sp
                )
            }

            // Status Icon
            Icon(
                imageVector = when (table.status) {
                    TableStatus.Available -> Icons.Default.CheckCircle
                    TableStatus.Occupied -> Icons.Default.Person
                    TableStatus.Reserved -> Icons.Default.EventSeat
                    TableStatus.Cleaning -> Icons.Default.CleaningServices
                },
                contentDescription = null,
                tint = borderColor,
                modifier = Modifier.size(24.dp)
            )

            // Details
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                // Seats
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    Icon(
                        Icons.Default.Chair,
                        contentDescription = null,
                        modifier = Modifier.size(14.dp),
                        tint = borderColor
                    )
                    Text(
                        text = "${table.seats} seats",
                        fontSize = 11.sp,
                        color = borderColor,
                        fontWeight = FontWeight.Medium
                    )
                }

                // Order Total (if occupied)
                if (table.status == TableStatus.Occupied && table.orderTotal != null) {
                    val formattedTotal =
                        "$" + (kotlin.math.round(table.orderTotal * 100) / 100).toString()
                    Text(
                        text = formattedTotal,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = borderColor
                    )
                }

                // Status Text
                Text(
                    text = table.status.name,
                    fontSize = 10.sp,
                    color = borderColor,
                    fontWeight = FontWeight.Medium
                )
            }
        }
    }
}

@Composable
private fun StatusLegend(
    status: TableStatus,
    label: String,
    count: Int
) {
    val color = when (status) {
        TableStatus.Available -> Color(0xFF10B981)
        TableStatus.Occupied -> Color(0xFFEF4444)
        TableStatus.Reserved -> Color(0xFF3B82F6)
        TableStatus.Cleaning -> Color(0xFFF59E0B)
    }

    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Box(
            modifier = Modifier
                .size(16.dp)
                .clip(CircleShape)
                .background(color)
        )
        Text(
            text = "$label ($count)",
            fontSize = 13.sp,
            color = MaterialTheme.colorScheme.onSurface
        )
    }
}

// Data Models

data class TableInfo(
    val id: String,
    val number: Int,
    val status: TableStatus,
    val seats: Int,
    val orderTotal: Double? = null
)

enum class TableStatus {
    Available,
    Occupied,
    Reserved,
    Cleaning
}