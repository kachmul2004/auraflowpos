package com.theauraflow.pos.server.di

import com.theauraflow.pos.server.services.ProductService
import com.theauraflow.pos.server.services.impl.ProductServiceImpl
import org.koin.dsl.module

/**
 * Koin module for server-side services and repositories.
 */
val serverModule = module {
    single<ProductService> { ProductServiceImpl() }
}
