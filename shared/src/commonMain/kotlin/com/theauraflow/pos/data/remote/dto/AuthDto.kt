package com.theauraflow.pos.data.remote.dto

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

/**
 * Login request DTO.
 */
@Serializable
data class LoginRequest(
    @SerialName("username") val username: String,
    @SerialName("password") val password: String
)

/**
 * Login response DTO.
 */
@Serializable
data class LoginResponse(
    @SerialName("access_token") val accessToken: String,
    @SerialName("refresh_token") val refreshToken: String,
    @SerialName("token_type") val tokenType: String = "Bearer",
    @SerialName("expires_in") val expiresIn: Long,
    @SerialName("user") val user: UserDto
)

/**
 * Token refresh request DTO.
 */
@Serializable
data class RefreshTokenRequest(
    @SerialName("refresh_token") val refreshToken: String
)

/**
 * Token refresh response DTO.
 */
@Serializable
data class RefreshTokenResponse(
    @SerialName("access_token") val accessToken: String,
    @SerialName("refresh_token") val refreshToken: String,
    @SerialName("token_type") val tokenType: String = "Bearer",
    @SerialName("expires_in") val expiresIn: Long
)

/**
 * Register request DTO.
 */
@Serializable
data class RegisterRequest(
    @SerialName("username") val username: String,
    @SerialName("email") val email: String,
    @SerialName("password") val password: String,
    @SerialName("full_name") val fullName: String
)

/**
 * Register response DTO.
 */
@Serializable
data class RegisterResponse(
    @SerialName("user") val user: UserDto,
    @SerialName("message") val message: String
)