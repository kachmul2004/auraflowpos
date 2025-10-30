/**
 * Plugin Manager
 * 
 * Central system for managing plugins in AuraFlow POS.
 * Handles registration, activation, deactivation, and dependency resolution.
 */

import { Plugin, Preset, PluginConfig, PluginError, PluginRegistry } from './types/plugin.types';

export class PluginManager {
  private plugins: PluginRegistry = {};
  private activePlugins: Set<string> = new Set();
  private pluginConfigs: Map<string, PluginConfig> = new Map();

  /**
   * Register a plugin with the manager
   */
  registerPlugin(plugin: Plugin): void {
    if (this.plugins[plugin.id]) {
      console.warn(`Plugin ${plugin.id} is already registered. Overwriting.`);
    }
    
    this.plugins[plugin.id] = plugin;
    
    // Store default config
    if (plugin.config) {
      this.pluginConfigs.set(plugin.id, plugin.config);
    }
    
    console.log(`✓ Plugin registered: ${plugin.name} (${plugin.id})`);
  }

  /**
   * Register multiple plugins at once
   */
  registerPlugins(plugins: Plugin[]): void {
    plugins.forEach(plugin => this.registerPlugin(plugin));
  }

  /**
   * Activate a plugin and its dependencies
   */
  async activatePlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins[pluginId];
    
    if (!plugin) {
      throw this.createError(
        pluginId,
        'PLUGIN_NOT_FOUND',
        `Plugin ${pluginId} not found in registry`
      );
    }

    // Check if already active
    if (this.activePlugins.has(pluginId)) {
      console.log(`Plugin ${pluginId} is already active`);
      return;
    }

    // Check dependencies
    if (plugin.dependencies) {
      for (const depId of plugin.dependencies) {
        if (!this.isActive(depId)) {
          throw this.createError(
            pluginId,
            'DEPENDENCY_MISSING',
            `Plugin ${pluginId} requires ${depId} to be active`
          );
        }
      }
    }

    // Run onActivate hook
    try {
      if (plugin.onActivate) {
        await plugin.onActivate();
      }

      this.activePlugins.add(pluginId);
      console.log(`✓ Plugin activated: ${plugin.name}`);
    } catch (error) {
      throw this.createError(
        pluginId,
        'ACTIVATION_FAILED',
        `Failed to activate plugin ${pluginId}: ${error}`
      );
    }
  }

  /**
   * Deactivate a plugin
   */
  async deactivatePlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins[pluginId];
    
    if (!plugin) {
      throw this.createError(
        pluginId,
        'PLUGIN_NOT_FOUND',
        `Plugin ${pluginId} not found`
      );
    }

    if (!this.activePlugins.has(pluginId)) {
      console.log(`Plugin ${pluginId} is already inactive`);
      return;
    }

    // Check if other active plugins depend on this one
    const dependents = this.getActivePlugins().filter(p => 
      p.dependencies?.includes(pluginId)
    );

    if (dependents.length > 0) {
      const dependentNames = dependents.map(p => p.name).join(', ');
      throw this.createError(
        pluginId,
        'DEACTIVATION_FAILED',
        `Cannot deactivate ${pluginId}. Required by: ${dependentNames}`
      );
    }

    // Run onDeactivate hook
    try {
      if (plugin.onDeactivate) {
        await plugin.onDeactivate();
      }

      this.activePlugins.delete(pluginId);
      console.log(`✓ Plugin deactivated: ${plugin.name}`);
    } catch (error) {
      throw this.createError(
        pluginId,
        'DEACTIVATION_FAILED',
        `Failed to deactivate plugin ${pluginId}: ${error}`
      );
    }
  }

  /**
   * Check if a plugin is active
   */
  isActive(pluginId: string): boolean {
    return this.activePlugins.has(pluginId);
  }

  /**
   * Get a plugin by ID
   */
  getPlugin(pluginId: string): Plugin | undefined {
    return this.plugins[pluginId];
  }

  /**
   * Get all registered plugins
   */
  getAllPlugins(): Plugin[] {
    return Object.values(this.plugins);
  }

  /**
   * Get all active plugins
   */
  getActivePlugins(): Plugin[] {
    return Array.from(this.activePlugins)
      .map(id => this.plugins[id])
      .filter(Boolean);
  }

  /**
   * Get active plugin IDs
   */
  getActivePluginIds(): string[] {
    return Array.from(this.activePlugins);
  }

  /**
   * Get plugin configuration
   */
  getPluginConfig(pluginId: string): PluginConfig | undefined {
    return this.pluginConfigs.get(pluginId);
  }

  /**
   * Update plugin configuration
   */
  setPluginConfig(pluginId: string, config: Partial<PluginConfig>): void {
    const existing = this.pluginConfigs.get(pluginId) || {};
    this.pluginConfigs.set(pluginId, { ...existing, ...config });
  }

  /**
   * Load a preset (activate all plugins in preset)
   */
  async loadPreset(preset: Preset): Promise<void> {
    console.log(`Loading preset: ${preset.name}`);

    // Apply plugin configs from preset
    if (preset.pluginConfig) {
      Object.entries(preset.pluginConfig).forEach(([pluginId, config]) => {
        this.setPluginConfig(pluginId, config);
      });
    }

    // Activate plugins in order (respecting dependencies)
    for (const pluginId of preset.plugins) {
      try {
        await this.activatePlugin(pluginId);
      } catch (error) {
        console.error(`Failed to activate plugin ${pluginId}:`, error);
        // Continue with other plugins
      }
    }

    console.log(`✓ Preset loaded: ${preset.name}`);
  }

  /**
   * Deactivate all plugins
   */
  async deactivateAll(): Promise<void> {
    const pluginIds = Array.from(this.activePlugins);
    
    for (const pluginId of pluginIds) {
      try {
        await this.deactivatePlugin(pluginId);
      } catch (error) {
        console.error(`Failed to deactivate plugin ${pluginId}:`, error);
      }
    }
  }

  /**
   * Get plugins recommended for an industry
   */
  getPluginsForIndustry(industry: string): Plugin[] {
    return this.getAllPlugins().filter(plugin =>
      plugin.recommendedFor?.includes(industry)
    );
  }

  /**
   * Get plugins by tier
   */
  getPluginsByTier(tier: 'free' | 'standard' | 'premium' | 'enterprise'): Plugin[] {
    return this.getAllPlugins().filter(plugin => plugin.tier === tier);
  }

  /**
   * Check if all dependencies are met for a plugin
   */
  areDependenciesMet(pluginId: string): boolean {
    const plugin = this.plugins[pluginId];
    if (!plugin || !plugin.dependencies) return true;

    return plugin.dependencies.every(depId => this.isActive(depId));
  }

  /**
   * Get missing dependencies for a plugin
   */
  getMissingDependencies(pluginId: string): string[] {
    const plugin = this.plugins[pluginId];
    if (!plugin || !plugin.dependencies) return [];

    return plugin.dependencies.filter(depId => !this.isActive(depId));
  }

  /**
   * Create a plugin error
   */
  private createError(
    pluginId: string,
    code: PluginError['code'],
    message: string
  ): PluginError {
    const error = new Error(message) as PluginError;
    error.pluginId = pluginId;
    error.code = code;
    return error;
  }

  /**
   * Debug: Print current state
   */
  debug(): void {
    console.group('Plugin Manager State');
    console.log('Registered plugins:', Object.keys(this.plugins).length);
    console.log('Active plugins:', Array.from(this.activePlugins));
    console.log('Plugin configs:', this.pluginConfigs);
    console.groupEnd();
  }
}

// Singleton instance
export const pluginManager = new PluginManager();
