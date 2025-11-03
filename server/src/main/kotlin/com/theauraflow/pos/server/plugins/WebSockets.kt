package com.theauraflow.pos.server.plugins

import io.ktor.server.application.*
import io.ktor.server.websocket.*
import kotlin.time.Duration
import kotlin.time.Duration.Companion.seconds

/**
 * Configures WebSockets for real-time communication.
 */
fun Application.configureWebSockets() {
    install(WebSockets) {
        pingPeriod = 15.seconds
        timeout = 15.seconds
        maxFrameSize = Long.MAX_VALUE
        masking = false
    }
}
