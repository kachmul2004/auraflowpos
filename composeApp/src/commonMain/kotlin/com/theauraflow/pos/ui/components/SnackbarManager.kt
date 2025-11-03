package com.theauraflow.pos.ui.components

import androidx.compose.material3.*
import androidx.compose.runtime.*
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.asSharedFlow

/**
 * Global snackbar manager for showing success/error messages
 * throughout the app without prop drilling
 */
object SnackbarController {
    private val _messages = MutableSharedFlow<SnackbarMessage>(replay = 0)
    val messages = _messages.asSharedFlow()

    suspend fun showMessage(message: String, isError: Boolean = false) {
        _messages.emit(SnackbarMessage(message, isError))
    }

    suspend fun showSuccess(message: String) {
        _messages.emit(SnackbarMessage(message, isError = false))
    }

    suspend fun showError(message: String) {
        _messages.emit(SnackbarMessage(message, isError = true))
    }
}

data class SnackbarMessage(
    val message: String,
    val isError: Boolean = false
)

/**
 * SnackbarHost wrapper that handles global snackbar messages
 */
@Composable
fun GlobalSnackbarHost(
    snackbarHostState: SnackbarHostState,
    modifier: androidx.compose.ui.Modifier = androidx.compose.ui.Modifier
) {
    // Collect messages from SnackbarController
    LaunchedEffect(Unit) {
        SnackbarController.messages.collect { message ->
            snackbarHostState.showSnackbar(
                message = message.message,
                duration = SnackbarDuration.Short,
                withDismissAction = true
            )
        }
    }

    SnackbarHost(
        hostState = snackbarHostState,
        modifier = modifier
    ) { data ->
        Snackbar(
            snackbarData = data,
            containerColor = if (data.visuals.message.contains("error", ignoreCase = true) ||
                data.visuals.message.contains("failed", ignoreCase = true)
            ) {
                MaterialTheme.colorScheme.error
            } else {
                MaterialTheme.colorScheme.primary
            }
        )
    }
}
