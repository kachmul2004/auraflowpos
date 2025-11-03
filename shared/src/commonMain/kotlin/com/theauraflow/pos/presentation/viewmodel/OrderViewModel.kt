package com.theauraflow.pos.presentation.viewmodel

import com.theauraflow.pos.core.util.UiText
import com.theauraflow.pos.domain.model.Order
import com.theauraflow.pos.domain.model.OrderStatus
import com.theauraflow.pos.domain.model.PaymentMethod
import com.theauraflow.pos.domain.model.Transaction
import com.theauraflow.pos.domain.model.TransactionType
import com.theauraflow.pos.domain.model.TransactionStatus
import com.theauraflow.pos.domain.repository.OrderRepository
import com.theauraflow.pos.domain.repository.OrderStatistics
import com.theauraflow.pos.domain.repository.TransactionRepository
import com.theauraflow.pos.domain.usecase.order.CancelOrderUseCase
import com.theauraflow.pos.domain.usecase.order.CreateOrderUseCase
import com.theauraflow.pos.domain.usecase.order.DeleteOrderUseCase
import com.theauraflow.pos.domain.usecase.order.GetOrderStatisticsUseCase
import com.theauraflow.pos.domain.usecase.order.GetOrdersUseCase
import com.theauraflow.pos.domain.usecase.order.GetTodayOrdersUseCase
import com.theauraflow.pos.domain.usecase.order.RefundOrderUseCase
import com.theauraflow.pos.domain.usecase.order.VerifyAdminPasswordUseCase
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
    private val deleteOrderUseCase: DeleteOrderUseCase,
    private val verifyAdminPasswordUseCase: VerifyAdminPasswordUseCase,
    private val orderRepository: OrderRepository,
    private val transactionRepository: TransactionRepository,
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

    private val _transactionsState = MutableStateFlow<UiState<List<Transaction>>>(UiState.Loading())
    val transactionsState: StateFlow<UiState<List<Transaction>>> = _transactionsState.asStateFlow()

    private val _cancelOrderState = MutableStateFlow<UiState<Unit>?>(null)
    val cancelOrderState: StateFlow<UiState<Unit>?> = _cancelOrderState.asStateFlow()

    private val _deleteOrderState = MutableStateFlow<UiState<Unit>?>(null)
    val deleteOrderState: StateFlow<UiState<Unit>?> = _deleteOrderState.asStateFlow()

    init {
        // Observe orders from repository for reactive updates
        viewModelScope.launch(Dispatchers.Default) {
            orderRepository.observeOrders().collect { orders ->
                _ordersState.value = UiState.Success(orders)
            }
        }
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
            println("🚀 OrderViewModel.createOrder() - START")
            println("   Payment: $paymentMethod, Amount: $amountPaid")

            createOrderUseCase(
                customerId = customerId,
                paymentMethod = paymentMethod,
                amountPaid = amountPaid,
                notes = notes
            ).onSuccess { order ->
                println("✅ OrderViewModel: Order created successfully")
                println("   Order: ${order.orderNumber}")
                println("   Items: ${order.items.size}")
                order.items.forEach { item ->
                    println("     - ${item.product.name} x${item.quantity}")
                }

                _lastCreatedOrder.value = order
                println("📋 Set lastCreatedOrder with ${order.items.size} items")

                _message.value = "Order created successfully"
                // Create transaction record for this order
                createTransactionForOrder(order, "current_user", "Current User")
                // Orders automatically update via observeOrders() flow
            }.onFailure { error ->
                println("❌ OrderViewModel: Order creation failed: ${error.message}")
                error.printStackTrace()
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
     * Cancel an order with full enterprise audit trail.
     */
    fun cancelOrder(
        orderId: String,
        reason: String,
        issueRefund: Boolean,
        restockItems: Boolean,
        notifyCustomer: Boolean,
        additionalNotes: String?,
        userId: String,
        userName: String
    ) {
        viewModelScope.launch(Dispatchers.Default) {
            _cancelOrderState.value = UiState.Loading()

            cancelOrderUseCase(
                orderId = orderId,
                reason = reason,
                issueRefund = issueRefund,
                restockItems = restockItems,
                notifyCustomer = notifyCustomer,
                additionalNotes = additionalNotes,
                userId = userId,
                userName = userName
            ).onSuccess {
                _cancelOrderState.value = UiState.Success(Unit)
                _message.value = "Order cancelled successfully"
                loadTodayOrders() // Refresh orders
                loadTransactions() // Refresh transactions
            }.onFailure { error ->
                _cancelOrderState.value =
                    UiState.Error(UiText.DynamicString(error.message ?: "Failed to cancel order"))
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
     * Delete an order (requires super admin password).
     */
    fun deleteOrder(
        orderId: String,
        password: String,
        userId: String,
        userName: String,
        onPasswordVerified: (Boolean) -> Unit
    ) {
        viewModelScope.launch(Dispatchers.Default) {
            _deleteOrderState.value = UiState.Loading()

            // Verify super admin password first
            val isPasswordValid = verifyAdminPasswordUseCase(password).getOrNull() ?: false

            if (!isPasswordValid) {
                _deleteOrderState.value =
                    UiState.Error(UiText.DynamicString("Invalid super admin password"))
                onPasswordVerified(false)
                return@launch
            }

            onPasswordVerified(true)

            deleteOrderUseCase(
                orderId = orderId,
                userId = userId,
                userName = userName,
                reason = "Deleted by super admin"
            ).onSuccess {
                _deleteOrderState.value = UiState.Success(Unit)
                _message.value = "Order deleted successfully"
                loadTodayOrders() // Refresh orders
                loadTransactions() // Refresh transactions
            }.onFailure { error ->
                _deleteOrderState.value =
                    UiState.Error(UiText.DynamicString(error.message ?: "Failed to delete order"))
            }
        }
    }

    /**
     * Create a transaction record for an order.
     */
    private fun createTransactionForOrder(
        order: Order,
        userId: String,
        userName: String
    ) {
        viewModelScope.launch {
            // Use order timestamp for transaction
            val timestamp = order.createdAt

            val transaction = Transaction(
                id = "txn_${order.id}",
                referenceNumber = Transaction.generateReferenceNumber(
                    timestamp,
                    TransactionType.SALE
                ),
                orderId = order.id,
                orderNumber = order.orderNumber,
                type = TransactionType.SALE,
                amount = order.total,
                paymentMethod = order.paymentMethod,
                status = TransactionStatus.COMPLETED,
                userId = userId,
                userName = userName,
                notes = "Order ${order.orderNumber}",
                createdAt = order.createdAt,
                completedAt = order.completedAt
            )

            transactionRepository.createTransaction(transaction)
            println("Transaction created: ${transaction.referenceNumber}")
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
     * Load all transactions.
     */
    fun loadTransactions() {
        viewModelScope.launch(Dispatchers.Default) {
            _transactionsState.value = UiState.Loading()
            transactionRepository.getAllTransactions()
                .onSuccess { transactions ->
                    _transactionsState.value = UiState.Success(transactions)
                }
                .onFailure { error ->
                    _transactionsState.value = UiState.Error(
                        UiText.DynamicString(error.message ?: "Failed to load transactions")
                    )
                }
        }
    }

    /**
     * Reset cancel order state.
     */
    fun resetCancelOrderState() {
        _cancelOrderState.value = null
    }

    /**
     * Reset delete order state.
     */
    fun resetDeleteOrderState() {
        _deleteOrderState.value = null
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