package com.theauraflow.pos.core.util

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.map

/**
 * Extension functions for common Kotlin types.
 */

/**
 * Extension to wrap Flow emissions in Result.
 */
fun <T> Flow<T>.asResult(): Flow<Result<T>> {
    return this
        .map<T, Result<T>> { Result.success(it) }
        .catch { emit(Result.failure(it)) }
}

/**
 * Extension to check if string is a valid email.
 */
fun String.isValidEmail(): Boolean {
    return this.matches(Regex("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"))
}

/**
 * Extension to capitalize first letter of each word.
 */
fun String.toTitleCase(): String {
    return this.split(" ").joinToString(" ") { word ->
        word.lowercase().replaceFirstChar { it.uppercase() }
    }
}

/**
 * Extension to safely get or default.
 */
fun <T> List<T>.getOrDefault(index: Int, default: T): T {
    return this.getOrNull(index) ?: default
}

/**
 * Extension to remove nulls and blanks from list of strings.
 */
fun List<String?>.filterNotBlank(): List<String> {
    return this.filterNotNull().filter { it.isNotBlank() }
}