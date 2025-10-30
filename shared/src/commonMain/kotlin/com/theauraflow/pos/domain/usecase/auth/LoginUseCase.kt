package com.theauraflow.pos.domain.usecase.auth

import com.theauraflow.pos.domain.model.User
import com.theauraflow.pos.domain.repository.AuthRepository

/**
 * Use case for user login.
 *
 * Business logic:
 * - Validates email format
 * - Validates password is not empty
 * - Delegates authentication to repository
 */
class LoginUseCase(
    private val authRepository: AuthRepository
) {
    suspend operator fun invoke(email: String, password: String): Result<User> {
        // Validate email
        if (email.isBlank() || !isValidEmail(email)) {
            return Result.failure(
                IllegalArgumentException("Invalid email format")
            )
        }

        // Validate password
        if (password.isBlank()) {
            return Result.failure(
                IllegalArgumentException("Password cannot be empty")
            )
        }

        // Attempt login
        return authRepository.login(email.trim(), password)
    }

    private fun isValidEmail(email: String): Boolean {
        return email.matches(Regex("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"))
    }
}
