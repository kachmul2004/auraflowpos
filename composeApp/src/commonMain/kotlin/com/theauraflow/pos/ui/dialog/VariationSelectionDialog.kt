package com.theauraflow.pos.ui.dialog

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.theauraflow.pos.domain.model.Product
import com.theauraflow.pos.domain.model.ProductVariation
import com.theauraflow.pos.domain.model.Modifier as ProductModifier
import com.theauraflow.pos.domain.model.CartItemModifier
import com.theauraflow.pos.presentation.viewmodel.CartViewModel
import kotlinx.coroutines.launch

// Helper function to format price
private fun formatPrice(price: Double): String {
    val parts = price.toString().split(".")
    val dollars = parts.getOrNull(0) ?: "0"
    val cents = parts.getOrNull(1)?.take(2)?.padEnd(2, '0') ?: "00"
    return "$$dollars.$cents"
}

/**
 * Dialog for selecting product variations and modifiers.
 * Matches web version: docs/Web Version/src/components/VariationModal.tsx
 *
 * Features:
 * - Grid layout for variation selection (2 columns)
 * - List with +/- controls for modifiers
 * - Real-time price calculation
 * - Stock badges on variations
 * - Disabled state for out-of-stock variations
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun VariationSelectionDialog(
    product: Product,
    onDismiss: () -> Unit,
    onAddToCart: (variation: ProductVariation?, modifiers: List<CartItemModifier>) -> Unit,
    getAvailableStock: (productId: String, variationId: String?) -> Int = { _, _ -> 999 }
) {
    var selectedVariation by remember { mutableStateOf<ProductVariation?>(null) }
    var modifierQuantities by remember { mutableStateOf<Map<String, Int>>(emptyMap()) }

    // Calculate total price
    val total = remember(selectedVariation, modifierQuantities) {
        val basePrice = selectedVariation?.price ?: product.price
        val modifiersTotal = modifierQuantities.entries.sumOf { (modId, qty) ->
            val modifier = product.modifiers?.find { it.id == modId }
            (modifier?.price ?: 0.0) * qty
        }
        basePrice + modifiersTotal
    }

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(
            dismissOnBackPress = true,
            dismissOnClickOutside = true,
            usePlatformDefaultWidth = false
        )
    ) {
        Surface(
            modifier = Modifier
                .width(500.dp)
                .wrapContentHeight(),
            shape = RoundedCornerShape(12.dp),
            color = MaterialTheme.colorScheme.surface,
            tonalElevation = 6.dp
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(24.dp)
            ) {
                // Header
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    Text(
                        text = product.name,
                        style = MaterialTheme.typography.headlineSmall,
                        fontWeight = FontWeight.Bold
                    )
                    if (product.variationType != null) {
                        val variationTypeName = product.variationType?.name ?: "Options"
                        Text(
                            text = "Select ${variationTypeName.lowercase()} and customize your order",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }

                Spacer(modifier = Modifier.height(24.dp))

                // Scrollable content
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f, fill = false)
                        .verticalScroll(rememberScrollState()),
                    verticalArrangement = Arrangement.spacedBy(24.dp)
                ) {
                    // Variations Section
                    product.variations?.let { variations ->
                        Column(
                            modifier = Modifier.fillMaxWidth(),
                            verticalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Text(
                                text = product.variationType?.name ?: "Options",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.SemiBold
                            )

                            // Grid of variation buttons (2 columns)
                            Column(
                                modifier = Modifier.fillMaxWidth(),
                                verticalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                variations.chunked(2).forEach { rowVariations ->
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                                    ) {
                                        rowVariations.forEach { variation ->
                                            val availableStock =
                                                getAvailableStock(product.id, variation.id)
                                            val isOutOfStock = availableStock <= 0
                                            val isSelected = selectedVariation?.id == variation.id
                                            val isLowStock = availableStock in 1..5

                                            Box(
                                                modifier = Modifier.weight(1f)
                                            ) {
                                                OutlinedButton(
                                                    onClick = { selectedVariation = variation },
                                                    modifier = Modifier
                                                        .fillMaxWidth()
                                                        .height(80.dp),
                                                    enabled = !isOutOfStock,
                                                    colors = ButtonDefaults.outlinedButtonColors(
                                                        containerColor = if (isSelected)
                                                            MaterialTheme.colorScheme.primaryContainer
                                                        else
                                                            Color.Transparent,
                                                        contentColor = if (isSelected)
                                                            MaterialTheme.colorScheme.onPrimaryContainer
                                                        else
                                                            MaterialTheme.colorScheme.onSurface
                                                    ),
                                                    border = androidx.compose.foundation.BorderStroke(
                                                        width = if (isSelected) 2.dp else 1.dp,
                                                        color = if (isSelected)
                                                            MaterialTheme.colorScheme.primary
                                                        else
                                                            MaterialTheme.colorScheme.outline
                                                    ),
                                                    shape = RoundedCornerShape(8.dp)
                                                ) {
                                                    Column(
                                                        modifier = Modifier.fillMaxWidth(),
                                                        horizontalAlignment = Alignment.Start,
                                                        verticalArrangement = Arrangement.Center
                                                    ) {
                                                        Text(
                                                            text = variation.name,
                                                            style = MaterialTheme.typography.bodyMedium,
                                                            fontWeight = FontWeight.Medium
                                                        )
                                                        Text(
                                                            text = formatPrice(variation.price),
                                                            style = MaterialTheme.typography.bodySmall,
                                                            color = MaterialTheme.colorScheme.onSurfaceVariant
                                                        )
                                                    }
                                                }

                                                // Stock badge
                                                if (isOutOfStock || isLowStock) {
                                                    Surface(
                                                        modifier = Modifier
                                                            .align(Alignment.TopEnd)
                                                            .padding(4.dp),
                                                        color = if (isOutOfStock)
                                                            MaterialTheme.colorScheme.error
                                                        else
                                                            MaterialTheme.colorScheme.secondary,
                                                        shape = RoundedCornerShape(4.dp)
                                                    ) {
                                                        Text(
                                                            text = if (isOutOfStock) "Out" else "$availableStock",
                                                            modifier = Modifier.padding(
                                                                horizontal = 6.dp,
                                                                vertical = 2.dp
                                                            ),
                                                            style = MaterialTheme.typography.labelSmall,
                                                            color = if (isOutOfStock)
                                                                MaterialTheme.colorScheme.onError
                                                            else
                                                                MaterialTheme.colorScheme.onSecondary,
                                                            fontSize = 10.sp
                                                        )
                                                    }
                                                }
                                            }
                                        }

                                        // Fill remaining space if odd number of variations
                                        if (rowVariations.size == 1) {
                                            Spacer(modifier = Modifier.weight(1f))
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Modifiers Section
                    product.modifiers?.let { modifiers ->
                        Column(
                            modifier = Modifier.fillMaxWidth(),
                            verticalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Text(
                                text = "Add-ons (Optional)",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.SemiBold
                            )

                            Column(
                                modifier = Modifier.fillMaxWidth(),
                                verticalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                modifiers.forEach { modifier ->
                                    val quantity = modifierQuantities[modifier.id] ?: 0

                                    Surface(
                                        modifier = Modifier.fillMaxWidth(),
                                        shape = RoundedCornerShape(8.dp),
                                        border = androidx.compose.foundation.BorderStroke(
                                            width = 1.dp,
                                            color = MaterialTheme.colorScheme.outline
                                        )
                                    ) {
                                        Row(
                                            modifier = Modifier
                                                .fillMaxWidth()
                                                .padding(12.dp),
                                            horizontalArrangement = Arrangement.SpaceBetween,
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            // Modifier info
                                            Column(
                                                modifier = Modifier.weight(1f)
                                            ) {
                                                Text(
                                                    text = modifier.name,
                                                    style = MaterialTheme.typography.bodyMedium,
                                                    fontWeight = FontWeight.Medium
                                                )
                                                if (modifier.price > 0) {
                                                    Text(
                                                        text = "+${formatPrice(modifier.price)}",
                                                        style = MaterialTheme.typography.bodySmall,
                                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                                    )
                                                }
                                            }

                                            // Quantity controls
                                            Row(
                                                horizontalArrangement = Arrangement.spacedBy(8.dp),
                                                verticalAlignment = Alignment.CenterVertically
                                            ) {
                                                IconButton(
                                                    onClick = {
                                                        val newQty = (quantity - 1).coerceAtLeast(0)
                                                        modifierQuantities = if (newQty == 0) {
                                                            modifierQuantities - modifier.id
                                                        } else {
                                                            modifierQuantities + (modifier.id to newQty)
                                                        }
                                                    },
                                                    modifier = Modifier.size(32.dp),
                                                    enabled = quantity > 0
                                                ) {
                                                    Icon(
                                                        Icons.Default.Remove,
                                                        contentDescription = "Decrease",
                                                        modifier = Modifier.size(16.dp)
                                                    )
                                                }

                                                Text(
                                                    text = quantity.toString(),
                                                    style = MaterialTheme.typography.bodyMedium,
                                                    modifier = Modifier.width(24.dp),
                                                    fontWeight = FontWeight.Medium
                                                )

                                                IconButton(
                                                    onClick = {
                                                        val newQty = (quantity + 1).coerceAtMost(10)
                                                        modifierQuantities =
                                                            modifierQuantities + (modifier.id to newQty)
                                                    },
                                                    modifier = Modifier.size(32.dp),
                                                    enabled = quantity < 10
                                                ) {
                                                    Icon(
                                                        Icons.Default.Add,
                                                        contentDescription = "Increase",
                                                        modifier = Modifier.size(16.dp)
                                                    )
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(24.dp))

                // Footer: Total and Add to Cart button
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Total price
                    Column {
                        Text(
                            text = "Total",
                            style = MaterialTheme.typography.labelMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Text(
                            text = formatPrice(total),
                            style = MaterialTheme.typography.headlineSmall,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        )
                    }

                    // Add to Cart button
                    Button(
                        onClick = {
                            val cartItemModifiers = modifierQuantities
                                .mapNotNull { (modId, qty) ->
                                    product.modifiers?.find { it.id == modId }?.let { modifier ->
                                        CartItemModifier(
                                            id = modifier.id,
                                            name = modifier.name,
                                            price = modifier.price,
                                            quantity = qty
                                        )
                                    }
                                }
                            onAddToCart(selectedVariation, cartItemModifiers)
                            onDismiss()
                        },
                        enabled = selectedVariation != null || !product.hasVariations,
                        modifier = Modifier.height(48.dp)
                    ) {
                        Text("Add to Cart")
                    }
                }
            }
        }
    }
}
