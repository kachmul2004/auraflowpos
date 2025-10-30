package com.theauraflow.pos.data.repository

/**
 * Simple in-memory TokenStorage implementation for all platforms.
 *
 * Note: Tokens won't persist across app restarts. Replace with a
 * platform-specific secure storage (e.g., EncryptedSharedPreferences on Android,
 * Keychain on iOS) when persistence is needed.
 */
class InMemoryTokenStorage : TokenStorage {
    private var accessToken: String? = null
    private var refreshToken: String? = null

    override fun saveAccessToken(token: String) {
        accessToken = token
    }

    override fun saveRefreshToken(token: String) {
        refreshToken = token
    }

    override fun getAccessToken(): String? = accessToken

    override fun getRefreshToken(): String? = refreshToken

    override fun clearTokens() {
        accessToken = null
        refreshToken = null
    }
}

