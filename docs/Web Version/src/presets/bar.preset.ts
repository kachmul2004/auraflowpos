/**
 * Bar & Nightclub Preset
 * 
 * Optimized for bars, pubs, nightclubs, and lounges with age verification,
 * open tabs, quick drink ordering, and high-volume service capabilities.
 */

import { Preset } from '../core/lib/types/plugin.types';

export const barPreset: Preset = {
  id: 'bar',
  name: 'Bar & Nightclub',
  description: 'Bar POS with age verification, open tabs, quick drink ordering, and split checks',
  icon: '🍺',
  category: 'restaurant',
  
  plugins: [
    'age-verification',
    'open-tabs',
    'split-checks',
    'table-management',
    'order-types',
  ],
  
  pluginConfig: {
    'age-verification': {
      features: {
        requireForAlcohol: true,
        scanID: true,
        manualVerification: true,
        logVerifications: true,
      },
      ui: {
        showAgePrompt: true,
        requireManagerOverride: false,
      },
      compliance: {
        minimumAge: 21, // Configurable per region
        checkEveryTransaction: false, // Only check once per customer
        flagSuspicious: true,
      },
    },
    'open-tabs': {
      features: {
        autoClose: false, // Bars typically keep tabs open
        maxTabDuration: 720, // 12 hours
        requireCreditCard: true, // Common for bars
        allowMultipleTabs: true, // Same customer can have multiple tabs
      },
      ui: {
        showTabList: true,
        showTabTotal: true,
        warningThreshold: 200, // Warning when tab exceeds $200
      },
      payments: {
        authorizationAmount: 1.00, // Pre-auth amount for card holds
        autoGratuity: 18, // Auto-gratuity percentage for large tabs
        autoGratuityThreshold: 6, // Number of drinks to trigger auto-gratuity
      },
    },
    'split-checks': {
      features: {
        enableBySeat: false, // Not common in bars
        enableByItem: true, // Split by drink
        enableEvenly: true, // Split tab evenly
        enableCustomAmount: true, // Pay specific amount
      },
      ui: {
        quickSplit: true, // Quick 2-way, 3-way, 4-way buttons
        showRunningTotal: true,
      },
    },
    'table-management': {
      features: {
        enableSections: true,
        enableReservations: true, // For VIP sections, bottle service
      },
      ui: {
        showFloorPlan: true,
        defaultSections: ['Main Bar', 'High Tops', 'Lounge', 'Patio', 'VIP'],
        tableTypes: ['Bar Seat', 'Table', 'Booth', 'VIP Section'],
      },
    },
    'order-types': {
      features: {
        enableDineIn: true,
        enableTakeout: true, // For to-go drinks where legal
        enableDelivery: false,
      },
      ui: {
        defaultType: 'dine-in',
        showTypeSelector: true,
      },
      types: [
        { id: 'bar', label: 'Bar', icon: '🍺' },
        { id: 'table', label: 'Table Service', icon: '🍽️' },
        { id: 'bottle-service', label: 'Bottle Service', icon: '🍾' },
        { id: 'to-go', label: 'To-Go', icon: '🥤' },
      ],
    },
  },
  
  coreSettings: {
    enableTipping: true,
    defaultTaxRate: 0.08,
    receiptFooter: 'Thank you! Drink responsibly.',
    requireCustomer: false, // Optional for walk-ins
    quickSale: true, // Fast drink ordering
    enableHappyHour: true, // Time-based pricing (coming soon)
  },
  
  ui: {
    theme: 'dark',
    primaryColor: '#8B5CF6', // Purple for nightlife vibe
    layout: 'sidebar-cart',
    quickAccess: {
      // Common bar items for quick access
      showFavorites: true,
      showRecent: true,
      categories: ['Beer', 'Wine', 'Spirits', 'Cocktails', 'Non-Alcoholic'],
    },
  },
  
  inventory: {
    // Bar-specific inventory tracking
    trackByBottle: true,
    lowStockAlerts: true,
    trackPourCost: true, // Track cost per pour for profitability
    wasteTracking: true, // Track spills, comps, etc.
  },
  
  modifiers: {
    // Common drink modifiers
    presets: [
      // Serving style
      { id: 'rocks', label: 'On the Rocks', category: 'style' },
      { id: 'neat', label: 'Neat', category: 'style' },
      { id: 'frozen', label: 'Frozen', category: 'style' },
      { id: 'blended', label: 'Blended', category: 'style' },
      
      // Size
      { id: 'single', label: 'Single', category: 'size' },
      { id: 'double', label: 'Double', category: 'size', priceMultiplier: 1.8 },
      { id: 'pitcher', label: 'Pitcher', category: 'size', priceMultiplier: 4.5 },
      
      // Mixers
      { id: 'coke', label: 'Coke', category: 'mixer' },
      { id: 'sprite', label: 'Sprite', category: 'mixer' },
      { id: 'tonic', label: 'Tonic', category: 'mixer' },
      { id: 'soda', label: 'Soda Water', category: 'mixer' },
      { id: 'juice', label: 'Juice', category: 'mixer' },
      
      // Special requests
      { id: 'salt-rim', label: 'Salt Rim', category: 'special' },
      { id: 'sugar-rim', label: 'Sugar Rim', category: 'special' },
      { id: 'extra-lime', label: 'Extra Lime', category: 'special' },
      { id: 'extra-olives', label: 'Extra Olives', category: 'special' },
      { id: 'extra-ice', label: 'Extra Ice', category: 'special' },
      { id: 'light-ice', label: 'Light Ice', category: 'special' },
    ],
  },
  
  compliance: {
    // Bar-specific compliance features
    alcoholSalesHours: {
      enabled: true,
      // Configure per local laws
      weekday: { start: '11:00', end: '02:00' },
      weekend: { start: '11:00', end: '02:00' },
      sunday: { start: '12:00', end: '00:00' }, // Example: Different Sunday hours
    },
    requireAgeVerification: true,
    maxDrinksPerCustomer: 4, // Configurable limit per transaction
    refusalLogging: true, // Log when service is refused
    incidentReporting: true, // Track incidents for liability
  },
};
