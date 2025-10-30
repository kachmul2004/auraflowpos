/**
 * Bar Industry Configuration
 * 
 * Pre-configured settings, categories, and modifiers for bars, pubs, and nightclubs
 */

export const barConfig = {
  // Product Categories
  categories: [
    {
      id: 'beer',
      name: 'Beer',
      icon: '🍺',
      color: '#F59E0B',
      modifierGroups: ['serving-style', 'size'],
      requiresAge: true,
    },
    {
      id: 'wine',
      name: 'Wine',
      icon: '🍷',
      color: '#DC2626',
      modifierGroups: ['wine-type', 'serving-size'],
      requiresAge: true,
    },
    {
      id: 'spirits',
      name: 'Spirits',
      icon: '🥃',
      color: '#8B5CF6',
      modifierGroups: ['tier', 'serving-style', 'mixer'],
      requiresAge: true,
    },
    {
      id: 'cocktails',
      name: 'Cocktails',
      icon: '🍸',
      color: '#EC4899',
      modifierGroups: ['serving-style', 'special-requests'],
      requiresAge: true,
    },
    {
      id: 'shots',
      name: 'Shots',
      icon: '🥃',
      color: '#EF4444',
      modifierGroups: ['tier'],
      requiresAge: true,
    },
    {
      id: 'non-alcoholic',
      name: 'Non-Alcoholic',
      icon: '🥤',
      color: '#10B981',
      modifierGroups: ['size'],
      requiresAge: false,
    },
    {
      id: 'food',
      name: 'Food',
      icon: '🍔',
      color: '#F97316',
      modifierGroups: ['food-modifiers'],
      requiresAge: false,
    },
  ],

  // Modifier Groups
  modifierGroups: [
    {
      id: 'serving-style',
      name: 'Serving Style',
      required: false,
      multiSelect: false,
      modifiers: [
        { id: 'rocks', name: 'On the Rocks', price: 0 },
        { id: 'neat', name: 'Neat', price: 0 },
        { id: 'up', name: 'Up', price: 0 },
        { id: 'frozen', name: 'Frozen', price: 1.00 },
        { id: 'blended', name: 'Blended', price: 1.00 },
      ],
    },
    {
      id: 'size',
      name: 'Size',
      required: false,
      multiSelect: false,
      modifiers: [
        { id: 'single', name: 'Single', price: 0, isDefault: true },
        { id: 'double', name: 'Double', priceMultiplier: 1.8 },
        { id: 'pitcher', name: 'Pitcher', priceMultiplier: 4.5 },
        { id: 'bucket', name: 'Bucket (5)', priceMultiplier: 4.0 },
      ],
    },
    {
      id: 'tier',
      name: 'Spirit Tier',
      required: false,
      multiSelect: false,
      modifiers: [
        { id: 'well', name: 'Well', price: 0, isDefault: true },
        { id: 'call', name: 'Call', price: 2.00 },
        { id: 'premium', name: 'Premium', price: 4.00 },
        { id: 'top-shelf', name: 'Top Shelf', price: 6.00 },
      ],
    },
    {
      id: 'mixer',
      name: 'Mixer',
      required: false,
      multiSelect: false,
      modifiers: [
        { id: 'coke', name: 'Coke', price: 0 },
        { id: 'diet-coke', name: 'Diet Coke', price: 0 },
        { id: 'sprite', name: 'Sprite', price: 0 },
        { id: 'tonic', name: 'Tonic Water', price: 0 },
        { id: 'soda', name: 'Soda Water', price: 0 },
        { id: 'ginger-ale', name: 'Ginger Ale', price: 0 },
        { id: 'cranberry', name: 'Cranberry Juice', price: 0.50 },
        { id: 'orange', name: 'Orange Juice', price: 0.50 },
        { id: 'pineapple', name: 'Pineapple Juice', price: 0.50 },
        { id: 'redbull', name: 'Red Bull', price: 2.00 },
      ],
    },
    {
      id: 'wine-type',
      name: 'Wine Type',
      required: false,
      multiSelect: false,
      modifiers: [
        { id: 'red', name: 'Red', price: 0 },
        { id: 'white', name: 'White', price: 0 },
        { id: 'rose', name: 'Rosé', price: 0 },
        { id: 'sparkling', name: 'Sparkling', price: 2.00 },
      ],
    },
    {
      id: 'serving-size',
      name: 'Serving Size',
      required: false,
      multiSelect: false,
      modifiers: [
        { id: 'glass', name: 'By Glass', price: 0, isDefault: true },
        { id: 'bottle', name: 'By Bottle', priceMultiplier: 4.0 },
        { id: 'carafe', name: 'Carafe', priceMultiplier: 2.5 },
      ],
    },
    {
      id: 'special-requests',
      name: 'Special Requests',
      required: false,
      multiSelect: true,
      modifiers: [
        { id: 'salt-rim', name: 'Salt Rim', price: 0 },
        { id: 'sugar-rim', name: 'Sugar Rim', price: 0 },
        { id: 'extra-lime', name: 'Extra Lime', price: 0 },
        { id: 'extra-lemon', name: 'Extra Lemon', price: 0 },
        { id: 'extra-olives', name: 'Extra Olives', price: 0.50 },
        { id: 'extra-cherries', name: 'Extra Cherries', price: 0.50 },
        { id: 'extra-ice', name: 'Extra Ice', price: 0 },
        { id: 'light-ice', name: 'Light Ice', price: 0 },
        { id: 'no-ice', name: 'No Ice', price: 0 },
        { id: 'dirty', name: 'Dirty (Martini)', price: 0.50 },
        { id: 'extra-dirty', name: 'Extra Dirty', price: 1.00 },
      ],
    },
    {
      id: 'food-modifiers',
      name: 'Food Options',
      required: false,
      multiSelect: true,
      modifiers: [
        { id: 'no-onion', name: 'No Onion', price: 0 },
        { id: 'extra-cheese', name: 'Extra Cheese', price: 1.00 },
        { id: 'spicy', name: 'Make it Spicy', price: 0 },
        { id: 'side-ranch', name: 'Side Ranch', price: 0.50 },
      ],
    },
  ],

  // Sample Products
  sampleProducts: [
    // Beer
    { name: 'Domestic Draft', category: 'beer', price: 5.00, sku: 'BEER-DOM-DFT' },
    { name: 'Import Draft', category: 'beer', price: 6.00, sku: 'BEER-IMP-DFT' },
    { name: 'Craft Beer', category: 'beer', price: 7.00, sku: 'BEER-CRA-DFT' },
    { name: 'Domestic Bottle', category: 'beer', price: 4.50, sku: 'BEER-DOM-BTL' },
    { name: 'Import Bottle', category: 'beer', price: 5.50, sku: 'BEER-IMP-BTL' },

    // Wine
    { name: 'House Wine', category: 'wine', price: 8.00, sku: 'WINE-HOUSE' },
    { name: 'Premium Wine', category: 'wine', price: 12.00, sku: 'WINE-PREM' },
    { name: 'Champagne', category: 'wine', price: 15.00, sku: 'WINE-CHAMP' },

    // Spirits
    { name: 'Vodka', category: 'spirits', price: 6.00, sku: 'SPRT-VODKA' },
    { name: 'Rum', category: 'spirits', price: 6.00, sku: 'SPRT-RUM' },
    { name: 'Whiskey', category: 'spirits', price: 7.00, sku: 'SPRT-WHSKY' },
    { name: 'Tequila', category: 'spirits', price: 7.00, sku: 'SPRT-TEQUI' },
    { name: 'Gin', category: 'spirits', price: 6.00, sku: 'SPRT-GIN' },

    // Cocktails
    { name: 'Margarita', category: 'cocktails', price: 10.00, sku: 'CKTL-MARG' },
    { name: 'Mojito', category: 'cocktails', price: 10.00, sku: 'CKTL-MOJI' },
    { name: 'Old Fashioned', category: 'cocktails', price: 12.00, sku: 'CKTL-OLDF' },
    { name: 'Manhattan', category: 'cocktails', price: 12.00, sku: 'CKTL-MANH' },
    { name: 'Martini', category: 'cocktails', price: 11.00, sku: 'CKTL-MART' },
    { name: 'Long Island', category: 'cocktails', price: 11.00, sku: 'CKTL-LONG' },

    // Shots
    { name: 'Tequila Shot', category: 'shots', price: 5.00, sku: 'SHOT-TEQU' },
    { name: 'Whiskey Shot', category: 'shots', price: 5.00, sku: 'SHOT-WHIS' },
    { name: 'Jäger Bomb', category: 'shots', price: 8.00, sku: 'SHOT-JAGR' },

    // Non-Alcoholic
    { name: 'Soft Drink', category: 'non-alcoholic', price: 3.00, sku: 'NA-SODA' },
    { name: 'Energy Drink', category: 'non-alcoholic', price: 4.00, sku: 'NA-ENERGY' },
    { name: 'Bottled Water', category: 'non-alcoholic', price: 2.00, sku: 'NA-WATER' },
    { name: 'Coffee', category: 'non-alcoholic', price: 3.00, sku: 'NA-COFFEE' },

    // Food
    { name: 'Wings (10pc)', category: 'food', price: 12.00, sku: 'FOOD-WING10' },
    { name: 'Nachos', category: 'food', price: 10.00, sku: 'FOOD-NACHO' },
    { name: 'Burger', category: 'food', price: 14.00, sku: 'FOOD-BURG' },
    { name: 'Fries', category: 'food', price: 6.00, sku: 'FOOD-FRIES' },
  ],

  // Table Sections
  sections: [
    { id: 'main-bar', name: 'Main Bar', color: '#3B82F6', capacity: 12 },
    { id: 'high-tops', name: 'High Tops', color: '#10B981', capacity: 20 },
    { id: 'lounge', name: 'Lounge', color: '#8B5CF6', capacity: 30 },
    { id: 'patio', name: 'Patio', color: '#F59E0B', capacity: 24 },
    { id: 'vip', name: 'VIP', color: '#EF4444', capacity: 16 },
  ],

  // Compliance Settings
  compliance: {
    minimumAge: 21,
    requireAgeVerification: true,
    alcoholSalesHours: {
      monday: { start: '11:00', end: '02:00' },
      tuesday: { start: '11:00', end: '02:00' },
      wednesday: { start: '11:00', end: '02:00' },
      thursday: { start: '11:00', end: '02:00' },
      friday: { start: '11:00', end: '02:00' },
      saturday: { start: '11:00', end: '02:00' },
      sunday: { start: '12:00', end: '00:00' },
    },
    maxDrinksPerTransaction: 4,
    logRefusals: true,
    lastCallMinutes: 30, // Minutes before closing for last call
  },

  // Tab Settings
  tabSettings: {
    requireCreditCard: true,
    preAuthAmount: 1.00,
    maxTabDuration: 720, // 12 hours in minutes
    warningThreshold: 200, // Dollar amount
    autoGratuityPercent: 18,
    autoGratuityThreshold: 6, // Number of drinks
  },

  // Receipt Settings
  receiptSettings: {
    footer: 'Thank you! Drink responsibly. 🍺',
    showTips: true,
    suggestedTips: [15, 18, 20, 25],
    showServerName: true,
    showDrinkDetails: true,
  },
};

export default barConfig;
