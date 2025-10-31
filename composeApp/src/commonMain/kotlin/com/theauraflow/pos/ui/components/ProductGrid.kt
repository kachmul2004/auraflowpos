package com.theauraflow.pos.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil3.compose.SubcomposeAsyncImage
import com.theauraflow.pos.domain.model.Product

/**
 * Product grid with category filtering and pagination.
 * Matches web version design from docs/Web Version/src/components/ProductGrid.tsx
 */
@Composable
fun ProductGrid(
    products: List<Product>,
    selectedCategory: String = "All",
    onCategoryChange: (String) -> Unit = {},
    onProductClick: (Product) -> Unit = {},
    searchQuery: String = "",
    onSearchQueryChange: (String) -> Unit = {},
    isDarkTheme: Boolean = false,
    modifier: Modifier = Modifier
) {
    var currentPage by remember { mutableStateOf(1) }
    val itemsPerPage = 25 // 5 columns × 5 rows
    val focusManager = LocalFocusManager.current

    // Extract unique categories from products
    val categories = remember(products) {
        listOf("All") + products.mapNotNull { it.categoryName }.distinct().sorted()
    }

    // Filter products by selected category
    val filteredProducts = remember(products, selectedCategory) {
        if (selectedCategory == "All") products
        else products.filter { it.categoryName == selectedCategory }
    }

    // Pagination logic
    val totalPages = remember(filteredProducts.size, itemsPerPage) {
        (filteredProducts.size + itemsPerPage - 1) / itemsPerPage
    }

    val paginatedProducts = remember(filteredProducts, currentPage, itemsPerPage) {
        val startIndex = (currentPage - 1) * itemsPerPage
        val endIndex = minOf(startIndex + itemsPerPage, filteredProducts.size)
        filteredProducts.subList(startIndex, endIndex)
    }

    // Reset to page 1 when category changes
    LaunchedEffect(selectedCategory) {
        currentPage = 1
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .clickable(
                indication = null,
                interactionSource = remember { MutableInteractionSource() }
            ) { focusManager.clearFocus() }
    ) {
        // Search bar (matches web version: hidden lg:block p-4 border-b border-border bg-card)
        Surface(
            modifier = Modifier
                .fillMaxWidth(),
            color = MaterialTheme.colorScheme.surface,
            tonalElevation = 0.dp,
            shadowElevation = 1.dp
        ) {
            Row(
                modifier = Modifier.padding(6.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = onSearchQueryChange,
                    modifier = Modifier.weight(1f),
                    placeholder = {
                        Text(
                            "Search by name, SKU, or scan barcode...",
                            fontSize = 12.sp
                        )
                    },
                    leadingIcon = {
                        Icon(
                            Icons.Default.Search,
                            contentDescription = null,
                            modifier = Modifier.size(18.dp)
                        )
                    },
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = MaterialTheme.colorScheme.primary,
                        unfocusedBorderColor = MaterialTheme.colorScheme.outline
                    ),
                    textStyle = MaterialTheme.typography.bodyMedium.copy(fontSize = 14.sp),
                    keyboardOptions = KeyboardOptions.Default.copy(
                        imeAction = ImeAction.Search
                    ),
                    keyboardActions = KeyboardActions(
                        onSearch = { focusManager.clearFocus() }
                    )
                )
            }
        }

        // Category tabs (horizontal scrollable like web version)
        ScrollableTabRow(
            selectedTabIndex = categories.indexOf(selectedCategory).coerceAtLeast(0),
            modifier = Modifier
                .fillMaxWidth()
                .clickable(
                    indication = null,
                    interactionSource = remember { MutableInteractionSource() }
                ) { focusManager.clearFocus() },
            edgePadding = 8.dp,
            containerColor = MaterialTheme.colorScheme.surface
        ) {
            categories.forEach { category ->
                Tab(
                    selected = selectedCategory == category,
                    onClick = { onCategoryChange(category) },
                    text = {
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(6.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                getCategoryIconForProduct(category),
                                contentDescription = null,
                                modifier = Modifier.size(16.dp)
                            )
                            Text(category, fontSize = 12.sp)
                        }
                    }
                )
            }
        }

        // Product grid with background color based on theme
        BoxWithConstraints(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
                .background(
                    if (isDarkTheme) Color(0xFF1B191A) else Color(0xFFD9D9D9)
                )
                .padding(12.dp)
                .clickable(
                    indication = null,
                    interactionSource = remember { MutableInteractionSource() }
                ) { focusManager.clearFocus() }
        ) {
            // Calculate item size to fit exactly 5 rows in available height
            // Web uses: grid-rows-[repeat(5,1fr)] which divides height equally
            val availableHeight = maxHeight
            val verticalSpacing = 8.dp * 4 // 4 gaps between 5 rows
            val itemHeight = (availableHeight - verticalSpacing) / 5

            LazyVerticalGrid(
                columns = GridCells.Fixed(5), // 5 columns like web version
                modifier = Modifier.fillMaxSize(),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp),
                contentPadding = PaddingValues(0.dp),
                userScrollEnabled = false // Disable scrolling - we use pagination instead
            ) {
                // Show paginated products
                items(paginatedProducts) { product ->
                    ProductGridCard(
                        product = product,
                        onClick = { onProductClick(product) },
                        isDarkTheme = isDarkTheme,
                        modifier = Modifier.height(itemHeight)
                    )
                }

                // Fill remaining slots with placeholders
                val placeholderCount = itemsPerPage - paginatedProducts.size
                items(placeholderCount) {
                    PlaceholderCard(modifier = Modifier.height(itemHeight))
                }
            }
        }

        // Pagination controls
        Surface(
            modifier = Modifier.fillMaxWidth(),
            color = MaterialTheme.colorScheme.surface,
            shape = RoundedCornerShape(0.dp)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 12.dp, vertical = 4.dp),
                horizontalArrangement = Arrangement.Center,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Previous button - circular
                FilledIconButton(
                    onClick = { currentPage = maxOf(1, currentPage - 1) },
                    enabled = currentPage > 1,
                    modifier = Modifier.size(28.dp), // Compact circular button
                    colors = IconButtonDefaults.filledIconButtonColors(
                        containerColor = MaterialTheme.colorScheme.primary,
                        disabledContainerColor = MaterialTheme.colorScheme.surface
                    )
                ) {
                    Icon(
                        Icons.Default.ChevronLeft,
                        contentDescription = "Previous page",
                        modifier = Modifier.size(16.dp)
                    )
                }

                Spacer(modifier = Modifier.width(12.dp))

                Text(
                    text = "$currentPage / ${maxOf(1, totalPages)}",
                    style = MaterialTheme.typography.bodyMedium.copy(fontSize = 12.sp)
                )

                Spacer(modifier = Modifier.width(12.dp))

                // Next button - circular
                FilledIconButton(
                    onClick = { currentPage = minOf(totalPages, currentPage + 1) },
                    enabled = currentPage < totalPages,
                    modifier = Modifier.size(28.dp), // Compact circular button
                    colors = IconButtonDefaults.filledIconButtonColors(
                        containerColor = MaterialTheme.colorScheme.primary,
                        disabledContainerColor = MaterialTheme.colorScheme.surface
                    )
                ) {
                    Icon(
                        Icons.Default.ChevronRight,
                        contentDescription = "Next page",
                        modifier = Modifier.size(16.dp)
                    )
                }
            }
        }
    }
}

