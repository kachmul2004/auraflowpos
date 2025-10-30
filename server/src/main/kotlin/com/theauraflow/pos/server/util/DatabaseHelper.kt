package com.theauraflow.pos.server.util

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.jetbrains.exposed.sql.transactions.transaction

/**
 * Execute a database query with proper transaction management and error handling.
 */
suspend fun <T> dbQuery(block: () -> T): T = withContext(Dispatchers.IO) {
    transaction { block() }
}

/**
 * Execute a database query with Result wrapper for error handling.
 */
suspend fun <T> dbQueryResult(block: () -> T): Result<T> = withContext(Dispatchers.IO) {
    try {
        Result.success(transaction { block() })
    } catch (e: Exception) {
        Result.failure(DatabaseException("Database operation failed: ${e.message}", e))
    }
}

/**
 * Custom exception for database errors.
 */
class DatabaseException(message: String, cause: Throwable? = null) : Exception(message, cause)

/**
 * Custom exception for not found errors.
 */
class NotFoundException(message: String) : NoSuchElementException(message)

/**
 * Custom exception for validation errors.
 */
class ValidationException(
    message: String,
    val fieldErrors: Map<String, String> = emptyMap()
) : IllegalArgumentException(message)

/**
 * Custom exception for authorization errors.
 */
class UnauthorizedException(message: String) : SecurityException(message)
