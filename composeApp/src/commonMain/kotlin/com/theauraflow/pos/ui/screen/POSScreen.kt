package com.theauraflow.pos.ui.screen

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.theauraflow.pos.presentation.viewmodel.ProductViewModel
import com.theauraflow.pos.presentation.viewmodel.CartViewModel
import com.theauraflow.pos.presentation.viewmodel.OrderViewModel
import com.theauraflow.pos.presentation.viewmodel.CustomerViewModel
import com.theauraflow.pos.ui.components.ProductGrid
import com.theauraflow.pos.ui.components.ShoppingCart
import com.theauraflow.pos.ui.dialog.ReceiptDialog
import com.theauraflow.pos.domain.model.CartItem
import com.theauraflow.pos.domain.model.PaymentMethod
import kotlin.random.Random

/**
 * Main POS screen with product grid and shopping cart.
 * Uses split layout: Product grid on left (70%), cart on right (30%).
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

    // Receipt dialog state
    var showReceiptDialog by remember { mutableStateOf(false) }
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

    // Order notes state
    var orderNotes by remember { mutableStateOf("") }

    // Extract customers list from state
    val customers = remember(customersState) {
        when (val state = customersState) {
            is com.theauraflow.pos.presentation.base.UiState.Success -> state.data
            else -> emptyList()
        }
    }

    // Filter products by search query
    val filteredProducts = remember(products, searchQuery) {
        if (searchQuery.isBlank()) products
        else products.filter {
            it.name.contains(searchQuery, ignoreCase = true) ||
                    it.sku?.contains(searchQuery, ignoreCase = true) == true
        }
    }

    // Watch for newly created orders to update order number
    LaunchedEffect(lastCreatedOrder) {
        lastCreatedOrder?.let { order ->
            // Update order number with the real one from database
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

    Row(
        modifier = modifier.fillMaxSize()
    ) {
        // Left side - Product Grid (70%)
        Column(
            modifier = Modifier
                .weight(7f)
                .fillMaxHeight()
        ) {
            // Search bar
            Surface(
                modifier = Modifier.fillMaxWidth(),
                color = MaterialTheme.colorScheme.surface,
                shadowElevation = 2.dp
            ) {
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = {
                        searchQuery = it
                        productViewModel.searchProducts(it)
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    placeholder = { Text("Search products by name or SKU...") },
                    leadingIcon = {
                        Icon(Icons.Default.Search, "Search")
                    },
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = MaterialTheme.colorScheme.primary,
                        unfocusedBorderColor = MaterialTheme.colorScheme.outline
                    )
                )
            }

            // Product grid with category filtering and pagination
            ProductGrid(
                products = filteredProducts,
                selectedCategory = selectedCategory,
                onCategoryChange = { selectedCategory = it },
                onProductClick = { product ->
                    cartViewModel.addToCart(product)
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f)
            )
        }

        // Divider
        VerticalDivider()

        // Right side - Shopping Cart (30%)
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
            onSaveNotes = { notes ->
                orderNotes = notes
            },
            onUpdateItem = { cartItem, newQuantity, itemDiscount, priceOverride ->
                // Update quantity
                if (newQuantity != cartItem.quantity) {
                    cartViewModel.updateQuantity(cartItem.id, newQuantity)
                }
                // TODO: Handle itemDiscount and priceOverride when CartViewModel supports them
                // For now, we'll need to update the CartViewModel to support these
            },
            onVoidItem = { cartItem ->
                cartViewModel.removeFromCart(cartItem.id)
            },
            onClearCart = {
                cartViewModel.clearCart()
            },
            onCheckout = { paymentMethodString, amountReceived ->
                // Convert string to PaymentMethod enum
                val paymentMethod = when (paymentMethodString.lowercase()) {
                    "cash" -> PaymentMethod.CASH
                    "card" -> PaymentMethod.CARD
                    else -> PaymentMethod.OTHER
                }

                // Capture current cart state before clearing
                completedItems = cartItems.toList()
                completedSubtotal = subtotal
                completedDiscount = discount
                completedTax = tax
                completedTotal = total
                completedPaymentMethod = paymentMethodString
                completedAmountReceived = amountReceived

                // Create order via OrderViewModel
                orderViewModel.createOrder(
                    customerId = selectedCustomer?.id,
                    paymentMethod = paymentMethod,
                    amountPaid = if (paymentMethod == PaymentMethod.CASH) amountReceived else null,
                    notes = orderNotes
                )

                // Clear cart explicitly
                cartViewModel.clearCart()

                // Show receipt immediately
                // Generate a temporary order number (will be replaced when real order comes through)
                completedOrderNumber = "ORD-${kotlin.random.Random.nextInt(10000, 99999)}"
                showReceiptDialog = true

                // Clear order notes and customer selection
                orderNotes = ""
                customerViewModel.clearSelection()
            },
            modifier = Modifier
                .weight(3f)
                .fillMaxHeight()
        )
    }

    // Receipt Dialog
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
        onPrint = { /* TODO: Implement print */ },
        onEmail = { /* TODO: Implement email */ }
    )
}
