package com.theauraflow.pos.data.remote.api

import com.theauraflow.pos.data.remote.dto.LoginRequest
import com.theauraflow.pos.data.remote.dto.LoginResponse
import com.theauraflow.pos.data.remote.dto.RefreshTokenRequest
import com.theauraflow.pos.data.remote.dto.RefreshTokenResponse
import com.theauraflow.pos.data.remote.dto.RegisterRequest
import com.theauraflow.pos.data.remote.dto.RegisterResponse
import com.theauraflow.pos.data.remote.dto.UserDto
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.request.get
import io.ktor.client.request.post
import io.ktor.client.request.put
import io.ktor.client.request.setBody

/**
 * API client for authentication-related endpoints.
 */
class AuthApiClient(
    private val client: HttpClient
) {
    /**
     * Login with username and password.
     */
    suspend fun login(username: String, password: String): LoginResponse {
        return client.post("api/auth/login") {
            setBody(LoginRequest(username, password))
        }.body()
    }

    /**
     * Register a new user.
     */
    suspend fun register(
        username: String,
        email: String,
        password: String,
        fullName: String
    ): RegisterResponse {
        return client.post("api/auth/register") {
            setBody(RegisterRequest(username, email, password, fullName))
        }.body()
    }

    /**
     * Refresh access token using refresh token.
     */
    suspend fun refreshToken(refreshToken: String): RefreshTokenResponse {
        return client.post("api/auth/refresh") {
            setBody(RefreshTokenRequest(refreshToken))
        }.body()
    }

    /**
     * Logout (invalidate tokens).
     */
    suspend fun logout() {
        client.post("api/auth/logout")
    }

    /**
     * Get current user profile.
     */
    suspend fun getCurrentUser(): UserDto {
        return client.get("api/auth/me").body()
    }

    /**
     * Change password.
     */
    suspend fun changePassword(currentPassword: String, newPassword: String) {
        client.put("api/auth/password") {
            setBody(
                mapOf(
                    "current_password" to currentPassword,
                    "new_password" to newPassword
                )
            )
        }
    }

    /**
     * Verify if token is valid.
     */
    suspend fun verifyToken(): Boolean {
        return try {
            client.get("api/auth/verify")
            true
        } catch (e: Exception) {
            false
        }
    }
}