/**
 * Individual product card in the grid.
 * Matches web design: split layout with info on left, image on right.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun ProductGridCard(
    product: Product,
    onClick: () -> Unit,
    isDarkTheme: Boolean = false,
    modifier: Modifier = Modifier
) {
    val stockLevel = product.stockQuantity

    Card(
        onClick = onClick,
        modifier = modifier
            .fillMaxWidth(),
        shape = RoundedCornerShape(8.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (isDarkTheme) Color(0xFF2F2D2D) else MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(
            defaultElevation = 2.dp,
            pressedElevation = 6.dp
        ),
        border = if (isDarkTheme) androidx.compose.foundation.BorderStroke(
            width = 1.dp,
            color = Color(0xFF808080) // 50% white for subtle border in dark mode
        ) else null
    ) {
        Row(
            modifier = Modifier.fillMaxSize()
        ) {
            // Left side: Product info (50%)
            Column(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxHeight()
                    .padding(8.dp),
                verticalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    // Stock badge at top
                    Surface(
                        shape = RoundedCornerShape(4.dp),
                        color = if (stockLevel > 5)
                            MaterialTheme.colorScheme.secondary
                        else
                            MaterialTheme.colorScheme.error,
                        modifier = Modifier.padding(bottom = 4.dp)
                    ) {
                        Text(
                            text = stockLevel.toString(),
                            style = MaterialTheme.typography.labelSmall,
                            color = if (stockLevel > 5)
                                MaterialTheme.colorScheme.onSecondary
                            else
                                MaterialTheme.colorScheme.onError,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(4.dp))

                    // Product name
                    Text(
                        text = product.name,
                        style = MaterialTheme.typography.bodySmall,
                        maxLines = 3,
                        overflow = TextOverflow.Ellipsis,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                }

                // Price at bottom
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Format price with 2 decimal places
                    val priceText = buildString {
                        append("$")
                        val priceStr = product.price.toString()
                        val parts = priceStr.split(".")
                        append(parts.getOrNull(0) ?: "0")
                        append(".")
                        val decimal = parts.getOrNull(1)?.take(2)?.padEnd(2, '0') ?: "00"
                        append(decimal)
                    }

                    Text(
                        text = priceText,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.primary
                    )

                    // Show '+' badge if product has variations/modifiers
                    if (product.hasVariations || product.hasModifiers) {
                        Surface(
                            shape = RoundedCornerShape(4.dp),
                            color = MaterialTheme.colorScheme.primaryContainer,
                            modifier = Modifier.size(16.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Text(
                                    text = "+",
                                    style = MaterialTheme.typography.labelSmall,
                                    color = MaterialTheme.colorScheme.onPrimaryContainer
                                )
                            }
                        }
                    }
                }
            }

            // Right side: Product image (50%)
            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxHeight()
                    .background(
                        MaterialTheme.colorScheme.surface,
                        RoundedCornerShape(topEnd = 8.dp, bottomEnd = 8.dp)
                    ),
                contentAlignment = Alignment.Center
            ) {
                if (product.imageUrl != null) {
                    // Load actual image from URL with loading and error states
                    SubcomposeAsyncImage(
                        model = product.imageUrl,
                        contentDescription = product.name,
                        modifier = Modifier.fillMaxSize(),
                        contentScale = ContentScale.Crop,
                        loading = {
                            // Show loading indicator while image loads
                            Box(
                                modifier = Modifier.fillMaxSize(),
                                contentAlignment = Alignment.Center
                            ) {
                                CircularProgressIndicator(
                                    modifier = Modifier.size(24.dp),
                                    color = MaterialTheme.colorScheme.primary
                                )
                            }
                        },
                        error = {
                            // Show icon if image fails to load
                            Box(
                                modifier = Modifier.fillMaxSize(),
                                contentAlignment = Alignment.Center
                            ) {
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Icon(
                                        imageVector = getCategoryIconForProduct(product.categoryName),
                                        contentDescription = null,
                                        tint = MaterialTheme.colorScheme.error.copy(alpha = 0.4f),
                                        modifier = Modifier.size(48.dp)
                                    )
                                    Text(
                                        text = "Error",
                                        style = MaterialTheme.typography.labelSmall,
                                        color = MaterialTheme.colorScheme.error
                                    )
                                }
                            }
                        }
                    )
                } else {
                    // Fallback to icon if no image URL - THIS SHOULD NOT HAPPEN!
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(
                            imageVector = getCategoryIconForProduct(product.categoryName),
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.4f),
                            modifier = Modifier.size(48.dp)
                        )
                        Text(
                            text = "No URL",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.error
                        )
                    }
                }
            }
        }
    }
}

/**
 * Placeholder card for empty grid slots.
 */
