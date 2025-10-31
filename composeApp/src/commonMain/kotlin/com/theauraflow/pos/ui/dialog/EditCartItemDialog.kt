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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.theauraflow.pos.domain.model.CartItem

/**
 * Format double to 2 decimal places.
 */
private fun Double.formatPrice(): String {
    val str = this.toString()
    return if (str.contains('.')) {
        val parts = str.split('.')
        "${parts[0]}.${parts[1].padEnd(2, '0').take(2)}"
    } else {
        "$str.00"
    }
}

/**
 * Dialog for editing cart items with tabs for Quantity, Variations, Modifiers, and Pricing.
 * Matches web version: docs/Web Version/src/components/EditCartItemDialog.tsx
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EditCartItemDialog(
    cartItem: CartItem,
    onDismiss: () -> Unit,
    onSave: (quantity: Int, discount: Double?, priceOverride: Double?) -> Unit,
    onVoid: () -> Unit,
    modifier: Modifier = Modifier
) {
    var selectedTab by remember { mutableStateOf(0) }
    var quantity by remember { mutableStateOf(cartItem.quantity) }
    var discountType by remember { mutableStateOf("percentage") }
    var discountValue by remember { mutableStateOf("") }
    var priceOverride by remember { mutableStateOf("") }

    val tabs = listOf("Quantity", "Variations", "Modifiers", "Pricing")
    val maxQuantity = cartItem.product.stockQuantity

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(
            dismissOnBackPress = true,
            dismissOnClickOutside = false,
            usePlatformDefaultWidth = false
        )
    ) {
        Surface(
            modifier = modifier
                .width(900.dp)
                .heightIn(max = 650.dp),
            shape = MaterialTheme.shapes.large,
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
                        Text(
                            text = "Edit Item",
                            style = MaterialTheme.typography.headlineSmall
                        )
                        Text(
                            text = cartItem.product.name,
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Default.Close, "Close")
                    }
                }

                Divider()

                // Main Content: Tabs + Content
                Row(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxWidth()
                ) {
                    // Left: Tab Navigation
                    Column(
                        modifier = Modifier
                            .width(150.dp)
                            .fillMaxHeight()
                            .padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        tabs.forEachIndexed { index, tab ->
                            NavigationDrawerItem(
                                label = { Text(tab) },
                                selected = selectedTab == index,
                                onClick = { selectedTab = index },
                                icon = {
                                    Icon(
                                        when (index) {
                                            0 -> Icons.Default.Add
                                            1 -> Icons.Default.Settings
                                            2 -> Icons.Default.AddCircle
                                            else -> Icons.Default.AttachMoney
                                        },
                                        contentDescription = tab
                                    )
                                }
                            )
                        }
                    }

                    VerticalDivider()

                    // Right: Tab Content
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .fillMaxHeight()
                            .padding(24.dp)
                            .verticalScroll(rememberScrollState())
                    ) {
                        when (selectedTab) {
                            0 -> QuantityTab(
                                quantity = quantity,
                                maxQuantity = maxQuantity,
                                onQuantityChange = { quantity = it }
                            )

                            1 -> VariationsTab()
                            2 -> ModifiersTab()
                            3 -> PricingTab(
                                originalPrice = cartItem.product.price,
                                quantity = quantity,
                                discountType = discountType,
                                discountValue = discountValue,
                                priceOverride = priceOverride,
                                onDiscountTypeChange = { discountType = it },
                                onDiscountValueChange = { discountValue = it },
                                onPriceOverrideChange = { priceOverride = it }
                            )
                        }
                    }
                }

                Divider()

                // Footer: Action Buttons
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(24.dp),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Button(
                        onClick = {
                            onVoid()
                            onDismiss()
                        },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = MaterialTheme.colorScheme.error
                        )
                    ) {
                        Icon(Icons.Default.Delete, "Void", modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Void Item")
                    }

                    Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                        OutlinedButton(onClick = onDismiss) {
                            Text("Cancel")
                        }
                        Button(
                            onClick = {
                                val discount = discountValue.toDoubleOrNull()
                                val override = priceOverride.toDoubleOrNull()
                                onSave(quantity, discount, override)
                                onDismiss()
                            }
                        ) {
                            Text("Save Changes")
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun QuantityTab(
    quantity: Int,
    maxQuantity: Int,
    onQuantityChange: (Int) -> Unit
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(24.dp)
    ) {
        Text(
            text = "Quantity",
            style = MaterialTheme.typography.headlineMedium
        )
        Text(
            text = "Adjust the item quantity",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Quantity Controls
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            OutlinedButton(
                onClick = { if (quantity > 1) onQuantityChange(quantity - 1) },
                enabled = quantity > 1,
                modifier = Modifier.size(56.dp)
            ) {
                Icon(Icons.Default.Remove, "Decrease", modifier = Modifier.size(24.dp))
            }

            OutlinedTextField(
                value = quantity.toString(),
                onValueChange = {
                    val newQty = it.toIntOrNull()
                    if (newQty != null && newQty in 1..maxQuantity) {
                        onQuantityChange(newQty)
                    }
                },
                modifier = Modifier.width(120.dp),
                textStyle = MaterialTheme.typography.headlineMedium.copy(
                    textAlign = TextAlign.Center
                ),
                singleLine = true
            )

            OutlinedButton(
                onClick = { if (quantity < maxQuantity) onQuantityChange(quantity + 1) },
                enabled = quantity < maxQuantity,
                modifier = Modifier.size(56.dp)
            ) {
                Icon(Icons.Default.Add, "Increase", modifier = Modifier.size(24.dp))
            }
        }

        // Stock Info
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.surfaceVariant
            )
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("Available Stock:")
                Badge {
                    Text("$maxQuantity units")
                }
            }
        }
    }
}

@Composable
private fun VariationsTab() {
    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text(
            text = "Variations",
            style = MaterialTheme.typography.headlineMedium
        )
        Text(
            text = "No variations available for this product",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}

@Composable
private fun ModifiersTab() {
    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text(
            text = "Modifiers",
            style = MaterialTheme.typography.headlineMedium
        )
        Text(
            text = "No modifiers available for this product",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}

@Composable
private fun PricingTab(
    originalPrice: Double,
    quantity: Int,
    discountType: String,
    discountValue: String,
    priceOverride: String,
    onDiscountTypeChange: (String) -> Unit,
    onDiscountValueChange: (String) -> Unit,
    onPriceOverrideChange: (String) -> Unit
) {
    Column(
        modifier = Modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(24.dp)
    ) {
        Text(
            text = "Pricing & Discounts",
            style = MaterialTheme.typography.headlineMedium
        )
        Text(
            text = "Adjust price or apply discounts",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )

        HorizontalDivider()

        // Price Override
        Text("Price Override", style = MaterialTheme.typography.titleMedium)
        OutlinedTextField(
            value = priceOverride,
            onValueChange = onPriceOverrideChange,
            label = { Text("Override Price") },
            placeholder = { Text("$${originalPrice.formatPrice()}") },
            leadingIcon = { Icon(Icons.Default.AttachMoney, null) },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true
        )
        Text(
            text = "Original: $${originalPrice.formatPrice()}",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )

        HorizontalDivider()

        // Discount
        Text("Discount", style = MaterialTheme.typography.titleMedium)
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            FilterChip(
                selected = discountType == "percentage",
                onClick = { onDiscountTypeChange("percentage") },
                label = { Text("Percentage") },
                leadingIcon = { Icon(Icons.Default.Percent, null) },
                modifier = Modifier.weight(1f)
            )
            FilterChip(
                selected = discountType == "fixed",
                onClick = { onDiscountTypeChange("fixed") },
                label = { Text("Fixed") },
                leadingIcon = { Icon(Icons.Default.AttachMoney, null) },
                modifier = Modifier.weight(1f)
            )
        }

        OutlinedTextField(
            value = discountValue,
            onValueChange = onDiscountValueChange,
            label = { Text(if (discountType == "percentage") "Discount %" else "Amount $") },
            placeholder = { Text("0.00") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true
        )

        HorizontalDivider()

        // Summary
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.secondaryContainer
            )
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                val basePrice = priceOverride.toDoubleOrNull() ?: originalPrice
                val subtotal = basePrice * quantity
                val discount = when {
                    discountType == "percentage" && discountValue.toDoubleOrNull() != null ->
                        (subtotal * discountValue.toDouble()) / 100

                    discountType == "fixed" && discountValue.toDoubleOrNull() != null ->
                        discountValue.toDouble()

                    else -> 0.0
                }
                val total = subtotal - discount

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text("Subtotal ($quantity×):")
                    Text("$${subtotal.formatPrice()}")
                }
                if (discount > 0) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("Discount:", color = MaterialTheme.colorScheme.error)
                        Text(
                            "-$${discount.formatPrice()}",
                            color = MaterialTheme.colorScheme.error
                        )
                    }
                }
                HorizontalDivider()
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text("Total:", style = MaterialTheme.typography.titleMedium)
                    Text(
                        "$${total.formatPrice()}",
                        style = MaterialTheme.typography.titleMedium,
                        color = MaterialTheme.colorScheme.primary
                    )
                }
            }
        }
    }
}
