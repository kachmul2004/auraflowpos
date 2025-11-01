package com.theauraflow.pos.core.di

import com.theauraflow.pos.data.repository.AuthRepositoryImpl
import com.theauraflow.pos.data.repository.CartRepositoryImpl
import com.theauraflow.pos.data.repository.CustomerRepositoryImpl
import com.theauraflow.pos.data.repository.OrderRepositoryImpl
import com.theauraflow.pos.data.repository.ProductRepositoryImpl
import com.theauraflow.pos.data.repository.InMemoryTokenStorage
import com.theauraflow.pos.data.repository.TokenStorage
import com.theauraflow.pos.data.local.LocalStorage
import com.theauraflow.pos.data.local.InMemoryLocalStorage
import com.theauraflow.pos.domain.repository.AuthRepository
import com.theauraflow.pos.domain.repository.CartRepository
import com.theauraflow.pos.domain.repository.CustomerRepository
import com.theauraflow.pos.domain.repository.OrderRepository
import com.theauraflow.pos.domain.repository.ProductRepository
import org.koin.core.module.dsl.singleOf
import org.koin.dsl.bind
import org.koin.dsl.module

/**
 * Koin module for data layer dependencies.
 *
 * Provides repository implementations.
 */
val dataModule = module {
    // Token storage
    single<TokenStorage> { InMemoryTokenStorage() }

    // Local storage (mock implementation - replace with Room/DataStore later)
    single<LocalStorage> { InMemoryLocalStorage() }

    // Repositories
    singleOf(::ProductRepositoryImpl) bind ProductRepository::class
    singleOf(::CustomerRepositoryImpl) bind CustomerRepository::class
    single<OrderRepository> {
        OrderRepositoryImpl(
            orderApiClient = get(),
            cartRepository = get(),
            localStorage = get()
        )
    }
    singleOf(::AuthRepositoryImpl) bind AuthRepository::class
    single<CartRepository> {
        CartRepositoryImpl(
            localStorage = get()
        )
    }
}