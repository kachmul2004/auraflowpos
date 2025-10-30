package com.theauraflow.pos.data.repository

import com.theauraflow.pos.data.remote.api.AuthApiClient
import com.theauraflow.pos.data.remote.dto.toDomain
import com.theauraflow.pos.domain.model.User
import com.theauraflow.pos.domain.repository.AuthRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow

/**
 * Implementation of AuthRepository.
 *
 * Handles authentication and session management.
 */
class AuthRepositoryImpl(
    private val apiClient: AuthApiClient,
    private val tokenStorage: TokenStorage
) : AuthRepository {

    private val _currentUser = MutableStateFlow<User?>(null)

    override fun observeCurrentUser(): Flow<User?> {
        return _currentUser.asStateFlow()
    }

    override suspend fun login(email: String, password: String): Result<User> {
        return try {
            val response = apiClient.login(email, password)

            // Store tokens
            tokenStorage.saveAccessToken(response.accessToken)
            tokenStorage.saveRefreshToken(response.refreshToken)

            // Store user
            val user = response.user.toDomain()
            _currentUser.value = user

            Result.success(user)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun register(
        email: String,
        password: String,
        name: String
    ): Result<User> {
        return try {
            val response = apiClient.register(email, email, password, name)
            val user = response.user.toDomain()
            Result.success(user)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun logout(): Result<Unit> {
        return try {
            apiClient.logout()

            // Clear tokens and user
            tokenStorage.clearTokens()
            _currentUser.value = null

            Result.success(Unit)
        } catch (e: Exception) {
            // Even if API call fails, clear local data
            tokenStorage.clearTokens()
            _currentUser.value = null
            Result.success(Unit)
        }
    }

    override suspend fun getCurrentUser(): Result<User?> {
        return try {
            // Return cached user if available
            _currentUser.value?.let {
                return Result.success(it)
            }

            // Fetch from API
            val dto = apiClient.getCurrentUser()
            val user = dto.toDomain()
            _currentUser.value = user

            Result.success(user)
        } catch (e: Exception) {
            Result.success(null)
        }
    }

    override suspend fun isLoggedIn(): Boolean {
        val hasToken = tokenStorage.getAccessToken() != null
        val hasUser = _currentUser.value != null
        return hasToken && hasUser
    }

    override suspend fun refreshToken(): Result<Unit> {
        return try {
            val refreshToken = tokenStorage.getRefreshToken()
                ?: return Result.failure(IllegalStateException("No refresh token available"))

            val response = apiClient.refreshToken(refreshToken)

            // Update tokens
            tokenStorage.saveAccessToken(response.accessToken)
            tokenStorage.saveRefreshToken(response.refreshToken)

            Result.success(Unit)
        } catch (e: Exception) {
            // If refresh fails, clear tokens
            tokenStorage.clearTokens()
            _currentUser.value = null
            Result.failure(e)
        }
    }

    override suspend fun updateProfile(user: User): Result<User> {
        return try {
            // Update via API (would need updateProfile endpoint on AuthApiClient)
            // For now, just update cache
            _currentUser.value = user
            Result.success(user)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun changePassword(
        oldPassword: String,
        newPassword: String
    ): Result<Unit> {
        return try {
            apiClient.changePassword(oldPassword, newPassword)
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getAllUsers(): Result<List<User>> {
        return try {
            // Would need getAllUsers endpoint on AuthApiClient
            Result.failure(NotImplementedError("getAllUsers not implemented"))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun deactivateUser(userId: String): Result<Unit> {
        return try {
            // Would need deactivateUser endpoint on AuthApiClient
            Result.failure(NotImplementedError("deactivateUser not implemented"))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}

/**
 * Interface for token storage.
 * Platform-specific implementations will handle secure storage.
 */
interface TokenStorage {
    fun saveAccessToken(token: String)
    fun saveRefreshToken(token: String)
    fun getAccessToken(): String?
    fun getRefreshToken(): String?
    fun clearTokens()
}