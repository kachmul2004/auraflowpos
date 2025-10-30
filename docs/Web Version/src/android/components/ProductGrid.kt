package com.auraflow.pos.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ChevronLeft
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.auraflow.pos.models.Product
import com.auraflow.pos.theme.*
import com.auraflow.pos.ui.SecondaryButton

/**
 * Product grid with pagination
 * Background color: #D9D9D9
 */

@Composable
fun ProductGrid(
    products: List<Product>,
    stockMap: Map<String, Int>,
    onProductClick: (Product) -> Unit,
    modifier: Modifier = Modifier,
    itemsPerPage: Int = 15,
    columns: Int = 5
) {
    var currentPage by remember { mutableStateOf(0) }
    
    val totalPages = (products.size + itemsPerPage - 1) / itemsPerPage
    val startIndex = currentPage * itemsPerPage
    val endIndex = minOf(startIndex + itemsPerPage, products.size)
    val paginatedProducts = products.subList(startIndex, endIndex)
    
    Column(
        modifier = modifier.fillMaxSize()
    ) {
        // Product Grid with custom background
        Box(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
                .background(ProductGridBackground)
                .padding(12.dp)
        ) {
            LazyVerticalGrid(
                columns = GridCells.Fixed(columns),
                contentPadding = PaddingValues(0.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(paginatedProducts) { product ->
                    ProductCard(
                        product = product,
                        availableStock = stockMap[product.id] ?: 0,
                        onClick = { onProductClick(product) }
                    )
                }
            }
        }
        
        // Pagination Controls
        if (totalPages > 1) {
            Surface(
                modifier = Modifier.fillMaxWidth(),
                color = Background,
                tonalElevation = 0.dp
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Previous Button
                    IconButton(
                        onClick = { if (currentPage > 0) currentPage-- },
                        enabled = currentPage > 0
                    ) {
                        Icon(
                            imageVector = Icons.Default.ChevronLeft,
                            contentDescription = "Previous",
                            tint = if (currentPage > 0) Foreground else MutedForeground
                        )
                    }
                    
                    // Page Indicator
                    Text(
                        text = "Page ${currentPage + 1} of $totalPages",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Medium,
                        color = Foreground
                    )
                    
                    // Next Button
                    IconButton(
                        onClick = { if (currentPage < totalPages - 1) currentPage++ },
                        enabled = currentPage < totalPages - 1
                    ) {
                        Icon(
                            imageVector = Icons.Default.ChevronRight,
                            contentDescription = "Next",
                            tint = if (currentPage < totalPages - 1) Foreground else MutedForeground
                        )
                    }
                }
            }
        }
    }
}
