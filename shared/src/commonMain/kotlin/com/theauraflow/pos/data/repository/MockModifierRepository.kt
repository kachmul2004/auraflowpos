package com.theauraflow.pos.data.repository

import com.theauraflow.pos.domain.model.Modifier

object MockModifierRepository {
    val mockModifiers = listOf(
        Modifier(id = "1", name = "Extra Cheese", price = 1.50),
        Modifier(id = "2", name = "Bacon", price = 2.00),
        Modifier(id = "3", name = "Avocado", price = 1.75),
        Modifier(id = "4", name = "No Onions", price = 0.0),
        Modifier(id = "5", name = "Extra Sauce", price = 0.50),
        Modifier(id = "6", name = "Gluten Free", price = 2.00),
        Modifier(id = "7", name = "Extra Shot", price = 1.00),
        Modifier(id = "8", name = "Oat Milk", price = 0.75),
        Modifier(id = "9", name = "Whipped Cream", price = 0.50),
        Modifier(id = "10", name = "Sugar Free", price = 0.0)
    )
}
