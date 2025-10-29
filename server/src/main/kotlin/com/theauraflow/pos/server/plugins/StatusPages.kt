package com.theauraflow.pos.server.plugins

import com.theauraflow.pos.server.util.ErrorResponse
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.response.*
import co.touchlab.kermit.Logger

/**
 * Configures status pages for error handling.
 * Catches exceptions and returns appropriate HTTP responses.
 */
fun Application.configureStatusPages() {
    val logger = Logger.withTag("StatusPages")

    install(StatusPages) {
        exception<Throwable> { call, cause ->
            logger.e(cause) { "Unhandled exception: ${cause.message}" }

            val (status, message) = when (cause) {
                is IllegalArgumentException -> HttpStatusCode.BadRequest to (cause.message
                    ?: "Bad request")

                is NoSuchElementException -> HttpStatusCode.NotFound to (cause.message
                    ?: "Resource not found")

                is SecurityException -> HttpStatusCode.Forbidden to "Access denied"
                is IllegalStateException -> HttpStatusCode.Conflict to (cause.message ?: "Conflict")
                else -> {
                    // Don't expose internal errors in production
                    val isDevelopment = System.getenv("KTOR_ENV") == "development"
                    if (isDevelopment) {
                        HttpStatusCode.InternalServerError to (cause.message
                            ?: "Internal server error")
                    } else {
                        HttpStatusCode.InternalServerError to "Internal server error"
                    }
                }
            }

            call.respond(
                status,
                ErrorResponse(
                    error = status.description,
                    message = message,
                    statusCode = status.value
                )
            )
        }

        status(HttpStatusCode.NotFound) { call, status ->
            call.respond(
                status,
                ErrorResponse(
                    error = "Not Found",
                    message = "The requested resource was not found",
                    statusCode = 404
                )
            )
        }

        status(HttpStatusCode.Unauthorized) { call, status ->
            call.respond(
                status,
                ErrorResponse(
                    error = "Unauthorized",
                    message = "Authentication required",
                    statusCode = 401
                )
            )
        }
    }
}
