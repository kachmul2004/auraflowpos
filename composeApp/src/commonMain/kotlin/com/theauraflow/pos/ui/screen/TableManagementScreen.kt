package com.theauraflow.pos.ui.screen

import androidx.compose.foundation.background
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

/**
 * Full-screen Table Management page for restaurant/dining POS.
 * Matches web version: docs/Web Version/src/components/TableManagementPage.tsx
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TableManagementScreen(
    onBack: () -> Unit,
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

        // Status Legend
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 24.dp, vertical = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(24.dp)
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
            columns = GridCells.Adaptive(minSize = 180.dp),
            contentPadding = PaddingValues(24.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
            modifier = Modifier.weight(1f)
        ) {
            items(tables) { table ->
                TableCard(
                    table = table,
                    onClick = { /* TODO: Handle table selection */ }
                )
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
        TableStatus.Available -> Color(0xFF10B981).copy(alpha = 0.1f)
        TableStatus.Occupied -> Color(0xFFEF4444).copy(alpha = 0.1f)
        TableStatus.Reserved -> Color(0xFF3B82F6).copy(alpha = 0.1f)
        TableStatus.Cleaning -> Color(0xFFF59E0B).copy(alpha = 0.1f)
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
                .padding(16.dp),
            verticalArrangement = Arrangement.SpaceBetween,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Table Number
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .clip(CircleShape)
                    .background(borderColor),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = table.number.toString(),
                    color = Color.White,
                    fontWeight = FontWeight.Bold,
                    fontSize = 20.sp
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
                modifier = Modifier.size(28.dp)
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
                        modifier = Modifier.size(16.dp),
                        tint = borderColor
                    )
                    Text(
                        text = "${table.seats} seats",
                        fontSize = 12.sp,
                        color = borderColor,
                        fontWeight = FontWeight.Medium
                    )
                }

                // Order Total (if occupied)
                if (table.status == TableStatus.Occupied && table.orderTotal != null) {
                    Text(
                        text = "$${table.orderTotal}",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = borderColor
                    )
                }

                // Status Text
                Text(
                    text = table.status.name,
                    fontSize = 11.sp,
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
            color = MaterialTheme.colorScheme.onSurface,
            fontWeight = FontWeight.Medium
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