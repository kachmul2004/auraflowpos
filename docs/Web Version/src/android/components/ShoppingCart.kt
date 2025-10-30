package com.auraflow.pos.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.auraflow.pos.models.CartItem
import com.auraflow.pos.theme.*
import com.auraflow.pos.ui.PrimaryButton
import com.auraflow.pos.ui.SecondaryButton
import java.text.NumberFormat
import java.util.Locale

/**
 * Shopping cart component
 */

@Composable
fun ShoppingCart(
    cartItems: List<CartItem>,
    subtotal: Double,
    tax: Double,
    total: Double,
    onQuantityChange: (CartItem, Int) -> Unit,
    onRemoveItem: (CartItem) -> Unit,
    onCheckout: () -> Unit,
    onClearCart: () -> Unit,
    modifier: Modifier = Modifier
) {
    Surface(
        modifier = modifier,
        color = Card,
        tonalElevation = 0.dp
    ) {
        Column(
            modifier = Modifier.fillMaxSize()
        ) {
            // Cart Header
            Surface(
                modifier = Modifier.fillMaxWidth(),
                color = Background,
                tonalElevation = 1.dp
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Current Order",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Foreground
                    )
                    
                    if (cartItems.isNotEmpty()) {
                        IconButton(onClick = onClearCart) {
                            Icon(
                                imageVector = Icons.Default.Delete,
                                contentDescription = "Clear cart",
                                tint = Destructive
                            )
                        }
                    }
                }
            }
            
            // Cart Items
            if (cartItems.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f),
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.ShoppingCart,
                            contentDescription = null,
                            modifier = Modifier.size(48.dp),
                            tint = MutedForeground
                        )
                        Text(
                            text = "Cart is empty",
                            fontSize = 14.sp,
                            color = MutedForeground
                        )
                    }
                }
            } else {
                LazyColumn(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f)
                        .padding(12.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(cartItems) { item ->
                        CartItemCard(
                            item = item,
                            onQuantityChange = { newQty -> onQuantityChange(item, newQty) },
                            onRemove = { onRemoveItem(item) }
                        )
                    }
                }
            }
            
            // Cart Summary
            if (cartItems.isNotEmpty()) {
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    color = Background,
                    tonalElevation = 1.dp
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        // Subtotal
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("Subtotal", color = Foreground)
                            Text(formatCurrency(subtotal), color = Foreground)
                        }
                        
                        // Tax
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("Tax", color = Foreground)
                            Text(formatCurrency(tax), color = Foreground)
                        }
                        
                        Divider(color = Border)
                        
                        // Total
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                "Total",
                                fontSize = 18.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = Foreground
                            )
                            Text(
                                formatCurrency(total),
                                fontSize = 18.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = Primary
                            )
                        }
                        
                        // Checkout Button
                        PrimaryButton(
                            text = "Checkout",
                            onClick = onCheckout,
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun CartItemCard(
    item: CartItem,
    onQuantityChange: (Int) -> Unit,
    onRemove: () -> Unit,
    modifier: Modifier = Modifier
) {
    Surface(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(8.dp))
            .border(1.dp, Border, RoundedCornerShape(8.dp)),
        color = Background
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = item.product.name,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Medium,
                        color = Foreground,
                        maxLines = 2,
                        overflow = TextOverflow.Ellipsis
                    )
                    Text(
                        text = formatCurrency(item.price),
                        fontSize = 12.sp,
                        color = MutedForeground
                    )
                }
                
                IconButton(
                    onClick = onRemove,
                    modifier = Modifier.size(32.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Close,
                        contentDescription = "Remove",
                        tint = Destructive,
                        modifier = Modifier.size(16.dp)
                    )
                }
            }
            
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Quantity Controls
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(
                        onClick = { if (item.quantity > 1) onQuantityChange(item.quantity - 1) },
                        modifier = Modifier.size(32.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Remove,
                            contentDescription = "Decrease",
                            modifier = Modifier.size(16.dp)
                        )
                    }
                    
                    Text(
                        text = item.quantity.toString(),
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Medium,
                        color = Foreground
                    )
                    
                    IconButton(
                        onClick = { onQuantityChange(item.quantity + 1) },
                        modifier = Modifier.size(32.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Add,
                            contentDescription = "Increase",
                            modifier = Modifier.size(16.dp)
                        )
                    }
                }
                
                // Item Total
                Text(
                    text = formatCurrency(item.subtotal),
                    fontSize = 16.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Foreground
                )
            }
        }
    }
}

fun formatCurrency(amount: Double): String {
    val formatter = NumberFormat.getCurrencyInstance(Locale.US)
    return formatter.format(amount)
}
