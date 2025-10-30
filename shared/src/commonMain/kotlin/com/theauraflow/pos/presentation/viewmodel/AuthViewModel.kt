package com.theauraflow.pos.presentation.viewmodel

import com.theauraflow.pos.core.util.UiText
import com.theauraflow.pos.domain.model.User
import com.theauraflow.pos.domain.usecase.auth.LoginUseCase
import com.theauraflow.pos.domain.usecase.auth.LogoutUseCase
import com.theauraflow.pos.domain.usecase.auth.RefreshTokenUseCase
import com.theauraflow.pos.presentation.base.UiState
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

/**
 * ViewModel for authentication.
 */
class AuthViewModel(
    private val loginUseCase: LoginUseCase,
    private val logoutUseCase: LogoutUseCase,
    private val refreshTokenUseCase: RefreshTokenUseCase,
    private val viewModelScope: CoroutineScope
) {
    private val _authState = MutableStateFlow<UiState<User>>(UiState.Idle)
    val authState: StateFlow<UiState<User>> = _authState.asStateFlow()

    private val _currentUser = MutableStateFlow<User?>(null)
    val currentUser: StateFlow<User?> = _currentUser.asStateFlow()

    private val _isLoggedIn = MutableStateFlow(false)
    val isLoggedIn: StateFlow<Boolean> = _isLoggedIn.asStateFlow()

    /**
     * Login with email and password.
     */
    fun login(email: String, password: String) {
        viewModelScope.launch(Dispatchers.Default) {
            _authState.value = UiState.Loading()

            // Validate inputs
            if (email.isBlank() || password.isBlank()) {
                _authState.value = UiState.Error(
                    UiText.DynamicString("Email and password are required")
                )
                return@launch
            }

            loginUseCase(email, password)
                .onSuccess { user ->
                    _currentUser.value = user
                    _isLoggedIn.value = true
                    _authState.value = UiState.Success(user)
                }
                .onFailure { error ->
                    _authState.value = UiState.Error(
                        UiText.DynamicString(error.message ?: "Login failed")
                    )
                }
        }
    }

    /**
     * Logout current user.
     */
    fun logout() {
        viewModelScope.launch(Dispatchers.Default) {
            logoutUseCase()
                .onSuccess {
                    _currentUser.value = null
                    _isLoggedIn.value = false
                    _authState.value = UiState.Idle
                }
                .onFailure { error ->
                    // Still clear local state even if API call fails
                    _currentUser.value = null
                    _isLoggedIn.value = false
                    _authState.value = UiState.Error(
                        UiText.DynamicString(error.message ?: "Logout failed")
                    )
                }
        }
    }

    /**
     * Refresh authentication token.
     */
    fun refreshToken() {
        viewModelScope.launch(Dispatchers.Default) {
            refreshTokenUseCase()
                .onFailure {
                    // Token refresh failed, need to re-login
                    logout()
                }
        }
    }

    /**
     * Clear auth state errors.
     */
    fun clearError() {
        if (_authState.value is UiState.Error) {
            _authState.value = UiState.Idle
        }
    }
}