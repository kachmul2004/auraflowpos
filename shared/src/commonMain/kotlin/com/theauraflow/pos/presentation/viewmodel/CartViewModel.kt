package com.theauraflow.pos.presentation.viewmodel

import com.theauraflow.pos.domain.model.CartItem
import com.theauraflow.pos.domain.model.Discount
import com.theauraflow.pos.domain.model.Modifier
import com.theauraflow.pos.domain.model.Product
import com.theauraflow.pos.domain.repository.CartTotals
import com.theauraflow.pos.domain.usecase.cart.AddToCartUseCase
import com.theauraflow.pos.domain.usecase.cart.ApplyDiscountUseCase
import com.theauraflow.pos.domain.usecase.cart.ClearCartUseCase
import com.theauraflow.pos.domain.usecase.cart.GetCartTotalsUseCase
import com.theauraflow.pos.domain.usecase.cart.HoldCartUseCase
import com.theauraflow.pos.domain.usecase.cart.RemoveFromCartUseCase
import com.theauraflow.pos.domain.usecase.cart.RetrieveCartUseCase
import com.theauraflow.pos.domain.usecase.cart.UpdateCartItemUseCase
import com.theauraflow.pos.presentation.base.UiState
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

/**
 * ViewModel for shopping cart management.
 */
class CartViewModel(
    private val addToCartUseCase: AddToCartUseCase,
    private val updateCartItemUseCase: UpdateCartItemUseCase,
    private val removeFromCartUseCase: RemoveFromCartUseCase,
    private val clearCartUseCase: ClearCartUseCase,
    private val applyDiscountUseCase: ApplyDiscountUseCase,
    private val getCartTotalsUseCase: GetCartTotalsUseCase,
    private val holdCartUseCase: HoldCartUseCase,
    private val retrieveCartUseCase: RetrieveCartUseCase,
    private val viewModelScope: CoroutineScope
) {
    private val _cartState = MutableStateFlow<UiState<List<CartItem>>>(UiState.Success(emptyList()))
    val cartState: StateFlow<UiState<List<CartItem>>> = _cartState.asStateFlow()

    private val _cartTotals = MutableStateFlow<CartTotals?>(null)
    val cartTotals: StateFlow<CartTotals?> = _cartTotals.asStateFlow()

    private val _message = MutableStateFlow<String?>(null)
    val message: StateFlow<String?> = _message.asStateFlow()

    /**
     * Add product to cart.
     */
    fun addToCart(product: Product, quantity: Int = 1, modifiers: List<Modifier> = emptyList()) {
        viewModelScope.launch(Dispatchers.Default) {
            addToCartUseCase(product, quantity, modifiers)
                .onSuccess {
                    _message.value = "${product.name} added to cart"
                    updateCartTotals()
                }
                .onFailure { error ->
                    _message.value = error.message ?: "Failed to add to cart"
                }
        }
    }

    /**
     * Update cart item quantity.
     */
    fun updateQuantity(cartItemId: String, quantity: Int) {
        if (quantity <= 0) {
            removeFromCart(cartItemId)
            return
        }

        viewModelScope.launch(Dispatchers.Default) {
            updateCartItemUseCase(cartItemId, quantity)
                .onSuccess {
                    updateCartTotals()
                }
                .onFailure { error ->
                    _message.value = error.message ?: "Failed to update quantity"
                }
        }
    }

    /**
     * Remove item from cart.
     */
    fun removeFromCart(cartItemId: String) {
        viewModelScope.launch(Dispatchers.Default) {
            removeFromCartUseCase(cartItemId)
                .onSuccess {
                    _message.value = "Item removed from cart"
                    updateCartTotals()
                }
                .onFailure { error ->
                    _message.value = error.message ?: "Failed to remove item"
                }
        }
    }

    /**
     * Clear entire cart.
     */
    fun clearCart() {
        viewModelScope.launch(Dispatchers.Default) {
            clearCartUseCase()
                .onSuccess {
                    _message.value = "Cart cleared"
                    _cartTotals.value = null
                }
                .onFailure { error ->
                    _message.value = error.message ?: "Failed to clear cart"
                }
        }
    }

    /**
     * Apply discount to cart item.
     */
    fun applyDiscount(cartItemId: String, discount: Discount) {
        viewModelScope.launch(Dispatchers.Default) {
            applyDiscountUseCase(cartItemId, discount)
                .onSuccess {
                    _message.value = "Discount applied"
                    updateCartTotals()
                }
                .onFailure { error ->
                    _message.value = error.message ?: "Failed to apply discount"
                }
        }
    }

    /**
     * Hold current cart.
     */
    fun holdCart(name: String? = null) {
        viewModelScope.launch(Dispatchers.Default) {
            holdCartUseCase(name)
                .onSuccess { cartId ->
                    _message.value = "Cart saved: $cartId"
                    _cartTotals.value = null
                }
                .onFailure { error ->
                    _message.value = error.message ?: "Failed to hold cart"
                }
        }
    }

    /**
     * Retrieve held cart.
     */
    fun retrieveCart(cartId: String) {
        viewModelScope.launch(Dispatchers.Default) {
            retrieveCartUseCase(cartId)
                .onSuccess {
                    _message.value = "Cart retrieved"
                    updateCartTotals()
                }
                .onFailure { error ->
                    _message.value = error.message ?: "Failed to retrieve cart"
                }
        }
    }

    /**
     * Update cart totals.
     */
    private fun updateCartTotals() {
        viewModelScope.launch(Dispatchers.Default) {
            getCartTotalsUseCase()
                .onSuccess { totals ->
                    _cartTotals.value = totals
                }
                .onFailure {
                    _cartTotals.value = null
                }
        }
    }

    /**
     * Clear message.
     */
    fun clearMessage() {
        _message.value = null
    }

    init {
        updateCartTotals()
    }
}