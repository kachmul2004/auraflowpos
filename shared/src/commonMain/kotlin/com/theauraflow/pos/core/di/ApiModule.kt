package com.theauraflow.pos.core.di

import com.theauraflow.pos.data.remote.api.AuthApiClient
import com.theauraflow.pos.data.remote.api.CategoryApiClient
import com.theauraflow.pos.data.remote.api.CustomerApiClient
import com.theauraflow.pos.data.remote.api.OrderApiClient
import com.theauraflow.pos.data.remote.api.ProductApiClient
import org.koin.core.module.dsl.singleOf
import org.koin.dsl.module

/**
 * Koin module for API client dependencies.
 *
 * Provides all API clients with HttpClient.
 */
val apiModule = module {
    // API Clients
    singleOf(::ProductApiClient)
    singleOf(::CategoryApiClient)
    singleOf(::OrderApiClient)
    singleOf(::CustomerApiClient)
    singleOf(::AuthApiClient)
}