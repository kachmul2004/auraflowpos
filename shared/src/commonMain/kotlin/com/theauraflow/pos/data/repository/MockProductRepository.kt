package com.theauraflow.pos.data.repository

import com.theauraflow.pos.domain.model.Product
import com.theauraflow.pos.domain.repository.ProductRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow

class MockProductRepository : ProductRepository {
    private val mockProducts = listOf(
        // Food Category
        Product(
            id = "1",
            name = "Classic Burger",
            price = 12.99,
            sku = "FOOD-001",
            barcode = "0123456789012",
            categoryName = "Food",
            stockQuantity = 45,
            imageUrl = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400"
        ),
        Product(
            id = "2",
            name = "Margherita Pizza",
            price = 14.99,
            sku = "FOOD-002",
            barcode = "0123456789029",
            categoryName = "Food",
            stockQuantity = 30,
            imageUrl = "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400"
        ),
        Product(
            id = "3",
            name = "Caesar Salad",
            price = 9.99,
            sku = "FOOD-003",
            barcode = "0123456789036",
            categoryName = "Food",
            stockQuantity = 25,
            imageUrl = "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400"
        ),
        Product(
            id = "4",
            name = "Grilled Salmon",
            price = 18.99,
            sku = "FOOD-004",
            barcode = "0123456789043",
            categoryName = "Food",
            stockQuantity = 20,
            imageUrl = "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400"
        ),
        Product(
            id = "5",
            name = "Chicken Sandwich",
            price = 11.99,
            sku = "FOOD-005",
            barcode = "0123456789050",
            categoryName = "Food",
            stockQuantity = 35,
            imageUrl = "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400"
        ),
        Product(
            id = "6",
            name = "Pasta Carbonara",
            price = 13.99,
            sku = "FOOD-006",
            barcode = "0123456789067",
            categoryName = "Food",
            stockQuantity = 28,
            imageUrl = "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400"
        ),
        Product(
            id = "7",
            name = "Tacos (3pc)",
            price = 10.99,
            sku = "FOOD-007",
            barcode = "0123456789074",
            categoryName = "Food",
            stockQuantity = 40,
            imageUrl = "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400"
        ),
        Product(
            id = "8",
            name = "Sushi Roll Set",
            price = 16.99,
            sku = "FOOD-008",
            barcode = "0123456789081",
            categoryName = "Food",
            stockQuantity = 22,
            imageUrl = "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400"
        ),
        Product(
            id = "9",
            name = "French Fries",
            price = 4.99,
            sku = "FOOD-009",
            barcode = "0123456789098",
            categoryName = "Food",
            stockQuantity = 60,
            imageUrl = "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=400"
        ),
        Product(
            id = "10",
            name = "Hot Dog",
            price = 6.99,
            sku = "FOOD-010",
            barcode = "0123456789105",
            categoryName = "Food",
            stockQuantity = 50,
            imageUrl = "https://images.unsplash.com/photo-1612392062422-ef19b42f74df?w=400"
        ),

        // Beverages Category
        Product(
            id = "11",
            name = "Cappuccino",
            price = 4.99,
            sku = "BEV-001",
            barcode = "0123456789112",
            categoryName = "Beverages",
            stockQuantity = 100,
            imageUrl = "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400"
        ),
        Product(
            id = "12",
            name = "Fresh Orange Juice",
            price = 5.99,
            sku = "BEV-002",
            barcode = "0123456789129",
            categoryName = "Beverages",
            stockQuantity = 80,
            imageUrl = "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400"
        ),
        Product(
            id = "13",
            name = "Iced Latte",
            price = 5.49,
            sku = "BEV-003",
            barcode = "0123456789136",
            categoryName = "Beverages",
            stockQuantity = 90,
            imageUrl = "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400"
        ),
        Product(
            id = "14",
            name = "Green Tea",
            price = 3.99,
            sku = "BEV-004",
            barcode = "0123456789143",
            categoryName = "Beverages",
            stockQuantity = 70,
            imageUrl = "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400"
        ),
        Product(
            id = "15",
            name = "Smoothie Bowl",
            price = 7.99,
            sku = "BEV-005",
            barcode = "0123456789150",
            categoryName = "Beverages",
            stockQuantity = 40,
            imageUrl = "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400"
        ),
        Product(
            id = "16",
            name = "Milkshake",
            price = 6.99,
            sku = "BEV-006",
            barcode = "0123456789167",
            categoryName = "Beverages",
            stockQuantity = 55,
            imageUrl = "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400"
        ),
        Product(
            id = "17",
            name = "Coca Cola",
            price = 2.99,
            sku = "BEV-007",
            barcode = "0123456789174",
            categoryName = "Beverages",
            stockQuantity = 150,
            imageUrl = "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400"
        ),
        Product(
            id = "18",
            name = "Espresso",
            price = 3.49,
            sku = "BEV-008",
            barcode = "0123456789181",
            categoryName = "Beverages",
            stockQuantity = 120,
            imageUrl = "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400"
        ),
        Product(
            id = "19",
            name = "Lemonade",
            price = 3.99,
            sku = "BEV-009",
            barcode = "0123456789198",
            categoryName = "Beverages",
            stockQuantity = 85,
            imageUrl = "https://images.unsplash.com/photo-1523677011781-c91d1bbe6e20?w=400"
        ),
        Product(
            id = "20",
            name = "Iced Tea",
            price = 3.49,
            sku = "BEV-010",
            barcode = "0123456789205",
            categoryName = "Beverages",
            stockQuantity = 95,
            imageUrl = "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400"
        ),

        // Retail Category
        Product(
            id = "21",
            name = "Wireless Headphones",
            price = 79.99,
            sku = "RET-001",
            barcode = "0123456789212",
            categoryName = "Retail",
            stockQuantity = 15,
            imageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"
        ),
        Product(
            id = "22",
            name = "Bluetooth Speaker",
            price = 49.99,
            sku = "RET-002",
            barcode = "0123456789229",
            categoryName = "Retail",
            stockQuantity = 20,
            imageUrl = "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400"
        ),
        Product(
            id = "23",
            name = "Phone Case",
            price = 19.99,
            sku = "RET-003",
            barcode = "0123456789236",
            categoryName = "Retail",
            stockQuantity = 50,
            imageUrl = "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400"
        ),
        Product(
            id = "24",
            name = "Sunglasses",
            price = 29.99,
            sku = "RET-004",
            barcode = "0123456789243",
            categoryName = "Retail",
            stockQuantity = 35,
            imageUrl = "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400"
        ),
        Product(
            id = "25",
            name = "Backpack",
            price = 59.99,
            sku = "RET-005",
            barcode = "0123456789250",
            categoryName = "Retail",
            stockQuantity = 18,
            imageUrl = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"
        ),
        Product(
            id = "26",
            name = "Water Bottle",
            price = 14.99,
            sku = "RET-006",
            barcode = "0123456789267",
            categoryName = "Retail",
            stockQuantity = 45,
            imageUrl = "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400"
        ),
        Product(
            id = "27",
            name = "Yoga Mat",
            price = 34.99,
            sku = "RET-007",
            barcode = "0123456789274",
            categoryName = "Retail",
            stockQuantity = 25,
            imageUrl = "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400"
        ),
        Product(
            id = "28",
            name = "Running Shoes",
            price = 89.99,
            sku = "RET-008",
            barcode = "0123456789281",
            categoryName = "Retail",
            stockQuantity = 12,
            imageUrl = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"
        ),
        Product(
            id = "29",
            name = "T-Shirt",
            price = 24.99,
            sku = "RET-009",
            barcode = "0123456789298",
            categoryName = "Retail",
            stockQuantity = 40,
            imageUrl = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"
        ),
        Product(
            id = "30",
            name = "Baseball Cap",
            price = 19.99,
            sku = "RET-010",
            barcode = "0123456789305",
            categoryName = "Retail",
            stockQuantity = 30,
            imageUrl = "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400"
        )
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
