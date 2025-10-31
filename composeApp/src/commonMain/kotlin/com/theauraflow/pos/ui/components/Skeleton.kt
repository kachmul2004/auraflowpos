package com.theauraflow.pos.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

/**
 * Shimmer effect for skeleton loaders.
 * Creates a left-to-right sweep animation.
 */
@Composable
private fun shimmerBrush(): Brush {
    val shimmerColors = listOf(
        MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f),
        MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.2f),
        MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f)
    )

    val transition = rememberInfiniteTransition(label = "shimmer")
    val translateAnimation by transition.animateFloat(
        initialValue = 0f,
        targetValue = 1000f,
        animationSpec = infiniteRepeatable(
            animation = tween(1200, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "shimmer"
    )

    return Brush.linearGradient(
        colors = shimmerColors,
        start = Offset(translateAnimation - 1000f, translateAnimation - 1000f),
        end = Offset(translateAnimation, translateAnimation)
    )
}

/**
 * Generic skeleton box with shimmer effect.
 */
@Composable
fun SkeletonBox(
    modifier: Modifier = Modifier,
    shape: androidx.compose.ui.graphics.Shape = RoundedCornerShape(8.dp)
) {
    Box(
        modifier = modifier
            .clip(shape)
            .background(shimmerBrush())
    )
}

/**
 * Product card skeleton matching ProductCard layout.
 * Displays a 50/50 split with shimmer animation.
 */
@Composable
fun ProductCardSkeleton(
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.clip(RoundedCornerShape(12.dp)),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(modifier = Modifier.fillMaxSize()) {
            // Left side - Info
            Box(
                modifier = Modifier
                    .weight(0.5f)
                    .fillMaxHeight()
                    .background(MaterialTheme.colorScheme.surface)
                    .padding(12.dp)
            ) {
                Column(
                    modifier = Modifier.fillMaxSize(),
                    verticalArrangement = Arrangement.SpaceBetween
                ) {
                    // Stock badge skeleton
                    SkeletonBox(
                        modifier = Modifier.size(40.dp),
                        shape = CircleShape
                    )

                    // Product info skeleton
                    Column {
                        // Name
                        SkeletonBox(
                            modifier = Modifier
                                .fillMaxWidth(0.8f)
                                .height(16.dp)
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        SkeletonBox(
                            modifier = Modifier
                                .fillMaxWidth(0.6f)
                                .height(16.dp)
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                        // Price
                        SkeletonBox(
                            modifier = Modifier
                                .width(60.dp)
                                .height(20.dp)
                        )
                    }
                }
            }

            // Right side - Image skeleton
            SkeletonBox(
                modifier = Modifier
                    .weight(0.5f)
                    .fillMaxHeight(),
                shape = RoundedCornerShape(0.dp)
            )
        }
    }
}

/**
 * Cart item skeleton matching CartItemCard layout.
 */
@Composable
fun CartItemSkeleton(
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Product name
        Column(modifier = Modifier.weight(1f)) {
            SkeletonBox(
                modifier = Modifier
                    .fillMaxWidth(0.7f)
                    .height(16.dp)
            )
            Spacer(modifier = Modifier.height(6.dp))
            SkeletonBox(
                modifier = Modifier
                    .width(80.dp)
                    .height(14.dp)
            )
        }

        // Quantity
        SkeletonBox(
            modifier = Modifier
                .width(60.dp)
                .height(32.dp),
            shape = RoundedCornerShape(6.dp)
        )

        // Price
        SkeletonBox(
            modifier = Modifier
                .width(70.dp)
                .height(18.dp)
        )
    }
}

/**
 * Order card skeleton for order history.
 */
@Composable
fun OrderCardSkeleton(
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                SkeletonBox(
                    modifier = Modifier
                        .width(120.dp)
                        .height(18.dp)
                )
                SkeletonBox(
                    modifier = Modifier
                        .width(80.dp)
                        .height(16.dp)
                )
            }

            SkeletonBox(
                modifier = Modifier
                    .fillMaxWidth(0.5f)
                    .height(14.dp)
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                SkeletonBox(
                    modifier = Modifier
                        .width(100.dp)
                        .height(16.dp)
                )
                SkeletonBox(
                    modifier = Modifier
                        .width(60.dp)
                        .height(20.dp)
                )
            }
        }
    }
}
