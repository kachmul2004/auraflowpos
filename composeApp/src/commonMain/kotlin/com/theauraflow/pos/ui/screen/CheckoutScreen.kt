package com.theauraflow.pos.ui.screen

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.theauraflow.pos.presentation.viewmodel.CartViewModel
import com.theauraflow.pos.presentation.viewmodel.CartUiState
import com.theauraflow.pos.presentation.viewmodel.OrderViewModel
import com.theauraflow.pos.presentation.viewmodel.CustomerViewModel
import com.theauraflow.pos.core.util.formatCurrency
import com.theauraflow.pos.ui.components.CartItemCard

/**
 * Checkout screen for processing orders.
 *
 * Features:
 * - Cart summary
 * - Payment method selection
 * - Customer selection (optional)
 * - Order notes
 * - Complete order action
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CheckoutScreen(
    cartViewModel: CartViewModel,
    orderViewModel: OrderViewModel,
    customerViewModel: CustomerViewModel,
    onBack: () -> Unit,
    onOrderComplete: () -> Unit,
    modifier: Modifier = Modifier
) {
    val cartState by cartViewModel.cartState.collectAsState()

    var selectedPaymentMethod by remember { mutableStateOf("cash") }
    var orderNotes by remember { mutableStateOf("") }
    var isProcessing by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Checkout") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, "Back")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer
                )
            )
        },
        modifier = modifier
    ) { paddingValues ->

        when (val state = cartState) {
            is com.theauraflow.pos.presentation.base.UiState.Success -> {
                val cart = state.data

                if (cart.items.isEmpty()) {
                    // Empty cart state
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(paddingValues),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.spacedBy(16.dp)
                        ) {
                            Text(
                                text = "Cart is empty",
                                style = MaterialTheme.typography.titleLarge
                            )
                            Button(onClick = onBack) {
                                Text("Go Back")
                            }
                        }
                    }
                } else {
                    // Checkout content
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(paddingValues)
                    ) {
                        LazyColumn(
                            modifier = Modifier
                                .weight(1f)
                                .fillMaxWidth(),
                            contentPadding = PaddingValues(16.dp),
                            verticalArrangement = Arrangement.spacedBy(16.dp)
                        ) {
                            // Order items section
                            item {
                                Text(
                                    text = "Order Items",
                                    style = MaterialTheme.typography.titleMedium,
                                    color = MaterialTheme.colorScheme.primary
                                )
                            }

                            items(cart.items) { item ->
                                CartItemCard(
                                    cartItem = item,
                                    onClick = {
                                        // TODO: Open edit dialog for this item
                                    }
                                )
                            }

                            // Customer section
                            item {
                                Spacer(modifier = Modifier.height(8.dp))
                                Text(
                                    text = "Customer (Optional)",
                                    style = MaterialTheme.typography.titleMedium,
                                    color = MaterialTheme.colorScheme.primary
                                )
                                Spacer(modifier = Modifier.height(8.dp))

                                OutlinedCard(
                                    modifier = Modifier.fillMaxWidth(),
                                    onClick = { /* TODO: Open customer selection */ }
                                ) {
                                    Row(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .padding(16.dp),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Row(
                                            horizontalArrangement = Arrangement.spacedBy(12.dp),
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            Icon(
                                                Icons.Default.Person,
                                                contentDescription = null,
                                                tint = MaterialTheme.colorScheme.primary
                                            )
                                            Text("Add Customer")
                                        }
                                        Text(
                                            text = "Optional",
                                            style = MaterialTheme.typography.bodySmall,
                                            color = MaterialTheme.colorScheme.onSurfaceVariant
                                        )
                                    }
                                }
                            }

                            // Payment method section
                            item {
                                Spacer(modifier = Modifier.height(8.dp))
                                Text(
                                    text = "Payment Method",
                                    style = MaterialTheme.typography.titleMedium,
                                    color = MaterialTheme.colorScheme.primary
                                )
                                Spacer(modifier = Modifier.height(8.dp))

                                PaymentMethodSelector(
                                    selectedMethod = selectedPaymentMethod,
                                    onMethodSelected = { selectedPaymentMethod = it }
                                )
                            }

                            // Order notes section
                            item {
                                Spacer(modifier = Modifier.height(8.dp))
                                Text(
                                    text = "Order Notes",
                                    style = MaterialTheme.typography.titleMedium,
                                    color = MaterialTheme.colorScheme.primary
                                )
                                Spacer(modifier = Modifier.height(8.dp))

                                OutlinedTextField(
                                    value = orderNotes,
                                    onValueChange = { orderNotes = it },
                                    modifier = Modifier.fillMaxWidth(),
                                    placeholder = { Text("Add notes (optional)") },
                                    minLines = 3,
                                    maxLines = 5
                                )
                            }

                            // Order summary section
                            item {
                                Spacer(modifier = Modifier.height(8.dp))
                                OrderSummaryCard(cart = cart)
                            }
                        }

                        // Bottom action area
                        Surface(
                            modifier = Modifier.fillMaxWidth(),
                            tonalElevation = 3.dp
                        ) {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(16.dp),
                                verticalArrangement = Arrangement.spacedBy(12.dp)
                            ) {
                                // Total amount
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(
                                        text = "Total Amount",
                                        style = MaterialTheme.typography.titleLarge
                                    )
                                    Text(
                                        text = "$${cart.total.formatCurrency()}",
                                        style = MaterialTheme.typography.headlineMedium,
                                        color = MaterialTheme.colorScheme.primary
                                    )
                                }

                                // Complete order button
                                Button(
                                    onClick = {
                                        isProcessing = true
                                        // TODO: Process order
                                        // orderViewModel.createOrder(...)
                                        // onOrderComplete()
                                    },
                                    modifier = Modifier.fillMaxWidth(),
                                    enabled = !isProcessing && cart.items.isNotEmpty()
                                ) {
                                    if (isProcessing) {
                                        CircularProgressIndicator(
                                            modifier = Modifier.size(20.dp),
                                            color = MaterialTheme.colorScheme.onPrimary
                                        )
                                    } else {
                                        Icon(Icons.Default.Check, "Complete")
                                        Spacer(modifier = Modifier.width(8.dp))
                                        Text("Complete Order")
                                    }
                                }
                            }
                        }
                    }
                }
            }

            else -> {
                // Loading or error state
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(paddingValues),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator()
                }
            }
        }
    }
}