@Composable
private fun PlaceholderCard(modifier: Modifier = Modifier) {
    Surface(
        modifier = modifier
            .fillMaxWidth(),
        shape = RoundedCornerShape(8.dp),
        color = MaterialTheme.colorScheme.surface.copy(alpha = 0.3f),
        border = androidx.compose.foundation.BorderStroke(
            width = 2.dp,
            color = MaterialTheme.colorScheme.outline.copy(alpha = 0.2f)
        )
    ) {
        Box(
            modifier = Modifier.fillMaxSize(),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = "Empty",
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.4f)
            )
        }
    }
}

/**
 * Get icon for product category.
 */
private fun getCategoryIconForProduct(categoryName: String?): ImageVector {
    val categoryLower = categoryName?.lowercase() ?: ""
    return when {
        categoryLower.contains("food") -> Icons.Default.Restaurant
        categoryLower.contains("beverage") || categoryLower.contains("drink") || categoryLower.contains(
            "coffee"
        ) -> Icons.Default.LocalCafe

        categoryLower.contains("retail") || categoryLower.contains("merchandise") -> Icons.Default.ShoppingBag
        categoryLower.contains("pharmacy") || categoryLower.contains("medical") || categoryLower.contains(
            "health"
        ) -> Icons.Default.MedicalServices

        categoryLower.contains("salon") || categoryLower.contains("beauty") || categoryLower.contains(
            "hair"
        ) -> Icons.Default.ContentCut

        else -> Icons.Default.Category
    }
}
