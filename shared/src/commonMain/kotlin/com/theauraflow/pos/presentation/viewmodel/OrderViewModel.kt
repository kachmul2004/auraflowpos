package com.theauraflow.pos.presentation.viewmodel

import com.theauraflow.pos.core.util.UiText
import com.theauraflow.pos.domain.model.Order
import com.theauraflow.pos.domain.model.OrderStatus
import com.theauraflow.pos.domain.model.PaymentMethod
import com.theauraflow.pos.domain.repository.OrderStatistics
import com.theauraflow.pos.domain.usecase.order.CancelOrderUseCase
import com.theauraflow.pos.domain.usecase.order.CreateOrderUseCase
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
    private val createOrderUseCase: CreateOrderUseCase,
    private val getOrdersUseCase: GetOrdersUseCase,
    private val getTodayOrdersUseCase: GetTodayOrdersUseCase,
    private val cancelOrderUseCase: CancelOrderUseCase,
    private val refundOrderUseCase: RefundOrderUseCase,
    private val getOrderStatisticsUseCase: GetOrderStatisticsUseCase,
    private val viewModelScope: CoroutineScope
) {
    private val _ordersState = MutableStateFlow<UiState<List<Order>>>(UiState.Loading())
    val ordersState: StateFlow<UiState<List<Order>>> = _ordersState.asStateFlow()

    private val _statisticsState = MutableStateFlow<UiState<OrderStatistics>>(UiState.Loading())
    val statisticsState: StateFlow<UiState<OrderStatistics>> = _statisticsState.asStateFlow()

    private val _lastCreatedOrder = MutableStateFlow<Order?>(null)
    val lastCreatedOrder: StateFlow<Order?> = _lastCreatedOrder.asStateFlow()

    private val _message = MutableStateFlow<String?>(null)
    val message: StateFlow<String?> = _message.asStateFlow()

    init {
    }

    /**
     * Create a new order from current cart.
     */
    fun createOrder(
        customerId: String? = null,
        paymentMethod: PaymentMethod,
        amountPaid: Double? = null,
        notes: String? = null
    ) {
        viewModelScope.launch(Dispatchers.Default) {
            createOrderUseCase(
                customerId = customerId,
                paymentMethod = paymentMethod,
                amountPaid = amountPaid,
                notes = notes
            ).onSuccess { order ->
                _lastCreatedOrder.value = order
                _message.value = "Order created successfully"
                // Removed loadTodayOrders() - using local storage
            }.onFailure { error ->
                _message.value = error.message ?: "Failed to create order"
            }
        }
    }

    /**
     * Load today's orders.
     */
    fun loadTodayOrders() {
        viewModelScope.launch(Dispatchers.Default) {
            _ordersState.value = UiState.Loading()

            getTodayOrdersUseCase()
                .onSuccess { orders ->
                    _ordersState.value = UiState.Success(orders)
                }
                .onFailure { error ->
                    _ordersState.value = UiState.Error(
                        UiText.DynamicString(error.message ?: "Failed to load orders")
                    )
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
        endDate: Long? = null,
        limit: Int = 50
    ) {
        viewModelScope.launch(Dispatchers.Default) {
            _ordersState.value = UiState.Loading()

            val result = when {
                customerId != null -> getOrdersUseCase.forCustomer(customerId, limit)
                status != null -> getOrdersUseCase.byStatus(status, limit)
                startDate != null && endDate != null -> getOrdersUseCase.forDateRange(
                    startDate,
                    endDate,
                    limit
                )

                else -> getOrdersUseCase(limit)
            }

            result.onSuccess { orders ->
                    _ordersState.value = UiState.Success(orders)
                }
                .onFailure { error ->
                    _ordersState.value = UiState.Error(
                        UiText.DynamicString(error.message ?: "Failed to load orders")
                    )
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
                    // Removed loadTodayOrders() - using local storage
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
                    // Removed loadTodayOrders() - using local storage
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
            _statisticsState.value = UiState.Loading()

            getOrderStatisticsUseCase(startDate, endDate)
                .onSuccess { stats ->
                    _statisticsState.value = UiState.Success(stats)
                }
                .onFailure { error ->
                    _statisticsState.value = UiState.Error(
                        UiText.DynamicString(error.message ?: "Failed to load statistics")
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

    /**
     * Clear last created order state (for receipt dialog).
     */
    fun clearLastOrder() {
        _lastCreatedOrder.value = null
    }
}