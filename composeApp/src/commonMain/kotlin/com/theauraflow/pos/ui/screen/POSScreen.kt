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
import com.theauraflow.pos.ui.dialog.EditProfileDialog
import com.theauraflow.pos.ui.dialog.ShiftStatusDialog
import com.theauraflow.pos.ui.dialog.QuickSettingsDialog
import com.theauraflow.pos.ui.dialog.KeyboardShortcutsDialog
import com.theauraflow.pos.ui.components.CashDrawerDialog
import com.theauraflow.pos.ui.components.ParkedSalesDialog
import com.theauraflow.pos.ui.components.ParkedSale
import com.theauraflow.pos.domain.model.CartItem
import com.theauraflow.pos.domain.model.PaymentMethod
import com.theauraflow.pos.ui.dialog.VariationSelectionDialog

// Import new screens for view navigation
import com.theauraflow.pos.ui.screen.TransactionsScreen
import com.theauraflow.pos.ui.screen.ReturnsScreen
import com.theauraflow.pos.ui.screen.OrdersScreen // Import new OrdersScreen

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
    isDarkTheme: Boolean,
    onThemeToggle: () -> Unit,
    onLogout: () -> Unit = {},
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
    var showClockInDialog by remember { mutableStateOf(true) }
    var shiftStarted by remember { mutableStateOf(false) }
    var showReceiptDialog by remember { mutableStateOf(false) }
    var showHelpDialog by remember { mutableStateOf(false) }
    var showShiftDialog by remember { mutableStateOf(false) }
    var showSettingsDialog by remember { mutableStateOf(false) }
    var showKeyboardShortcutsDialog by remember { mutableStateOf(false) }
    var showEditProfileDialog by remember { mutableStateOf(false) }
    var showCashDrawerDialog by remember { mutableStateOf(false) }
    var showLockScreen by remember { mutableStateOf(false) }
    var showParkedSalesDialog by remember { mutableStateOf(false) }

    // View navigation
    var currentView by remember { mutableStateOf("pos") } // "pos", "tables", "transactions", "returns", "orders"

    // Top bar states
    var isTrainingMode by remember { mutableStateOf(false) }
    var isFullscreen by remember { mutableStateOf(false) }
    var showUserMenu by remember { mutableStateOf(false) }

    // Receipt data - only keep payment data not in Order model
    var completedOrderNumber by remember { mutableStateOf("") }
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

    val heldCartsState by cartViewModel.heldCartsState.collectAsState()
    val heldCarts = when (val s = heldCartsState) {
        is com.theauraflow.pos.presentation.base.UiState.Success -> s.data
        else -> emptyList()
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

    // Variation/Modifier product dialog state
    var selectedProductForCustomization by remember {
        mutableStateOf<com.theauraflow.pos.domain.model.Product?>(
            null
        )
    }

    // Show Table Management screen if selected
    if (currentView == "tables") {
        TableManagementScreen(
            onBack = { currentView = "pos" }
        )
        return
    }
    // Show Transactions screen if selected
    if (currentView == "transactions") {
        TransactionsScreen(
            transactions = emptyList(), // TODO: Get from shift data
            onBack = { currentView = "pos" }
        )
        return
    }
    // Show Returns screen if selected
    if (currentView == "returns") {
        ReturnsScreen(
            orders = emptyList(), // TODO: Get from order history
            onBack = { currentView = "pos" },
            onProcessReturn = { orderId, itemIds, reason ->
                // TODO: Process return
                println("Processing return for order $orderId")
            }
        )
        return
    }
    // Show Orders screen if selected
    if (currentView == "orders") {
        OrdersScreen(
            orderViewModel = orderViewModel,
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
            color = MaterialTheme.colorScheme.surface
        ) {
            Column {
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
                            fontWeight = FontWeight.SemiBold,
                            color = if (isDarkTheme) Color.White else MaterialTheme.colorScheme.onSurface
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
                                fontSize = 11.sp,
                                color = if (isDarkTheme) Color.White else MaterialTheme.colorScheme.onSurface
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
                                color = if (isDarkTheme) Color.White else MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }

                        // Training mode badge - KEEP ORANGE COLOR
                        if (isTrainingMode) {
                            Surface(
                                shape = MaterialTheme.shapes.small,
                                color = MaterialTheme.colorScheme.surfaceVariant,
                                border = androidx.compose.foundation.BorderStroke(
                                    1.dp,
                                    Color(0xFFF59E0B)
                                )
                            ) {
                                Row(
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(3.dp)
                                ) {
                                    Icon(
                                        Icons.Default.School,
                                        null,
                                        modifier = Modifier.size(10.dp)
                                    )
                                    Text(
                                        text = "Training",
                                        fontSize = 9.sp,
                                        color = Color(0xFFF59E0B), // Keep orange - this is a status color
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
                            Icon(
                                Icons.Default.Help,
                                null,
                                modifier = Modifier.size(16.dp),
                                tint = if (isDarkTheme) Color.White else MaterialTheme.colorScheme.onSurface
                            )
                            Spacer(Modifier.width(4.dp))
                            Text(
                                "Help",
                                fontSize = 11.sp,
                                color = if (isDarkTheme) Color.White else MaterialTheme.colorScheme.onSurface
                            )
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
                                color = if (isDarkTheme) Color.White else MaterialTheme.colorScheme.onSurfaceVariant
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
                                Icon(
                                    Icons.Default.TableChart,
                                    null,
                                    modifier = Modifier.size(12.dp),
                                    tint = if (isDarkTheme) Color.White else MaterialTheme.colorScheme.onSurface
                                )
                                Text(
                                    "Tables",
                                    fontSize = 11.sp,
                                    color = if (isDarkTheme) Color.White else MaterialTheme.colorScheme.onSurface
                                )
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
                                    modifier = Modifier.size(12.dp),
                                    tint = if (isDarkTheme) Color.White else MaterialTheme.colorScheme.onSurface
                                )
                                Text(
                                    "Admin",
                                    fontSize = 11.sp,
                                    color = if (isDarkTheme) Color.White else MaterialTheme.colorScheme.onSurface
                                )
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
                                modifier = Modifier.size(18.dp),
                                tint = if (isDarkTheme) Color.White else MaterialTheme.colorScheme.onSurface
                            )
                        }

                        // Theme
                        IconButton(
                            onClick = onThemeToggle,
                            modifier = Modifier.size(32.dp)
                        ) {
                            Icon(
                                if (isDarkTheme) Icons.Default.WbSunny else Icons.Default.Brightness3,
                                null,
                                modifier = Modifier.size(18.dp),
                                tint = if (isDarkTheme) Color.White else MaterialTheme.colorScheme.onSurface
                            )
                        }

                        // User menu with name and avatar (matching web UserProfileDropdown)
                        Box {
                            Button(
                                onClick = { showUserMenu = !showUserMenu },
                                modifier = Modifier.height(28.dp), // Compact height
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = Color.Transparent,
                                    contentColor = if (isDarkTheme) Color.White else MaterialTheme.colorScheme.onSurface
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
                                    color = if (isDarkTheme) Color.White else MaterialTheme.colorScheme.onSurface
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
                HorizontalDivider(color = MaterialTheme.colorScheme.outline)
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
                            onProductClick = { product ->
                                if (product.hasVariations || product.hasModifiers) {
                                    selectedProductForCustomization = product
                                } else {
                                    cartViewModel.addToCart(product)
                                }
                            },
                            modifier = Modifier.fillMaxWidth().weight(1f),
                            searchQuery = searchQuery,
                            onSearchQueryChange = { searchQuery = it },
                            isDarkTheme = isDarkTheme,
                            cartItems = cartItems // Pass cart items for real-time stock calculation
                        )

                        // Action bar
                        ActionBar(
                            onClockOut = { showShiftDialog = true },
                            onLock = { showLockScreen = true },
                            onCashDrawer = { showCashDrawerDialog = true },
                            onTransactions = { currentView = "transactions" },
                            onReturns = { currentView = "returns" },
                            onOrders = {
                                currentView = "orders"
                            }, // Navigate to orders history page
                            // Plugin buttons (can be toggled via settings in the future)
                            showSplitCheck = true, // TODO: Get from settings
                            onSplitCheck = { /* TODO: Implement split check dialog */ },
                            cartHasItems = cartItems.isNotEmpty(),
                            showCourses = true, // TODO: Get from settings
                            onCourses = { /* TODO: Implement courses dialog */ },
                            showHeldOrders = true, // TODO: Get from settings
                            onHeldOrders = { /* TODO: Implement held orders dialog */ },
                            heldOrdersCount = 0 // TODO: Get from order state
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
                            // Create order first (this clears cart internally)
                            orderViewModel.createOrder(
                                customerId = selectedCustomer?.id,
                                paymentMethod = paymentMethod,
                                amountPaid = if (paymentMethod == PaymentMethod.CASH) amountReceived else null,
                                notes = orderNotes
                            )
                            // Store payment data for receipt
                            completedPaymentMethod = paymentMethodString
                            completedAmountReceived = amountReceived
                            showReceiptDialog = true
                            orderNotes = ""
                            customerViewModel.clearSelection()
                        },
                        onParkSale = {
                            cartViewModel.holdCart()
                            showParkedSalesDialog = true
                        },
                        modifier = Modifier.width(384.dp).fillMaxHeight()
                    )
                }

                "tables" -> {
                    // TableManagementScreen is now rendered above in the early return block.
                }

                "transactions" -> {
                    // TransactionsScreen is rendered above in the early return block.
                }

                "returns" -> {
                    // ReturnsScreen is rendered above in the early return block.
                }

                "orders" -> {
                    // OrdersScreen is rendered above in the early return block.
                }
            }
        }
    }

    // Clock In Dialog - shows immediately when POSScreen loads
    if (showClockInDialog && !shiftStarted) {
        ClockInDialog(
            onClockIn = { openingBalance ->
                // TODO: Start shift with openingBalance
                shiftStarted = true
                showClockInDialog = false
            },
            onCancel = {
                // Cancel = Logout
                onLogout()
            }
        )
    }

    // Dialogs
    ReceiptDialog(
        open = showReceiptDialog,
        orderNumber = completedOrderNumber,
        items = lastCreatedOrder?.items ?: emptyList(),
        subtotal = lastCreatedOrder?.subtotal ?: 0.0,
        discount = lastCreatedOrder?.discount ?: 0.0,
        tax = lastCreatedOrder?.tax ?: 0.0,
        total = lastCreatedOrder?.total ?: 0.0,
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

    // Edit Profile Dialog
    if (showEditProfileDialog) {
        EditProfileDialog(
            open = showEditProfileDialog,
            onDismiss = { showEditProfileDialog = false }
        )
    }

    // Shift Status Dialog
    if (showShiftDialog) {
        ShiftStatusDialog(
            open = showShiftDialog,
            onDismiss = { showShiftDialog = false }
        )
    }

    // Quick Settings Dialog
    if (showSettingsDialog) {
        QuickSettingsDialog(
            open = showSettingsDialog,
            onDismiss = { showSettingsDialog = false }
        )
    }

    // Keyboard Shortcuts Dialog
    if (showKeyboardShortcutsDialog) {
        KeyboardShortcutsDialog(
            open = showKeyboardShortcutsDialog,
            onDismiss = { showKeyboardShortcutsDialog = false }
        )
    }

    // Cash Drawer Dialog
    CashDrawerDialog(
        open = showCashDrawerDialog,
        currentBalance = 100.0, // TODO: Get from shift data
        isDarkTheme = isDarkTheme,
        onClose = { showCashDrawerDialog = false },
        onConfirm = { type, amount, reason ->
            // TODO: Record cash transaction
            println("Cash $type: $$amount - $reason")
            showCashDrawerDialog = false
        }
    )

    // Lock Screen
    LockScreen(
        open = showLockScreen,
        userPin = "123456", // TODO: Get from user data
        userName = "John Cashier",
        onUnlock = { showLockScreen = false }
    )

    // Parked Sales Dialog
    ParkedSalesDialog(
        open = showParkedSalesDialog,
        parkedSales = heldCarts.map { heldCart ->
            ParkedSale(
                id = heldCart.id,
                timestamp = formatTimestamp(heldCart.createdAt),
                itemCount = heldCart.itemCount,
                total = heldCart.total,
                customerName = heldCart.customerName
            )
        },
        currentCartHasItems = cartItems.isNotEmpty(),
        onClose = { showParkedSalesDialog = false },
        onParkCurrent = {
            cartViewModel.holdCart()
            showParkedSalesDialog = false
        },
        onLoadSale = { saleId ->
            cartViewModel.retrieveCart(saleId)
            showParkedSalesDialog = false
        },
        onDeleteSale = { saleId ->
            cartViewModel.deleteHeldCart(saleId)
        }
    )

    // Temporary dialog for products with variations/modifiers (Phase 2 - will be replaced with full modal)
    selectedProductForCustomization?.let { product ->
        VariationSelectionDialog(
            product = product,
            onDismiss = { selectedProductForCustomization = null },
            onAddToCart = { variation, modifiers ->
                // Add to cart with variation and modifiers
                cartViewModel.addToCart(product, variation = variation, modifiers = modifiers)
                selectedProductForCustomization = null
            },
            getAvailableStock = { productId, variationId ->
                // Calculate available stock for the variation
                if (variationId != null) {
                    val variation = product.variations?.find { it.id == variationId }
                    val quantityInCart = cartItems
                        .filter { it.product.id == productId && it.variation?.id == variationId }
                        .sumOf { it.quantity }
                    (variation?.stockQuantity ?: 0) - quantityInCart
                } else {
                    val quantityInCart = cartItems
                        .filter { it.product.id == productId && it.variation == null }
                        .sumOf { it.quantity }
                    product.stockQuantity - quantityInCart
                }
            }
        )
    }
}

