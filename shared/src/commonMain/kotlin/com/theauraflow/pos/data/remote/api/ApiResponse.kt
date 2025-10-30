package com.theauraflow.pos.data.remote.api

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

/**
 * Generic API success response wrapper.
 */
@Serializable
data class ApiSuccessResponse<T>(
    @SerialName("success") val success: Boolean = true,
    @SerialName("data") val data: T,
    @SerialName("message") val message: String? = null,
    @SerialName("timestamp") val timestamp: Long
)

/**
 * Generic API error response wrapper.
 */
@Serializable
data class ApiErrorResponse(
    @SerialName("error") val error: String,
    @SerialName("message") val message: String,
    @SerialName("status_code") val statusCode: Int,
    @SerialName("timestamp") val timestamp: Long
)

/**
 * Validation error response with field-specific errors.
 */
@Serializable
data class ValidationErrorResponse(
    @SerialName("error") val error: String = "Validation Error",
    @SerialName("message") val message: String,
    @SerialName("status_code") val statusCode: Int = 400,
    @SerialName("field_errors") val fieldErrors: Map<String, String>,
    @SerialName("timestamp") val timestamp: Long
)