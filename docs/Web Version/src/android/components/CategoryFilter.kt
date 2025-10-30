package com.auraflow.pos.components

import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import com.auraflow.pos.models.Category
import com.auraflow.pos.theme.*

/**
 * Category filter chips
 */

@Composable
fun CategoryFilter(
    categories: List<String>,
    selectedCategory: String?,
    onCategorySelected: (String?) -> Unit,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .horizontalScroll(rememberScrollState())
            .padding(horizontal = 12.dp, vertical = 8.dp),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        // All Categories chip
        FilterChip(
            selected = selectedCategory == null,
            onClick = { onCategorySelected(null) },
            label = { Text("All") },
            leadingIcon = {
                Icon(
                    imageVector = Icons.Default.Apps,
                    contentDescription = null,
                    modifier = Modifier.size(18.dp)
                )
            },
            colors = FilterChipDefaults.filterChipColors(
                containerColor = if (selectedCategory == null) Primary else Secondary,
                labelColor = if (selectedCategory == null) PrimaryForeground else Foreground,
                selectedContainerColor = Primary,
                selectedLabelColor = PrimaryForeground
            ),
            border = FilterChipDefaults.filterChipBorder(
                borderColor = Border,
                selectedBorderColor = Primary
            )
        )
        
        // Individual category chips
        categories.forEach { category ->
            FilterChip(
                selected = selectedCategory == category,
                onClick = { onCategorySelected(category) },
                label = { Text(category) },
                leadingIcon = {
                    Icon(
                        imageVector = getCategoryIcon(category),
                        contentDescription = null,
                        modifier = Modifier.size(18.dp)
                    )
                },
                colors = FilterChipDefaults.filterChipColors(
                    containerColor = if (selectedCategory == category) Primary else Secondary,
                    labelColor = if (selectedCategory == category) PrimaryForeground else Foreground,
                    selectedContainerColor = Primary,
                    selectedLabelColor = PrimaryForeground
                ),
                border = FilterChipDefaults.filterChipBorder(
                    borderColor = Border,
                    selectedBorderColor = Primary
                )
            )
        }
    }
}
