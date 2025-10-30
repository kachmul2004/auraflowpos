package com.theauraflow.pos.presentation.viewmodel

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import com.theauraflow.pos.domain.model.Product

/**
 * ViewModel for managing product state and operations
 */
class ComposeProductViewModel : ViewModel() {
    private val _products = MutableStateFlow<List<Product>>(emptyList())
    val products: StateFlow<List<Product>> = _products.asStateFlow()

    private val _selectedCategory = MutableStateFlow("All")
    val selectedCategory: StateFlow<String> = _selectedCategory.asStateFlow()

    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    init {
        loadProducts()
    }

    fun loadProducts() {
        // TODO: Load products from repository
        _products.value = emptyList()
    }

    fun setCategory(category: String) {
        _selectedCategory.value = category
    }

    fun search(query: String) {
        _searchQuery.value = query
    }
}
