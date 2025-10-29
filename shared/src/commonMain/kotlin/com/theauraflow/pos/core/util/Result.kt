package com.theauraflow.pos.core.util

/**
 * Type alias for Kotlin's built-in Result class.
 * Represents the outcome of an operation that can either succeed or fail.
 */
typealias AppResult<T> = Result<T>

/**
 * Extension function to convert Throwable to UiText for user-friendly error messages.
 */
fun Throwable.toUiText(): UiText {
    return when (this) {
        is NetworkException -> UiText.StringResource("error_network")
        is DatabaseException -> UiText.StringResource("error_database")
        is ValidationException -> UiText.DynamicString(message ?: "Validation error")
        else -> UiText.DynamicString(message ?: "Unknown error occurred")
    }
}

/**
 * Extension to map Result<T> to Result<R>
 */
inline fun <T, R> Result<T>.mapResult(transform: (T) -> R): Result<R> {
    return fold(
        onSuccess = { Result.success(transform(it)) },
        onFailure = { Result.failure(it) }
    )
}

/**
 * Extension to flatMap Result<T> to Result<R>
 */
inline fun <T, R> Result<T>.flatMapResult(transform: (T) -> Result<R>): Result<R> {
    return fold(
        onSuccess = { transform(it) },
        onFailure = { Result.failure(it) }
    )
}

// Custom exceptions for domain-specific errors
class NetworkException(message: String, cause: Throwable? = null) : Exception(message, cause)
class DatabaseException(message: String, cause: Throwable? = null) : Exception(message, cause)
class ValidationException(message: String) : Exception(message)
class UnauthorizedException(message: String = "Unauthorized access") : Exception(message)
class NotFoundException(message: String = "Resource not found") : Exception(message)