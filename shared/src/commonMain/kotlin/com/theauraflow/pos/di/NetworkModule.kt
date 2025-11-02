package com.theauraflow.pos.di

import io.ktor.client.*
import io.ktor.client.plugins.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.plugins.logging.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.json.Json
import org.koin.core.module.Module
import org.koin.dsl.module

/**
 * Network module providing HttpClient configuration.
 */
val networkModule: Module = module {

    single {
        HttpClient {
            // Content negotiation for JSON
            install(ContentNegotiation) {
                json(Json {
                    prettyPrint = true
                    isLenient = true
                    ignoreUnknownKeys = true
                })
            }

            // Logging
            install(Logging) {
                logger = Logger.DEFAULT
                level = LogLevel.INFO
            }

            // Timeout configuration
            install(HttpTimeout) {
                requestTimeoutMillis = 30_000
                connectTimeoutMillis = 30_000
                socketTimeoutMillis = 30_000
            }

            // Default request configuration
            defaultRequest {
                url {
                    // TODO: Configure base URL from environment or config
                    host = "api.auraflow.com"
                    protocol = io.ktor.http.URLProtocol.HTTPS
                }
            }
        }
    }
}
