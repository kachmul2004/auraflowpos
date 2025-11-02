package com.theauraflow.pos.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material.icons.filled.Tag
import androidx.compose.material.icons.filled.Archive
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.DeleteForever
import androidx.compose.material.icons.filled.MonetizationOn
import androidx.compose.material.icons.filled.AccountBalance
import androidx.compose.material3.*
import androidx.compose.material3.AlertDialog
import androidx.compose.ui.graphics.Color
import androidx.compose.foundation.BorderStroke
import androidx.compose.material.icons.automirrored.filled.Note
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material.icons.filled.TableRestaurant
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.layout.onSizeChanged
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.theauraflow.pos.domain.model.CartItem
import com.theauraflow.pos.core.util.formatCurrency
import com.theauraflow.pos.ui.dialog.EditCartItemDialog
import com.theauraflow.pos.ui.dialog.PaymentDialog
import com.theauraflow.pos.ui.dialog.CustomerSelectionDialog
import com.theauraflow.pos.ui.dialog.OrderNotesDialog
import com.theauraflow.pos.domain.model.Customer
import com.theauraflow.pos.domain.model.Table

/**
 * Shopping cart sidebar component matching the web design.
 *
 * Design: TypeScript/React components in docs/Web Version/src/components/ShoppingCart.tsx
 *
 * Features:
 * - Customer selection button with badge
 * - Order notes button
 * - Scrollable cart items with gradient backgrounds
 * - Click cart item to open EditCartItemDialog
 * - Inline modifiers display
 * - Discount section with dialog
 * - Totals (Subtotal, Discount, Tax, Total)
 * - Action buttons (Delete, Park Sale, Charge)
 */
