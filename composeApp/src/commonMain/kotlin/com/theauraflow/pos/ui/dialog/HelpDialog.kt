package com.theauraflow.pos.ui.dialog

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog

/**
 * Help dialog with comprehensive user guide for POS system.
 * Matching web version with tabs for different help sections.
 */
@Composable
fun HelpDialog(
    onDismiss: () -> Unit,
    modifier: Modifier = Modifier
) {
    var selectedTab by remember { mutableStateOf(0) }

    Dialog(onDismissRequest = onDismiss) {
        Surface(
            modifier = modifier
                .fillMaxWidth(0.95f)
                .fillMaxHeight(0.9f),
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
                                imageVector = Icons.Default.Description,
                                contentDescription = null,
                                tint = MaterialTheme.colorScheme.primary,
                                modifier = Modifier.size(24.dp)
                            )
                            Text(
                                text = "AuraFlow POS User Guide",
                                style = MaterialTheme.typography.headlineSmall,
                                fontWeight = FontWeight.Bold
                            )
                        }
                        Text(
                            text = "Complete guide for cashiers and managers",
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

                // Tab Row
                ScrollableTabRow(
                    selectedTabIndex = selectedTab,
                    modifier = Modifier.fillMaxWidth(),
                    edgePadding = 16.dp
                ) {
                    Tab(
                        selected = selectedTab == 0,
                        onClick = { selectedTab = 0 },
                        text = { Text("Getting Started") }
                    )
                    Tab(
                        selected = selectedTab == 1,
                        onClick = { selectedTab = 1 },
                        text = { Text("Orders") }
                    )
                    Tab(
                        selected = selectedTab == 2,
                        onClick = { selectedTab = 2 },
                        text = { Text("Payments") }
                    )
                    Tab(
                        selected = selectedTab == 3,
                        onClick = { selectedTab = 3 },
                        text = { Text("Advanced") }
                    )
                    Tab(
                        selected = selectedTab == 4,
                        onClick = { selectedTab = 4 },
                        text = { Text("Shortcuts") }
                    )
                }

                HorizontalDivider()

                // Content
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxWidth()
                        .padding(24.dp)
                ) {
                    when (selectedTab) {
                        0 -> GettingStartedContent()
                        1 -> OrdersContent()
                        2 -> PaymentsContent()
                        3 -> AdvancedContent()
                        4 -> ShortcutsContent()
                    }
                }
            }
        }
    }
}

@Composable
private fun GettingStartedContent() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(20.dp)
    ) {
        HelpSection(
            icon = Icons.Default.CheckCircle,
            title = "Welcome to AuraFlow POS",
            iconTint = Color(0xFF10B981)
        ) {
            Text(
                text = "AuraFlow POS is a modern point-of-sale system designed to make checkout fast and efficient. This guide will help you get started and master all features.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }

        HorizontalDivider()

        HelpSection(title = "Clocking In") {
            NumberedList(
                items = listOf(
                    "Log in with your credentials",
                    "Click Clock In button to start your session",
                    "Select your terminal",
                    "Enter your starting cash drawer balance",
                    "Click \"Clock In\" to begin"
                )
            )
        }

        HelpSection(
            icon = Icons.Default.School,
            title = "Training Mode",
            iconTint = Color(0xFFF59E0B)
        ) {
            Surface(
                color = Color(0xFFF59E0B).copy(alpha = 0.1f),
                shape = MaterialTheme.shapes.medium,
                border = androidx.compose.foundation.BorderStroke(
                    1.dp,
                    Color(0xFFF59E0B).copy(alpha = 0.3f)
                )
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Text(
                        text = "What is Training Mode?",
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFFF59E0B)
                    )
                    Text(
                        text = "Training Mode allows you to practice using the POS without affecting real business data. When enabled:",
                        color = Color(0xFFF59E0B),
                        fontSize = 13.sp
                    )
                    BulletList(
                        items = listOf(
                            "Transactions are marked as \"training\"",
                            "Inventory is NOT deducted",
                            "Sales are NOT included in reports",
                            "Financial records are NOT affected"
                        ),
                        color = Color(0xFFF59E0B)
                    )

                    Text(
                        text = "How to Enable:",
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFFF59E0B),
                        modifier = Modifier.padding(top = 8.dp)
                    )
                    Text(
                        text = "Toggle the \"Training\" switch in the top header or press Ctrl+Shift+T",
                        color = Color(0xFFF59E0B),
                        fontSize = 13.sp
                    )

                    Surface(
                        color = Color(0xFFEF4444).copy(alpha = 0.2f),
                        shape = MaterialTheme.shapes.small,
                        border = androidx.compose.foundation.BorderStroke(
                            1.dp,
                            Color(0xFFEF4444).copy(alpha = 0.5f)
                        ),
                        modifier = Modifier.padding(top = 8.dp)
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                Icon(
                                    Icons.Default.Warning,
                                    contentDescription = null,
                                    tint = Color(0xFFEF4444),
                                    modifier = Modifier.size(16.dp)
                                )
                                Text(
                                    text = "Important Warning",
                                    fontWeight = FontWeight.Bold,
                                    color = Color(0xFFEF4444),
                                    fontSize = 13.sp
                                )
                            }
                            Text(
                                text = "Always turn OFF Training Mode before processing real customer transactions. Transactions in training mode will NOT be recorded in your sales or financial data!",
                                color = Color(0xFFEF4444),
                                fontSize = 12.sp,
                                modifier = Modifier.padding(top = 6.dp)
                            )
                        }
                    }
                }
            }
        }

        HelpSection(title = "Understanding the Interface") {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                InterfaceRow("Left Side:", "Product grid with categories and search")
                InterfaceRow("Right Side:", "Shopping cart with current order items")
                InterfaceRow("Top:", "Status indicators (online, training, user)")
            }
        }
    }
}

