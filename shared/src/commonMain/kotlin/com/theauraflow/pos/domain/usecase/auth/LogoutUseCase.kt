package com.theauraflow.pos.domain.usecase.auth

import com.theauraflow.pos.domain.repository.AuthRepository
import com.theauraflow.pos.domain.repository.CartRepository

/**
 * Use case for user logout.
 *
 * Business logic:
 * - Logs out the current user
 * - Clears the shopping cart
 * - Cleans up session data
 */
class LogoutUseCase(
    private val authRepository: AuthRepository,
    private val cartRepository: CartRepository
) {
    suspend operator fun invoke(): Result<Unit> {
        // Clear cart before logout
        cartRepository.clearCart()

        // Logout
        return authRepository.logout()
    }
}
