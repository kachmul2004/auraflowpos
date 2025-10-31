package com.theauraflow.pos.ui.screen

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.theauraflow.pos.presentation.viewmodel.ProductViewModel
import com.theauraflow.pos.presentation.viewmodel.CartViewModel
import com.theauraflow.pos.presentation.viewmodel.OrderViewModel
import com.theauraflow.pos.presentation.viewmodel.CustomerViewModel
import com.theauraflow.pos.ui.components.ProductGrid
import com.theauraflow.pos.ui.components.ShoppingCart
import com.theauraflow.pos.ui.components.ActionBar
import com.theauraflow.pos.ui.components.OnlineIndicator
import com.theauraflow.pos.ui.dialog.ReceiptDialog
import com.theauraflow.pos.ui.dialog.HelpDialog
import com.theauraflow.pos.ui.dialog.TablesDialog
import com.theauraflow.pos.domain.model.CartItem
import com.theauraflow.pos.domain.model.PaymentMethod

/**
 * Main POS screen matching the exact web version layout.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun POSScreen(
    productViewModel: ProductViewModel,
    cartViewModel: CartViewModel,
    orderViewModel: OrderViewModel,
    customerViewModel: CustomerViewModel,
    modifier: Modifier = Modifier
) {
    val productsState by productViewModel.productsState.collectAsState()
    val products = when (val s = productsState) {
        is com.theauraflow.pos.presentation.base.UiState.Success -> s.data
        else -> emptyList()
    }

    val cartState by cartViewModel.cartState.collectAsState()
    val cartUi = when (val s = cartState) {
        is com.theauraflow.pos.presentation.base.UiState.Success -> s.data
        else -> com.theauraflow.pos.presentation.viewmodel.CartUiState()
    }

    val lastCreatedOrder by orderViewModel.lastCreatedOrder.collectAsState()
    val cartItems = cartUi.items
    val subtotal = cartUi.subtotal
    val tax = cartUi.tax
    val discount = cartUi.discount
    val total = cartUi.total

    var searchQuery by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf("All") }

    // Dialog states
    var showReceiptDialog by remember { mutableStateOf(false) }
    var showHelpDialog by remember { mutableStateOf(false) }
    var showShiftDialog by remember { mutableStateOf(false) }
    var showSettingsDialog by remember { mutableStateOf(false) }
    var showKeyboardShortcutsDialog by remember { mutableStateOf(false) }
    var showEditProfileDialog by remember { mutableStateOf(false) }

    // View navigation
    var currentView by remember { mutableStateOf("pos") } // "pos" or "tables"

    // Top bar states
    var isTrainingMode by remember { mutableStateOf(false) }
    var isDarkTheme by remember { mutableStateOf(true) }
    var isFullscreen by remember { mutableStateOf(false) }
    var showUserMenu by remember { mutableStateOf(false) }

    // Receipt data
    var completedOrderNumber by remember { mutableStateOf("") }
    var completedItems by remember { mutableStateOf<List<CartItem>>(emptyList()) }
    var completedSubtotal by remember { mutableStateOf(0.0) }
    var completedDiscount by remember { mutableStateOf(0.0) }
    var completedTax by remember { mutableStateOf(0.0) }
    var completedTotal by remember { mutableStateOf(0.0) }
    var completedPaymentMethod by remember { mutableStateOf("") }
    var completedAmountReceived by remember { mutableStateOf(0.0) }

    val customersState by customerViewModel.customersState.collectAsState()
    val selectedCustomer by customerViewModel.selectedCustomer.collectAsState()
    var orderNotes by remember { mutableStateOf("") }

    val customers = remember(customersState) {
        when (val state = customersState) {
            is com.theauraflow.pos.presentation.base.UiState.Success -> state.data
            else -> emptyList()
        }
    }

    val filteredProducts = remember(products, searchQuery) {
        if (searchQuery.isBlank()) products
        else products.filter {
            it.name.contains(searchQuery, ignoreCase = true) ||
                    it.sku?.contains(searchQuery, ignoreCase = true) == true
        }
    }

    LaunchedEffect(lastCreatedOrder) {
        lastCreatedOrder?.let { order ->
            completedOrderNumber = order.orderNumber
        }
    }

    LaunchedEffect(showReceiptDialog) {
        if (!showReceiptDialog) {
            orderViewModel.clearLastOrder()
            orderNotes = ""
            customerViewModel.clearSelection()
        }
    }

    val focusManager = LocalFocusManager.current

    // Show Table Management screen if selected
    if (currentView == "tables") {
        TableManagementScreen(
            onBack = { currentView = "pos" }
        )
        return
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .clickable(
                // Dismiss keyboard when touched anywhere except child clickable elements
                indication = null,
                interactionSource = remember { MutableInteractionSource() }
            ) { focusManager.clearFocus() }
    ) {
        // Compact Top Bar - matches screenshot exactly
        Surface(
            modifier = Modifier.fillMaxWidth(),
            color = MaterialTheme.colorScheme.surface,
            shadowElevation = 2.dp
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 8.dp, vertical = 4.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                // Left: App name + badges
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(
                        text = "AuraFlow-POS",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.SemiBold
                    )

                    // Standard View badge
                    Surface(
                        shape = MaterialTheme.shapes.small,
                        border = androidx.compose.foundation.BorderStroke(
                            1.dp,
                            MaterialTheme.colorScheme.outline
                        )
                    ) {
                        Text(
                            text = "⚡ Standard View",
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                            fontSize = 11.sp
                        )
                    }

                    // Subscription badges
                    Surface(
                        shape = MaterialTheme.shapes.small,
                        border = androidx.compose.foundation.BorderStroke(
                            1.dp,
                            MaterialTheme.colorScheme.outline
                        )
                    ) {
                        Text(
                            text = "🍽️",
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                            fontSize = 11.sp
                        )
                    }

                    Surface(
                        shape = MaterialTheme.shapes.small,
                        border = androidx.compose.foundation.BorderStroke(
                            1.dp,
                            MaterialTheme.colorScheme.outline
                        )
                    ) {
                        Text(
                            text = "🏪",
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                            fontSize = 11.sp
                        )
                    }

                    // Clocked In badge
                    Surface(
                        shape = MaterialTheme.shapes.small,
                        border = androidx.compose.foundation.BorderStroke(
                            1.dp,
                            MaterialTheme.colorScheme.outline
                        )
                    ) {
                        Text(
                            text = "Clocked In: T#1",
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                            fontSize = 10.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }

                    // Training mode badge
                    if (isTrainingMode) {
                        Surface(
                            shape = MaterialTheme.shapes.small,
                            color = Color(0xFFF59E0B).copy(alpha = 0.2f),
                            border = androidx.compose.foundation.BorderStroke(
                                1.dp,
                                Color(0xFFF59E0B).copy(alpha = 0.5f)
                            )
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(3.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.School,
                                    contentDescription = null,
                                    tint = Color(0xFFF59E0B),
                                    modifier = Modifier.size(10.dp)
                                )
                                Text(
                                    text = "Training",
                                    fontSize = 9.sp,
                                    color = Color(0xFFF59E0B),
                                    fontWeight = FontWeight.Medium
                                )
                            }
                        }
                    }
                }

                // Center: Online indicator
                OnlineIndicator(isOnline = false, pendingCount = 0)

                // Right: Action buttons
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    // Help
                    TextButton(
                        onClick = { showHelpDialog = true },
                        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp)
                    ) {
                        Icon(Icons.Default.Help, null, modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(4.dp))
                        Text("Help", fontSize = 11.sp)
                    }

                    // Training toggle (Switch FIRST, then Label - matching web line 440-447)
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Switch(
                            checked = isTrainingMode,
                            onCheckedChange = {
                                isTrainingMode = it
                                // TODO: Show badge in top left when enabled
                            },
                            modifier = Modifier
                                .height(20.dp)
                                .scale(0.8f) // Scale down the switch to make it smaller
                        )
                        Text(
                            "Training",
                            fontSize = 10.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }

                    // Tables - same style as Standard View badge
                    Surface(
                        onClick = { currentView = "tables" }, // Navigate to full screen
                        shape = MaterialTheme.shapes.small,
                        border = androidx.compose.foundation.BorderStroke(
                            1.dp,
                            MaterialTheme.colorScheme.outline
                        ),
                        color = MaterialTheme.colorScheme.surface
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                            horizontalArrangement = Arrangement.spacedBy(4.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(Icons.Default.TableChart, null, modifier = Modifier.size(12.dp))
                            Text("Tables", fontSize = 11.sp)
                        }
                    }

                    // Admin - same style as Standard View badge
                    Surface(
                        onClick = { /* TODO */ },
                        shape = MaterialTheme.shapes.small,
                        border = androidx.compose.foundation.BorderStroke(
                            1.dp,
                            MaterialTheme.colorScheme.outline
                        ),
                        color = MaterialTheme.colorScheme.surface
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                            horizontalArrangement = Arrangement.spacedBy(4.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                Icons.Default.AdminPanelSettings,
                                null,
                                modifier = Modifier.size(12.dp)
                            )
                            Text("Admin", fontSize = 11.sp)
                        }
                    }

                    // Fullscreen
                    IconButton(
                        onClick = { isFullscreen = !isFullscreen },
                        modifier = Modifier.size(32.dp)
                    ) {
                        Icon(
                            if (isFullscreen) Icons.Default.FullscreenExit else Icons.Default.Fullscreen,
                            null,
                            modifier = Modifier.size(18.dp)
                        )
                    }

                    // Theme
                    IconButton(
                        onClick = { isDarkTheme = !isDarkTheme },
                        modifier = Modifier.size(32.dp)
                    ) {
                        Icon(
                            if (isDarkTheme) Icons.Default.WbSunny else Icons.Default.Brightness3,
                            null,
                            modifier = Modifier.size(18.dp)
                        )
                    }

                    // User menu with name and avatar (matching web UserProfileDropdown)
                    Box {
                        Button(
                            onClick = { showUserMenu = !showUserMenu },
                            modifier = Modifier.height(28.dp), // Compact height
                            colors = ButtonDefaults.buttonColors(
                                containerColor = Color.Transparent,
                                contentColor = MaterialTheme.colorScheme.onSurface
                            ),
                            contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp)
                        ) {
                            // Avatar with initials
                            Surface(
                                modifier = Modifier.size(20.dp), // Small avatar
                                shape = RoundedCornerShape(50),
                                color = MaterialTheme.colorScheme.primary
                            ) {
                                Box(
                                    contentAlignment = Alignment.Center,
                                    modifier = Modifier.fillMaxSize()
                                ) {
                                    Text(
                                        text = "JC", // John Cashier initials
                                        fontSize = 9.sp,
                                        color = MaterialTheme.colorScheme.onPrimary,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                            }
                            Spacer(Modifier.width(6.dp))
                            Text(
                                "John Cashier",
                                fontSize = 11.sp,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                        }
                        DropdownMenu(
                            expanded = showUserMenu,
                            onDismissRequest = { showUserMenu = false }
                        ) {
                            DropdownMenuItem(
                                text = {
                                    Text(
                                        "My Account",
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                },
                                onClick = {},
                                enabled = false
                            )
                            HorizontalDivider()
                            // Edit Profile
                            DropdownMenuItem(
                                text = {
                                    Row(
                                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Icon(
                                            Icons.Default.Person,
                                            null,
                                            modifier = Modifier.size(16.dp)
                                        )
                                        Text("Edit Profile", fontSize = 12.sp)
                                    }
                                },
                                onClick = {
                                    showEditProfileDialog = true
                                    showUserMenu = false
                                }
                            )
                            HorizontalDivider()
                            // Shift Status
                            DropdownMenuItem(
                                text = {
                                    Row(
                                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Icon(
                                            Icons.Default.Schedule,
                                            null,
                                            modifier = Modifier.size(16.dp)
                                        )
                                        Text("Shift Status", fontSize = 12.sp)
                                    }
                                },
                                onClick = {
                                    showShiftDialog = true
                                    showUserMenu = false
                                }
                            )
                            // Settings
                            DropdownMenuItem(
                                text = {
                                    Row(
                                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Icon(
                                            Icons.Default.Settings,
                                            null,
                                            modifier = Modifier.size(16.dp)
                                        )
                                        Text("Settings", fontSize = 12.sp)
                                    }
                                },
                                onClick = {
                                    showSettingsDialog = true
                                    showUserMenu = false
                                }
                            )
                            // Keyboard Shortcuts
                            DropdownMenuItem(
                                text = {
                                    Row(
                                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Icon(
                                            Icons.Default.Keyboard,
                                            null,
                                            modifier = Modifier.size(16.dp)
                                        )
                                        Text("Keyboard Shortcuts", fontSize = 12.sp)
                                    }
                                },
                                onClick = {
                                    showKeyboardShortcutsDialog = true
                                    showUserMenu = false
                                }
                            )
                        }
                    }
                }
            }
        }

        // Main content
        Row(modifier = Modifier.fillMaxSize().weight(1f)) {
            when (currentView) {
                "pos" -> {
                    // Left: Product area
                    Column(modifier = Modifier.weight(1f).fillMaxHeight()) {
                        // Product grid with search and categories (search is part of ProductGrid per web version)
                        ProductGrid(
                            products = filteredProducts,
                            selectedCategory = selectedCategory,
                            onCategoryChange = { selectedCategory = it },
                            onProductClick = { product -> cartViewModel.addToCart(product) },
                            modifier = Modifier.fillMaxWidth().weight(1f),
                            searchQuery = searchQuery,
                            onSearchQueryChange = { searchQuery = it }
                        )

                        // Action bar
                        ActionBar(
                            onClockOut = { /* TODO */ },
                            onLock = { /* TODO */ },
                            onCashDrawer = { /* TODO */ },
                            onTransactions = { /* TODO */ },
                            onReturns = { /* TODO */ },
                            onOrders = { /* TODO */ }
                        )
                    }

                    // Right: Cart sidebar (384dp width)
                    ShoppingCart(
                        items = cartItems,
                        subtotal = subtotal,
                        tax = tax,
                        discount = discount,
                        total = total,
                        customers = customers,
                        selectedCustomer = selectedCustomer,
                        onSelectCustomer = { customer ->
                            if (customer != null) {
                                customerViewModel.selectCustomer(customer.id)
                            } else {
                                customerViewModel.clearSelection()
                            }
                        },
                        orderNotes = orderNotes,
                        onSaveNotes = { notes -> orderNotes = notes },
                        onUpdateItem = { cartItem, newQuantity, itemDiscount, priceOverride ->
                            if (newQuantity != cartItem.quantity) {
                                cartViewModel.updateQuantity(cartItem.id, newQuantity)
                            }
                        },
                        onVoidItem = { cartItem -> cartViewModel.removeFromCart(cartItem.id) },
                        onClearCart = { cartViewModel.clearCart() },
                        onCheckout = { paymentMethodString, amountReceived ->
                            val paymentMethod = when (paymentMethodString.lowercase()) {
                                "cash" -> PaymentMethod.CASH
                                "card" -> PaymentMethod.CARD
                                else -> PaymentMethod.OTHER
                            }
                            completedItems = cartItems.toList()
                            completedSubtotal = subtotal
                            completedDiscount = discount
                            completedTax = tax
                            completedTotal = total
                            completedPaymentMethod = paymentMethodString
                            completedAmountReceived = amountReceived
                            orderViewModel.createOrder(
                                customerId = selectedCustomer?.id,
                                paymentMethod = paymentMethod,
                                amountPaid = if (paymentMethod == PaymentMethod.CASH) amountReceived else null,
                                notes = orderNotes
                            )
                            cartViewModel.clearCart()
                            completedOrderNumber =
                                "ORD-${kotlin.random.Random.nextInt(10000, 99999)}"
                            showReceiptDialog = true
                            orderNotes = ""
                            customerViewModel.clearSelection()
                        },
                        modifier = Modifier.width(384.dp).fillMaxHeight()
                    )
                }

                "tables" -> {
                    // TableManagementScreen is now rendered above in the early return block.
                }
            }
        }
    }

    // Dialogs
    ReceiptDialog(
        open = showReceiptDialog,
        orderNumber = completedOrderNumber,
        items = completedItems,
        subtotal = completedSubtotal,
        discount = completedDiscount,
        tax = completedTax,
        total = completedTotal,
        paymentMethod = completedPaymentMethod,
        amountReceived = completedAmountReceived,
        onDismiss = { showReceiptDialog = false },
        onNewOrder = { showReceiptDialog = false },
        onPrint = { /* TODO */ },
        onEmail = { /* TODO */ }
    )

    if (showHelpDialog) {
        HelpDialog(onDismiss = { showHelpDialog = false })
    }

    // Edit Profile Dialog (placeholder)
    if (showEditProfileDialog) {
        AlertDialog(
            onDismissRequest = { showEditProfileDialog = false },
            title = { Text("Edit Profile") },
            text = { Text("Edit profile functionality coming soon") },
            confirmButton = {
                TextButton(onClick = { showEditProfileDialog = false }) {
                    Text("Close")
                }
            }
        )
    }

    // Shift Status Dialog (placeholder)
    if (showShiftDialog) {
        AlertDialog(
            onDismissRequest = { showShiftDialog = false },
            title = { Text("Shift Status") },
            text = {
                Column(
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text("Current Shift Information", fontWeight = FontWeight.Bold)
                    Text("Terminal: T#1")
                    Text("Clocked In: 09:00 AM")
                    Text("Total Orders: 0")
                    Text("Total Sales: $0.00")
                }
            },
            confirmButton = {
                TextButton(onClick = { showShiftDialog = false }) {
                    Text("Close")
                }
            }
        )
    }

    // Settings Dialog (placeholder)
    if (showSettingsDialog) {
        AlertDialog(
            onDismissRequest = { showSettingsDialog = false },
            title = { Text("Settings") },
            text = {
                Column(
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("Auto-Print Receipts")
                        Switch(checked = false, onCheckedChange = {})
                    }
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("Sound Effects")
                        Switch(checked = true, onCheckedChange = {})
                    }
                }
            },
            confirmButton = {
                TextButton(onClick = { showSettingsDialog = false }) {
                    Text("Close")
                }
            }
        )
    }

    // Keyboard Shortcuts Dialog (placeholder)
    if (showKeyboardShortcutsDialog) {
        AlertDialog(
            onDismissRequest = { showKeyboardShortcutsDialog = false },
            title = { Text("Keyboard Shortcuts") },
            text = {
                Column(
                    verticalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    Text("General Shortcuts:", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                    Text("F1 - Show keyboard shortcuts", fontSize = 11.sp)
                    Text("F2 - Quick payment (Cash)", fontSize = 11.sp)
                    Text("F3 - Search products", fontSize = 11.sp)
                    Text("F11 - Toggle fullscreen", fontSize = 11.sp)
                    Text("Ctrl+L - Lock screen", fontSize = 11.sp)
                    Text("Ctrl+N - New order / Clear cart", fontSize = 11.sp)
                }
            },
            confirmButton = {
                TextButton(onClick = { showKeyboardShortcutsDialog = false }) {
                    Text("Close")
                }
            }
        )
    }
}

