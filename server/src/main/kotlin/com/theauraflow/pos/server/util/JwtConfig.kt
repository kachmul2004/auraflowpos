package com.theauraflow.pos.server.util

import com.auth0.jwt.JWT
import com.auth0.jwt.JWTVerifier
import com.auth0.jwt.algorithms.Algorithm
import java.util.*

/**
 * JWT configuration for authentication.
 * Handles token generation and validation.
 */
object JwtConfig {
    // Get secret from environment variable or use default for development
    private val secret = System.getenv("JWT_SECRET") ?: "auraflow-pos-secret-change-in-production"
    private val issuer = "auraflow-pos"
    private val audience = "auraflow-clients"
    const val realm = "AuraFlow POS"

    // Token expiration times
    private const val ACCESS_TOKEN_VALIDITY = 3600000 // 1 hour
    private const val REFRESH_TOKEN_VALIDITY = 2592000000 // 30 days

    private val algorithm = Algorithm.HMAC256(secret)

    /**
     * JWT verifier for validating tokens.
     */
    val verifier: JWTVerifier = JWT
        .require(algorithm)
        .withAudience(audience)
        .withIssuer(issuer)
        .build()

    /**
     * Generate an access token for a user.
     */
    fun generateAccessToken(userId: String, email: String, role: String): String {
        return JWT.create()
            .withAudience(audience)
            .withIssuer(issuer)
            .withClaim("userId", userId)
            .withClaim("email", email)
            .withClaim("role", role)
            .withClaim("type", "access")
            .withExpiresAt(Date(System.currentTimeMillis() + ACCESS_TOKEN_VALIDITY))
            .withIssuedAt(Date())
            .sign(algorithm)
    }

    /**
     * Generate a refresh token for a user.
     */
    fun generateRefreshToken(userId: String): String {
        return JWT.create()
            .withAudience(audience)
            .withIssuer(issuer)
            .withClaim("userId", userId)
            .withClaim("type", "refresh")
            .withExpiresAt(Date(System.currentTimeMillis() + REFRESH_TOKEN_VALIDITY))
            .withIssuedAt(Date())
            .sign(algorithm)
    }

    /**
     * Extract user ID from a token.
     */
    fun getUserId(token: String): String? {
        return try {
            verifier.verify(token).getClaim("userId").asString()
        } catch (e: Exception) {
            null
        }
    }
}
