package com.theauraflow.pos.server.plugins

import io.ktor.server.application.*
import io.ktor.server.plugins.calllogging.*
import io.ktor.server.request.*
import org.slf4j.event.Level

/**
 * Configures call logging for debugging and monitoring.
 */
fun Application.configureCallLogging() {
    install(CallLogging) {
        level = Level.INFO
        filter { call -> call.request.path().startsWith("/api") }
        format { call ->
            val status = call.response.status()
            val httpMethod = call.request.httpMethod.value
            val path = call.request.path()
            val queryParams = call.request.queryParameters.entries()
                .joinToString { "${it.key}=${it.value}" }

            "[$httpMethod] $path${if (queryParams.isNotEmpty()) "?$queryParams" else ""} - $status"
        }
    }
}
