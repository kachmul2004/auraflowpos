/**
 * Plugin Configuration
 * 
 * Central configuration for which plugins are available and active.
 */

/**
 * List of plugin IDs that are available in the system.
 * Add new plugin IDs here when creating new plugins.
 */
export const availablePlugins = [
  // Restaurant plugins
  'table-management',
  'kitchen-display',
  'split-checks',
  'course-management',
  'order-types',
  'open-tabs',
  
  // Retail/General plugins
  'barcode-scanner',
  'loyalty-program',
  'inventory-advanced',
  
  // Service plugins
  'appointments',
  
  // Specialized plugins
  'price-checker',
  'layaway',
  'age-verification',
  'prescription-tracking',
] as const;

/**
 * Plugins that are currently active.
 * This can be dynamically updated based on user settings.
 */
export const defaultActivePlugins: string[] = [
  // Default to restaurant preset
  'table-management',
  'kitchen-display',
  'split-checks',
  'course-management',
  'order-types',
  'open-tabs',
];

/**
 * Get active plugins from local storage or use default
 */
export function getActivePlugins(): string[] {
  if (typeof window === 'undefined') return defaultActivePlugins;
  
  const stored = localStorage.getItem('auraflow:activePlugins');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultActivePlugins;
    }
  }
  
  return defaultActivePlugins;
}

/**
 * Save active plugins to local storage
 */
export function setActivePlugins(pluginIds: string[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auraflow:activePlugins', JSON.stringify(pluginIds));
}

/**
 * Package Tiers
 * Define which plugins are available at each subscription level
 */
export const PACKAGES = [
  {
    id: 'free',
    name: 'Free',
    description: 'Basic POS functionality',
    plugins: [],
  },
  {
    id: 'starter',
    name: 'Starter',
    description: 'Essential features for small businesses',
    plugins: [
      'table-management',
      'order-types',
      'barcode-scanner',
      'loyalty-program',
      'age-verification',
      'appointments',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Advanced features for growing businesses',
    plugins: [
      'table-management',
      'kitchen-display',
      'split-checks',
      'course-management',
      'order-types',
      'barcode-scanner',
      'loyalty-program',
      'inventory-advanced',
      'appointments',
      'price-checker',
      'layaway',
      'age-verification',
    ],
  },
  {
    id: 'ultimate',
    name: 'Ultimate',
    description: 'All features unlocked',
    plugins: [
      'table-management',
      'kitchen-display',
      'split-checks',
      'course-management',
      'order-types',
      'open-tabs',
      'barcode-scanner',
      'loyalty-program',
      'inventory-advanced',
      'appointments',
      'price-checker',
      'layaway',
      'age-verification',
      'prescription-tracking',
    ],
  },
] as const;