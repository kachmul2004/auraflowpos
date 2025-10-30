package com.theauraflow.pos.core.di

import com.theauraflow.pos.domain.usecase.auth.LoginUseCase
import com.theauraflow.pos.domain.usecase.auth.LogoutUseCase
import com.theauraflow.pos.domain.usecase.auth.RefreshTokenUseCase
import com.theauraflow.pos.domain.usecase.cart.AddToCartUseCase
import com.theauraflow.pos.domain.usecase.cart.ApplyDiscountUseCase
import com.theauraflow.pos.domain.usecase.cart.ClearCartUseCase
import com.theauraflow.pos.domain.usecase.cart.GetCartTotalsUseCase
import com.theauraflow.pos.domain.usecase.cart.HoldCartUseCase
import com.theauraflow.pos.domain.usecase.cart.RemoveFromCartUseCase
import com.theauraflow.pos.domain.usecase.cart.RetrieveCartUseCase
import com.theauraflow.pos.domain.usecase.cart.UpdateCartItemUseCase
import com.theauraflow.pos.domain.usecase.customer.CreateCustomerUseCase
import com.theauraflow.pos.domain.usecase.customer.GetCustomerUseCase
import com.theauraflow.pos.domain.usecase.customer.GetTopCustomersUseCase
import com.theauraflow.pos.domain.usecase.customer.SearchCustomersUseCase
import com.theauraflow.pos.domain.usecase.customer.UpdateLoyaltyPointsUseCase
import com.theauraflow.pos.domain.usecase.order.CancelOrderUseCase
import com.theauraflow.pos.domain.usecase.order.CreateOrderUseCase
import com.theauraflow.pos.domain.usecase.order.GetOrderStatisticsUseCase
import com.theauraflow.pos.domain.usecase.order.GetOrdersUseCase
import com.theauraflow.pos.domain.usecase.order.GetTodayOrdersUseCase
import com.theauraflow.pos.domain.usecase.order.RefundOrderUseCase
import com.theauraflow.pos.domain.usecase.product.GetProductsByCategoryUseCase
import com.theauraflow.pos.domain.usecase.product.GetProductsUseCase
import com.theauraflow.pos.domain.usecase.product.SearchProductsUseCase
import com.theauraflow.pos.domain.repository.CartRepository
import com.theauraflow.pos.presentation.viewmodel.CartViewModel
import com.theauraflow.pos.presentation.viewmodel.ProductViewModel
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import org.koin.core.module.dsl.factoryOf
import org.koin.dsl.module

/**
 * Koin module for domain layer dependencies.
 *
 * Provides all use cases as factories (new instance per injection).
 */
val domainModule = module {
    // Product Use Cases
    factoryOf(::GetProductsUseCase)
    factoryOf(::SearchProductsUseCase)
    factoryOf(::GetProductsByCategoryUseCase)

    // Cart Use Cases
    factoryOf(::AddToCartUseCase)
    factoryOf(::UpdateCartItemUseCase)
    factoryOf(::RemoveFromCartUseCase)
    factoryOf(::ClearCartUseCase)
    factoryOf(::ApplyDiscountUseCase)
    factoryOf(::GetCartTotalsUseCase)
    factoryOf(::HoldCartUseCase)
    factoryOf(::RetrieveCartUseCase)

    // Order Use Cases
    factoryOf(::CreateOrderUseCase)
    factoryOf(::GetOrdersUseCase)
    factoryOf(::GetTodayOrdersUseCase)
    factoryOf(::CancelOrderUseCase)
    factoryOf(::RefundOrderUseCase)
    factoryOf(::GetOrderStatisticsUseCase)

    // Customer Use Cases
    factoryOf(::SearchCustomersUseCase)
    factoryOf(::GetCustomerUseCase)
    factoryOf(::UpdateLoyaltyPointsUseCase)
    factoryOf(::CreateCustomerUseCase)
    factoryOf(::GetTopCustomersUseCase)

    // Auth Use Cases
    factoryOf(::LoginUseCase)
    factoryOf(::LogoutUseCase)
    factoryOf(::RefreshTokenUseCase)

    // ViewModels
    single {
        ProductViewModel(
            getProductsUseCase = get(),
            searchProductsUseCase = get(),
            getProductsByCategoryUseCase = get(),
            viewModelScope = CoroutineScope(Dispatchers.Default)
        )
    }

    single {
        CartViewModel(
            cartRepository = get(),
            addToCartUseCase = get(),
            updateCartItemUseCase = get(),
            removeFromCartUseCase = get(),
            clearCartUseCase = get(),
            applyDiscountUseCase = get(),
            getCartTotalsUseCase = get(),
            holdCartUseCase = get(),
            retrieveCartUseCase = get(),
            viewModelScope = CoroutineScope(Dispatchers.Default)
        )
    }
}