package com.theauraflow.pos.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
 * - Stock badge in top-left corner
 *
 * @param product The product to display
 * @param onClick Callback when card is clicked
 * @param modifier Modifier for customization
 */
@Composable
fun ProductCard(
    product: Product,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val isOutOfStock = product.stockQuantity <= 0
    val colors = MaterialTheme.colorScheme

    Card(
        onClick = onClick,
        modifier = modifier
            .clip(RoundedCornerShape(12.dp)),
        enabled = !isOutOfStock,
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxSize()
        ) {
            // LEFT SIDE: Product Info (50%)
            Box(
                modifier = Modifier
                    .weight(0.5f)
                    .fillMaxHeight()
                    .background(colors.surface)
                    .padding(12.dp),
                contentAlignment = Alignment.TopStart
            ) {
                Column(
                    modifier = Modifier.fillMaxSize(),
                    verticalArrangement = Arrangement.SpaceBetween
                ) {
                    // Stock Badge - Top Left
                    Box(
                        modifier = Modifier
                            .size(40.dp)
                            .clip(CircleShape)
                            .background(colors.primary),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = if (isOutOfStock) "0" else product.stockQuantity.toString(),
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = colors.onPrimary
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
                            color = colors.onSurface,
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
                            color = colors.onSurface
                        )
                    }
                }
            }

            // RIGHT SIDE: Product Image (50%)
            Box(
                modifier = Modifier
                    .weight(0.5f)
                    .fillMaxHeight()
                    .background(colors.surfaceVariant),
                contentAlignment = Alignment.Center
            ) {
                if (!product.imageUrl.isNullOrEmpty()) {
                    // Show actual product image
                    // AsyncImage(
                    //     model = product.imageUrl,
                    //     contentDescription = product.name,
                    //     modifier = Modifier.fillMaxSize(),
                    //     contentScale = ContentScale.Crop,
                    //     alpha = if (isOutOfStock) 0.5f else 1f
                    // )
                } else {
                    // Fallback: Category icon if no image
                    Icon(
                        imageVector = getCategoryIcon(product.categoryName ?: ""),
                        contentDescription = product.name,
                        modifier = Modifier.size(48.dp),
                        tint = colors.onSurfaceVariant.copy(alpha = 0.3f)
                    )
                }

                // Out of Stock Overlay
                if (isOutOfStock) {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(colors.error.copy(alpha = 0.3f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "Out of Stock",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = colors.onError,
                            modifier = Modifier
                                .background(
                                    colors.error.copy(alpha = 0.8f),
                                    shape = RoundedCornerShape(4.dp)
                                )
                                .padding(8.dp)
                        )
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

