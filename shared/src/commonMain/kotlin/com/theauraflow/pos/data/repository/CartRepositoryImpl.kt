package com.theauraflow.pos.data.repository

import com.theauraflow.pos.domain.model.CartItem
import com.theauraflow.pos.domain.model.CartItemModifier
import com.theauraflow.pos.domain.model.Discount
import com.theauraflow.pos.domain.model.HeldCart
import com.theauraflow.pos.domain.model.Modifier
import com.theauraflow.pos.domain.model.Product
import com.theauraflow.pos.domain.model.ProductVariation
import com.theauraflow.pos.domain.repository.CartRepository
import com.theauraflow.pos.data.local.LocalStorage
import com.theauraflow.pos.domain.repository.CartTotals
import com.theauraflow.pos.util.MoneyUtils
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.launch
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

/**
 * In-memory implementation of CartRepository with LocalStorage for persistence.
 *
 * For a production app, this would use Room database.
 */
@OptIn(ExperimentalUuidApi::class)
class CartRepositoryImpl(
    private val localStorage: LocalStorage
) : CartRepository {

    private val _cart = MutableStateFlow<List<CartItem>>(emptyList())
    private val _heldCarts = mutableMapOf<String, HeldCart>()
    private val _heldCartsFlow = MutableStateFlow<List<HeldCart>>(emptyList())
    private var heldCartCounter = 1L
    private val baseTimestamp = 1704067200000L // Jan 1, 2024

    private val json = Json {
        ignoreUnknownKeys = true
        prettyPrint = false
    }

    companion object {
        private const val HELD_CARTS_KEY = "held_carts"
    }

    init {
        // Load held carts from storage on init
        kotlinx.coroutines.CoroutineScope(kotlinx.coroutines.Dispatchers.Default).launch {
            loadHeldCartsFromStorage()
        }
    }

    private suspend fun loadHeldCartsFromStorage() {
        try {
            val jsonString = localStorage.getString(HELD_CARTS_KEY)
            if (jsonString != null) {
                val carts = json.decodeFromString<List<HeldCart>>(jsonString)
                _heldCarts.clear()
                carts.forEach { _heldCarts[it.id] = it }
                _heldCartsFlow.value = carts

                // Update counter to avoid ID collisions
                val maxCounter = carts.maxOfOrNull { it.createdAt } ?: 0L
                heldCartCounter = ((maxCounter - baseTimestamp) / 1000L) + 1
            }
        } catch (e: Exception) {
            // If loading fails, start fresh
            println("Failed to load held carts: ${e.message}")
        }
    }

    private suspend fun saveHeldCartsToStorage() {
        try {
            val carts = _heldCarts.values.toList()
            val jsonString = json.encodeToString(carts)
            localStorage.saveString(HELD_CARTS_KEY, jsonString)
        } catch (e: Exception) {
            println("Failed to save held carts: ${e.message}")
        }
    }

    override fun observeCart(): Flow<List<CartItem>> {
        return _cart.asStateFlow()
    }

    override suspend fun getCart(): Result<List<CartItem>> {
        return Result.success(_cart.value)
    }

    override suspend fun addToCart(
        product: Product,
        variation: ProductVariation?,
        quantity: Int,
        modifiers: List<CartItemModifier>
    ): Result<CartItem> {
        return try {
            // Check if item already exists with same product, variation and modifiers
            val existing = _cart.value.find {
                it.product.id == product.id &&
                        it.variation?.id == variation?.id &&
                        it.modifiers.map { m -> m.id }.toSet() == modifiers.map { m -> m.id }
                    .toSet()
            }

            val cartItem = if (existing != null) {
                // Update quantity
                existing.copy(quantity = existing.quantity + quantity)
            } else {
                // Create new cart item
                CartItem(
                    id = Uuid.random().toString(),
                    product = product,
                    variation = variation,
                    quantity = quantity,
                    modifiers = modifiers
                )
            }

            // Update cart
            _cart.value = if (existing != null) {
                _cart.value.map { if (it.id == existing.id) cartItem else it }
            } else {
                _cart.value + cartItem
            }

            Result.success(cartItem)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun updateQuantity(cartItemId: String, quantity: Int): Result<CartItem> {
        return try {
            val item = _cart.value.find { it.id == cartItemId }
                ?: return Result.failure(NoSuchElementException("Cart item not found"))

            val updated = item.copy(quantity = quantity)
            _cart.value = _cart.value.map {
                if (it.id == cartItemId) updated else it
            }

            Result.success(updated)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun addModifier(
        cartItemId: String,
        modifier: CartItemModifier
    ): Result<CartItem> {
        return try {
            val item = _cart.value.find { it.id == cartItemId }
                ?: return Result.failure(NoSuchElementException("Cart item not found"))

            val updated = item.copy(modifiers = item.modifiers + modifier)
            _cart.value = _cart.value.map {
                if (it.id == cartItemId) updated else it
            }

            Result.success(updated)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun removeModifier(cartItemId: String, modifierId: String): Result<CartItem> {
        return try {
            val item = _cart.value.find { it.id == cartItemId }
                ?: return Result.failure(NoSuchElementException("Cart item not found"))

            val updated = item.copy(
                modifiers = item.modifiers.filter { it.id != modifierId }
            )
            _cart.value = _cart.value.map {
                if (it.id == cartItemId) updated else it
            }

            Result.success(updated)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun applyDiscount(cartItemId: String, discount: Discount): Result<CartItem> {
        return try {
            val item = _cart.value.find { it.id == cartItemId }
                ?: return Result.failure(NoSuchElementException("Cart item not found"))

            val updated = item.copy(discount = discount)
            _cart.value = _cart.value.map {
                if (it.id == cartItemId) updated else it
            }

            Result.success(updated)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun removeDiscount(cartItemId: String): Result<CartItem> {
        return try {
            val item = _cart.value.find { it.id == cartItemId }
                ?: return Result.failure(NoSuchElementException("Cart item not found"))

            val updated = item.copy(discount = null)
            _cart.value = _cart.value.map {
                if (it.id == cartItemId) updated else it
            }

            Result.success(updated)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun removeFromCart(cartItemId: String): Result<Unit> {
        return try {
            _cart.value = _cart.value.filter { it.id != cartItemId }
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun clearCart(): Result<Unit> {
        return try {
            _cart.value = emptyList()
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getCartTotals(): Result<CartTotals> {
        return try {
            val items = _cart.value
            // Use MoneyUtils to sum with proper rounding
            val subtotal = MoneyUtils.sum(items.map { it.subtotal })
            val tax = MoneyUtils.sum(items.map { it.taxAmount })
            val discount = MoneyUtils.sum(items.map { it.discountAmount })
            val total = MoneyUtils.sum(items.map { it.total })
            val itemCount = items.sumOf { it.quantity }

            val totals = CartTotals(
                subtotal = subtotal,
                tax = tax,
                discount = discount,
                total = total,
                itemCount = itemCount
            )

            Result.success(totals)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun holdCart(name: String?): Result<String> {
        return try {
            val cartId = Uuid.random().toString()
            val items = _cart.value

            // Calculate totals with proper rounding
            val subtotal = MoneyUtils.sum(items.map { it.subtotal })
            val tax = MoneyUtils.sum(items.map { it.taxAmount })
            val discount = MoneyUtils.sum(items.map { it.discountAmount })
            val total = MoneyUtils.sum(items.map { it.total })

            val heldCart = HeldCart(
                id = cartId,
                items = items,
                name = name,
                createdAt = baseTimestamp + (heldCartCounter++ * 1000L),
                subtotal = subtotal,
                tax = tax,
                discount = discount,
                total = total
            )

            _heldCarts[cartId] = heldCart
            _heldCartsFlow.value = _heldCarts.values.toList().sortedByDescending { it.createdAt }
            _cart.value = emptyList()

            // Persist to storage
            saveHeldCartsToStorage()

            Result.success(cartId)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun retrieveCart(cartId: String): Result<Unit> {
        return try {
            val heldCart = _heldCarts[cartId]
                ?: return Result.failure(NoSuchElementException("Held cart not found"))

            _cart.value = heldCart.items
            _heldCarts.remove(cartId)
            _heldCartsFlow.value = _heldCarts.values.toList().sortedByDescending { it.createdAt }

            // Persist to storage
            saveHeldCartsToStorage()

            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getHeldCarts(): Result<List<HeldCart>> {
        return try {
            val carts = _heldCarts.values.toList().sortedByDescending { it.createdAt }
            Result.success(carts)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun deleteHeldCart(cartId: String): Result<Unit> {
        return try {
            if (_heldCarts.remove(cartId) == null) {
                return Result.failure(NoSuchElementException("Held cart not found"))
            }
            _heldCartsFlow.value = _heldCarts.values.toList().sortedByDescending { it.createdAt }

            // Persist to storage
            saveHeldCartsToStorage()

            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override fun observeHeldCarts(): Flow<List<HeldCart>> {
        return _heldCartsFlow.asStateFlow()
    }
}