@Composable
private fun OrdersContent() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(20.dp)
    ) {
        HelpSection(
            icon = Icons.Default.ShoppingCart,
            title = "Taking Orders",
            iconTint = MaterialTheme.colorScheme.primary
        ) {}

        HelpSection(title = "Adding Items to Cart") {
            NumberedList(
                items = listOf(
                    "Click on a product in the product grid",
                    "Item is automatically added to cart",
                    "Adjust quantity using +/- buttons",
                    "Click item for more options"
                )
            )
        }

        HelpSection(title = "Managing Cart Items") {
            Text(
                text = "Change Quantity:",
                fontWeight = FontWeight.Bold,
                fontSize = 13.sp
            )
            Text(
                text = "Use +/- buttons or click the quantity to enter a specific amount",
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                fontSize = 13.sp,
                modifier = Modifier.padding(bottom = 12.dp)
            )

            Text(
                text = "Item Actions:",
                fontWeight = FontWeight.Bold,
                fontSize = 13.sp
            )
            Text(
                text = "Click the three dots (⋮) on any cart item to edit, discount, or remove",
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                fontSize = 13.sp
            )
        }

        HelpSection(title = "Finding Products") {
            BulletList(
                items = listOf(
                    "Use search bar at top to search by name or SKU",
                    "Filter by category using tabs",
                    "Products update in real-time"
                )
            )
        }
    }
}

@Composable
private fun PaymentsContent() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(20.dp)
    ) {
        HelpSection(
            icon = Icons.Default.CreditCard,
            title = "Processing Payments",
            iconTint = Color(0xFF10B981)
        ) {}

        HelpSection(title = "Standard Checkout") {
            NumberedList(
                items = listOf(
                    "Review items and total in cart",
                    "Click the green \"Complete Transaction\" button",
                    "Select payment method (Cash, Card, etc.)",
                    "For cash: Enter amount tendered, change is calculated",
                    "For card: Process card payment",
                    "Click \"Complete Payment\"",
                    "Receipt is displayed"
                )
            )
        }

        HelpSection(title = "Payment Methods") {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                PaymentMethodCard("Cash", "Enter amount received. Change calculated automatically.")
                PaymentMethodCard("Credit/Debit Card", "Process card payment through terminal.")
                PaymentMethodCard(
                    "Cheque",
                    "Accept check payment. Enter check number for tracking."
                )
                PaymentMethodCard("Gift Card", "Redeem gift card. Enter card number.")
            }
        }
    }
}

@Composable
private fun AdvancedContent() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(20.dp)
    ) {
        HelpSection(
            icon = Icons.Default.Bolt,
            title = "Advanced Features",
            iconTint = Color(0xFFF59E0B)
        ) {}

        HelpSection(
            icon = Icons.Default.Fullscreen,
            title = "Fullscreen Mode"
        ) {
            Text(
                text = "Maximize screen space for a distraction-free POS experience.",
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                fontSize = 13.sp,
                modifier = Modifier.padding(bottom = 12.dp)
            )

            Surface(
                color = MaterialTheme.colorScheme.surfaceVariant,
                shape = MaterialTheme.shapes.medium
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text("How to Use:", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                    BulletList(
                        items = listOf(
                            "Click Fullscreen button in top bar",
                            "Press F11 on your keyboard",
                            "To exit: Click Exit Fullscreen or press F11 again",
                            "Or press Esc to exit fullscreen"
                        )
                    )
                }
            }
        }

        HelpSection(title = "Recent Orders") {
            Text(
                text = "View and reprint receipts for recent transactions.",
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                fontSize = 13.sp,
                modifier = Modifier.padding(bottom = 8.dp)
            )
            NumberedList(
                items = listOf(
                    "Click \"Order History\" in menu",
                    "Browse recent completed orders",
                    "Click \"View Receipt\" to see details",
                    "Reprint if needed"
                )
            )
        }
    }
}