@Composable
fun ShoppingCart(
    items: List<CartItem>,
    subtotal: Double,
    tax: Double,
    discount: Double = 0.0,
    total: Double,
    isCartEmpty: Boolean = items.isEmpty(),
    onUpdateItem: (CartItem, Int, Double?, Double?) -> Unit = { _, _, _, _ -> },
    onVoidItem: (CartItem) -> Unit = {},
    onClearCart: () -> Unit,
    onCheckout: (paymentMethod: String, amountReceived: Double) -> Unit,
    onRemoveItem: (CartItem) -> Unit = {},
    modifier: Modifier = Modifier,
    customers: List<Customer> = emptyList(),
    selectedCustomer: Customer? = null,
    onSelectCustomer: (Customer?) -> Unit = {},
    tableId: String? = null,
    tables: List<Table> = emptyList(),
    onChangeTable: () -> Unit = {},
    orderNotes: String = "",
    onSaveNotes: (String) -> Unit = {},
    customerName: String? = null,
    onAddCustomer: () -> Unit = {},
    onAddNotes: () -> Unit = {},
    onApplyDiscount: (Double, Boolean) -> Unit = { _, _ -> },
    onParkSale: () -> Unit = {} // Opens ParkedSalesDialog
) {
    val colors = MaterialTheme.colorScheme
    var showDiscountDialog by remember { mutableStateOf(false) }
    var discountType by remember { mutableStateOf(true) } // true = percentage, false = fixed
    var discountValue by remember { mutableStateOf("") }

    // State for EditCartItemDialog
    var selectedItem by remember { mutableStateOf<CartItem?>(null) }
    var showEditDialog by remember { mutableStateOf(false) }

    // State for PaymentDialog
    var showPaymentDialog by remember { mutableStateOf(false) }

    // State for CustomerSelectionDialog
    var showCustomerDialog by remember { mutableStateOf(false) }

    // State for OrderNotesDialog
    var showNotesDialog by remember { mutableStateOf(false) }

    val borderColor = colors.outline

    Surface(
        modifier = modifier
            .drawBehind {
                val strokeWidthPx = 1.dp.toPx()
                // Left
                drawLine(
                    color = borderColor,
                    start = Offset(0f, 0f),
                    end = Offset(0f, size.height),
                    strokeWidth = strokeWidthPx
                )
                // Right
                drawLine(
                    color = borderColor,
                    start = Offset(size.width, 0f),
                    end = Offset(size.width, size.height),
                    strokeWidth = strokeWidthPx
                )
                // Bottom
                drawLine(
                    color = borderColor,
                    start = Offset(0f, size.height),
                    end = Offset(size.width, size.height),
                    strokeWidth = strokeWidthPx
                )
            },
        color = colors.surface,
        tonalElevation = 0.dp
    ) {
        Column(
            modifier = Modifier.fillMaxSize()
        ) {
            // Customer & Notes Section
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .drawBehind {
                        val strokeWidthPx = 1.dp.toPx()
                        // Bottom border only
                        drawLine(
                            color = borderColor,
                            start = Offset(0f, size.height),
                            end = Offset(size.width, size.height),
                            strokeWidth = strokeWidthPx
                        )
                    },
                color = colors.surface,
                tonalElevation = 0.dp
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(6.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    // Order Type Selector with inline label (like phone country code)
                    var expanded by remember { mutableStateOf(false) }
                    var selectedOrderType by remember { mutableStateOf("Pickup") } // Changed default to Pickup
                    var dropdownWidth by remember { mutableStateOf(0) }

                    Box(modifier = Modifier.fillMaxWidth()) {
                        OutlinedButton(
                            onClick = { expanded = true },
                            modifier = Modifier.fillMaxWidth().height(32.dp),
                            shape = RoundedCornerShape(6.dp),
                            colors = ButtonDefaults.outlinedButtonColors(
                                containerColor = colors.surface,
                                contentColor = colors.onSurface
                            ),
                            border = BorderStroke(1.dp, colors.outline),
                            contentPadding = PaddingValues(horizontal = 0.dp)
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                // Left side: "Order Type:" label (non-clickable appearance)
                                Surface(
                                    modifier = Modifier.padding(0.dp),
                                    color = colors.surfaceVariant.copy(alpha = 0.3f),
                                    shape = RoundedCornerShape(topStart = 6.dp, bottomStart = 6.dp)
                                ) {
                                    Row(
                                        modifier = Modifier.padding(
                                            horizontal = 10.dp,
                                            vertical = 6.dp
                                        ),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Text(
                                            text = "Order Type:",
                                            fontSize = 12.sp,
                                            fontWeight = FontWeight.Medium,
                                            color = colors.onSurfaceVariant
                                        )
                                    }
                                }

                                // Vertical divider
                                VerticalDivider(
                                    modifier = Modifier
                                        .height(24.dp)
                                        .width(1.dp),
                                    color = colors.outline
                                )

                                // Right side: Selected value + dropdown arrow (track its width)
                                Row(
                                    modifier = Modifier
                                        .weight(1f)
                                        .padding(horizontal = 10.dp)
                                        .onSizeChanged { size ->
                                            dropdownWidth = size.width
                                        },
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(
                                        text = selectedOrderType,
                                        fontSize = 12.sp,
                                        color = colors.onSurface
                                    )
                                    Icon(
                                        Icons.Default.ArrowDropDown,
                                        contentDescription = null,
                                        modifier = Modifier.size(18.dp),
                                        tint = colors.onSurface
                                    )
                                }
                            }
                        }

                        // Dropdown menu aligned to right side only
                        Box(
                            modifier = Modifier.align(Alignment.CenterEnd)
                        ) {
                            DropdownMenu(
                                expanded = expanded,
                                onDismissRequest = { expanded = false },
                                modifier = Modifier.width(with(androidx.compose.ui.platform.LocalDensity.current) {
                                    dropdownWidth.toDp()
                                })
                            ) {
                                listOf("Delivery", "Dine In", "Takeout", "Pickup").forEach { type ->
                                    DropdownMenuItem(
                                        text = { Text(type, fontSize = 12.sp) },
                                        onClick = {
                                            selectedOrderType = type
                                            expanded = false
                                        }
                                    )
                                }
                            }
                        }
                    }

                    // Customer Button
                    OutlinedButton(
                        onClick = { showCustomerDialog = true },
                        modifier = Modifier.fillMaxWidth().height(32.dp),
                        shape = RoundedCornerShape(6.dp),
                        colors = ButtonDefaults.outlinedButtonColors(
                            containerColor = colors.surface,
                            contentColor = colors.onSurface
                        ),
                        border = BorderStroke(1.dp, colors.outline),
                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                    ) {
                        Icon(
                            Icons.Default.Person,
                            contentDescription = null,
                            modifier = Modifier.size(14.dp),
                            tint = colors.onSurface
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = customerName ?: "Add Customer",
                            fontSize = 12.sp,
                            modifier = Modifier
                                .weight(1f)
                                .wrapContentWidth(Alignment.Start),
                            overflow = TextOverflow.Ellipsis,
                            maxLines = 1
                        )
                        if (customerName != null) {
                            Surface(
                                modifier = Modifier
                                    .padding(start = 6.dp)
                                    .clip(RoundedCornerShape(3.dp)),
                                color = colors.secondary,
                                shape = RoundedCornerShape(3.dp)
                            ) {
                                Text(
                                    text = "✓",
                                    fontSize = 9.sp,
                                    color = colors.onSecondary,
                                    modifier = Modifier.padding(horizontal = 4.dp, vertical = 1.dp)
                                )
                            }
                        }
                    }

                    tableId?.let { id ->
                        val table = tables.find { it.id == id }
                        if (table != null) {
                            Surface(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 2.dp),
                                shape = RoundedCornerShape(6.dp),
                                color = colors.primaryContainer.copy(alpha = 0.3f),
                                border = BorderStroke(1.dp, colors.primary.copy(alpha = 0.3f))
                            ) {
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(horizontal = 10.dp, vertical = 6.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Row(
                                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Icon(
                                            Icons.Default.TableRestaurant,
                                            contentDescription = null,
                                            modifier = Modifier.size(14.dp),
                                            tint = colors.primary
                                        )
                                        Text(
                                            text = "Table ${table.number}",
                                            fontSize = 12.sp,
                                            fontWeight = FontWeight.Medium,
                                            color = colors.primary
                                        )
                                        table.section?.let { section ->
                                            Text(
                                                text = "• $section",
                                                fontSize = 10.sp,
                                                color = colors.onSurfaceVariant
                                            )
                                        }
                                    }
                                    TextButton(
                                        onClick = onChangeTable,
                                        contentPadding = PaddingValues(
                                            horizontal = 8.dp,
                                            vertical = 2.dp
                                        ),
                                        modifier = Modifier.height(24.dp)
                                    ) {
                                        Text(
                                            text = "Change",
                                            fontSize = 10.sp,
                                            color = colors.primary
                                        )
                                    }
                                }
                            }
                        }
                    }

                    // Notes Button
                    OutlinedButton(
                        onClick = { showNotesDialog = true },
                        modifier = Modifier.fillMaxWidth().height(32.dp),
                        shape = RoundedCornerShape(6.dp),
                        colors = ButtonDefaults.outlinedButtonColors(
                            containerColor = colors.surface,
                            contentColor = colors.onSurface
                        ),
                        border = BorderStroke(1.dp, colors.outline),
                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                    ) {
                        Icon(
                            Icons.AutoMirrored.Filled.Note,
                            contentDescription = null,
                            modifier = Modifier.size(14.dp),
                            tint = colors.onSurface
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "Order Notes",
                            fontSize = 12.sp,
                            modifier = Modifier.weight(1f),
                            textAlign = TextAlign.Start
                        )
                    }
                }
            }

            // Cart Items (Scrollable)
            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
            ) {
                if (isCartEmpty) {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Surface(
                            modifier = Modifier
                                .size(48.dp)
                                .clip(RoundedCornerShape(50)),
                            color = colors.surfaceVariant,
                            shape = RoundedCornerShape(50)
                        ) {
                            Icon(
                                Icons.Default.MonetizationOn,
                                contentDescription = null,
                                modifier = Modifier
                                    .fillMaxSize()
                                    .padding(12.dp),
                                tint = colors.onSurfaceVariant
                            )
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        Text(
                            text = "Cart is empty",
                            fontSize = 13.sp,
                            color = colors.onSurfaceVariant,
                            style = MaterialTheme.typography.titleMedium
                        )

                        Text(
                            text = "Add items to start an order",
                            fontSize = 11.sp,
                            color = colors.onSurfaceVariant.copy(alpha = 0.7f)
                        )
                    }
                } else {
                    LazyColumn(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(6.dp),
                        verticalArrangement = Arrangement.spacedBy(1.dp)
                    ) {
                        items(
                            items = items,
                            key = { it.id }
                        ) { item ->
                            CartItemButton(
                                cartItem = item,
                                onClick = {
                                    selectedItem = item
                                    showEditDialog = true
                                },
                                colors = colors
                            )
                        }
                    }
                }
            }

            // Totals & Actions Section
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .drawBehind {
                        val strokeWidthPx = 1.dp.toPx()
                        // Top border only
                        drawLine(
                            color = borderColor,
                            start = Offset(0f, 0f),
                            end = Offset(size.width, 0f),
                            strokeWidth = strokeWidthPx
                        )
                    },
                color = colors.surface,
                tonalElevation = 0.dp
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 8.dp, vertical = 12.dp),
                    verticalArrangement = Arrangement.spacedBy(3.dp)
                ) {
                    // Subtotal Row
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            "Subtotal",
                            fontSize = 12.sp,
                            color = colors.onSurface.copy(alpha = 0.8f)
                        )
                        Text(
                            "$${subtotal.formatCurrency()}",
                            fontSize = 12.sp,
                            color = colors.onSurface.copy(alpha = 0.8f)
                        )
                    }

                    // Discount Row (Clickable to open dialog)
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { showDiscountDialog = true }
                            .padding(vertical = 4.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Icon(
                                Icons.Default.Tag,
                                contentDescription = null,
                                modifier = Modifier.size(14.sp.value.dp),
                                tint = colors.onSurface
                            )
                            Text(
                                "Discount",
                                fontSize = 12.sp,
                                color = colors.onSurface
                            )
                        }

                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            if (discount > 0) {
                                Surface(
                                    modifier = Modifier.clip(RoundedCornerShape(4.dp)),
                                    color = colors.secondary,
                                    shape = RoundedCornerShape(4.dp)
                                ) {
                                    Text(
                                        "-$${discount.formatCurrency()}",
                                        fontSize = 10.sp,
                                        color = colors.onSecondary,
                                        modifier = Modifier.padding(
                                            horizontal = 6.dp,
                                            vertical = 2.dp
                                        )
                                    )
                                }
                            }
                            Text(
                                "-$${discount.formatCurrency()}",
                                fontSize = 12.sp,
                                color = if (discount > 0) colors.error else colors.onSurface.copy(
                                    alpha = 0.8f
                                ),
                                textAlign = TextAlign.End
                            )
                        }
                    }

                    // Tax Row
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            "Tax (8%)",
                            fontSize = 12.sp,
                            color = colors.onSurface.copy(alpha = 0.8f)
                        )
                        Text(
                            "$${tax.formatCurrency()}",
                            fontSize = 12.sp,
                            color = colors.onSurface.copy(alpha = 0.8f)
                        )
                    }

                    HorizontalDivider(
                        modifier = Modifier.fillMaxWidth(),
                        color = colors.outlineVariant
                    )

                    // Total Row (Bold and colored)
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            "Total",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = colors.onSurface
                        )
                        Text(
                            "$${total.formatCurrency()}",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = colors.primary
                        )
                    }

                    // Action Buttons Row
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        // Delete Button (Icon only)
                        OutlinedButton(
                            onClick = onClearCart,
                            modifier = Modifier.size(32.dp),
                            shape = RoundedCornerShape(6.dp),
                            contentPadding = PaddingValues(0.dp),
                            enabled = !isCartEmpty,
                            colors = ButtonDefaults.outlinedButtonColors(
                                contentColor = colors.error,
                                disabledContentColor = colors.error.copy(alpha = 0.5f)
                            ),
                            border = BorderStroke(
                                1.dp,
                                if (isCartEmpty) colors.outlineVariant else colors.error
                            )
                        ) {
                            Icon(Icons.Default.DeleteForever, null, modifier = Modifier.size(16.dp))
                        }

                        // Park Sale Button
                        OutlinedButton(
                            onClick = onParkSale,
                            modifier = Modifier
                                .weight(1f)
                                .height(32.dp),
                            shape = RoundedCornerShape(6.dp),
                            colors = ButtonDefaults.outlinedButtonColors(
                                containerColor = colors.surface,
                                contentColor = colors.onSurface
                            ),
                            border = BorderStroke(1.dp, colors.outline)
                        ) {
                            Icon(Icons.Default.Archive, null, modifier = Modifier.size(14.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Park Sale", fontSize = 12.sp)
                        }

                        // Charge Button (Primary, green)
                        Button(
                            onClick = { showPaymentDialog = true },
                            modifier = Modifier
                                .weight(1f)
                                .height(32.dp),
                            shape = RoundedCornerShape(6.dp),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = Color(0xFF22C55E),
                                contentColor = Color.White,
                                disabledContainerColor = Color(0xFF22C55E).copy(alpha = 0.5f),
                                disabledContentColor = Color.White.copy(alpha = 0.5f)
                            ),
                            enabled = !isCartEmpty
                        ) {
                            Icon(
                                Icons.Default.MonetizationOn,
                                contentDescription = null,
                                modifier = Modifier.size(18.dp),
                                tint = Color.White
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Charge", fontSize = 12.sp, fontWeight = FontWeight.Medium)
                        }
                    }
                }
            }

            // Discount Dialog
            if (showDiscountDialog) {
                AlertDialog(
                    onDismissRequest = { showDiscountDialog = false },
                    properties = androidx.compose.ui.window.DialogProperties(
                        dismissOnBackPress = true,
                        dismissOnClickOutside = false
                    ),
                    title = { Text("Apply Discount") },
                    text = {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .verticalScroll(rememberScrollState()),
                            verticalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            // Discount Type Buttons
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Button(
                                    onClick = { discountType = true },
                                    modifier = Modifier
                                        .weight(1f)
                                        .height(40.dp),
                                    colors = ButtonDefaults.buttonColors(
                                        containerColor = if (discountType) colors.primary else colors.surface,
                                        contentColor = if (discountType) colors.onPrimary else colors.onSurface
                                    ),
                                    shape = RoundedCornerShape(6.dp),
                                    border = if (!discountType) BorderStroke(
                                        1.dp,
                                        colors.outline
                                    ) else null
                                ) {
                                    Text("Percentage (%)", fontSize = 11.sp)
                                }
                                Button(
                                    onClick = { discountType = false },
                                    modifier = Modifier
                                        .weight(1f)
                                        .height(40.dp),
                                    colors = ButtonDefaults.buttonColors(
                                        containerColor = if (!discountType) colors.primary else colors.surface,
                                        contentColor = if (!discountType) colors.onPrimary else colors.onSurface
                                    ),
                                    shape = RoundedCornerShape(6.dp),
                                    border = if (discountType) BorderStroke(
                                        1.dp,
                                        colors.outline
                                    ) else null
                                ) {
                                    Text("Fixed ($)", fontSize = 11.sp)
                                }
                            }

                            // Input Field
                            OutlinedTextField(
                                value = discountValue,
                                onValueChange = { discountValue = it },
                                label = { Text("Amount") },
                                placeholder = { Text("0.00") },
                                modifier = Modifier.fillMaxWidth(),
                                singleLine = true,
                                shape = RoundedCornerShape(6.dp)
                            )
                        }
                    },
                    confirmButton = {
                        Button(
                            onClick = {
                                val value = discountValue.toDoubleOrNull()
                                if (value != null && value > 0) {
                                    onApplyDiscount(value, discountType)
                                    showDiscountDialog = false
                                    discountValue = ""
                                }
                            }
                        ) {
                            Text("Apply")
                        }
                    },
                    dismissButton = {
                        TextButton(
                            onClick = {
                                showDiscountDialog = false
                                discountValue = ""
                            }
                        ) {
                            Text("Cancel")
                        }
                    }
                )
            }

            // Edit Cart Item Dialog
            if (showEditDialog && selectedItem != null) {
                EditCartItemDialog(
                    cartItem = selectedItem!!,
                    onDismiss = {
                        showEditDialog = false
                        selectedItem = null
                    },
                    onSave = { quantity, discount, priceOverride ->
                        onUpdateItem(selectedItem!!, quantity, discount, priceOverride)
                        showEditDialog = false
                        selectedItem = null
                    },
                    onVoid = {
                        onVoidItem(selectedItem!!)
                        showEditDialog = false
                        selectedItem = null
                    }
                )
            }

            // Payment Dialog
            PaymentDialog(
                open = showPaymentDialog,
                subtotal = subtotal,
                discount = discount,
                tax = tax,
                total = total,
                onDismiss = { showPaymentDialog = false },
                onCompletePayment = { paymentMethod, amountReceived ->
                    onCheckout(paymentMethod, amountReceived)
                    showPaymentDialog = false
                }
            )

            // Customer Selection Dialog
            CustomerSelectionDialog(
                show = showCustomerDialog,
                customers = customers,
                currentCustomer = selectedCustomer,
                onDismiss = { showCustomerDialog = false },
                onSelectCustomer = { customer ->
                    onSelectCustomer(customer)
                    showCustomerDialog = false
                }
            )

            // Order Notes Dialog
            OrderNotesDialog(
                show = showNotesDialog,
                currentNotes = orderNotes,
                onDismiss = { showNotesDialog = false },
                onSaveNotes = { notes ->
                    onSaveNotes(notes)
                }
            )
        }
    }
}

