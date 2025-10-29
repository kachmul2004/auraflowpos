package com.theauraflow.pos.server.plugins

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.cors.routing.*

/**
 * Configures CORS (Cross-Origin Resource Sharing) to allow requests
 * from different origins (especially for web clients).
 */
fun Application.configureCORS() {
    install(CORS) {
        // Allow all hosts in development, restrict in production
        val allowedHosts = System.getenv("ALLOWED_HOSTS")?.split(",") ?: listOf("*")

        if (allowedHosts.contains("*")) {
            anyHost()
        } else {
            allowedHosts.forEach { host ->
                allowHost(host, schemes = listOf("http", "https"))
            }
        }

        // Allow common headers
        allowHeader(HttpHeaders.ContentType)
        allowHeader(HttpHeaders.Authorization)
        allowHeader(HttpHeaders.Accept)
        allowHeader(HttpHeaders.AccessControlAllowOrigin)

        // Allow common methods
        allowMethod(HttpMethod.Get)
        allowMethod(HttpMethod.Post)
        allowMethod(HttpMethod.Put)
        allowMethod(HttpMethod.Delete)
        allowMethod(HttpMethod.Patch)
        allowMethod(HttpMethod.Options)

        // Allow credentials
        allowCredentials = true

        // Max age for preflight requests
        maxAgeInSeconds = 3600
    }
}
