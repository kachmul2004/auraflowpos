package com.theauraflow.pos.presentation.viewmodel

import com.theauraflow.pos.domain.model.Order
import com.theauraflow.pos.domain.model.OrderStatus
import com.theauraflow.pos.domain.model.PaymentMethod
import com.theauraflow.pos.domain.repository.OrderStatistics
import com.theauraflow.pos.domain.usecase.order.CancelOrderUseCase
import com.theauraflow.pos.domain.usecase.order.GetOrderStatisticsUseCase
import com.theauraflow.pos.domain.usecase.order.GetOrdersUseCase
import com.theauraflow.pos.domain.usecase.order.GetTodayOrdersUseCase
import com.theauraflow.pos.domain.usecase.order.RefundOrderUseCase
import com.theauraflow.pos.presentation.base.UiState
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

/**
 * ViewModel for order management.
 */
class OrderViewModel(
    private val getOrdersUseCase: GetOrdersUseCase,
    private val getTodayOrdersUseCase: GetTodayOrdersUseCase,
    private val cancelOrderUseCase: CancelOrderUseCase,
    private val refundOrderUseCase: RefundOrderUseCase,
    private val getOrderStatisticsUseCase: GetOrderStatisticsUseCase,
    private val viewModelScope: CoroutineScope
) {
    private val _ordersState = MutableStateFlow<UiState<List<Order>>>(UiState.Loading)
    val ordersState: StateFlow<UiState<List<Order>>> = _ordersState.asStateFlow()

    private val _statisticsState = MutableStateFlow<UiState<OrderStatistics>>(UiState.Loading)
    val statisticsState: StateFlow<UiState<OrderStatistics>> = _statisticsState.asStateFlow()

    private val _message = MutableStateFlow<String?>(null)
    val message: StateFlow<String?> = _message.asStateFlow()

    init {
        loadTodayOrders()
    }

    /**
     * Load today's orders.
     */
    fun loadTodayOrders() {
        viewModelScope.launch(Dispatchers.Default) {
            _ordersState.value = UiState.Loading

            getTodayOrdersUseCase()
                .onSuccess { orders ->
                    _ordersState.value = UiState.Success(orders)
                }
                .onFailure { error ->
                    _ordersState.value = UiState.Error(error.message ?: "Failed to load orders")
                }
        }
    }

    /**
     * Load orders with filters.
     */
    fun loadOrders(
        customerId: String? = null,
        status: OrderStatus? = null,
        startDate: Long? = null,
        endDate: Long? = null
    ) {
        viewModelScope.launch(Dispatchers.Default) {
            _ordersState.value = UiState.Loading

            getOrdersUseCase(customerId, status, startDate, endDate)
                .onSuccess { orders ->
                    _ordersState.value = UiState.Success(orders)
                }
                .onFailure { error ->
                    _ordersState.value = UiState.Error(error.message ?: "Failed to load orders")
                }
        }
    }

    /**
     * Cancel an order.
     */
    fun cancelOrder(orderId: String, reason: String) {
        viewModelScope.launch(Dispatchers.Default) {
            cancelOrderUseCase(orderId, reason)
                .onSuccess {
                    _message.value = "Order cancelled successfully"
                    loadTodayOrders()
                }
                .onFailure { error ->
                    _message.value = error.message ?: "Failed to cancel order"
                }
        }
    }

    /**
     * Refund an order.
     */
    fun refundOrder(orderId: String, amount: Double, reason: String) {
        viewModelScope.launch(Dispatchers.Default) {
            refundOrderUseCase(orderId, amount, reason)
                .onSuccess {
                    _message.value = "Order refunded successfully"
                    loadTodayOrders()
                }
                .onFailure { error ->
                    _message.value = error.message ?: "Failed to refund order"
                }
        }
    }

    /**
     * Load order statistics.
     */
    fun loadStatistics(startDate: Long, endDate: Long) {
        viewModelScope.launch(Dispatchers.Default) {
            _statisticsState.value = UiState.Loading

            getOrderStatisticsUseCase(startDate, endDate)
                .onSuccess { stats ->
                    _statisticsState.value = UiState.Success(stats)
                }
                .onFailure { error ->
                    _statisticsState.value =
                        UiState.Error(error.message ?: "Failed to load statistics")
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