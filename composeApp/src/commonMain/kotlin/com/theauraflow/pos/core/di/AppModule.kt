package com.theauraflow.pos.core.di

/**
 * Deprecated: Local DI module for composeApp has been removed in favor of the shared KMP DI.
 *
 * The application now initializes Koin via `shared/src/commonMain/.../KoinInitializer.kt` and
 * uses the shared `appModule` declared in `shared/src/commonMain/.../core/di/AppModule.kt`.
 *
 * This file is intentionally left without any Koin definitions to avoid conflicting symbols
 * (e.g., another `appModule`) across modules.
 *
 * Do not add Koin modules here. Add modules under `shared/src/commonMain/kotlin/com/theauraflow/pos/core/di/` instead
 * and include them from the shared `appModule`.
 */
