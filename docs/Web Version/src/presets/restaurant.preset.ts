/**
 * Restaurant Preset
 * 
 * Full-service restaurant configuration with table management,
 * kitchen display, and advanced order management.
 */

import { Preset } from '../core/lib/types/plugin.types';

export const restaurantPreset: Preset = {
  id: 'restaurant',
  name: 'Full-Service Restaurant',
  description: 'Complete restaurant POS with table management, kitchen display, and split checks',
  icon: '🍽️',
  category: 'restaurant',
  
  plugins: [
    'table-management',
    'kitchen-display',
    'split-checks',
    'course-management',
    'order-types',
    'open-tabs',
  ],
  
  pluginConfig: {
    'order-types': {
      features: {
        enableDineIn: true,
        enableTakeout: true,
        enableDelivery: true,
      },
      ui: {
        defaultType: 'dine-in',
        showTypeSelector: true,
      },
    },
    'table-management': {
      features: {
        enableSections: true,
        enableReservations: false,
      },
      ui: {
        showFloorPlan: true,
        defaultSections: ['Main Dining', 'Bar', 'Patio'],
      },
    },
    'kitchen-display': {
      features: {
        autoAdvance: true,
        showAllOrders: true,
        enableBumping: true,
      },
      ui: {
        columnsPerView: 3,
        showTimer: true,
      },
    },
    'split-checks': {
      features: {
        enableBySeat: true,
        enableByItem: true,
        enableEvenly: true,
      },
    },
    'course-management': {
      courses: [
        { id: 'appetizer', label: 'Appetizer', order: 1 },
        { id: 'entree', label: 'Entrée', order: 2 },
        { id: 'dessert', label: 'Dessert', order: 3 },
        { id: 'drink', label: 'Drink', order: 0 },
      ],
    },
  },
  
  coreSettings: {
    enableTipping: true,
    defaultTaxRate: 0.08,
    receiptFooter: 'Thank you for dining with us!',
    requireCustomer: false,
  },
  
  ui: {
    theme: 'dark',
    primaryColor: '#EF4444',
    layout: 'sidebar-cart',
  },
};