/**
 * Ultimate Preset
 * 
 * All-inclusive package with features from every industry.
 * Perfect for businesses operating in multiple sectors or requiring maximum flexibility.
 */

import { Preset } from '../core/lib/types/plugin.types';

export const ultimatePreset: Preset = {
  id: 'ultimate',
  name: 'Ultimate - All Industries',
  description: 'Complete POS solution with all industry features enabled. Includes restaurant, retail, pharmacy, salon, and service features.',
  icon: '👑',
  category: 'all',
  
  plugins: [
    // Restaurant Features
    'table-management',
    'kitchen-display',
    'split-checks',
    'course-management',
    'order-types',
    'open-tabs',
    
    // Retail Features
    'barcode-scanner',
    'loyalty-program',
    'inventory-advanced',
    'price-checker',
    'layaway',
    
    // Pharmacy/Healthcare Features
    'prescription-tracking',
    'age-verification',
    
    // Service Features
    'appointments',
    
    // Enterprise Features (Week 3-6)
    'analytics-reporting',
    'customer-management-advanced',
    'multi-location',
    'employee-performance',
    'inventory-management-advanced',
    'reporting-export-advanced',
    
    // Core POS Features (Week 7)
    'discount-management',
    'offline-mode',
    
    // Hardware & Printer Management (Week 8)
    'hardware-printer-management',
  ],
  
  pluginConfig: {
    // Universal order types (for all industries)
    'order-types': {
      features: {
        enableInStore: true,
        enablePickup: true,
        enableDelivery: true,
      },
      ui: {
        defaultType: 'in-store',
        showTypeSelector: true,
      },
    },
    'table-management': {
      features: {
        enableSections: true,
        enableReservations: true,
      },
      ui: {
        showFloorPlan: true,
        defaultSections: ['Main Dining', 'Bar', 'Patio', 'VIP'],
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
    
    // Retail configs
    'barcode-scanner': {
      features: {
        autoLookup: true,
        soundEffects: true,
        multiScan: true,
      },
      scanner: {
        codeTypes: ['EAN13', 'UPC', 'CODE128', 'QR', 'NDC'],
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
        enableAutoReorder: true,
        enableMultiLocation: true,
      },
      alerts: {
        lowStockThreshold: 10,
        criticalStockThreshold: 5,
      },
    },
    
    // Pharmacy configs
    'age-verification': {
      features: {
        requireForCategories: true,
        scanID: true,
      },
      verification: {
        requiredAge: 18,
        categories: ['Tobacco', 'Alcohol', 'Controlled Substances'],
      },
      ui: {
        showAgePrompt: true,
      },
    },
    
    // Service configs
    'appointments': {
      features: {
        enableBooking: true,
        enableReminders: true,
      },
      ui: {
        showCalendar: true,
        defaultDuration: 60,
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
    primaryColor: '#8B5CF6', // Purple for ultimate/premium
    layout: 'sidebar-cart',
  },
};