import { Plugin } from '../../core/lib/types/plugin.types';
import { MapPin } from 'lucide-react';

export const multiLocationPlugin: Plugin = {
  id: 'multi-location',
  name: 'Multi-Location Management',
  description: 'Enterprise multi-location support with centralized management, location-specific inventory, cross-location reporting, and transfer capabilities',
  version: '1.0.0',
  category: 'enterprise',
  icon: MapPin,
  author: 'AuraFlow',
  enabled: true,
  config: {
    mode: 'centralized', // 'centralized' or 'decentralized'
    features: {
      enableLocationSelector: true,
      enableInventoryTransfers: true,
      enableCrossLocationReporting: true,
      enableLocationHierarchy: true,
      enableRegionalManagement: true,
      enableLocationPerformance: true,
      enableSharedCustomers: true,
      enableSharedLoyalty: true,
      enableLocationSpecificPricing: false,
      enableLocationSpecificTax: true
    },
    locations: {
      autoAssignOnLogin: true,
      requireLocationSelection: true,
      allowLocationSwitch: true,
      trackLocationInOrders: true,
      syncInventoryRealtime: true
    },
    hierarchy: {
      enableRegions: true,
      enableDistricts: false,
      enableZones: false,
      levels: ['corporate', 'region', 'location']
    },
    transfers: {
      requireApproval: true,
      approvalThreshold: 1000, // Dollar amount requiring approval
      trackTransferHistory: true,
      allowPartialTransfers: true,
      estimatedTransferTime: 24, // Hours
      notifyRecipient: true
    },
    reporting: {
      enableConsolidated: true,
      enableComparative: true,
      enableLocationRankings: true,
      enableRegionalRollup: true,
      defaultView: 'consolidated',
      includeInactive: false
    },
    permissions: {
      locationAdmin: ['manage_location', 'view_location_reports', 'transfer_inventory'],
      regionalManager: ['manage_locations', 'view_regional_reports', 'approve_transfers'],
      corporate: ['manage_all_locations', 'view_all_reports', 'configure_system']
    },
    notifications: {
      lowStockAtLocation: true,
      transferCompleted: true,
      transferRequested: true,
      locationPerformanceAlert: false
    },
    sync: {
      inventorySync: 'realtime', // 'realtime', 'hourly', 'daily'
      customerSync: 'realtime',
      productSync: 'realtime',
      priceSync: 'daily',
      reportSync: 'hourly'
    }
  },
  requiredPermissions: ['manage_locations', 'view_locations'],
  dependencies: [],
  optionalDependencies: ['analytics-reporting', 'inventory-advanced', 'customer-management-advanced'],
  industries: ['restaurant', 'retail', 'cafe', 'pharmacy', 'salon', 'general', 'ultimate'],
  packageTier: 'enterprise',
  routes: [
    {
      path: '/admin/locations',
      component: 'LocationManagement'
    },
    {
      path: '/admin/locations/:id',
      component: 'LocationDetails'
    },
    {
      path: '/admin/transfers',
      component: 'InventoryTransfers'
    }
  ],
  adminNavigation: {
    label: 'Locations',
    icon: MapPin,
    path: '/admin/locations',
    section: 'enterprise',
    order: 1
  },
  features: [
    'Unlimited locations',
    'Location hierarchy (Corporate → Region → Location)',
    'Location selector in POS',
    'Location-specific inventory tracking',
    'Inventory transfers between locations',
    'Cross-location reporting',
    'Consolidated financial reports',
    'Location performance comparison',
    'Regional management',
    'Shared customer database',
    'Location-specific pricing (optional)',
    'Location-specific tax rates',
    'Transfer approval workflow',
    'Real-time inventory sync',
    'Location analytics dashboard',
    'Geographic mapping',
    'Multi-location user permissions',
    'Transfer history tracking',
    'Low stock alerts per location',
    'Location status management (Active/Inactive)'
  ],
  settings: [
    {
      key: 'mode',
      label: 'Management Mode',
      type: 'select',
      options: [
        { label: 'Centralized', value: 'centralized' },
        { label: 'Decentralized', value: 'decentralized' }
      ],
      defaultValue: 'centralized',
      description: 'Centralized: Corporate controls all. Decentralized: Locations have autonomy.'
    },
    {
      key: 'features.enableInventoryTransfers',
      label: 'Enable Inventory Transfers',
      type: 'boolean',
      defaultValue: true,
      description: 'Allow transferring inventory between locations'
    },
    {
      key: 'features.enableCrossLocationReporting',
      label: 'Enable Cross-Location Reporting',
      type: 'boolean',
      defaultValue: true,
      description: 'View consolidated reports across all locations'
    },
    {
      key: 'features.enableLocationHierarchy',
      label: 'Enable Location Hierarchy',
      type: 'boolean',
      defaultValue: true,
      description: 'Organize locations into regions and districts'
    },
    {
      key: 'transfers.requireApproval',
      label: 'Require Transfer Approval',
      type: 'boolean',
      defaultValue: true,
      description: 'Transfers require manager approval'
    },
    {
      key: 'transfers.approvalThreshold',
      label: 'Approval Threshold',
      type: 'number',
      defaultValue: 1000,
      description: 'Dollar amount requiring approval for transfers'
    },
    {
      key: 'sync.inventorySync',
      label: 'Inventory Sync Frequency',
      type: 'select',
      options: [
        { label: 'Real-time', value: 'realtime' },
        { label: 'Hourly', value: 'hourly' },
        { label: 'Daily', value: 'daily' }
      ],
      defaultValue: 'realtime',
      description: 'How often to sync inventory across locations'
    }
  ],
  businessBenefits: [
    'Manage multiple stores from single dashboard',
    'Optimize inventory across locations',
    'Transfer stock to prevent stockouts',
    'Compare location performance',
    'Centralized customer data across locations',
    'Reduce administrative overhead',
    'Make data-driven expansion decisions',
    'Improve supply chain efficiency',
    'Scale operations efficiently',
    'Regional performance insights'
  ],
  useCases: [
    'Retail chains with multiple stores',
    'Restaurant groups with multiple locations',
    'Franchise operations',
    'Regional businesses',
    'Pop-up stores with main location',
    'Warehouse + retail locations',
    'Multi-site healthcare facilities',
    'Salon/spa chains',
    'Coffee shop chains',
    'Regional distribution'
  ],
  metrics: {
    totalLocations: 'Number of active locations',
    averageLocationRevenue: 'Average revenue per location',
    topPerformingLocation: 'Highest revenue location',
    inventoryUtilization: 'Inventory efficiency across locations',
    transferVolume: 'Number and value of transfers',
    locationGrowth: 'Month-over-month location expansion'
  },
  dataSchema: {
    location: {
      id: 'string',
      name: 'string',
      code: 'string',
      type: 'store | warehouse | pop-up | mobile',
      status: 'active | inactive | pending',
      region: 'string | null',
      district: 'string | null',
      address: {
        street: 'string',
        city: 'string',
        state: 'string',
        zip: 'string',
        country: 'string'
      },
      contact: {
        phone: 'string',
        email: 'string',
        manager: 'string'
      },
      settings: {
        timezone: 'string',
        currency: 'string',
        taxRate: 'number',
        openingHours: 'object'
      },
      inventory: {
        trackSeparately: 'boolean',
        allowNegative: 'boolean',
        lowStockThreshold: 'number'
      }
    },
    transfer: {
      id: 'string',
      fromLocationId: 'string',
      toLocationId: 'string',
      items: 'array',
      status: 'pending | approved | in-transit | completed | rejected',
      requestedBy: 'string',
      approvedBy: 'string | null',
      totalValue: 'number',
      requestDate: 'Date',
      completedDate: 'Date | null'
    }
  }
};
