package com.theauraflow.pos.core.di

import com.theauraflow.pos.domain.usecase.auth.LoginUseCase
import com.theauraflow.pos.domain.usecase.auth.LogoutUseCase
import com.theauraflow.pos.domain.usecase.auth.RefreshTokenUseCase
import com.theauraflow.pos.domain.usecase.cart.AddToCartUseCase
import com.theauraflow.pos.domain.usecase.cart.ApplyDiscountUseCase
import com.theauraflow.pos.domain.usecase.cart.ClearCartUseCase
import com.theauraflow.pos.domain.usecase.cart.DeleteHeldCartUseCase
import com.theauraflow.pos.domain.usecase.cart.GetCartTotalsUseCase
import com.theauraflow.pos.domain.usecase.cart.GetHeldCartsUseCase
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
import com.theauraflow.pos.domain.usecase.order.DeleteOrderUseCase
import com.theauraflow.pos.domain.usecase.order.GetOrderStatisticsUseCase
import com.theauraflow.pos.domain.usecase.order.GetOrdersUseCase
import com.theauraflow.pos.domain.usecase.order.GetTodayOrdersUseCase
import com.theauraflow.pos.domain.usecase.order.RefundOrderUseCase
import com.theauraflow.pos.domain.usecase.order.VerifyAdminPasswordUseCase
import com.theauraflow.pos.domain.usecase.product.GetProductsByCategoryUseCase
import com.theauraflow.pos.domain.usecase.product.GetProductsUseCase
import com.theauraflow.pos.domain.usecase.product.SearchProductsUseCase
import com.theauraflow.pos.domain.repository.CartRepository
import com.theauraflow.pos.domain.repository.OrderRepository
import com.theauraflow.pos.presentation.viewmodel.AuthViewModel
import com.theauraflow.pos.presentation.viewmodel.CartViewModel
import com.theauraflow.pos.presentation.viewmodel.CustomerViewModel
import com.theauraflow.pos.presentation.viewmodel.OrderViewModel
import com.theauraflow.pos.presentation.viewmodel.ProductViewModel
import com.theauraflow.pos.presentation.viewmodel.SettingsViewModel
import com.theauraflow.pos.presentation.viewmodel.TableViewModel
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
    factoryOf(::GetHeldCartsUseCase)
    factoryOf(::DeleteHeldCartUseCase)

    // Order Use Cases
    factoryOf(::CreateOrderUseCase)
    factoryOf(::GetOrdersUseCase)
    factoryOf(::GetTodayOrdersUseCase)
    factoryOf(::CancelOrderUseCase)
    factoryOf(::RefundOrderUseCase)
    factoryOf(::GetOrderStatisticsUseCase)
    factoryOf(::DeleteOrderUseCase)
    factory { VerifyAdminPasswordUseCase() }

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
            getHeldCartsUseCase = get(),
            deleteHeldCartUseCase = get(),
            viewModelScope = CoroutineScope(Dispatchers.Default)
        )
    }

    single<AuthViewModel> {
        AuthViewModel(
            loginUseCase = get(),
            logoutUseCase = get(),
            refreshTokenUseCase = get(),
            viewModelScope = CoroutineScope(Dispatchers.Default)
        )
    }

    single {
        OrderViewModel(
            createOrderUseCase = get(),
            getOrdersUseCase = get(),
            getTodayOrdersUseCase = get(),
            cancelOrderUseCase = get(),
            refundOrderUseCase = get(),
            getOrderStatisticsUseCase = get(),
            deleteOrderUseCase = get(),
            verifyAdminPasswordUseCase = get(),
            orderRepository = get(),
            transactionRepository = get(),
            viewModelScope = CoroutineScope(Dispatchers.Default)
        )
    }

    single {
        CustomerViewModel(
            searchCustomersUseCase = get(),
            getCustomerUseCase = get(),
            createCustomerUseCase = get(),
            updateLoyaltyPointsUseCase = get(),
            getTopCustomersUseCase = get(),
            viewModelScope = CoroutineScope(Dispatchers.Default)
        )
    }

    single {
        TableViewModel(
            tableRepository = get(),
            viewModelScope = CoroutineScope(Dispatchers.Default)
        )
    }

    single {
        SettingsViewModel(
            settingsRepository = get(),
            scope = CoroutineScope(Dispatchers.Default)
        )
    }
}