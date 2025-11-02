package com.theauraflow.pos.di

import com.theauraflow.pos.data.local.InMemoryLocalStorage
import com.theauraflow.pos.data.local.InMemoryWebStorage
import com.theauraflow.pos.data.local.LocalStorage
import com.theauraflow.pos.data.local.WebStorage
import com.theauraflow.pos.data.remote.api.*
import com.theauraflow.pos.data.repository.*
import com.theauraflow.pos.domain.repository.*
import org.koin.core.module.Module
import org.koin.dsl.module

/**
 * Data layer Koin module.
 *
 * Provides:
 * - LocalStorage for in-memory caching
 * - WebStorage for web platforms (IndexedDB or in-memory)
 * - API clients for remote data
 * - Repository implementations
 *
 * Note: Repositories currently use in-memory storage and API clients.
 * Database integration is available on native platforms via databaseModule.
 */
val dataModule: Module = module {

// Local Storage
    single<LocalStorage> { InMemoryLocalStorage() }

    // Web Storage (for JS/WasmJS platforms)
    single<WebStorage> { InMemoryWebStorage() }

    // Token Storage
    single<TokenStorage> { InMemoryTokenStorage() }

    // API Clients
    single { ProductApiClient(get()) }
    single { OrderApiClient(get()) }
    single { CustomerApiClient(get()) }
    single { AuthApiClient(get()) }

    // Repositories
    // Note: CartRepository must be declared before OrderRepository since OrderRepository depends on it
    single<CartRepository> { CartRepositoryImpl(get()) }
    single<ProductRepository> { ProductRepositoryImpl(get()) }
    single<OrderRepository> { OrderRepositoryImpl(get(), get(), get()) }
    single<CustomerRepository> { CustomerRepositoryImpl(get()) }
    single<AuthRepository> { AuthRepositoryImpl(get(), get()) }
}
