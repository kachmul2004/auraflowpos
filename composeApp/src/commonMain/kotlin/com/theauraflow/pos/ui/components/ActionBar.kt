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
import com.theauraflow.pos.util.Locale

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
    onHistory: () -> Unit,
    modifier: Modifier = Modifier,
    // Plugin buttons (optional)
    showSplitCheck: Boolean = false,
    onSplitCheck: () -> Unit = {},
    cartHasItems: Boolean = false,
    showCourses: Boolean = false,
    onCourses: () -> Unit = {},
    showHeldOrders: Boolean = false,
    onHeldOrders: () -> Unit = {},
    heldOrdersCount: Int = 0
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

                // History Button - Indigo (combines Orders, Returns, Transactions)
                ActionButton(
                    onClick = onHistory,
                    icon = Icons.Default.History,
                    label = "History",
                    backgroundColor = Color(0xFF6366F1),
                    contentColor = Color.White,
                    modifier = Modifier.weight(1f)
                )

                // Split Check Button - Purple (Plugin, requires items in cart)
                if (showSplitCheck) {
                    ActionButton(
                        onClick = onSplitCheck,
                        icon = Icons.Default.CallSplit,
                        label = Locale.splitCheck,
                        backgroundColor = Color(0xFF8B5CF6),
                        contentColor = Color.White,
                        enabled = cartHasItems,
                        modifier = Modifier.weight(1f)
                    )
                }

                // Courses Button - Cyan (Plugin, requires items in cart)
                if (showCourses) {
                    ActionButton(
                        onClick = onCourses,
                        icon = Icons.Default.Restaurant,
                        label = "Courses",
                        backgroundColor = Color(0xFF06B6D4),
                        contentColor = Color.White,
                        enabled = cartHasItems,
                        modifier = Modifier.weight(1f)
                    )
                }

                // Held Orders Button - Orange (Plugin, shows badge with count)
                if (showHeldOrders) {
                    ActionButtonWithBadge(
                        onClick = onHeldOrders,
                        icon = Icons.Default.LocalFireDepartment,
                        label = "Held Orders",
                        backgroundColor = Color(0xFFF97316),
                        contentColor = Color.White,
                        badgeCount = heldOrdersCount,
                        modifier = Modifier.weight(1f)
                    )
                }
            }
        }
    }
}

@Composable
private fun ActionButtonWithBadge(
    onClick: () -> Unit,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    backgroundColor: Color,
    contentColor: Color,
    badgeCount: Int,
    modifier: Modifier = Modifier
) {
    Box(modifier = modifier) {
        Button(
            onClick = onClick,
            modifier = Modifier.fillMaxWidth().height(40.dp),
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

        // Badge showing count
        if (badgeCount > 0) {
            Badge(
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .offset(x = (-4).dp, y = 4.dp),
                containerColor = MaterialTheme.colorScheme.error
            ) {
                Text(
                    text = badgeCount.toString(),
                    fontSize = 10.sp,
                    color = MaterialTheme.colorScheme.onError
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
    modifier: Modifier = Modifier,
    enabled: Boolean = true
) {
    Button(
        onClick = onClick,
        modifier = modifier.height(40.dp),
        enabled = enabled,
        colors = ButtonDefaults.buttonColors(
            containerColor = backgroundColor,
            contentColor = contentColor,
            disabledContainerColor = backgroundColor.copy(alpha = 0.5f),
            disabledContentColor = contentColor.copy(alpha = 0.5f)
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