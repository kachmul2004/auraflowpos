package com.theauraflow.pos.server

import com.theauraflow.pos.server.plugins.*
import com.theauraflow.pos.server.di.serverModule
import com.theauraflow.pos.di.appModules
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import org.koin.core.context.startKoin

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
 * Configures DI, Ktor plugins, routing, and database.
 */
fun Application.module() {
    // Start Koin DI with shared modules + server module
    startKoin {
        allowOverride(true)
        modules(appModules + listOf(serverModule))
    }

    // Configure plugins
    configureContentNegotiation()
    configureCORS()
    configureStatusPages()
    configureWebSockets()
    configureAuthentication()
    configureCallLogging()

    // Configure routing
    configureRouting()

    // Initialize database (PostgreSQL via Exposed)
    configureDatabase()
}
