/**
 * Pharmacy Preset
 * 
 * Pharmacy configuration with prescription tracking,
 * age verification, and barcode scanning for medications.
 */

import { Preset } from '../core/lib/types/plugin.types';

export const pharmacyPreset: Preset = {
  id: 'pharmacy',
  name: 'Pharmacy',
  description: 'Pharmacy POS with prescription tracking, age verification, and medication scanning',
  icon: '💊',
  category: 'healthcare',
  
  plugins: [
    'barcode-scanner',
    'prescription-tracking',
    'age-verification',
    'inventory-advanced',
    'loyalty-program',
  ],
  
  pluginConfig: {
    'barcode-scanner': {
      features: {
        autoLookup: true,
        soundEffects: true,
        multiScan: true,
      },
      scanner: {
        codeTypes: ['EAN13', 'UPC', 'NDC', 'CODE128'], // NDC for medications
        timeout: 5000,
      },
      ui: {
        showScanButton: true,
        position: 'action-bar',
      },
    },
    'age-verification': {
      features: {
        requireForCategories: true,
        scanID: false,
      },
      verification: {
        requiredAge: 18,
        categories: ['Tobacco', 'Alcohol', 'Controlled Substances'],
      },
      ui: {
        showAgePrompt: true,
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
    enableTipping: false,
    defaultTaxRate: 0.0, // Many medications are tax-exempt
    receiptFooter: 'Please read all medication instructions carefully.',
    requireCustomer: true, // For prescription tracking
  },
  
  ui: {
    theme: 'dark',
    primaryColor: '#10B981',
    layout: 'sidebar-cart',
  },
};