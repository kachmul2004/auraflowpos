package com.theauraflow.pos.server.util

import kotlinx.serialization.Serializable

/**
 * Standard error response format.
 */
@Serializable
data class ErrorResponse(
    val error: String,
    val message: String,
    val statusCode: Int,
    val timestamp: Long = System.currentTimeMillis()
)

/**
 * Validation error response with field-level errors.
 */
@Serializable
data class ValidationErrorResponse(
    val error: String = "Validation Error",
    val message: String,
    val statusCode: Int = 400,
    val fieldErrors: Map<String, String>,
    val timestamp: Long = System.currentTimeMillis()
)

/**
 * Success response wrapper.
 */
@Serializable
data class SuccessResponse<T>(
    val success: Boolean = true,
    val data: T,
    val message: String? = null,
    val timestamp: Long = System.currentTimeMillis()
)

/**
 * Paginated response wrapper.
 */
@Serializable
data class PaginatedResponse<T>(
    val success: Boolean = true,
    val data: List<T>,
    val page: Int,
    val pageSize: Int,
    val totalItems: Long,
    val totalPages: Int,
    val timestamp: Long = System.currentTimeMillis()
)
