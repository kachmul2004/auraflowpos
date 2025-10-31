package com.theauraflow.pos.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.theauraflow.pos.domain.model.CartItem
import com.theauraflow.pos.core.util.formatCurrency

/**
 * Cart item component for displaying items in the shopping cart.
 *
 * Design matches the web app:
 * - Wide landscape format (like A4 paper) that adapts to screen size
 * - Dynamic responsive height based on container
 * - Compact, button-like appearance
 * - Quantity indicator (e.g., "2×")
 * - Product name
 * - Modifiers listed below with prices
 * - Total price on the right
 * - Clickable for editing
 *
 * @param cartItem The cart item to display
 * @param onClick Callback when item is clicked (for editing)
 * @param modifier Modifier for customization
 */
@Composable
fun CartItemCard(
    cartItem: CartItem,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val colors = MaterialTheme.colorScheme

    Surface(
        modifier = modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(8.dp),
        color = colors.surfaceVariant,
        border = BorderStroke(1.dp, colors.outlineVariant)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp, vertical = 10.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Left side: Product info (quantity × name)
            Column(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxHeight()
            ) {
                // Quantity × Product Name (Top Row)
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = "${cartItem.quantity}×",
                        fontSize = 13.sp,
                        color = colors.onSurfaceVariant
                    )

                    Text(
                        text = cartItem.product.name,
                        fontSize = 14.sp,
                        lineHeight = 18.sp,
                        color = colors.onSurface,
                        maxLines = 2,
                        overflow = TextOverflow.Ellipsis,
                        modifier = Modifier.weight(1f)
                    )

                    // Price in top row
                    Text(
                        text = "$${cartItem.total.formatCurrency()}",
                        fontSize = 15.sp,
                        color = colors.onSurface,
                        modifier = Modifier.wrapContentWidth()
                    )
                }

                // Modifiers (if any) - Bottom row
                if (cartItem.modifiers.isNotEmpty()) {
                    Spacer(modifier = Modifier.height(4.dp))
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(start = 20.dp),
                        verticalArrangement = Arrangement.spacedBy(2.dp)
                    ) {
                        cartItem.modifiers.forEach { modifier ->
                            Text(
                                text = buildString {
                                    append("+ ")
                                    append(modifier.name)
                                    if (modifier.price > 0) {
                                        append(" (+$${modifier.price.formatCurrency()})")
                                    }
                                },
                                fontSize = 12.sp,
                                color = colors.onSurfaceVariant,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                        }
                    }
                }
            }
        }
    }
}