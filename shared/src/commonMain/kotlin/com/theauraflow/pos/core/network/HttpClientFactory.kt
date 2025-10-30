package com.theauraflow.pos.core.network

import com.theauraflow.pos.core.constants.AppConstants
import com.theauraflow.pos.core.util.AppLogger
import io.ktor.client.*
import io.ktor.client.plugins.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.plugins.logging.*
import io.ktor.client.plugins.websocket.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.json.Json
import kotlin.time.Duration.Companion.seconds

/**
 * Factory for creating configured Ktor HttpClient instances.
 *
 * The client is configured with:
 * - **JSON Serialization** - kotlinx.serialization for request/response handling
 * - **Content Negotiation** - Automatic content type handling
 * - **Logging** - Request/response logging for debugging
 * - **WebSockets** - Support for real-time communication
 * - **Default Headers** - Common headers for all requests
 * - **Timeout Configuration** - Request, connect, and socket timeouts
 * - **Authentication** - Bearer token interceptor (when token is available)
 *
 * Usage:
 * ```kotlin
 * val client = HttpClientFactory.create()
 * val response = client.get("https://api.example.com/data")
 * ```
 */
object HttpClientFactory {

    /**
     * Creates a configured HttpClient instance.
     *
     * @return Configured HttpClient ready for API calls
     */
    fun create(): HttpClient {
        return HttpClient {
            // JSON Serialization
            install(ContentNegotiation) {
                json(Json {
                    prettyPrint = AppConstants.FeatureFlags.DEBUG_MODE
                    isLenient = true
                    ignoreUnknownKeys = true
                    encodeDefaults = true
                })
            }

            // Logging
            install(Logging) {
                logger = object : Logger {
                    override fun log(message: String) {
                        AppLogger.d("HTTP", message)
                    }
                }
                level = if (AppConstants.FeatureFlags.DEBUG_MODE) {
                    LogLevel.BODY
                } else {
                    LogLevel.INFO
                }
            }

            // WebSockets for real-time updates
            install(WebSockets) {
                pingInterval = 20.seconds
            }

            // Default request configuration
            install(DefaultRequest) {
                // Set base URL
                url(AppConstants.API_BASE_URL)

                // Set default headers
                header(HttpHeaders.ContentType, ContentType.Application.Json)
                header(HttpHeaders.Accept, ContentType.Application.Json)
                header("X-App-Version", AppConstants.APP_VERSION)
            }

            // Timeout configuration
            install(HttpTimeout) {
                requestTimeoutMillis = AppConstants.CONNECTION_TIMEOUT_MS
                connectTimeoutMillis = AppConstants.CONNECTION_TIMEOUT_MS
                socketTimeoutMillis = AppConstants.READ_TIMEOUT_MS
            }

            // TODO: Add authentication interceptor when we implement auth
            // This will add Bearer token to requests automatically
            // install(Auth) {
            //     bearer {
            //         loadTokens {
            //             // Load tokens from secure storage
            //         }
            //     }
            // }
        }
    }
}
