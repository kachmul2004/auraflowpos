package com.theauraflow.pos.server

import com.theauraflow.pos.server.plugins.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*

fun main() {
    embeddedServer(
        factory = Netty,
        port = System.getenv("PORT")?.toIntOrNull() ?: 8080,
        host = "0.0.0.0",
        module = Application::module
    ).start(wait = true)
}

/**
 * Main application module.
 * Configures all Ktor plugins and routing.
 */
fun Application.module() {
    // Configure plugins
    configureContentNegotiation()
    configureCORS()
    configureStatusPages()
    configureWebSockets()
    configureAuthentication()
    configureCallLogging()

    // Configure routing
    configureRouting()

    // Initialize database
    configureDatabase()
}