@Composable
private fun PaymentMethodSelector(
    selectedMethod: String,
    onMethodSelected: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    val paymentMethods = listOf(
        "cash" to "Cash",
        "card" to "Credit/Debit Card",
        "mobile" to "Mobile Payment",
        "other" to "Other"
    )

    Column(
        modifier = modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        paymentMethods.forEach { (id, name) ->
            OutlinedCard(
                modifier = Modifier.fillMaxWidth(),
                onClick = { onMethodSelected(id) },
                border = if (selectedMethod == id) {
                    CardDefaults.outlinedCardBorder().copy(
                        width = 2.dp,
                        brush = androidx.compose.ui.graphics.SolidColor(
                            MaterialTheme.colorScheme.primary
                        )
                    )
                } else {
                    CardDefaults.outlinedCardBorder()
                }
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = name,
                        style = MaterialTheme.typography.bodyLarge
                    )
                    RadioButton(
                        selected = selectedMethod == id,
                        onClick = { onMethodSelected(id) }
                    )
                }
            }
        }
    }
}

@Composable
private fun OrderSummaryCard(
    cart: CartUiState,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant
        )
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Text(
                text = "Order Summary",
                style = MaterialTheme.typography.titleMedium,
                color = MaterialTheme.colorScheme.primary
            )

            Divider()

            SummaryRow("Items", "${cart.itemCount}")
            SummaryRow("Subtotal", "$${cart.subtotal.formatCurrency()}")
            SummaryRow("Tax", "$${cart.tax.formatCurrency()}")

            if (cart.discount > 0) {
                SummaryRow(
                    label = "Discount",
                    value = "-$${cart.discount.formatCurrency()}",
                    valueColor = MaterialTheme.colorScheme.secondary
                )
            }

            Divider()

            SummaryRow(
                label = "Total",
                value = "$${cart.total.formatCurrency()}",
                labelStyle = MaterialTheme.typography.titleLarge,
                valueStyle = MaterialTheme.typography.titleLarge,
                valueColor = MaterialTheme.colorScheme.primary
            )
        }
    }
}

@Composable
private fun SummaryRow(
    label: String,
    value: String,
    modifier: Modifier = Modifier,
    labelStyle: androidx.compose.ui.text.TextStyle = MaterialTheme.typography.bodyLarge,
    valueStyle: androidx.compose.ui.text.TextStyle = MaterialTheme.typography.bodyLarge,
    valueColor: androidx.compose.ui.graphics.Color = MaterialTheme.colorScheme.onSurface
) {
    Row(
        modifier = modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(text = label, style = labelStyle)
        Text(text = value, style = valueStyle, color = valueColor)
    }
}
