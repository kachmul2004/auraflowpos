package com.theauraflow.pos.data.remote.dto

import com.theauraflow.pos.domain.model.Category
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

/**
 * Data Transfer Object for Category API responses.
 */
@Serializable
data class CategoryDto(
    @SerialName("id") val id: String,
    @SerialName("name") val name: String,
    @SerialName("description") val description: String? = null,
    @SerialName("parent_category_id") val parentCategoryId: String? = null,
    @SerialName("icon") val icon: String? = null,
    @SerialName("color") val color: String? = null,
    @SerialName("sort_order") val sortOrder: Int = 0,
    @SerialName("is_active") val isActive: Boolean = true
)

/**
 * Convert CategoryDto to domain Category model.
 */
fun CategoryDto.toDomain(): Category = Category(
    id = id,
    name = name,
    description = description,
    parentCategoryId = parentCategoryId,
    icon = icon,
    color = color,
    sortOrder = sortOrder,
    isActive = isActive
)

/**
 * Convert domain Category to CategoryDto.
 */
fun Category.toDto(): CategoryDto = CategoryDto(
    id = id,
    name = name,
    description = description,
    parentCategoryId = parentCategoryId,
    icon = icon,
    color = color,
    sortOrder = sortOrder,
    isActive = isActive
)