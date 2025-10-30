package com.theauraflow.pos.domain.model

import kotlinx.serialization.Serializable

/**
 * Domain model representing a product category.
 *
 * Categories help organize products in the POS system.
 */
@Serializable
data class Category(
    val id: String,
    val name: String,
    val description: String? = null,
    val color: String? = null,
    val icon: String? = null,
    val sortOrder: Int = 0,
    val isActive: Boolean = true,
    val parentCategoryId: String? = null
) {
    /**
     * Check if this is a root category (no parent).
     */
    val isRootCategory: Boolean
        get() = parentCategoryId == null

    /**
     * Check if this is a subcategory.
     */
    val isSubCategory: Boolean
        get() = parentCategoryId != null
}
