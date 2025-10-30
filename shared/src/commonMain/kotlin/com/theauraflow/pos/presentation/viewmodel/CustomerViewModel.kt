package com.theauraflow.pos.presentation.viewmodel

import com.theauraflow.pos.core.util.UiText
import com.theauraflow.pos.domain.model.Customer
import com.theauraflow.pos.domain.usecase.customer.CreateCustomerUseCase
import com.theauraflow.pos.domain.usecase.customer.GetCustomerUseCase
import com.theauraflow.pos.domain.usecase.customer.GetTopCustomersUseCase
import com.theauraflow.pos.domain.usecase.customer.SearchCustomersUseCase
import com.theauraflow.pos.domain.usecase.customer.UpdateLoyaltyPointsUseCase
import com.theauraflow.pos.presentation.base.UiState
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

/**
 * ViewModel for customer management.
 */
class CustomerViewModel(
    private val searchCustomersUseCase: SearchCustomersUseCase,
    private val getCustomerUseCase: GetCustomerUseCase,
    private val createCustomerUseCase: CreateCustomerUseCase,
    private val updateLoyaltyPointsUseCase: UpdateLoyaltyPointsUseCase,
    private val getTopCustomersUseCase: GetTopCustomersUseCase,
    private val viewModelScope: CoroutineScope
) {
    private val _customersState = MutableStateFlow<UiState<List<Customer>>>(UiState.Idle)
    val customersState: StateFlow<UiState<List<Customer>>> = _customersState.asStateFlow()

    private val _selectedCustomer = MutableStateFlow<Customer?>(null)
    val selectedCustomer: StateFlow<Customer?> = _selectedCustomer.asStateFlow()

    private val _message = MutableStateFlow<UiText?>(null)
    val message: StateFlow<UiText?> = _message.asStateFlow()

    /**
     * Search customers by query.
     */
    fun searchCustomers(query: String) {
        if (query.isBlank()) {
            _customersState.value = UiState.Success(emptyList())
            return
        }

        viewModelScope.launch(Dispatchers.Default) {
            _customersState.value = UiState.Loading()

            searchCustomersUseCase(query)
                .onSuccess { customers ->
                    _customersState.value = UiState.Success(customers)
                }
                .onFailure { error ->
                    _customersState.value = UiState.Error(
                        UiText.DynamicString(error.message ?: "Search failed")
                    )
                }
        }
    }

    /**
     * Select a customer.
     */
    fun selectCustomer(customerId: String) {
        viewModelScope.launch(Dispatchers.Default) {
            getCustomerUseCase(customerId)
                .onSuccess { customer ->
                    _selectedCustomer.value = customer
                }
                .onFailure { error ->
                    _message.value =
                        UiText.DynamicString(error.message ?: "Failed to load customer")
                }
        }
    }

    /**
     * Clear selected customer.
     */
    fun clearSelection() {
        _selectedCustomer.value = null
    }

    /**
     * Create a new customer.
     */
    fun createCustomer(customer: Customer) {
        viewModelScope.launch(Dispatchers.Default) {
            createCustomerUseCase(customer)
                .onSuccess { created ->
                    _message.value = UiText.DynamicString("Customer created successfully")
                    _selectedCustomer.value = created
                }
                .onFailure { error ->
                    _message.value =
                        UiText.DynamicString(error.message ?: "Failed to create customer")
                }
        }
    }

    /**
     * Update customer loyalty points.
     */
    fun updateLoyaltyPoints(customerId: String, pointsDelta: Int) {
        viewModelScope.launch(Dispatchers.Default) {
            updateLoyaltyPointsUseCase(customerId, pointsDelta)
                .onSuccess { updated ->
                    _message.value = UiText.DynamicString(
                        if (pointsDelta > 0) {
                        "$pointsDelta points added"
                    } else {
                        "${-pointsDelta} points redeemed"
                    }
                    )
                    _selectedCustomer.value = updated
                }
                .onFailure { error ->
                    _message.value =
                        UiText.DynamicString(error.message ?: "Failed to update points")
                }
        }
    }

    /**
     * Load top customers.
     */
    fun loadTopCustomers(limit: Int = 10) {
        viewModelScope.launch(Dispatchers.Default) {
            _customersState.value = UiState.Loading()

            getTopCustomersUseCase(limit)
                .onSuccess { customers ->
                    _customersState.value = UiState.Success(customers)
                }
                .onFailure { error ->
                    _customersState.value = UiState.Error(
                        UiText.DynamicString(error.message ?: "Failed to load top customers")
                    )
                }
        }
    }

    /**
     * Clear message.
     */
    fun clearMessage() {
        _message.value = null
    }
}