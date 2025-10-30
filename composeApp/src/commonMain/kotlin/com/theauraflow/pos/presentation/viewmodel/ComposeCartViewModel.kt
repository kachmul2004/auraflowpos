package com.theauraflow.pos.presentation.viewmodel

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import com.theauraflow.pos.domain.model.CartItem
import com.theauraflow.pos.domain.model.Product

/**
 * ViewModel for managing shopping cart state and operations
 */
class ComposeCartViewModel : ViewModel() {
    private val _items = MutableStateFlow<List<CartItem>>(emptyList())
    val items: StateFlow<List<CartItem>> = _items.asStateFlow()

    private val _subtotal = MutableStateFlow(0.0)
    val subtotal: StateFlow<Double> = _subtotal.asStateFlow()

    private val _tax = MutableStateFlow(0.0)
    val tax: StateFlow<Double> = _tax.asStateFlow()

    private val _discount = MutableStateFlow(0.0)
    val discount: StateFlow<Double> = _discount.asStateFlow()

    private val _total = MutableStateFlow(0.0)
    val total: StateFlow<Double> = _total.asStateFlow()

    fun addItem(product: Product, quantity: Int = 1) {
        val currentItems = _items.value.toMutableList()
        val existingItem = currentItems.find { it.product.id == product.id }

        if (existingItem != null) {
            val index = currentItems.indexOf(existingItem)
            currentItems[index] = existingItem.copy(quantity = existingItem.quantity + quantity)
        } else {
            currentItems.add(
                CartItem(
                    id = "cart_${_items.value.size + 1}",
                    product = product,
                    quantity = quantity,
                    modifiers = emptyList(),
                    discount = null
                )
            )
        }

        _items.value = currentItems
        calculateTotals()
    }

    fun removeItem(itemId: String) {
        _items.value = _items.value.filter { it.id != itemId }
        calculateTotals()
    }

    fun updateQuantity(itemId: String, newQuantity: Int) {
        if (newQuantity <= 0) {
            removeItem(itemId)
            return
        }

        _items.value = _items.value.map { item ->
            if (item.id == itemId) item.copy(quantity = newQuantity) else item
        }
        calculateTotals()
    }

    fun applyDiscount(discountAmount: Double) {
        _discount.value = discountAmount
        calculateTotals()
    }

    fun clearCart() {
        _items.value = emptyList()
        _discount.value = 0.0
        calculateTotals()
    }

    private fun calculateTotals() {
        val subtotal = _items.value.sumOf { it.product.price * it.quantity }
        val tax = (subtotal - _discount.value) * 0.08 // 8% tax
        val total = subtotal - _discount.value + tax

        _subtotal.value = subtotal
        _tax.value = tax
        _total.value = total
    }
}
