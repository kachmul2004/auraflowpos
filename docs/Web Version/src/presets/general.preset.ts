/**
 * General Preset
 * 
 * General-purpose configuration with all free features enabled.
 * Good starting point for custom configurations.
 */

import { Preset } from '../core/lib/types/plugin.types';

export const generalPreset: Preset = {
  id: 'general',
  name: 'General / Custom',
  description: 'General-purpose POS with commonly used features - customize to your needs',
  icon: '⚡',
  category: 'other',
  
  plugins: [
    'order-types',
    'loyalty-program',
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
      },
    },
    'loyalty-program': {
      features: {
        enablePoints: true,
        enableRewards: true,
      },
      points: {
        pointsPerDollar: 1,
        redeemableAt: 100,
      },
    },
  },
  
  coreSettings: {
    enableTipping: true,
    defaultTaxRate: 0.08,
    receiptFooter: 'Thank you for your business!',
    requireCustomer: false,
  },
  
  ui: {
    theme: 'dark',
    primaryColor: '#6366F1',
    layout: 'sidebar-cart',
  },
};