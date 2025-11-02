package com.theauraflow.pos.di

import org.koin.core.context.startKoin

/**
 * Initialize Koin for JS/Web.
 *
 * Note: Database module is not included as Room doesn't support JS yet.
 * IndexedDB implementation will be added in Phase 3.5.
 */
fun initKoin() {
    startKoin {
        modules(appModules)
    }
}
