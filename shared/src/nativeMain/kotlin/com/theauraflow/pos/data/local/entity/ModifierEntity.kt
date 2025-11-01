package com.theauraflow.pos.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.theauraflow.pos.domain.model.Modifier
import kotlinx.serialization.Serializable

/**
 * Database entity for Modifier.
 */
@Entity(tableName = "modifiers")
@Serializable
data class ModifierEntity(
    @PrimaryKey
    val id: String,
    val name: String,
    val price: Double,
    val groupId: String? = null,
    val groupName: String? = null,
    val isRequired: Boolean = false
)

fun ModifierEntity.toDomain(): Modifier {
    return Modifier(
        id = id,
        name = name,
        price = price,
        groupId = groupId,
        groupName = groupName,
        isRequired = isRequired
    )
}

fun Modifier.toEntity(): ModifierEntity {
    return ModifierEntity(
        id = id,
        name = name,
        price = price,
        groupId = groupId,
        groupName = groupName,
        isRequired = isRequired
    )
}
