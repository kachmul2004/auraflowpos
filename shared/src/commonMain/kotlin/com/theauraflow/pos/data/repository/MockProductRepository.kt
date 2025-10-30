package com.theauraflow.pos.data.repository

import com.theauraflow.pos.domain.model.Product
import com.theauraflow.pos.domain.repository.ProductRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow

class MockProductRepository : ProductRepository {
    private val mockProducts = listOf(
        Product(
            id = "1",
            name = "Organic Apples",
            price = 2.99,
            sku = "FRT-001",
            barcode = "0123456789012",
            categoryName = "Fruits",
            stockQuantity = 50,
            imageUrl = null
        ),
        Product(
            id = "2",
            name = "Whole Wheat Bread",
            price = 4.5,
            sku = "BAK-001",
            barcode = "0123456789029",
            categoryName = "Bakery",
            stockQuantity = 30,
            imageUrl = null
        ),
        Product(
            id = "3",
            name = "Free-Range Eggs",
            price = 5.2,
            sku = "DAI-001",
            barcode = "0123456789036",
            categoryName = "Dairy",
            stockQuantity = 25,
            imageUrl = null
        ),
        Product(
            id = "4",
            name = "Almond Milk",
            price = 3.75,
            sku = "DAI-002",
            barcode = "0123456789043",
            categoryName = "Dairy",
            stockQuantity = 40,
            imageUrl = null
        ),
        Product(
            id = "5",
            name = "Cheddar Cheese",
            price = 7.0,
            sku = "DAI-003",
            barcode = "0123456789050",
            categoryName = "Dairy",
            stockQuantity = 20,
            imageUrl = null
        )
        // ...more products if needed...
    )

    private val _products = MutableStateFlow(mockProducts)

    override fun observeProducts(): Flow<List<Product>> = _products.asStateFlow()
    override fun observeProduct(id: String): Flow<Product?> =
        MutableStateFlow(mockProducts.find { it.id == id })

    override suspend fun getProducts(): Result<List<Product>> = Result.success(mockProducts)
    override suspend fun getProductsByCategory(categoryId: String): Result<List<Product>> =
        Result.success(mockProducts.filter { it.categoryName?.equals(categoryId, true) == true })

    override suspend fun getProductById(id: String): Result<Product> =
        mockProducts.find { it.id == id }?.let { Result.success(it) } ?: Result.failure(
            NoSuchElementException("Product $id not found")
        )

    override suspend fun searchProducts(query: String): Result<List<Product>> =
        Result.success(mockProducts.filter { it.name.contains(query, ignoreCase = true) })

    override suspend fun createProduct(product: Product): Result<Product> =
        Result.failure(NotImplementedError("Mock only"))

    override suspend fun updateProduct(product: Product): Result<Product> =
        Result.failure(NotImplementedError("Mock only"))

    override suspend fun deleteProduct(id: String): Result<Unit> =
        Result.failure(NotImplementedError("Mock only"))

    override suspend fun refreshProducts(): Result<Unit> = Result.success(Unit)
}
