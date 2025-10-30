package com.theauraflow.pos.data.repository

import com.theauraflow.pos.domain.model.User
import com.theauraflow.pos.domain.model.UserRole
import com.theauraflow.pos.domain.repository.AuthRepository
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow

/**
 * Mock implementation of AuthRepository for development and testing.
 *
 * Bypasses API calls and simulates authentication with hardcoded credentials.
 *
 * Valid credentials:
 * - Email: admin@example.com, Password: password123 (Admin User)
 * - Email: john@example.com, Password: password123 (John Cashier)
 * - Email: jane@example.com, Password: password123 (Jane Staff)
 */
class MockAuthRepository(
    private val tokenStorage: TokenStorage
) : AuthRepository {

    private val _currentUser = MutableStateFlow<User?>(null)

    private val mockUsers = listOf(
        User(
            id = "1",
            email = "admin@example.com",
            name = "Admin User",
            role = UserRole.ADMIN
        ),
        User(
            id = "2",
            email = "john@example.com",
            name = "John Cashier",
            role = UserRole.CASHIER
        ),
        User(
            id = "3",
            email = "jane@example.com",
            name = "Jane Staff",
            role = UserRole.CASHIER
        )
    )

    override fun observeCurrentUser(): Flow<User?> {
        return _currentUser.asStateFlow()
    }

    override suspend fun login(email: String, password: String): Result<User> {
        return try {
            // Simulate network delay
            delay(500)

            // Check credentials
            val user = mockUsers.find { it.email.equals(email, ignoreCase = true) }

            if (user == null) {
                return Result.failure(Exception("User not found"))
            }

            if (password != "password123") {
                return Result.failure(Exception("Invalid password"))
            }

            // Generate mock tokens
            val timestamp = "dev"
            val accessToken = "mock_access_token_${user.id}_$timestamp"
            val refreshToken = "mock_refresh_token_${user.id}_$timestamp"

            // Store tokens
            tokenStorage.saveAccessToken(accessToken)
            tokenStorage.saveRefreshToken(refreshToken)

            // Store user
            _currentUser.value = user

            Result.success(user)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun register(email: String, password: String, name: String): Result<User> {
        delay(500)
        return Result.failure(NotImplementedError("Registration not implemented in mock"))
    }

    override suspend fun logout(): Result<Unit> {
        return try {
            delay(300)

            // Clear tokens and user
            tokenStorage.clearTokens()
            _currentUser.value = null

            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getCurrentUser(): Result<User?> {
        return Result.success(_currentUser.value)
    }

    override suspend fun isLoggedIn(): Boolean {
        val hasToken = tokenStorage.getAccessToken() != null
        val hasUser = _currentUser.value != null
        return hasToken && hasUser
    }

    override suspend fun refreshToken(): Result<Unit> {
        delay(300)
        val user = _currentUser.value ?: return Result.failure(Exception("No user logged in"))

        // Generate new mock tokens
        val timestamp = "dev"
        val accessToken = "mock_access_token_${user.id}_$timestamp"
        val refreshToken = "mock_refresh_token_${user.id}_$timestamp"

        tokenStorage.saveAccessToken(accessToken)
        tokenStorage.saveRefreshToken(refreshToken)

        return Result.success(Unit)
    }

    override suspend fun updateProfile(user: User): Result<User> {
        _currentUser.value = user
        return Result.success(user)
    }

    override suspend fun changePassword(oldPassword: String, newPassword: String): Result<Unit> {
        delay(300)
        return Result.failure(NotImplementedError("Change password not implemented in mock"))
    }

    override suspend fun getAllUsers(): Result<List<User>> {
        delay(300)
        return Result.success(mockUsers)
    }

    override suspend fun deactivateUser(userId: String): Result<Unit> {
        delay(300)
        return Result.failure(NotImplementedError("Deactivate user not implemented in mock"))
    }
}