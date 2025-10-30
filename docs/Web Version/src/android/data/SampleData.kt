package com.auraflow.pos.data

import com.auraflow.pos.data.models.*

object SampleData {
    
    // ============================================================================
    // CATEGORIES
    // ============================================================================
    
    val categories = listOf(
        Category("all", "All", "grid", "#3B82F6"),
        Category("coffee", "Coffee", "coffee", "#8B4513"),
        Category("food", "Food", "utensils", "#F59E0B"),
        Category("drinks", "Drinks", "wine", "#EC4899"),
        Category("desserts", "Desserts", "cake-slice", "#A855F7"),
        Category("merchandise", "Merch", "shopping-bag", "#10B981")
    )
    
    // ============================================================================
    // PRODUCTS
    // ============================================================================
    
    val products = listOf(
        // Coffee Products
        Product(
            id = "1",
            name = "Espresso",
            price = 3.50,
            category = "coffee",
            imageUrl = "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400",
            stock = 100,
            sku = "COF-ESP-001",
            barcode = "1234567890001",
            description = "Rich, bold espresso shot",
            variations = listOf(
                ProductVariation(
                    name = "Size",
                    options = listOf(
                        VariationOption("single", "Single", 0.0),
                        VariationOption("double", "Double", 1.50)
                    )
                )
            ),
            modifiers = listOf(
                Modifier("extra-shot", "Extra Shot", 1.50),
                Modifier("decaf", "Decaf", 0.50)
            )
        ),
        Product(
            id = "2",
            name = "Cappuccino",
            price = 4.50,
            category = "coffee",
            imageUrl = "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400",
            stock = 100,
            sku = "COF-CAP-001",
            barcode = "1234567890002",
            description = "Espresso with steamed milk and foam",
            variations = listOf(
                ProductVariation(
                    name = "Size",
                    options = listOf(
                        VariationOption("small", "Small", 0.0),
                        VariationOption("medium", "Medium", 1.00),
                        VariationOption("large", "Large", 2.00)
                    )
                )
            ),
            modifiers = listOf(
                Modifier("extra-shot", "Extra Shot", 1.50),
                Modifier("oat-milk", "Oat Milk", 0.75),
                Modifier("almond-milk", "Almond Milk", 0.75),
                Modifier("sugar-free", "Sugar Free Syrup", 0.50)
            )
        ),
        Product(
            id = "3",
            name = "Latte",
            price = 4.75,
            category = "coffee",
            imageUrl = "https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400",
            stock = 100,
            sku = "COF-LAT-001",
            barcode = "1234567890003",
            variations = listOf(
                ProductVariation(
                    name = "Size",
                    options = listOf(
                        VariationOption("small", "Small", 0.0),
                        VariationOption("medium", "Medium", 1.00),
                        VariationOption("large", "Large", 2.00)
                    )
                ),
                ProductVariation(
                    name = "Flavor",
                    options = listOf(
                        VariationOption("vanilla", "Vanilla", 0.75),
                        VariationOption("caramel", "Caramel", 0.75),
                        VariationOption("hazelnut", "Hazelnut", 0.75),
                        VariationOption("none", "None", 0.0)
                    )
                )
            )
        ),
        Product(
            id = "4",
            name = "Americano",
            price = 3.75,
            category = "coffee",
            imageUrl = "https://images.unsplash.com/photo-1584054461377-0daa9fefff85?w=400",
            stock = 100,
            sku = "COF-AME-001",
            barcode = "1234567890004"
        ),
        Product(
            id = "5",
            name = "Mocha",
            price = 5.25,
            category = "coffee",
            imageUrl = "https://images.unsplash.com/photo-1607260550778-aa5c0b086cf0?w=400",
            stock = 100,
            sku = "COF-MOC-001"
        ),
        
        // Food Products
        Product(
            id = "6",
            name = "Croissant",
            price = 3.95,
            category = "food",
            imageUrl = "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400",
            stock = 50,
            sku = "FOD-CRO-001",
            barcode = "1234567890006",
            variations = listOf(
                ProductVariation(
                    name = "Type",
                    options = listOf(
                        VariationOption("plain", "Plain", 0.0),
                        VariationOption("chocolate", "Chocolate", 0.50),
                        VariationOption("almond", "Almond", 0.75)
                    )
                )
            )
        ),
        Product(
            id = "7",
            name = "Bagel with Cream Cheese",
            price = 4.50,
            category = "food",
            imageUrl = "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400",
            stock = 50,
            sku = "FOD-BAG-001",
            modifiers = listOf(
                Modifier("extra-cc", "Extra Cream Cheese", 1.00),
                Modifier("lox", "Add Lox", 3.50)
            )
        ),
        Product(
            id = "8",
            name = "Avocado Toast",
            price = 8.95,
            category = "food",
            imageUrl = "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=400",
            stock = 30,
            sku = "FOD-AVO-001",
            modifiers = listOf(
                Modifier("add-egg", "Add Egg", 2.00),
                Modifier("add-bacon", "Add Bacon", 2.50)
            )
        ),
        Product(
            id = "9",
            name = "Breakfast Sandwich",
            price = 7.50,
            category = "food",
            imageUrl = "https://images.unsplash.com/photo-1619881589558-d0b1d2a2e8c6?w=400",
            stock = 40,
            sku = "FOD-BRK-001"
        ),
        Product(
            id = "10",
            name = "Caesar Salad",
            price = 9.95,
            category = "food",
            imageUrl = "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400",
            stock = 25,
            sku = "FOD-SAL-001",
            modifiers = listOf(
                Modifier("add-chicken", "Add Chicken", 3.50),
                Modifier("add-shrimp", "Add Shrimp", 4.50)
            )
        ),
        
        // Drinks
        Product(
            id = "11",
            name = "Orange Juice",
            price = 3.50,
            category = "drinks",
            imageUrl = "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400",
            stock = 60,
            sku = "DRK-OJ-001",
            variations = listOf(
                ProductVariation(
                    name = "Size",
                    options = listOf(
                        VariationOption("small", "Small", 0.0),
                        VariationOption("large", "Large", 1.50)
                    )
                )
            )
        ),
        Product(
            id = "12",
            name = "Smoothie",
            price = 6.50,
            category = "drinks",
            imageUrl = "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400",
            stock = 40,
            sku = "DRK-SMO-001",
            variations = listOf(
                ProductVariation(
                    name = "Flavor",
                    options = listOf(
                        VariationOption("strawberry", "Strawberry", 0.0),
                        VariationOption("mango", "Mango", 0.0),
                        VariationOption("berry", "Mixed Berry", 0.0),
                        VariationOption("green", "Green", 0.50)
                    )
                )
            ),
            modifiers = listOf(
                Modifier("protein", "Add Protein", 2.00),
                Modifier("chia", "Add Chia Seeds", 1.00)
            )
        ),
        Product(
            id = "13",
            name = "Iced Tea",
            price = 3.25,
            category = "drinks",
            imageUrl = "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400",
            stock = 80,
            sku = "DRK-TEA-001"
        ),
        
        // Desserts
        Product(
            id = "14",
            name = "Chocolate Cake",
            price = 5.95,
            category = "desserts",
            imageUrl = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
            stock = 20,
            sku = "DES-CAK-001"
        ),
        Product(
            id = "15",
            name = "Cheesecake",
            price = 6.50,
            category = "desserts",
            imageUrl = "https://images.unsplash.com/photo-1533134242820-b4f3b6f67866?w=400",
            stock = 20,
            sku = "DES-CHE-001",
            variations = listOf(
                ProductVariation(
                    name = "Flavor",
                    options = listOf(
                        VariationOption("classic", "Classic", 0.0),
                        VariationOption("strawberry", "Strawberry", 0.50),
                        VariationOption("chocolate", "Chocolate", 0.50)
                    )
                )
            )
        ),
        Product(
            id = "16",
            name = "Cookie",
            price = 2.50,
            category = "desserts",
            imageUrl = "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400",
            stock = 100,
            sku = "DES-COO-001",
            variations = listOf(
                ProductVariation(
                    name = "Type",
                    options = listOf(
                        VariationOption("choc-chip", "Chocolate Chip", 0.0),
                        VariationOption("oatmeal", "Oatmeal Raisin", 0.0),
                        VariationOption("sugar", "Sugar", 0.0)
                    )
                )
            )
        ),
        Product(
            id = "17",
            name = "Brownie",
            price = 3.95,
            category = "desserts",
            imageUrl = "https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=400",
            stock = 50,
            sku = "DES-BRO-001"
        ),
        
        // Merchandise
        Product(
            id = "18",
            name = "Travel Mug",
            price = 15.99,
            category = "merchandise",
            imageUrl = "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400",
            stock = 30,
            sku = "MER-MUG-001",
            taxable = true
        ),
        Product(
            id = "19",
            name = "Coffee Beans (1lb)",
            price = 14.99,
            category = "merchandise",
            imageUrl = "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
            stock = 50,
            sku = "MER-BEA-001",
            variations = listOf(
                ProductVariation(
                    name = "Roast",
                    options = listOf(
                        VariationOption("light", "Light Roast", 0.0),
                        VariationOption("medium", "Medium Roast", 0.0),
                        VariationOption("dark", "Dark Roast", 0.0)
                    )
                )
            )
        ),
        Product(
            id = "20",
            name = "T-Shirt",
            price = 19.99,
            category = "merchandise",
            imageUrl = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
            stock = 40,
            sku = "MER-TSH-001",
            variations = listOf(
                ProductVariation(
                    name = "Size",
                    options = listOf(
                        VariationOption("s", "Small", 0.0),
                        VariationOption("m", "Medium", 0.0),
                        VariationOption("l", "Large", 0.0),
                        VariationOption("xl", "X-Large", 2.00)
                    )
                )
            )
        )
    )
    
