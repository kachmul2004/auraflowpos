/**
 * Retail Preset
 * 
 * Standard retail store configuration with barcode scanning,
 * loyalty program, and inventory management.
 */

import { Preset } from '../core/lib/types/plugin.types';

export const retailPreset: Preset = {
  id: 'retail',
  name: 'Retail Store',
  description: 'Standard retail POS with barcode scanning, loyalty rewards, and inventory tracking',
  icon: '🏪',
  category: 'retail',
  
  plugins: [
    'barcode-scanner',
    'loyalty-program',
    'inventory-advanced',
  ],
  
  pluginConfig: {
    'barcode-scanner': {
      features: {
        autoLookup: true,
        soundEffects: true,
        multiScan: true,
      },
      scanner: {
        codeTypes: ['EAN13', 'UPC', 'CODE128', 'QR'],
        timeout: 5000,
      },
      ui: {
        showScanButton: true,
        showScanCount: true,
        position: 'action-bar',
      },
      shortcuts: {
        toggleScanner: 'Ctrl+B',
      },
    },
    'loyalty-program': {
      features: {
        enablePoints: true,
        enableTiers: true,
        enableRewards: true,
      },
      points: {
        pointsPerDollar: 1,
        redeemableAt: 100,
        expirationDays: 365,
      },
      ui: {
        showBalance: true,
        showHistory: true,
      },
    },
    'inventory-advanced': {
      features: {
        enableLowStockAlerts: true,
        enableAutoReorder: false,
        enableMultiLocation: false,
      },
      alerts: {
        lowStockThreshold: 10,
        criticalStockThreshold: 5,
      },
    },
  },
  
  coreSettings: {
    enableTipping: false,
    defaultTaxRate: 0.08,
    receiptFooter: 'Thank you for shopping with us!',
    requireCustomer: false,
  },
  
  ui: {
    theme: 'dark',
    primaryColor: '#3B82F6',
    layout: 'sidebar-cart',
  },
};