package com.theauraflow.pos.ui.components

import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/**
 * Action bar at the bottom of the POS screen.
 * Matches web version design with colored buttons for various POS actions.
 *
 * Reference: docs/Web Version/src/components/ActionBar.tsx
 */
@Composable
fun ActionBar(
    onClockOut: () -> Unit,
    onLock: () -> Unit,
    onCashDrawer: () -> Unit,
    onTransactions: () -> Unit,
    onReturns: () -> Unit,
    onOrders: () -> Unit,
    modifier: Modifier = Modifier
) {
    Surface(
        modifier = modifier.fillMaxWidth(),
        color = MaterialTheme.colorScheme.surface,
        tonalElevation = 0.dp
    ) {
        Column {
            HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 8.dp, vertical = 12.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Clock Out Button - Green
                ActionButton(
                    onClick = onClockOut,
                    icon = Icons.Default.CalendarMonth,
                    label = "Clock Out",
                    backgroundColor = Color(0xFF22C55E),
                    contentColor = Color.White,
                    modifier = Modifier.weight(1f)
                )

                // Lock Button - Red
                ActionButton(
                    onClick = onLock,
                    icon = Icons.Default.Lock,
                    label = "Lock",
                    backgroundColor = Color(0xFFEF4444),
                    contentColor = Color.White,
                    modifier = Modifier.weight(1f)
                )

                // Cash Drawer Button - Blue
                ActionButton(
                    onClick = onCashDrawer,
                    icon = Icons.Default.AttachMoney,
                    label = "Cash Drawer",
                    backgroundColor = Color(0xFF3B82F6),
                    contentColor = Color.White,
                    modifier = Modifier.weight(1f)
                )

                // Transactions Button - Pink
                ActionButton(
                    onClick = onTransactions,
                    icon = Icons.Default.Description,
                    label = "Transactions",
                    backgroundColor = Color(0xFFEC4899),
                    contentColor = Color.White,
                    modifier = Modifier.weight(1f)
                )

                // Returns Button - Orange
                ActionButton(
                    onClick = onReturns,
                    icon = Icons.Default.Refresh,
                    label = "Returns",
                    backgroundColor = Color(0xFFF97316),
                    contentColor = Color.White,
                    modifier = Modifier.weight(1f)
                )

                // Orders Button - Yellow
                ActionButton(
                    onClick = onOrders,
                    icon = Icons.Default.Pause,
                    label = "Orders",
                    backgroundColor = Color(0xFFEAB308),
                    contentColor = Color.White,
                    modifier = Modifier.weight(1f)
                )
            }
        }
    }
}

@Composable
private fun ActionButton(
    onClick: () -> Unit,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    backgroundColor: Color,
    contentColor: Color,
    modifier: Modifier = Modifier
) {
    Button(
        onClick = onClick,
        modifier = modifier.height(40.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = backgroundColor,
            contentColor = contentColor
        ),
        shape = RoundedCornerShape(6.dp),
        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp)
    ) {
        Row(
            horizontalArrangement = Arrangement.spacedBy(4.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                modifier = Modifier.size(16.dp)
            )
            Text(
                text = label,
                fontSize = 12.sp,
                fontWeight = FontWeight.Medium,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
        }
    }
}