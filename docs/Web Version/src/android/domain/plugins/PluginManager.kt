package com.auraflow.pos.domain.plugins

/**
 * Plugin system for modular feature management
 * Allows enabling/disabling features dynamically
 */
class PluginManager {
    
    private val plugins = mutableMapOf<String, Plugin>()
    private val activePlugins = mutableSetOf<String>()
    
    fun registerPlugin(plugin: Plugin) {
        plugins[plugin.id] = plugin
    }
    
    fun activatePlugin(pluginId: String): Boolean {
        val plugin = plugins[pluginId] ?: return false
        
        // Check dependencies
        if (!plugin.dependencies.all { isActive(it) }) {
            return false
        }
        
        activePlugins.add(pluginId)
        plugin.onActivate()
        return true
    }
    
    fun deactivatePlugin(pluginId: String): Boolean {
        val plugin = plugins[pluginId] ?: return false
        
        // Check if other plugins depend on this
        val dependents = plugins.values.filter { 
            it.dependencies.contains(pluginId) && isActive(it.id)
        }
        
        if (dependents.isNotEmpty()) {
            return false // Cannot deactivate if others depend on it
        }
        
        activePlugins.remove(pluginId)
        plugin.onDeactivate()
        return true
    }
    
    fun isActive(pluginId: String): Boolean {
        return activePlugins.contains(pluginId)
    }
    
    fun getPlugin(pluginId: String): Plugin? {
        return plugins[pluginId]
    }
    
    fun getActivePlugins(): List<Plugin> {
        return activePlugins.mapNotNull { plugins[it] }
    }
    
    fun getAllPlugins(): List<Plugin> {
        return plugins.values.toList()
    }
}

// ============================================================================
// PLUGIN INTERFACE
// ============================================================================

interface Plugin {
    val id: String
    val name: String
    val description: String
    val version: String
    val dependencies: List<String>
    
    fun onActivate()
    fun onDeactivate()
}

// ============================================================================
// BUILT-IN PLUGINS
// ============================================================================

class BarcodePlugin : Plugin {
    override val id = "barcode-scanner"
    override val name = "Barcode Scanner"
    override val description = "Scan product barcodes for quick entry"
    override val version = "1.0.0"
    override val dependencies = emptyList<String>()
    
    override fun onActivate() {
        // Initialize barcode scanner
    }
    
    override fun onDeactivate() {
        // Clean up barcode scanner
    }
}

class LoyaltyPlugin : Plugin {
    override val id = "loyalty-program"
    override val name = "Loyalty Program"
    override val description = "Customer loyalty and rewards system"
    override val version = "1.0.0"
    override val dependencies = listOf("customer-management")
    
    override fun onActivate() {
        // Initialize loyalty system
    }
    
    override fun onDeactivate() {
        // Clean up loyalty system
    }
}

class KitchenDisplayPlugin : Plugin {
    override val id = "kitchen-display"
    override val name = "Kitchen Display System"
    override val description = "Display orders in kitchen/prep area"
    override val version = "1.0.0"
    override val dependencies = listOf("order-types")
    
    override fun onActivate() {
        // Initialize kitchen display
    }
    
    override fun onDeactivate() {
        // Clean up kitchen display
    }
}

class TableManagementPlugin : Plugin {
    override val id = "table-management"
    override val name = "Table Management"
    override val description = "Manage dining tables and seating"
    override val version = "1.0.0"
    override val dependencies = emptyList<String>()
    
    override fun onActivate() {
        // Initialize table management
    }
    
    override fun onDeactivate() {
        // Clean up table management
    }
}

class OpenTabsPlugin : Plugin {
    override val id = "open-tabs"
    override val name = "Open Tabs"
    override val description = "Keep customer tabs open (bar/restaurant)"
    override val version = "1.0.0"
    override val dependencies = listOf("customer-management")
    
    override fun onActivate() {
        // Initialize tabs system
    }
    
    override fun onDeactivate() {
        // Clean up tabs system
    }
}

class InventoryPlugin : Plugin {
    override val id = "inventory-tracking"
    override val name = "Inventory Tracking"
    override val description = "Track stock levels and reorder points"
    override val version = "1.0.0"
    override val dependencies = emptyList<String>()
    
    override fun onActivate() {
        // Initialize inventory tracking
    }
    
    override fun onDeactivate() {
        // Clean up inventory tracking
    }
}

class AppointmentsPlugin : Plugin {
    override val id = "appointments"
    override val name = "Appointments"
    override val description = "Schedule and manage appointments"
    override val version = "1.0.0"
    override val dependencies = listOf("customer-management")
    
    override fun onActivate() {
        // Initialize appointments system
    }
    
    override fun onDeactivate() {
        // Clean up appointments system
    }
}

class AgeVerificationPlugin : Plugin {
    override val id = "age-verification"
    override val name = "Age Verification"
    override val description = "Verify customer age for restricted items"
    override val version = "1.0.0"
    override val dependencies = emptyList<String>()
    
    override fun onActivate() {
        // Initialize age verification
    }
    
    override fun onDeactivate() {
        // Clean up age verification
    }
}
