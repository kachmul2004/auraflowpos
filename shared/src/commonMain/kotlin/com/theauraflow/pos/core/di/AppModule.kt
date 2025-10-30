package com.theauraflow.pos.core.di

import org.koin.core.module.Module
import org.koin.dsl.module

/**
 * Main application module that aggregates all Koin modules.
 */
val appModule = module {
    includes(
        networkModule,
        apiModule,
        dataModule,
        domainModule
    )
}
