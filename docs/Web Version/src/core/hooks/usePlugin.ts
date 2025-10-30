/**
 * usePlugin Hook
 * 
 * Hook for accessing a specific plugin's functionality.
 */

import { usePlugins } from './usePlugins';
import { Plugin, PluginComponents, PluginServices, PluginHooks, PluginConfig } from '../lib/types/plugin.types';

interface UsePluginReturn {
  /** Whether the plugin is active */
  isActive: boolean;
  
  /** The plugin instance */
  plugin: Plugin | undefined;
  
  /** Plugin components */
  components: PluginComponents;
  
  /** Plugin services */
  services: PluginServices;
  
  /** Plugin hooks */
  hooks: PluginHooks;
  
  /** Plugin configuration */
  config: PluginConfig;
}

export function usePlugin(pluginId: string): UsePluginReturn {
  const { getPlugin, isActive, getConfig } = usePlugins();
  
  const plugin = getPlugin(pluginId);
  const active = isActive(pluginId);
  const config = getConfig(pluginId);

  return {
    isActive: active,
    plugin,
    components: plugin?.components || {},
    services: plugin?.services || {},
    hooks: plugin?.hooks || {},
    config: config || {},
  };
}