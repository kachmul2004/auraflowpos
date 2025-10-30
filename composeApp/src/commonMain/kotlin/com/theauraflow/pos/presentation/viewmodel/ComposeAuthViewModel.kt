package com.theauraflow.pos.presentation.viewmodel

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

data class User(val id: String, val name: String, val email: String)

/**
 * ViewModel for managing authentication state
 */
class ComposeAuthViewModel : ViewModel() {
    private val _isLoggedIn = MutableStateFlow(false)
    val isLoggedIn: StateFlow<Boolean> = _isLoggedIn.asStateFlow()

    private val _authState = MutableStateFlow<AuthState>(AuthState.Idle)
    val authState: StateFlow<AuthState> = _authState.asStateFlow()

    private val _currentUser = MutableStateFlow<User?>(null)
    val currentUser: StateFlow<User?> = _currentUser.asStateFlow()

    fun login(email: String, password: String) {
        _authState.value = AuthState.Loading
        // TODO: Implement actual authentication logic
        // Simulating successful login
        _currentUser.value = User(
            id = "user_1",
            name = "Test User",
            email = email
        )
        _isLoggedIn.value = true
        _authState.value = AuthState.Success
    }

    fun logout() {
        _isLoggedIn.value = false
        _currentUser.value = null
        _authState.value = AuthState.Idle
    }
}

sealed class AuthState {
    object Idle : AuthState()
    object Loading : AuthState()
    object Success : AuthState()
    data class Error(val message: String) : AuthState()
}
