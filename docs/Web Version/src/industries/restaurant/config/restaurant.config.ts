/**
 * Restaurant Industry Configuration
 * 
 * This file defines all restaurant-specific features, settings, and behavior.
 * Modify these settings to customize the restaurant POS experience.
 */

export interface RestaurantConfig {
  industry: {
    id: string;
    name: string;
    description: string;
  };
  
  features: {
    tableManagement: boolean;
    kitchenDisplay: boolean;
    courseManagement: boolean;
    splitChecks: boolean;
    openTabs: boolean;
    serverAssignment: boolean;
    tableReservations: boolean;
    onlineOrdering: boolean;
  };
  
  orderTypes: OrderType[];
  courses: Course[];
  kitchenSettings: KitchenSettings;
  tableSettings: TableSettings;
}

export interface OrderType {
  id: string;
  label: string;
  icon: string;
  enabled: boolean;
  requiresTable: boolean;
  requiresAddress: boolean;
}

export interface Course {
  id: string;
  label: string;
  order: number;
  color: string;
  enabled: boolean;
}

export interface KitchenSettings {
  autoAdvanceTimer: number;
  playSound: boolean;
  soundVolume: number;
  showAllOrders: boolean;
  defaultView: 'priority' | 'time' | 'table';
  maxOrdersPerScreen: number;
}

export interface TableSettings {
  enableSections: boolean;
  sections: string[];
  maxGuestsPerTable: number;
  defaultTables: number;
  autoAssignServer: boolean;
  combineTablesEnabled: boolean;
}

/**
 * Default Restaurant Configuration
 */
export const restaurantConfig: RestaurantConfig = {
  industry: {
    id: 'restaurant',
    name: 'Restaurant & Food Service',
    description: 'Full-featured restaurant POS with table management, kitchen display, and course management',
  },
  
  features: {
    tableManagement: true,
    kitchenDisplay: true,
    courseManagement: true,
    splitChecks: true,
    openTabs: true,
    serverAssignment: true,
    tableReservations: false,    // Coming soon
    onlineOrdering: false,        // Coming soon
  },
  
  orderTypes: [
    {
      id: 'dine-in',
      label: 'Dine In',
      icon: 'utensils-crossed',
      enabled: true,
      requiresTable: true,
      requiresAddress: false,
    },
    {
      id: 'takeout',
      label: 'Takeout',
      icon: 'package',
      enabled: true,
      requiresTable: false,
      requiresAddress: false,
    },
    {
      id: 'delivery',
      label: 'Delivery',
      icon: 'truck',
      enabled: true,
      requiresTable: false,
      requiresAddress: true,
    },
  ],
  
  courses: [
    {
      id: 'beverage',
      label: 'Beverage',
      order: 0,
      color: '#3B82F6', // blue
      enabled: true,
    },
    {
      id: 'appetizer',
      label: 'Appetizer',
      order: 1,
      color: '#10B981', // green
      enabled: true,
    },
    {
      id: 'entree',
      label: 'Entrée',
      order: 2,
      color: '#EF4444', // red
      enabled: true,
    },
    {
      id: 'side',
      label: 'Side',
      order: 3,
      color: '#F59E0B', // orange
      enabled: true,
    },
    {
      id: 'dessert',
      label: 'Dessert',
      order: 4,
      color: '#EC4899', // pink
      enabled: true,
    },
  ],
  
  kitchenSettings: {
    autoAdvanceTimer: 30,              // seconds before auto-advancing order
    playSound: true,                   // play sound for new orders
    soundVolume: 80,                   // 0-100
    showAllOrders: true,               // show all orders or filter by station
    defaultView: 'priority',           // default sort/view mode
    maxOrdersPerScreen: 12,            // max orders to display at once
  },
  
  tableSettings: {
    enableSections: true,              // enable table sections (bar, patio, etc.)
    sections: [
      'Main Dining',
      'Bar',
      'Patio',
      'Private Room',
    ],
    maxGuestsPerTable: 12,             // maximum guests per table
    defaultTables: 20,                 // number of tables to create by default
    autoAssignServer: false,           // auto-assign server to table
    combineTablesEnabled: true,        // allow combining tables for large parties
  },
};

/**
 * Quick Settings Presets
 */
export const restaurantPresets = {
  quickService: {
    ...restaurantConfig,
    features: {
      ...restaurantConfig.features,
      tableManagement: false,
      courseManagement: false,
      splitChecks: false,
      openTabs: false,
    },
    orderTypes: [
      restaurantConfig.orderTypes[1], // takeout only
    ],
  },
  
  fineDining: {
    ...restaurantConfig,
    features: {
      ...restaurantConfig.features,
      courseManagement: true,
      tableReservations: true,
    },
    kitchenSettings: {
      ...restaurantConfig.kitchenSettings,
      autoAdvanceTimer: 0, // manual only
    },
  },
  
  casualDining: {
    ...restaurantConfig,
    // Use default settings
  },
  
  barAndGrill: {
    ...restaurantConfig,
    features: {
      ...restaurantConfig.features,
      courseManagement: false,
      openTabs: true,
    },
    tableSettings: {
      ...restaurantConfig.tableSettings,
      sections: ['Bar', 'Dining', 'Patio'],
    },
  },
};

/**
 * Helper function to get active order types
 */
export function getActiveOrderTypes(config: RestaurantConfig = restaurantConfig): OrderType[] {
  return config.orderTypes.filter(type => type.enabled);
}

/**
 * Helper function to get active courses
 */
export function getActiveCourses(config: RestaurantConfig = restaurantConfig): Course[] {
  return config.courses.filter(course => course.enabled).sort((a, b) => a.order - b.order);
}

/**
 * Helper function to check if a feature is enabled
 */
export function isFeatureEnabled(feature: keyof RestaurantConfig['features']): boolean {
  return restaurantConfig.features[feature];
}

/**
 * Helper function to get course by ID
 */
export function getCourseById(id: string): Course | undefined {
  return restaurantConfig.courses.find(course => course.id === id);
}

/**
 * Helper function to get order type by ID
 */
export function getOrderTypeById(id: string): OrderType | undefined {
  return restaurantConfig.orderTypes.find(type => type.id === id);
}

export default restaurantConfig;
