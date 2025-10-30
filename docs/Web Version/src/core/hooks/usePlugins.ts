/**
 * usePlugins Hook
 * 
 * Main hook for interacting with the plugin system.
 */

import { usePluginManager } from '../contexts/PluginContext';
import { Plugin } from '../lib/types/plugin.types';

export function usePlugins() {
  const manager = usePluginManager();

  return {
    /**
     * Check if a plugin is active
     */
    isActive: (pluginId: string): boolean => {
      return manager.isActive(pluginId);
    },

    /**
     * Get a plugin by ID
     */
    getPlugin: (pluginId: string): Plugin | undefined => {
      return manager.getPlugin(pluginId);
    },

    /**
     * Get all active plugins
     */
    getActivePlugins: (): Plugin[] => {
      return manager.getActivePlugins();
    },

    /**
     * Get all registered plugins
     */
    getAllPlugins: (): Plugin[] => {
      return manager.getAllPlugins();
    },

    /**
     * Get plugin configuration
     */
    getConfig: (pluginId: string) => {
      return manager.getPluginConfig(pluginId);
    },

    /**
     * Update plugin configuration
     */
    setConfig: (pluginId: string, config: any) => {
      manager.setPluginConfig(pluginId, config);
    },

    /**
     * Activate a plugin
     */
    activate: async (pluginId: string) => {
      await manager.activatePlugin(pluginId);
    },

    /**
     * Deactivate a plugin
     */
    deactivate: async (pluginId: string) => {
      await manager.deactivatePlugin(pluginId);
    },

    /**
     * Check if dependencies are met
     */
    areDependenciesMet: (pluginId: string): boolean => {
      return manager.areDependenciesMet(pluginId);
    },

    /**
     * Get missing dependencies
     */
    getMissingDependencies: (pluginId: string): string[] => {
      return manager.getMissingDependencies(pluginId);
    },
  };
}