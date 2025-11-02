package com.theauraflow.pos.domain.model

import kotlinx.serialization.Serializable

/**
 * Domain model representing a restaurant table.
 */
@Serializable
data class Table(
    val id: String,
    val number: Int,
    val section: String? = null,
    val seats: Int,
    val status: TableStatus,
    val server: String? = null,
    val currentOrderId: String? = null
)

/**
 * Status of a restaurant table.
 */
@Serializable
enum class TableStatus {
    AVAILABLE,
    OCCUPIED,
    RESERVED,
    CLEANING
}
