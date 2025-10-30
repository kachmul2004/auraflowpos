package com.theauraflow.pos.core.di

import com.theauraflow.pos.data.repository.AuthRepositoryImpl
import com.theauraflow.pos.data.repository.CartRepositoryImpl
import com.theauraflow.pos.data.repository.CustomerRepositoryImpl
import com.theauraflow.pos.data.repository.OrderRepositoryImpl
import com.theauraflow.pos.data.repository.ProductRepositoryImpl
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
    // Repositories
    singleOf(::ProductRepositoryImpl) bind ProductRepository::class
    singleOf(::CustomerRepositoryImpl) bind CustomerRepository::class
    singleOf(::OrderRepositoryImpl) bind OrderRepository::class
    singleOf(::AuthRepositoryImpl) bind AuthRepository::class
    singleOf(::CartRepositoryImpl) bind CartRepository::class
}