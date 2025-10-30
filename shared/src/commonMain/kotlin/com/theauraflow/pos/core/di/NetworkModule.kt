package com.theauraflow.pos.core.di

import com.theauraflow.pos.core.network.HttpClientFactory
import io.ktor.client.*
import org.koin.dsl.module

/**
 * Network module providing HTTP client and API services.
 *
 * This module provides:
 * - Configured Ktor HttpClient
 * - API service interfaces
 * - Network utilities
 *
 * The HttpClient is configured with:
 * - JSON serialization
 * - Authentication interceptor
 * - Logging
 * - Error handling
 */
val networkModule = module {
    // Provide single HttpClient instance
    single<HttpClient> {
        HttpClientFactory.create()
    }

    // API services will be added here as we create them
    // Example: single<ProductApi> { ProductApiImpl(get()) }
}