@Composable
private fun ShortcutsContent() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(20.dp)
    ) {
        HelpSection(
            icon = Icons.Default.Keyboard,
            title = "Keyboard Shortcuts",
            iconTint = Color(0xFFA855F7)
        ) {
            Text(
                text = "Speed up your workflow with these keyboard shortcuts",
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                fontSize = 13.sp
            )
        }

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Column(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                ShortcutSection(
                    title = "General",
                    shortcuts = listOf(
                        "F1" to "Show keyboard shortcuts",
                        "F3" to "Search products",
                        "Ctrl+K" to "Quick search",
                        "Esc" to "Close dialogs / Clear search"
                    )
                )

                ShortcutSection(
                    title = "Orders",
                    shortcuts = listOf(
                        "Ctrl+N" to "Clear cart / New order",
                        "Delete" to "Remove selected item",
                        "Ctrl++" to "Increase quantity",
                        "Ctrl+-" to "Decrease quantity"
                    )
                )
            }

            Column(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                ShortcutSection(
                    title = "Payment",
                    shortcuts = listOf(
                        "F4" to "Cash payment",
                        "F5" to "Card payment",
                        "F6" to "Process payment"
                    )
                )

                ShortcutSection(
                    title = "Admin",
                    shortcuts = listOf(
                        "F11" to "Toggle fullscreen",
                        "Ctrl+L" to "Lock screen",
                        "Ctrl+Shift+T" to "Toggle training mode"
                    )
                )
            }
        }

        Surface(
            color = MaterialTheme.colorScheme.primaryContainer,
            shape = MaterialTheme.shapes.medium
        ) {
            Row(
                modifier = Modifier.padding(16.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalAlignment = Alignment.Top
            ) {
                Icon(
                    Icons.Default.Info,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.size(20.dp)
                )
                Column {
                    Text(
                        text = "Pro Tip",
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.primary,
                        fontSize = 13.sp
                    )
                    Text(
                        text = "Most keyboard shortcuts are also shown as hints next to buttons throughout the interface. Press F1 anytime to see the full list!",
                        color = MaterialTheme.colorScheme.onPrimaryContainer,
                        fontSize = 12.sp,
                        modifier = Modifier.padding(top = 4.dp)
                    )
                }
            }
        }
    }
}

// Helper Composables

@Composable
private fun HelpSection(
    icon: ImageVector? = null,
    title: String,
    iconTint: Color = MaterialTheme.colorScheme.onSurface,
    content: @Composable ColumnScope.() -> Unit = {}
) {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            if (icon != null) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = iconTint,
                    modifier = Modifier.size(20.dp)
                )
            }
            Text(
                text = title,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
        }
        content()
    }
}

@Composable
private fun NumberedList(items: List<String>) {
    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
        items.forEachIndexed { index, item ->
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(
                    text = "${index + 1}.",
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    fontSize = 13.sp
                )
                Text(
                    text = item,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    fontSize = 13.sp,
                    modifier = Modifier.weight(1f)
                )
            }
        }
    }
}

@Composable
private fun BulletList(
    items: List<String>,
    color: Color = MaterialTheme.colorScheme.onSurfaceVariant
) {
    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
        items.forEach { item ->
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(
                    text = "•",
                    color = color,
                    fontSize = 13.sp
                )
                Text(
                    text = item,
                    color = color,
                    fontSize = 13.sp,
                    modifier = Modifier.weight(1f)
                )
            }
        }
    }
}

@Composable
private fun InterfaceRow(label: String, description: String) {
    Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
        Text(
            text = label,
            fontWeight = FontWeight.SemiBold,
            fontSize = 13.sp,
            modifier = Modifier.width(100.dp)
        )
        Text(
            text = description,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            fontSize = 13.sp,
            modifier = Modifier.weight(1f)
        )
    }
}

@Composable
private fun PaymentMethodCard(title: String, description: String) {
    Surface(
        shape = MaterialTheme.shapes.medium,
        border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Text(
                text = title,
                fontWeight = FontWeight.Bold,
                fontSize = 13.sp
            )
            Text(
                text = description,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                fontSize = 12.sp,
                modifier = Modifier.padding(top = 4.dp)
            )
        }
    }
}

@Composable
private fun ShortcutSection(title: String, shortcuts: List<Pair<String, String>>) {
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Text(
            text = title,
            fontWeight = FontWeight.Bold,
            fontSize = 14.sp
        )
        Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
            shortcuts.forEach { (keys, description) ->
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = description,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        fontSize = 12.sp,
                        modifier = Modifier.weight(1f)
                    )
                    Surface(
                        shape = MaterialTheme.shapes.extraSmall,
                        color = MaterialTheme.colorScheme.surfaceVariant
                    ) {
                        Text(
                            text = keys,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Medium,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                    }
                }
            }
        }
    }
}