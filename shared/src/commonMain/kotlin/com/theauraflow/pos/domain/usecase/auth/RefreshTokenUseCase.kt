package com.theauraflow.pos.domain.usecase.auth

import com.theauraflow.pos.domain.repository.AuthRepository

/**
 * Use case for refreshing authentication token
 *
 * Business Rules:
 * - Refresh token must be valid and not expired
 * - Returns new access token and refresh token
 * - Updates stored tokens automatically
 *
 * Called when:
 * - Access token expires
 * - API returns 401 Unauthorized
 * - Before making authenticated requests if token is close to expiry
 */
class RefreshTokenUseCase(
    private val authRepository: AuthRepository
) {
    /**
     * Refreshes the authentication token
     *
     * @return Result with success or error if refresh fails
     */
    suspend operator fun invoke(): Result<Unit> {
        return authRepository.refreshToken()
            .onFailure {
                // If refresh fails, user needs to re-login
                // Clear any stored tokens
                authRepository.logout()
            }
    }
}