/**
 * Individual cart item button with gradient background and modifiers.
 * Matches web design with inline modifiers display.
 */
@Composable
private fun CartItemButton(
    modifier: Modifier = Modifier,
    cartItem: CartItem,
    onClick: () -> Unit,
    colors: ColorScheme
) {
    Button(
        onClick = onClick,
        modifier = modifier
            .fillMaxWidth()
            .heightIn(min = 30.dp)
            .clip(RoundedCornerShape(6.dp)),
        shape = RoundedCornerShape(6.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = colors.surface,
            contentColor = colors.onSurface
        ),
//        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp),
        elevation = ButtonDefaults.buttonElevation(
            defaultElevation = 0.dp,
            pressedElevation = 1.dp
        ),
        border = BorderStroke(1.dp, colors.outline)
    ) {
        Column(
            modifier = Modifier.fillMaxWidth(),
            horizontalAlignment = Alignment.Start,
            verticalArrangement = Arrangement.spacedBy(1.dp)
        ) {
            // Top row: quantity × name ........... price
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    modifier = Modifier.weight(1f),
                    horizontalArrangement = Arrangement.spacedBy(3.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "${cartItem.quantity}×",
                        fontSize = 11.sp,
                        color = colors.onSurfaceVariant
                    )
                    val variation = cartItem.variation
                    Text(
                        text = buildString {
                            append(cartItem.product.name)
                            if (variation != null) {
                                append(" - ")
                                append(variation.name)
                            }
                        },
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Medium,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
                Text(
                    text = "$${cartItem.total.formatCurrency()}",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.SemiBold
                )
            }

            // Modifiers (if any)
            if (cartItem.modifiers.isNotEmpty()) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(start = 12.dp, top = 1.dp),
                    verticalArrangement = Arrangement.spacedBy(0.5.dp)
                ) {
                    cartItem.modifiers.forEach { modifier ->
                        Text(
                            text = buildString {
                                append("+ ")
                                append(modifier.name)
                                if (modifier.quantity > 1) {
                                    append(" x${modifier.quantity}")
                                }
                                if (modifier.price > 0) {
                                    append(" (+$${(modifier.price * modifier.quantity).formatCurrency()})")
                                }
                            },
                            fontSize = 9.sp,
                            color = colors.onSurfaceVariant
                        )
                    }
                }
            }
        }
    }
}
