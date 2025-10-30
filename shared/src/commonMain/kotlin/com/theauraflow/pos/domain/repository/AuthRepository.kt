package com.theauraflow.pos.domain.repository

import com.theauraflow.pos.domain.model.User
import kotlinx.coroutines.flow.Flow

/**
 * Repository interface for authentication and user operations.
 *
 * Manages user login, logout, and session management.
 */
interface AuthRepository {

    /**
     * Login with email and password.
     *
     * @param email User email
     * @param password User password
     * @return Result with logged-in user or error
     */
    suspend fun login(email: String, password: String): Result<User>

    /**
     * Logout the current user.
     *
     * @return Result with success or error
     */
    suspend fun logout(): Result<Unit>

    /**
     * Register a new user.
     * Requires admin permissions.
     *
     * @param email User email
     * @param password User password
     * @param name User name
     * @return Result with created user or error
     */
    suspend fun register(
        email: String,
        password: String,
        name: String
    ): Result<User>

    /**
     * Get the currently logged-in user.
     *
     * @return Result with current user or error
     */
    suspend fun getCurrentUser(): Result<User?>

    /**
     * Observe the current user as a Flow.
     * Emits null when logged out.
     *
     * @return Flow emitting current user or null
     */
    fun observeCurrentUser(): Flow<User?>

    /**
     * Check if a user is currently logged in.
     *
     * @return True if user is logged in, false otherwise
     */
    suspend fun isLoggedIn(): Boolean

    /**
     * Refresh the authentication token.
     *
     * @return Result with success or error
     */
    suspend fun refreshToken(): Result<Unit>

    /**
     * Update user profile.
     *
     * @param user Updated user data
     * @return Result with updated user or error
     */
    suspend fun updateProfile(user: User): Result<User>

    /**
     * Change password for current user.
     *
     * @param oldPassword Current password
     * @param newPassword New password
     * @return Result with success or error
     */
    suspend fun changePassword(oldPassword: String, newPassword: String): Result<Unit>

    /**
     * Get all users (admin only).
     *
     * @return Result with list of users or error
     */
    suspend fun getAllUsers(): Result<List<User>>

    /**
     * Deactivate a user (admin only).
     *
     * @param userId User ID to deactivate
     * @return Result with success or error
     */
    suspend fun deactivateUser(userId: String): Result<Unit>
}