    // ============================================================================
    // USERS
    // ============================================================================
    
    val users = listOf(
        User(
            id = "user1",
            name = "John Cashier",
            email = "cashier@auraflow.com",
            role = UserRole.CASHIER,
            pin = "1234",
            permissions = setOf(
                Permission.CLOCK_IN_OUT
            )
        ),
        User(
            id = "user2",
            name = "Sarah Manager",
            email = "manager@auraflow.com",
            role = UserRole.MANAGER,
            pin = "5678",
            permissions = setOf(
                Permission.MANAGE_PRODUCTS,
                Permission.VOID_TRANSACTIONS,
                Permission.REFUND_ORDERS,
                Permission.PRICE_OVERRIDE,
                Permission.DISCOUNT_ITEMS,
                Permission.VIEW_REPORTS,
                Permission.MANAGE_CASH_DRAWER,
                Permission.CLOCK_IN_OUT
            )
        ),
        User(
            id = "user3",
            name = "Admin User",
            email = "admin@auraflow.com",
            role = UserRole.ADMIN,
            pin = "9999",
            permissions = Permission.values().toSet()
        )
    )
    
    // ============================================================================
    // CUSTOMERS
    // ============================================================================
    
    val customers = listOf(
        Customer(
            id = "cust1",
            name = "Alice Johnson",
            email = "alice@example.com",
            phone = "(555) 123-4567",
            loyaltyPoints = 150,
            totalSpent = 487.50,
            visitCount = 23
        ),
        Customer(
            id = "cust2",
            name = "Bob Smith",
            email = "bob@example.com",
            phone = "(555) 234-5678",
            loyaltyPoints = 89,
            totalSpent = 234.75,
            visitCount = 12
        ),
        Customer(
            id = "cust3",
            name = "Carol White",
            email = "carol@example.com",
            phone = "(555) 345-6789",
            loyaltyPoints = 320,
            totalSpent = 1024.00,
            visitCount = 45
        )
    )
    
    // ============================================================================
    // GIFT CARDS
    // ============================================================================
    
    val giftCards = listOf(
        GiftCard("GC001", 50.00),
        GiftCard("GC002", 100.00),
        GiftCard("GC003", 25.00)
    )
    
    // ============================================================================
    // BUSINESS PROFILE
    // ============================================================================
    
    val businessProfile = BusinessProfile(
        name = "AuraFlow Café",
        address = "123 Main Street, Downtown",
        phone = "(555) 123-4567",
        email = "info@auraflowcafe.com",
        taxRate = 0.08,
        currency = "USD",
        receiptHeader = "Thank you for visiting!",
        receiptFooter = "Please visit again soon!",
        subscriptions = listOf("cafe", "loyalty-program"),
        industryType = IndustryType.CAFE
    )
}
