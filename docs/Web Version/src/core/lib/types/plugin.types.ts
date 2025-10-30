/**
 * Plugin System Type Definitions
 * 
 * Defines the interface for the AuraFlow POS plugin architecture.
 * All plugins must conform to the Plugin interface.
 */

import { ComponentType } from 'react';

export type PluginTier = 'free' | 'standard' | 'premium' | 'enterprise';

export interface PluginComponents {
  /** Component rendered in the POS view */
  posView?: ComponentType<any>;
  
  /** Full-page admin module */
  adminModule?: ComponentType<any>;
  
  /** Button in the action bar */
  actionBarButton?: ComponentType<any>;
  
  /** Settings page for this plugin */
  settingsPage?: ComponentType<any>;
  
  /** Additional components exposed by plugin */
  [key: string]: ComponentType<any> | undefined;
}

export interface PluginServices {
  [serviceName: string]: (...args: any[]) => any;
}

export interface PluginHooks {
  [hookName: string]: (...args: any[]) => any;
}

export interface PluginStoreExtensions {
  /** State to add to global store */
  state?: Record<string, any>;
  
  /** Actions to add to global store */
  actions?: Record<string, (...args: any[]) => any>;
  
  /** Getters to add to global store */
  getters?: Record<string, (...args: any[]) => any>;
}

export interface PluginConfig {
  /** Feature flags */
  features?: Record<string, boolean>;
  
  /** UI settings */
  ui?: Record<string, any>;
  
  /** Keyboard shortcuts */
  shortcuts?: Record<string, string>;
  
  /** Custom configuration */
  [key: string]: any;
}

export interface Plugin {
  /** Unique plugin identifier */
  id: string;
  
  /** Human-readable name */
  name: string;
  
  /** Semantic version */
  version: string;
  
  /** Description of plugin functionality */
  description: string;
  
  /** React components provided by plugin */
  components?: PluginComponents;
  
  /** Custom hooks provided by plugin */
  hooks?: PluginHooks;
  
  /** Service functions provided by plugin */
  services?: PluginServices;
  
  /** Extensions to global store */
  storeExtensions?: PluginStoreExtensions;
  
  /** Default configuration */
  config?: PluginConfig;
  
  /** Required plugins (must be active) */
  dependencies?: string[];
  
  /** Optional plugins (enhanced if present) */
  optionalDependencies?: string[];
  
  /** Industries this plugin is recommended for */
  recommendedFor?: string[];
  
  /** Licensing tier */
  tier?: PluginTier;
  
  /** Plugin author/maintainer */
  author?: string;
  
  /** Lifecycle hooks */
  onActivate?: () => void | Promise<void>;
  onDeactivate?: () => void | Promise<void>;
  onInit?: () => void | Promise<void>;
}

export interface Preset {
  /** Unique preset identifier */
  id: string;
  
  /** Human-readable name */
  name: string;
  
  /** Description of preset */
  description: string;
  
  /** Icon/emoji for this preset */
  icon?: string;
  
  /** Plugin IDs to activate */
  plugins: string[];
  
  /** Configuration overrides per plugin */
  pluginConfig?: Record<string, Partial<PluginConfig>>;
  
  /** Core POS settings */
  coreSettings?: {
    enableTipping?: boolean;
    defaultTaxRate?: number;
    receiptFooter?: string;
    requireCustomer?: boolean;
    [key: string]: any;
  };
  
  /** UI customization */
  ui?: {
    theme?: 'light' | 'dark';
    primaryColor?: string;
    layout?: 'sidebar-cart' | 'grid' | 'compact';
    [key: string]: any;
  };
  
  /** Industry category */
  category?: 'restaurant' | 'retail' | 'services' | 'healthcare' | 'other' | 'all';
}

export interface PluginRegistry {
  [pluginId: string]: Plugin;
}

export interface PresetRegistry {
  [presetId: string]: Preset;
}

export interface PluginError extends Error {
  pluginId: string;
  code: 'PLUGIN_NOT_FOUND' | 'DEPENDENCY_MISSING' | 'ACTIVATION_FAILED' | 'DEACTIVATION_FAILED';
}