package com.theauraflow.pos.core.di

import com.theauraflow.pos.domain.repository.ProductRepository
import com.theauraflow.pos.domain.repository.CustomerRepository
import com.theauraflow.pos.domain.repository.AuthRepository
import com.theauraflow.pos.data.repository.MockProductRepository
import com.theauraflow.pos.data.repository.MockCustomerRepository
import com.theauraflow.pos.data.repository.MockAuthRepository
import com.theauraflow.pos.data.repository.InMemoryTokenStorage
import com.theauraflow.pos.data.repository.TokenStorage
import org.koin.dsl.module

val mockDataModule = module {
    // Provide TokenStorage for mocks
    single<TokenStorage> { InMemoryTokenStorage() }

    // Bind mock implementations
    single<ProductRepository> { MockProductRepository() }
    single<CustomerRepository> { MockCustomerRepository() }
    single<AuthRepository> { MockAuthRepository(get()) }
    // Add more mock bindings (modifiers etc.) if used in DI
}
