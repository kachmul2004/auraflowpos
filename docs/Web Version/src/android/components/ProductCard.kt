package com.auraflow.pos.components

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.auraflow.pos.models.Category
import com.auraflow.pos.models.Product
import com.auraflow.pos.theme.*
import com.auraflow.pos.ui.Badge
import com.auraflow.pos.ui.BadgeVariant

/**
 * Product card with horizontal split layout
 * Left: Product name and price
 * Right: Product image or category icon
 */

@Composable
fun ProductCard(
    product: Product,
    availableStock: Int,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val isOutOfStock = availableStock <= 0
    val isLowStock = availableStock in 1..5
    
    Surface(
        onClick = if (!isOutOfStock) onClick else {},
        modifier = modifier
            .aspectRatio(1f)
            .shadow(1.dp, RoundedCornerShape(8.dp))
            .clip(RoundedCornerShape(8.dp))
            .border(
                1.dp,
                if (isOutOfStock) Border else Border,
                RoundedCornerShape(8.dp)
            ),
        color = Card,
        enabled = !isOutOfStock
    ) {
        Row(
            modifier = Modifier.fillMaxSize()
        ) {
            // Left Side: Product Info (50%)
            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxHeight()
                    .background(Card)
                    .padding(8.dp)
            ) {
                // Stock Badge
                Badge(
                    text = if (isOutOfStock) "Out" else availableStock.toString(),
                    variant = when {
                        isOutOfStock -> BadgeVariant.DESTRUCTIVE
                        isLowStock -> BadgeVariant.DESTRUCTIVE
                        else -> BadgeVariant.SECONDARY
                    },
                    modifier = Modifier
                        .align(Alignment.TopStart)
                )
                
                // Product Info - Centered
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(top = 24.dp),
                    verticalArrangement = Arrangement.SpaceBetween
                ) {
                    // Product Name
                    Text(
                        text = product.name,
                        fontSize = 12.sp,
                        lineHeight = 16.sp,
                        color = if (isOutOfStock) MutedForeground else CardForeground,
                        maxLines = 3,
                        overflow = TextOverflow.Ellipsis,
                        modifier = Modifier.weight(1f)
                    )
                    
                    // Price and Modifier Indicator
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = product.priceDisplay,
                            fontSize = 14.sp,
                            color = if (isOutOfStock) MutedForeground else CardForeground
                        )
                        
                        if (product.hasVariations || product.hasModifiers) {
                            Badge(
                                text = "+",
                                variant = BadgeVariant.OUTLINE,
                                modifier = Modifier.height(16.dp)
                            )
                        }
                    }
                }
            }
            
            // Right Side: Product Image (50%)
            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxHeight()
                    .background(
                        androidx.compose.ui.graphics.Brush.verticalGradient(
                            listOf(
                                Muted.copy(alpha = 0.8f),
                                Muted
                            )
                        )
                    ),
                contentAlignment = Alignment.Center
            ) {
                if (product.imageUrl != null) {
                    AsyncImage(
                        model = product.imageUrl,
                        contentDescription = product.name,
                        modifier = Modifier.fillMaxSize(),
                        contentScale = ContentScale.Crop
                    )
                } else {
                    Icon(
                        imageVector = getCategoryIcon(product.category),
                        contentDescription = null,
                        modifier = Modifier.size(32.dp),
                        tint = if (isOutOfStock) 
                            MutedForeground.copy(alpha = 0.2f) 
                        else 
                            MutedForeground.copy(alpha = 0.4f)
                    )
                }
            }
        }
    }
}

/**
 * Get category icon matching the React app
 */
fun getCategoryIcon(category: String): ImageVector {
    return when (category.uppercase()) {
        "GROCERIES" -> Icons.Filled.ShoppingCart
        "BEVERAGES" -> Icons.Filled.LocalDrink
        "COFFEE" -> Icons.Filled.LocalCafe
        "SNACKS" -> Icons.Filled.Cookie
        "DAIRY" -> Icons.Filled.Icecream
        "BAKERY" -> Icons.Filled.Cake
        "MEAT" -> Icons.Filled.Restaurant
        "PRODUCE" -> Icons.Filled.Eco
        "FROZEN" -> Icons.Filled.AcUnit
        "HOUSEHOLD" -> Icons.Filled.Home
        "PERSONAL_CARE", "PERSONAL CARE" -> Icons.Filled.Face
        "ALCOHOL" -> Icons.Filled.LocalBar
        "FOOD" -> Icons.Filled.Restaurant
        else -> Icons.Filled.Category
    }
}
