package com.auraflow.pos

import android.app.Application
import com.auraflow.pos.data.repository.POSRepository
import com.auraflow.pos.domain.plugins.PluginManager
import com.auraflow.pos.domain.subscription.SubscriptionManager
import com.auraflow.pos.domain.usecase.CartUseCases
import com.auraflow.pos.domain.usecase.OrderUseCases

/**
 * Application class for AuraFlow POS
 * Initializes dependencies and manages app lifecycle
 */
class POSApplication : Application() {
    
    // Singleton instances
    lateinit var repository: POSRepository
        private set
    
    lateinit var subscriptionManager: SubscriptionManager
        private set
    
    lateinit var pluginManager: PluginManager
        private set
    
    lateinit var cartUseCases: CartUseCases
        private set
    
    lateinit var orderUseCases: OrderUseCases
        private set
    
    override fun onCreate() {
        super.onCreate()
        initializeDependencies()
    }
    
    private fun initializeDependencies() {
        // Initialize repository
        repository = POSRepository()
        
        // Initialize subscription manager
        subscriptionManager = SubscriptionManager()
        
        // Initialize plugin manager
        pluginManager = PluginManager()
        
        // Initialize use cases
        cartUseCases = CartUseCases(repository)
        orderUseCases = OrderUseCases(repository)
        
        // Configure default subscriptions (can be changed in settings)
        subscriptionManager.setSubscriptions(listOf("cafe"))
    }
    
    companion object {
        const val TAG = "POSApplication"
    }
}