/**
 * Clock In Dialog for starting a shift.
 * Shows opening cash balance input.
 * No close button - only Clock In or Cancel (logout).
 *
 * Web reference: docs/Web Version/src/components/LoginScreen.tsx (Dialog)
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ClockInDialog(
    onClockIn: (openingBalance: Double) -> Unit,
    onCancel: () -> Unit
) {
    var openingBalance by remember { mutableStateOf("100.00") }

    AlertDialog(
        onDismissRequest = {}, // No dismiss on outside click
        title = {
            Column {
                Text(
                    "Clock In",
                    style = MaterialTheme.typography.titleLarge
                )
                Text(
                    "Enter the opening cash balance to start your shift.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.padding(top = 8.dp)
                )
            }
        },
        text = {
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Opening balance input
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(
                        text = "Opening Cash Balance ($)",
                        style = MaterialTheme.typography.bodyMedium.copy(
                            fontWeight = FontWeight.Medium
                        )
                    )
                    OutlinedTextField(
                        value = openingBalance,
                        onValueChange = { openingBalance = it },
                        modifier = Modifier.fillMaxWidth(),
                        placeholder = { Text("0.00") },
                        singleLine = true
                    )
                    Text(
                        text = "Count the cash in the drawer and enter the total amount.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    val balance = openingBalance.toDoubleOrNull() ?: 0.0
                    onClockIn(balance)
                },
                enabled = openingBalance.isNotBlank()
            ) {
                Text("Clock In")
            }
        },
        dismissButton = {
            TextButton(onClick = onCancel) {
                Text("Cancel")
            }
        }
    )
}

/**
 * Format timestamp to readable date/time string.
 * Using simple formatting based on timestamp value.
 */
private fun formatTimestamp(timestamp: Long): String {
    // Simple approach: show relative order
    val saleNumber = timestamp / 1000L
    return "Sale #$saleNumber"
}
