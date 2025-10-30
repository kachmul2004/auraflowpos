package com.theauraflow.pos.presentation.base

import com.theauraflow.pos.core.util.UiText

/**
 * Base sealed interface for UI states.
 *
 * Provides common state patterns for all screens:
 * - **Idle** - Initial state, no action taken yet
 * - **Loading** - Operation in progress
 * - **Success** - Operation completed successfully with data
 * - **Error** - Operation failed with error message
 * - **Empty** - Operation successful but no data available
 *
 * Example usage:
 * ```kotlin
 * sealed interface ProductUiState {
 *     data object Loading : ProductUiState
 *     data class Success(val products: List<Product>) : ProductUiState
 *     data class Error(val message: UiText) : ProductUiState
 *     data object Empty : ProductUiState
 * }
 * ```
 */
sealed interface UiState<out T> {

    /**
     * Initial state - no data loaded yet.
     */
    data object Idle : UiState<Nothing>

    /**
     * Loading state - operation in progress.
     *
     * @property message Optional loading message to display
     */
    data class Loading(val message: UiText? = null) : UiState<Nothing>

    /**
     * Success state - operation completed with data.
     *
     * @property data The data returned from the operation
     */
    data class Success<T>(val data: T) : UiState<T>

    /**
     * Error state - operation failed.
     *
     * @property message Error message to display to user
     * @property throwable Optional throwable for debugging
     */
    data class Error(
        val message: UiText,
        val throwable: Throwable? = null
    ) : UiState<Nothing>

    /**
     * Empty state - operation successful but no data.
     *
     * @property message Optional message explaining why it's empty
     */
    data class Empty(val message: UiText? = null) : UiState<Nothing>
}

/**
 * Extension function to check if current state is loading.
 */
fun <T> UiState<T>.isLoading(): Boolean = this is UiState.Loading

/**
 * Extension function to check if current state is success.
 */
fun <T> UiState<T>.isSuccess(): Boolean = this is UiState.Success

/**
 * Extension function to check if current state is error.
 */
fun <T> UiState<T>.isError(): Boolean = this is UiState.Error

/**
 * Extension function to get data if state is Success, null otherwise.
 */
fun <T> UiState<T>.getDataOrNull(): T? = when (this) {
    is UiState.Success -> data
    else -> null
}

/**
 * Extension function to get error message if state is Error, null otherwise.
 */
fun <T> UiState<T>.getErrorOrNull(): UiText? = when (this) {
    is UiState.Error -> message
    else -> null
}
