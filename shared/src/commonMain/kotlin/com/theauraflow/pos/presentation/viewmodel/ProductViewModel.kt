package com.theauraflow.pos.presentation.viewmodel

import com.theauraflow.pos.domain.model.Product
import com.theauraflow.pos.domain.usecase.product.GetProductsByCategoryUseCase
import com.theauraflow.pos.domain.usecase.product.GetProductsUseCase
import com.theauraflow.pos.domain.usecase.product.SearchProductsUseCase
import com.theauraflow.pos.presentation.base.UiState
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

/**
 * ViewModel for product management and display.
 *
 * Handles product listing, search, and category filtering.
 */
class ProductViewModel(
    private val getProductsUseCase: GetProductsUseCase,
    private val searchProductsUseCase: SearchProductsUseCase,
    private val getProductsByCategoryUseCase: GetProductsByCategoryUseCase,
    private val viewModelScope: CoroutineScope
) {
    private val _productsState = MutableStateFlow<UiState<List<Product>>>(UiState.Loading)
    val productsState: StateFlow<UiState<List<Product>>> = _productsState.asStateFlow()

    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    private val _selectedCategory = MutableStateFlow<String?>(null)
    val selectedCategory: StateFlow<String?> = _selectedCategory.asStateFlow()

    init {
        loadProducts()
    }

    /**
     * Load all products.
     */
    fun loadProducts() {
        viewModelScope.launch(Dispatchers.Default) {
            _productsState.value = UiState.Loading

            getProductsUseCase()
                .onSuccess { products ->
                    _productsState.value = UiState.Success(products)
                }
                .onFailure { error ->
                    _productsState.value = UiState.Error(error.message ?: "Failed to load products")
                }
        }
    }

    /**
     * Search products by query.
     */
    fun searchProducts(query: String) {
        _searchQuery.value = query

        if (query.isBlank()) {
            loadProducts()
            return
        }

        viewModelScope.launch(Dispatchers.Default) {
            _productsState.value = UiState.Loading

            searchProductsUseCase(query)
                .onSuccess { products ->
                    _productsState.value = UiState.Success(products)
                }
                .onFailure { error ->
                    _productsState.value = UiState.Error(error.message ?: "Search failed")
                }
        }
    }

    /**
     * Filter products by category.
     */
    fun filterByCategory(categoryId: String?) {
        _selectedCategory.value = categoryId

        if (categoryId == null) {
            loadProducts()
            return
        }

        viewModelScope.launch(Dispatchers.Default) {
            _productsState.value = UiState.Loading

            getProductsByCategoryUseCase(categoryId)
                .onSuccess { products ->
                    _productsState.value = UiState.Success(products)
                }
                .onFailure { error ->
                    _productsState.value =
                        UiState.Error(error.message ?: "Failed to filter products")
                }
        }
    }

    /**
     * Clear search and filters.
     */
    fun clearFilters() {
        _searchQuery.value = ""
        _selectedCategory.value = null
        loadProducts()
    }

    /**
     * Refresh products from server.
     */
    fun refresh() {
        loadProducts()
    }
}