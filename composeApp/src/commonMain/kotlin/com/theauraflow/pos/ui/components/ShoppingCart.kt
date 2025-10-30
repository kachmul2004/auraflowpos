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
import androidx.compose.material.icons.filled.Note
import androidx.compose.material.icons.filled.DeleteForever
import androidx.compose.material.icons.filled.MonetizationOn
import androidx.compose.material.icons.filled.AccountBalance
import androidx.compose.material3.*
import androidx.compose.material3.AlertDialog
import androidx.compose.ui.graphics.Color
import androidx.compose.foundation.BorderStroke
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
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
import com.theauraflow.pos.domain.model.Customer

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
    customerName: String? = null,
    onAddCustomer: () -> Unit = {},
    onAddNotes: () -> Unit = {},
    onApplyDiscount: (Double, Boolean) -> Unit = { _, _ -> }
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

    Surface(
        modifier = modifier,
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
                    .border(1.dp, colors.outline),
                color = colors.surfaceVariant.copy(alpha = 0.3f),
                tonalElevation = 0.dp
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(12.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    // Customer Button
                    OutlinedButton(
                        onClick = { showCustomerDialog = true },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(8.dp),
                        colors = ButtonDefaults.outlinedButtonColors(
                            containerColor = colors.surface,
                            contentColor = colors.onSurface
                        ),
                        border = BorderStroke(1.dp, colors.outline)
                    ) {
                        Icon(
                            Icons.Default.Person,
                            contentDescription = null,
                            modifier = Modifier.size(16.dp),
                            tint = colors.onSurface
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = customerName ?: "Add Customer",
                            fontSize = 13.sp,
                            modifier = Modifier
                                .weight(1f)
                                .wrapContentWidth(Alignment.Start),
                            overflow = TextOverflow.Ellipsis,
                            maxLines = 1
                        )
                        if (customerName != null) {
                            Surface(
                                modifier = Modifier
                                    .padding(start = 8.dp)
                                    .clip(RoundedCornerShape(4.dp)),
                                color = colors.secondary,
                                shape = RoundedCornerShape(4.dp)
                            ) {
                                Text(
                                    text = "✓",
                                    fontSize = 10.sp,
                                    color = colors.onSecondary,
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                )
                            }
                        }
                    }

                    // Notes Button
                    OutlinedButton(
                        onClick = onAddNotes,
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(8.dp),
                        colors = ButtonDefaults.outlinedButtonColors(
                            containerColor = colors.surface,
                            contentColor = colors.onSurface
                        ),
                        border = BorderStroke(1.dp, colors.outline)
                    ) {
                        Icon(
                            Icons.Default.Note,
                            contentDescription = null,
                            modifier = Modifier.size(16.dp),
                            tint = colors.onSurface
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Order Notes",
                            fontSize = 13.sp,
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
                    .border(1.dp, colors.outline)
            ) {
                if (isCartEmpty) {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Surface(
                            modifier = Modifier
                                .size(60.dp)
                                .clip(RoundedCornerShape(50)),
                            color = colors.surfaceVariant,
                            shape = RoundedCornerShape(50)
                        ) {
                            Icon(
                                Icons.Default.MonetizationOn,
                                contentDescription = null,
                                modifier = Modifier
                                    .fillMaxSize()
                                    .padding(14.dp),
                                tint = colors.onSurfaceVariant
                            )
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        Text(
                            text = "Cart is empty",
                            fontSize = 14.sp,
                            color = colors.onSurfaceVariant,
                            style = MaterialTheme.typography.titleMedium
                        )

                        Text(
                            text = "Add items to start an order",
                            fontSize = 12.sp,
                            color = colors.onSurfaceVariant.copy(alpha = 0.7f)
                        )
                    }
                } else {
                    LazyColumn(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(8.dp),
                        verticalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        items(items) { item ->
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
                    .border(1.dp, colors.outline),
                color = colors.surfaceVariant.copy(alpha = 0.3f),
                tonalElevation = 0.dp
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(12.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    // Subtotal Row
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            "Subtotal",
                            fontSize = 12.sp,
                            color = colors.onSurfaceVariant.copy(alpha = 0.8f)
                        )
                        Text(
                            "$${subtotal.formatCurrency()}",
                            fontSize = 12.sp,
                            color = colors.onSurfaceVariant.copy(alpha = 0.8f)
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
                                color = if (discount > 0) colors.error else colors.onSurfaceVariant,
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
                            color = colors.onSurfaceVariant.copy(alpha = 0.8f)
                        )
                        Text(
                            "$${tax.formatCurrency()}",
                            fontSize = 12.sp,
                            color = colors.onSurfaceVariant.copy(alpha = 0.8f)
                        )
                    }

                    HorizontalDivider(
                        modifier = Modifier.fillMaxWidth(),
                        color = colors.outline.copy(alpha = 0.3f)
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
                            modifier = Modifier.size(40.dp),
                            shape = RoundedCornerShape(8.dp),
                            contentPadding = PaddingValues(0.dp),
                            enabled = !isCartEmpty,
                            colors = ButtonDefaults.outlinedButtonColors(
                                contentColor = colors.error,
                                disabledContentColor = colors.error.copy(alpha = 0.5f)
                            ),
                            border = BorderStroke(
                                1.dp,
                                if (isCartEmpty) colors.error.copy(alpha = 0.3f) else colors.error.copy(
                                    alpha = 0.5f
                                )
                            )
                        ) {
                            Icon(Icons.Default.DeleteForever, null, modifier = Modifier.size(18.dp))
                        }

                        // Park Sale Button
                        OutlinedButton(
                            onClick = { },
                            modifier = Modifier
                                .weight(1f)
                                .height(40.dp),
                            shape = RoundedCornerShape(8.dp),
                            colors = ButtonDefaults.outlinedButtonColors(
                                containerColor = colors.surface,
                                contentColor = colors.onSurface
                            ),
                            border = BorderStroke(1.dp, colors.outline)
                        ) {
                            Icon(Icons.Default.Archive, null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Park Sale", fontSize = 12.sp)
                        }

                        // Charge Button (Primary, green)
                        Button(
                            onClick = { showPaymentDialog = true },
                            modifier = Modifier
                                .weight(1f)
                                .height(40.dp),
                            shape = RoundedCornerShape(8.dp),
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
        }
    }
}

/**
 * Individual cart item button with gradient background and modifiers.
 * Matches web design with inline modifiers display.
 */
@Composable
private fun CartItemButton(
    cartItem: CartItem,
    onClick: () -> Unit,
    colors: ColorScheme
) {
    Button(
        onClick = onClick,
        modifier = Modifier
            .fillMaxWidth()
            .wrapContentHeight()
            .clip(RoundedCornerShape(8.dp))
            .border(1.dp, colors.outline, RoundedCornerShape(8.dp)),
        shape = RoundedCornerShape(8.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = colors.surface,
            contentColor = colors.onSurface
        ),
        contentPadding = PaddingValues(10.dp),
        elevation = ButtonDefaults.buttonElevation(
            defaultElevation = 0.dp,
            pressedElevation = 2.dp
        )
    ) {
        Column(
            modifier = Modifier.fillMaxWidth(),
            horizontalAlignment = Alignment.Start,
            verticalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            // Top row: quantity × name ........... price
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    modifier = Modifier.weight(1f),
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "${cartItem.quantity}×",
                        fontSize = 12.sp,
                        color = colors.onSurfaceVariant
                    )
                    Text(
                        text = cartItem.product.name,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Medium,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
                Text(
                    text = "$${
                        cartItem.modifiers.fold(cartItem.product.price * cartItem.quantity) { sum, mod -> sum + (mod.price ?: 0.0) }
                            .formatCurrency()
                    }",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold
                )
            }

            // Modifiers (if any)
            if (cartItem.modifiers.isNotEmpty()) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .paddingFromBaseline(top = 2.dp)
                        .padding(start = 20.dp),
                    verticalArrangement = Arrangement.spacedBy(1.dp)
                ) {
                    cartItem.modifiers.forEach { modifier ->
                        Text(
                            text = "+ ${modifier.name}${if ((modifier.price ?: 0.0) > 0) " (+$${modifier.price.formatCurrency()})" else ""}",
                            fontSize = 10.sp,
                            color = colors.onSurfaceVariant
                        )
                    }
                }
            }
        }
    }
}
