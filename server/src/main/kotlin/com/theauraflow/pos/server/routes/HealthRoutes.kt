package com.theauraflow.pos.server.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable

/**
 * Health check routes for monitoring.
 */
fun Route.healthRoutes() {
    route("/health") {
        get {
            call.respond(
                HttpStatusCode.OK,
                HealthCheckResponse(
                    status = "UP",
                    timestamp = System.currentTimeMillis(),
                    version = "1.0.0"
                )
            )
        }

        get("/ready") {
            // Check if all services are ready (database, redis, etc.)
            // For now, just return OK
            call.respond(
                HttpStatusCode.OK,
                mapOf(
                    "status" to "READY",
                    "database" to "OK",
                    "timestamp" to System.currentTimeMillis()
                )
            )
        }

        get("/live") {
            // Liveness probe - server is running
            call.respond(HttpStatusCode.OK, mapOf("status" to "ALIVE"))
        }
    }
}

@Serializable
data class HealthCheckResponse(
    val status: String,
    val timestamp: Long,
    val version: String
)
