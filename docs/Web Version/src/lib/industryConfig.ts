import { BusinessProfile, IndustryConfig } from './types';

// Define industry configurations
export const INDUSTRY_CONFIGS: Record<BusinessProfile, IndustryConfig> = {
  restaurant: {
    type: 'restaurant',
    name: 'Restaurant / Café',
    description: 'Full-service restaurants, cafés, bars, and food service establishments',
    features: {
      // Restaurant features
      tableManagement: true,
      orderTypes: true,
      tipping: true,
      serverAssignment: true,
      
      // Specialized features (disabled)
      variableWeight: false,
      pluCodeEntry: false,
      ageVerification: false,
      prescriptionTracking: false,
      insuranceBilling: false,
      customOrders: false,
      deliveryScheduling: false,
      layaway: false,
      
      // Universal features
      barcodeScanner: true,
      customerManagement: true,
      giftCards: true,
      returns: true,
      discounts: true,
    },
  },
  
  retail: {
    type: 'retail',
    name: 'Retail Store',
    description: 'General retail stores, boutiques, and specialty shops',
    features: {
      // Restaurant features (disabled)
      tableManagement: false,
      orderTypes: false,
      tipping: false,
      serverAssignment: false,
      
      // Specialized features
      variableWeight: false,
      pluCodeEntry: false,
      ageVerification: false,
      prescriptionTracking: false,
      insuranceBilling: false,
      customOrders: false,
      deliveryScheduling: false,
      layaway: true,
      
      // Universal features
      barcodeScanner: true,
      customerManagement: true,
      giftCards: true,
      returns: true,
      discounts: true,
    },
  },
  
  grocery: {
    type: 'grocery',
    name: 'Grocery / Supermarket',
    description: 'Grocery stores, supermarkets, and convenience stores',
    features: {
      // Restaurant features (disabled)
      tableManagement: false,
      orderTypes: false,
      tipping: false,
      serverAssignment: false,
      
      // Specialized features
      variableWeight: true,
      pluCodeEntry: true,
      ageVerification: true,
      prescriptionTracking: false,
      insuranceBilling: false,
      customOrders: false,
      deliveryScheduling: false,
      layaway: false,
      
      // Universal features
      barcodeScanner: true,
      customerManagement: true,
      giftCards: true,
      returns: true,
      discounts: true,
    },
  },
  
  pharmacy: {
    type: 'pharmacy',
    name: 'Pharmacy / Drugstore',
    description: 'Pharmacies, drugstores, and medical supply stores',
    features: {
      // Restaurant features (disabled)
      tableManagement: false,
      orderTypes: false,
      tipping: false,
      serverAssignment: false,
      
      // Specialized features
      variableWeight: false,
      pluCodeEntry: false,
      ageVerification: true,
      prescriptionTracking: true,
      insuranceBilling: true,
      customOrders: false,
      deliveryScheduling: false,
      layaway: false,
      
      // Universal features
      barcodeScanner: true,
      customerManagement: true,
      giftCards: true,
      returns: true,
      discounts: true,
    },
  },
  
  furniture: {
    type: 'furniture',
    name: 'Furniture / Home Goods',
    description: 'Furniture stores, home decor, and large-item retailers',
    features: {
      // Restaurant features (disabled)
      tableManagement: false,
      orderTypes: false,
      tipping: false,
      serverAssignment: false,
      
      // Specialized features
      variableWeight: false,
      pluCodeEntry: false,
      ageVerification: false,
      prescriptionTracking: false,
      insuranceBilling: false,
      customOrders: true,
      deliveryScheduling: true,
      layaway: true,
      
      // Universal features
      barcodeScanner: true,
      customerManagement: true,
      giftCards: true,
      returns: true,
      discounts: true,
    },
  },
  
  cafe: {
    type: 'cafe',
    name: 'Coffee Shop / Cafe',
    description: 'Quick service cafes, coffee shops, and casual dining',
    features: {
      // Restaurant features (limited)
      tableManagement: false, // Usually counter service
      orderTypes: true,
      tipping: true,
      serverAssignment: false,
      
      // Specialized features (disabled)
      variableWeight: false,
      pluCodeEntry: false,
      ageVerification: false,
      prescriptionTracking: false,
      insuranceBilling: false,
      customOrders: false,
      deliveryScheduling: false,
      layaway: false,
      
      // Universal features
      barcodeScanner: true,
      customerManagement: true,
      giftCards: true,
      returns: true,
      discounts: true,
    },
  },
  
  salon: {
    type: 'salon',
    name: 'Hair Salon / Spa',
    description: 'Hair salons, spas, and beauty service businesses',
    features: {
      // Restaurant features (disabled)
      tableManagement: false,
      orderTypes: false,
      tipping: true,
      serverAssignment: true, // For service providers
      
      // Specialized features
      variableWeight: false,
      pluCodeEntry: false,
      ageVerification: false,
      prescriptionTracking: false,
      insuranceBilling: false,
      customOrders: false,
      deliveryScheduling: false, // Appointments instead
      layaway: false,
      
      // Universal features
      barcodeScanner: true,
      customerManagement: true,
      giftCards: true,
      returns: false, // Services typically non-refundable
      discounts: true,
    },
  },
  
  bar: {
    type: 'bar',
    name: 'Bar & Nightclub',
    description: 'Bars, pubs, nightclubs, and lounges with age verification and tab management',
    features: {
      // Restaurant-like features
      tableManagement: true,
      orderTypes: true,
      tipping: true,
      serverAssignment: true,
      
      // Bar-specific features
      variableWeight: false,
      pluCodeEntry: false,
      ageVerification: true,
      prescriptionTracking: false,
      insuranceBilling: false,
      customOrders: false,
      deliveryScheduling: false,
      layaway: false,
      
      // Universal features
      barcodeScanner: true,
      customerManagement: true,
      giftCards: true,
      returns: true,
      discounts: true,
    },
  },
  
  general: {
    type: 'general',
    name: 'General / All Features',
    description: 'All features enabled - suitable for multi-purpose businesses',
    features: {
      // All features enabled
      tableManagement: true,
      orderTypes: true,
      tipping: true,
      serverAssignment: true,
      variableWeight: true,
      pluCodeEntry: true,
      ageVerification: true,
      prescriptionTracking: true,
      insuranceBilling: true,
      customOrders: true,
      deliveryScheduling: true,
      layaway: true,
      barcodeScanner: true,
      customerManagement: true,
      giftCards: true,
      returns: true,
      discounts: true,
    },
  },
  
  ultimate: {
    type: 'ultimate',
    name: 'Ultimate - All Industries',
    description: 'Complete multi-industry solution with all features from restaurant, retail, pharmacy, and service businesses',
    features: {
      // All features enabled - ultimate package
      tableManagement: true,
      orderTypes: true,
      tipping: true,
      serverAssignment: true,
      variableWeight: true,
      pluCodeEntry: true,
      ageVerification: true,
      prescriptionTracking: true,
      insuranceBilling: true,
      customOrders: true,
      deliveryScheduling: true,
      layaway: true,
      barcodeScanner: true,
      customerManagement: true,
      giftCards: true,
      returns: true,
      discounts: true,
    },
  },
};

// Helper function to get industry config
export function getIndustryConfig(businessProfile: BusinessProfile): IndustryConfig {
  return INDUSTRY_CONFIGS[businessProfile] || INDUSTRY_CONFIGS.general;
}

// Helper function to check if a feature is enabled
export function isFeatureEnabled(
  businessProfile: BusinessProfile,
  feature: keyof IndustryConfig['features']
): boolean {
  const config = getIndustryConfig(businessProfile);
  return config.features[feature];
}