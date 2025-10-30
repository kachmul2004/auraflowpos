package com.auraflow.pos.components

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.auraflow.pos.theme.*
import com.auraflow.pos.ui.Badge
import com.auraflow.pos.ui.BadgeVariant
import com.auraflow.pos.ui.SecondaryButton

/**
 * Action bar component for POS operations
 */

@Composable
fun ActionBar(
    userName: String,
    cartItemCount: Int,
    onHoldOrder: () -> Unit,
    onRecallOrder: () -> Unit,
    onHelp: () -> Unit,
    onSettings: () -> Unit,
    onLogout: () -> Unit,
    modifier: Modifier = Modifier
) {
    Surface(
        modifier = modifier.fillMaxWidth(),
        color = Background,
        tonalElevation = 2.dp
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Left: User Info
            Row(
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.Person,
                    contentDescription = null,
                    tint = Primary,
                    modifier = Modifier.size(24.dp)
                )
                
                Column {
                    Text(
                        text = userName,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Foreground
                    )
                    Text(
                        text = "Cashier",
                        fontSize = 12.sp,
                        color = MutedForeground
                    )
                }
                
                if (cartItemCount > 0) {
                    Badge(
                        text = "$cartItemCount items",
                        variant = BadgeVariant.PRIMARY
                    )
                }
            }
            
            // Right: Action Buttons
            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // Hold Order
                IconButton(onClick = onHoldOrder) {
                    Icon(
                        imageVector = Icons.Default.Pause,
                        contentDescription = "Hold Order",
                        tint = Warning
                    )
                }
                
                // Recall Order
                IconButton(onClick = onRecallOrder) {
                    Icon(
                        imageVector = Icons.Default.History,
                        contentDescription = "Recall Order",
                        tint = Primary
                    )
                }
                
                Divider(
                    modifier = Modifier
                        .width(1.dp)
                        .height(32.dp),
                    color = Border
                )
                
                // Help
                IconButton(onClick = onHelp) {
                    Icon(
                        imageVector = Icons.Default.Help,
                        contentDescription = "Help",
                        tint = Foreground
                    )
                }
                
                // Settings
                IconButton(onClick = onSettings) {
                    Icon(
                        imageVector = Icons.Default.Settings,
                        contentDescription = "Settings",
                        tint = Foreground
                    )
                }
                
                // Logout
                IconButton(onClick = onLogout) {
                    Icon(
                        imageVector = Icons.Default.Logout,
                        contentDescription = "Logout",
                        tint = Destructive
                    )
                }
            }
        }
    }
}

@Composable
fun QuickActionsBar(
    onDiscount: () -> Unit,
    onPriceOverride: () -> Unit,
    onVoidItem: () -> Unit,
    onParkSale: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true
) {
    Surface(
        modifier = modifier.fillMaxWidth(),
        color = Card,
        tonalElevation = 1.dp
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 8.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            // Discount
            SecondaryButton(
                text = "Discount",
                onClick = onDiscount,
                enabled = enabled,
                icon = {
                    Icon(
                        imageVector = Icons.Default.LocalOffer,
                        contentDescription = null,
                        modifier = Modifier.size(18.dp)
                    )
                },
                modifier = Modifier.weight(1f)
            )
            
            // Price Override
            SecondaryButton(
                text = "Price",
                onClick = onPriceOverride,
                enabled = enabled,
                icon = {
                    Icon(
                        imageVector = Icons.Default.Edit,
                        contentDescription = null,
                        modifier = Modifier.size(18.dp)
                    )
                },
                modifier = Modifier.weight(1f)
            )
            
            // Void Item
            SecondaryButton(
                text = "Void",
                onClick = onVoidItem,
                enabled = enabled,
                icon = {
                    Icon(
                        imageVector = Icons.Default.Delete,
                        contentDescription = null,
                        modifier = Modifier.size(18.dp)
                    )
                },
                modifier = Modifier.weight(1f)
            )
            
            // Park Sale
            SecondaryButton(
                text = "Park",
                onClick = onParkSale,
                enabled = enabled,
                icon = {
                    Icon(
                        imageVector = Icons.Default.Bookmark,
                        contentDescription = null,
                        modifier = Modifier.size(18.dp)
                    )
                },
                modifier = Modifier.weight(1f)
            )
        }
    }
}
