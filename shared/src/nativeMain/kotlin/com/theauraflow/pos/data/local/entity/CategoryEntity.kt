package com.theauraflow.pos.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.theauraflow.pos.domain.model.Category
import kotlinx.serialization.Serializable

/**
 * Database entity for Category.
 */
@Entity(tableName = "categories")
@Serializable
data class CategoryEntity(
    @PrimaryKey
    val id: String,
    val name: String,
    val description: String? = null,
    val color: String? = null,
    val icon: String? = null,
    val sortOrder: Int = 0,
    val isActive: Boolean = true,
    val parentCategoryId: String? = null
)

fun CategoryEntity.toDomain(): Category {
    return Category(
        id = id,
        name = name,
        description = description,
        color = color,
        icon = icon,
        sortOrder = sortOrder,
        isActive = isActive,
        parentCategoryId = parentCategoryId
    )
}

fun Category.toEntity(): CategoryEntity {
    return CategoryEntity(
        id = id,
        name = name,
        description = description,
        color = color,
        icon = icon,
        sortOrder = sortOrder,
        isActive = isActive,
        parentCategoryId = parentCategoryId
    )
}
