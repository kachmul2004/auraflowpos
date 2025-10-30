package com.theauraflow.pos.server.routes

import at.favre.lib.crypto.bcrypt.BCrypt
import com.theauraflow.pos.server.database.tables.UserRole
import com.theauraflow.pos.server.database.tables.UsersTable
import com.theauraflow.pos.server.util.*
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll
import java.util.*

/**
 * Authentication routes.
 */
fun Route.authRoutes() {
    route("/api/auth") {

        // Login endpoint
        post("/login") {
            val request = call.receive<LoginRequest>()

            // Validate input
            if (request.email.isBlank() || request.password.isBlank()) {
                call.respond(
                    HttpStatusCode.BadRequest,
                    ErrorResponse("Bad Request", "Email and password are required", 400)
                )
                return@post
            }

            // Find user by email
            val user = dbQuery {
                UsersTable.selectAll()
                    .where { UsersTable.email eq request.email }
                    .singleOrNull()
            }

            if (user == null) {
                call.respond(
                    HttpStatusCode.Unauthorized,
                    ErrorResponse("Unauthorized", "Invalid email or password", 401)
                )
                return@post
            }

            // Verify password
            val passwordHash = user[UsersTable.passwordHash]
            val passwordMatches = BCrypt.verifyer().verify(
                request.password.toCharArray(),
                passwordHash.toCharArray()
            ).verified

            if (!passwordMatches) {
                call.respond(
                    HttpStatusCode.Unauthorized,
                    ErrorResponse("Unauthorized", "Invalid email or password", 401)
                )
                return@post
            }

            // Check if user is active
            if (!user[UsersTable.isActive]) {
                call.respond(
                    HttpStatusCode.Forbidden,
                    ErrorResponse("Forbidden", "Account is inactive", 403)
                )
                return@post
            }

            // Generate tokens
            val userId = user[UsersTable.id]
            val email = user[UsersTable.email]
            val role = user[UsersTable.role]

            val accessToken = JwtConfig.generateAccessToken(userId, email, role)
            val refreshToken = JwtConfig.generateRefreshToken(userId)

            call.respond(
                HttpStatusCode.OK,
                LoginResponse(
                    accessToken = accessToken,
                    refreshToken = refreshToken,
                    user = UserInfo(
                        id = userId,
                        email = email,
                        name = user[UsersTable.name],
                        role = role
                    )
                )
            )
        }

        // Register endpoint
        post("/register") {
            val request = call.receive<RegisterRequest>()

            // Validate input
            val fieldErrors = mutableMapOf<String, String>()
            if (request.email.isBlank()) fieldErrors["email"] = "Email is required"
            if (request.password.isBlank()) fieldErrors["password"] = "Password is required"
            if (request.password.length < 6) fieldErrors["password"] =
                "Password must be at least 6 characters"
            if (request.name.isBlank()) fieldErrors["name"] = "Name is required"
            if (UserRole.fromString(request.role) == null) fieldErrors["role"] = "Invalid role"

            if (fieldErrors.isNotEmpty()) {
                call.respond(
                    HttpStatusCode.BadRequest,
                    ValidationErrorResponse(
                        message = "Validation failed",
                        fieldErrors = fieldErrors
                    )
                )
                return@post
            }

            // Check if user already exists
            val existingUser = dbQuery {
                UsersTable.selectAll()
                    .where { UsersTable.email eq request.email }
                    .singleOrNull()
            }

            if (existingUser != null) {
                call.respond(
                    HttpStatusCode.Conflict,
                    ErrorResponse("Conflict", "User with this email already exists", 409)
                )
                return@post
            }

            // Hash password
            val passwordHash =
                BCrypt.withDefaults().hashToString(12, request.password.toCharArray())

            // Create user
            val userId = UUID.randomUUID().toString()
            dbQuery {
                UsersTable.insert {
                    it[id] = userId
                    it[email] = request.email
                    it[UsersTable.passwordHash] = passwordHash
                    it[name] = request.name
                    it[role] = request.role.uppercase()
                }
            }

            // Generate tokens
            val accessToken = JwtConfig.generateAccessToken(userId, request.email, request.role)
            val refreshToken = JwtConfig.generateRefreshToken(userId)

            call.respond(
                HttpStatusCode.Created,
                LoginResponse(
                    accessToken = accessToken,
                    refreshToken = refreshToken,
                    user = UserInfo(
                        id = userId,
                        email = request.email,
                        name = request.name,
                        role = request.role.uppercase()
                    )
                )
            )
        }

        // Refresh token endpoint
        post("/refresh") {
            val request = call.receive<RefreshTokenRequest>()

            // Validate refresh token
            val userId = JwtConfig.getUserId(request.refreshToken)
            if (userId == null) {
                call.respond(
                    HttpStatusCode.Unauthorized,
                    ErrorResponse("Unauthorized", "Invalid refresh token", 401)
                )
                return@post
            }

            // Get user info
            val user = dbQuery {
                UsersTable.selectAll()
                    .where { (UsersTable.id eq userId) and (UsersTable.isActive eq true) }
                    .singleOrNull()
            }

            if (user == null) {
                call.respond(
                    HttpStatusCode.Unauthorized,
                    ErrorResponse("Unauthorized", "User not found or inactive", 401)
                )
                return@post
            }

            // Generate new tokens
            val accessToken = JwtConfig.generateAccessToken(
                userId,
                user[UsersTable.email],
                user[UsersTable.role]
            )
            val newRefreshToken = JwtConfig.generateRefreshToken(userId)

            call.respond(
                HttpStatusCode.OK,
                RefreshTokenResponse(
                    accessToken = accessToken,
                    refreshToken = newRefreshToken
                )
            )
        }
    }
}

@Serializable
data class LoginRequest(
    val email: String,
    val password: String
)

@Serializable
data class RegisterRequest(
    val email: String,
    val password: String,
    val name: String,
    val role: String
)

@Serializable
data class RefreshTokenRequest(
    val refreshToken: String
)

@Serializable
data class LoginResponse(
    val accessToken: String,
    val refreshToken: String,
    val user: UserInfo
)

@Serializable
data class RefreshTokenResponse(
    val accessToken: String,
    val refreshToken: String
)

@Serializable
data class UserInfo(
    val id: String,
    val email: String,
    val name: String,
    val role: String
)
