/**
 * Cafe Preset
 * 
 * Coffee shop / cafe configuration with order types and loyalty program.
 */

import { Preset } from '../core/lib/types/plugin.types';

export const cafePreset: Preset = {
  id: 'cafe',
  name: 'Coffee Shop / Cafe',
  description: 'Cafe POS with order types, loyalty program, and quick service features',
  icon: '☕',
  category: 'restaurant',
  
  plugins: [
    'order-types',
    'loyalty-program',
    'open-tabs',
  ],
  
  pluginConfig: {
    'order-types': {
      features: {
        enableDineIn: true,
        enableTakeout: true,
        enableDelivery: false,
      },
      ui: {
        defaultType: 'takeout',
        showTypeSelector: true,
      },
    },
    'loyalty-program': {
      features: {
        enablePoints: true,
        enableRewards: true,
      },
      points: {
        pointsPerDollar: 1,
        redeemableAt: 50, // Lower threshold for cafes
      },
      ui: {
        showBalance: true,
      },
    },
    'open-tabs': {
      features: {
        autoClose: true,
        maxTabDuration: 480, // 8 hours
      },
    },
  },
  
  coreSettings: {
    enableTipping: true,
    defaultTaxRate: 0.08,
    receiptFooter: 'Thank you! See you next time!',
    requireCustomer: false,
  },
  
  ui: {
    theme: 'dark',
    primaryColor: '#F59E0B',
    layout: 'sidebar-cart',
  },
};