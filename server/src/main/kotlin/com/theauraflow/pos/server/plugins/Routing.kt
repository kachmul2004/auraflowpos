package com.theauraflow.pos.server.plugins

import com.theauraflow.pos.server.routes.authRoutes
import com.theauraflow.pos.server.routes.healthRoutes
import com.theauraflow.pos.server.routes.productRoutes
import io.ktor.server.application.*
import io.ktor.server.routing.*

/**
 * Configures all API routing.
 */
fun Application.configureRouting() {
    routing {
        // Health check endpoint (no auth required)
        healthRoutes()

        // Authentication routes (login, register, etc.)
        authRoutes()

        // Protected routes
        route("/api") {
            // Product management
            productRoutes()

            // TODO: Add more routes as we implement features
            // orderRoutes()
            // customerRoutes()
            // adminRoutes()
        }
    }
}
