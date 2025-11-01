package com.theauraflow.pos.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.theauraflow.pos.domain.model.Product
import com.theauraflow.pos.core.util.formatCurrency

/**
 * Product card component for displaying products in the POS grid.
 *
 * Design exactly matches the web app:
 * - Left side (50%): Product info (stock, name, price) on light background
 * - Right side (50%): Product image
 * - Stock badge in top-left corner with color coding (shows AVAILABLE stock)
 *
 * Stock Badge Colors:
 * - Green: > 10 units (healthy stock)
 * - Yellow: 1-10 units (low stock warning)
 * - Red: 0 units (out of stock)
 *
 * @param product The product to display
 * @param onClick Callback when card is clicked
 * @param quantityInCart Current quantity of this product in the cart (for real-time stock display)
 * @param allowOutOfStockPurchase Whether to allow adding out-of-stock items (admin mode)
 * @param modifier Modifier for customization
 */
@Composable
fun ProductCard(
    product: Product,
    onClick: () -> Unit,
    quantityInCart: Int = 0,
    allowOutOfStockPurchase: Boolean = false,
    modifier: Modifier = Modifier
) {
    // Calculate available stock (total stock - quantity in cart)
    val availableStock = (product.stockQuantity - quantityInCart).coerceAtLeast(0)

    val isOutOfStock = availableStock <= 0
    val isLowStock = availableStock in 1..10
    val isEnabled = allowOutOfStockPurchase || !isOutOfStock
    val colors = MaterialTheme.colorScheme
    val borderRadius = 12.dp

    // Stock badge color based on AVAILABLE quantity
    val stockBadgeColor = when {
        isOutOfStock -> Color(0xFFEF4444) // Red
        isLowStock -> Color(0xFFF59E0B) // Amber/Yellow
        else -> Color(0xFF10B981) // Green
    }

    Card(
        modifier = modifier
            .clip(RoundedCornerShape(borderRadius))
            .clickable(enabled = isEnabled) { onClick() },
        elevation = CardDefaults.cardElevation(defaultElevation = if (isEnabled) 2.dp else 0.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (isEnabled) colors.surface else colors.surfaceVariant,
            disabledContainerColor = colors.surfaceVariant
        ),
        shape = RoundedCornerShape(borderRadius)
    ) {
        Row(
            modifier = Modifier.fillMaxSize()
        ) {
            // LEFT SIDE: Product Info (50%)
            Box(
                modifier = Modifier
                    .weight(0.5f)
                    .fillMaxHeight()
                    .background(if (isEnabled) colors.surface else colors.surfaceVariant)
                    .padding(12.dp),
                contentAlignment = Alignment.TopStart
            ) {
                Column(
                    modifier = Modifier.fillMaxSize(),
                    verticalArrangement = Arrangement.SpaceBetween
                ) {
                    // Stock Badge - Top Left with Color Coding (shows AVAILABLE stock)
                    Box(
                        modifier = Modifier
                            .size(40.dp)
                            .clip(CircleShape)
                            .background(stockBadgeColor),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = availableStock.toString(),
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                    }

                    // Product Info at Bottom
                    Column(
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        // Product Name
                        Text(
                            text = product.name,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Medium,
                            color = if (isEnabled) colors.onSurface else colors.onSurface.copy(alpha = 0.5f),
                            maxLines = 2,
                            overflow = TextOverflow.Ellipsis,
                            lineHeight = 16.sp
                        )

                        Spacer(modifier = Modifier.height(8.dp))

                        // Price
                        Text(
                            text = "$${product.price.formatCurrency()}",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (isEnabled) colors.onSurface else colors.onSurface.copy(alpha = 0.5f)
                        )

                        // Low Stock Warning
                        if (isLowStock && !isOutOfStock) {
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = "Low Stock",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Medium,
                                color = Color(0xFFF59E0B),
                                modifier = Modifier
                                    .background(
                                        Color(0xFFF59E0B).copy(alpha = 0.15f),
                                        shape = RoundedCornerShape(4.dp)
                                    )
                                    .padding(horizontal = 6.dp, vertical = 2.dp)
                            )
                        }
                    }
                }
            }

            // RIGHT SIDE: Product Image (50%)
            Box(
                modifier = Modifier
                    .weight(0.5f)
                    .fillMaxHeight()
                    .background(if (isEnabled) colors.surfaceVariant else colors.surfaceVariant),
                contentAlignment = Alignment.Center
            ) {
                if (!product.imageUrl.isNullOrEmpty()) {
                    // Show actual product image
                    // AsyncImage(
                    //     model = product.imageUrl,
                    //     contentDescription = product.name,
                    //     modifier = Modifier.fillMaxSize(),
                    //     contentScale = ContentScale.Crop,
                    //     alpha = if (isEnabled) 1f else 0.5f
                    // )
                } else {
                    // Fallback: Category icon if no image
                    Icon(
                        imageVector = getCategoryIcon(product.categoryName ?: ""),
                        contentDescription = product.name,
                        modifier = Modifier.size(48.dp),
                        tint = colors.onSurfaceVariant.copy(alpha = if (isEnabled) 0.3f else 0.1f)
                    )
                }

                // Out of Stock Overlay
                if (isOutOfStock) {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(Color(0xFFEF4444).copy(alpha = 0.15f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Surface(
                            color = Color(0xFFEF4444),
                            shape = RoundedCornerShape(6.dp),
                            shadowElevation = 2.dp
                        ) {
                            Text(
                                text = "OUT OF STOCK",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                            )
                        }
                    }
                }
            }
        }
    }
}

/**
 * Get category icon matching the reference implementation
 */
private fun getCategoryIcon(category: String): ImageVector {
    return when (category.uppercase()) {
        "GROCERIES" -> Icons.Filled.ShoppingCart
        "BEVERAGES", "DRINKS" -> Icons.Default.LocalDrink
        "COFFEE" -> Icons.Default.LocalCafe
        "SNACKS" -> Icons.Default.Cookie
        "DAIRY" -> Icons.Default.Icecream
        "BAKERY" -> Icons.Default.Cake
        "MEAT" -> Icons.Default.Restaurant
        "PRODUCE" -> Icons.Default.Eco
        "FROZEN" -> Icons.Default.AcUnit
        "HOUSEHOLD" -> Icons.Default.Home
        "PERSONAL_CARE", "PERSONAL CARE" -> Icons.Default.Face
        "ALCOHOL", "BAR" -> Icons.Default.LocalBar
        "FOOD" -> Icons.Default.Restaurant
        else -> Icons.Default.Category
    }
}

