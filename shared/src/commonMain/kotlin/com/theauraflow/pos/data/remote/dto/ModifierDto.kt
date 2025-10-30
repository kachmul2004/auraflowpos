package com.theauraflow.pos.data.remote.dto

import com.theauraflow.pos.domain.model.Modifier
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

/**
 * Data Transfer Object for Modifier API responses.
 */
@Serializable
data class ModifierDto(
    @SerialName("id") val id: String,
    @SerialName("name") val name: String,
    @SerialName("price") val price: Double,
    @SerialName("group_id") val groupId: String? = null,
    @SerialName("group_name") val groupName: String? = null,
    @SerialName("is_required") val isRequired: Boolean = false
)

/**
 * Convert ModifierDto to domain Modifier model.
 */
fun ModifierDto.toDomain(): Modifier = Modifier(
    id = id,
    name = name,
    price = price,
    groupId = groupId,
    groupName = groupName,
    isRequired = isRequired
)

/**
 * Convert domain Modifier to ModifierDto.
 */
fun Modifier.toDto(): ModifierDto = ModifierDto(
    id = id,
    name = name,
    price = price,
    groupId = groupId,
    groupName = groupName,
    isRequired = isRequired
)