package com.auraflow.pos.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.auraflow.pos.data.repository.POSRepository
import com.auraflow.pos.domain.subscription.SubscriptionManager
import com.auraflow.pos.domain.usecase.CartUseCases
import com.auraflow.pos.domain.usecase.OrderUseCases

/**
 * Factory for creating POSViewModel with dependencies
 */
class POSViewModelFactory(
    private val repository: POSRepository,
    private val cartUseCases: CartUseCases,
    private val orderUseCases: OrderUseCases,
    private val subscriptionManager: SubscriptionManager
) : ViewModelProvider.Factory {
    
    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(POSViewModel::class.java)) {
            return POSViewModel(
                repository,
                cartUseCases,
                orderUseCases,
                subscriptionManager
            ) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
