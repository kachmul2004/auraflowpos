import { Plugin } from '../../core/lib/types/plugin.types';
import { Package } from 'lucide-react';

export const inventoryManagementAdvancedPlugin: Plugin = {
  id: 'inventory-management-advanced',
  name: 'Advanced Inventory Management',
  description: 'Enterprise inventory control with purchase orders, stock alerts, vendor management, stock takes, reorder automation, and multi-location tracking',
  version: '1.0.0',
  category: 'inventory',
  icon: Package,
  author: 'AuraFlow',
  enabled: true,
  config: {
    stockAlerts: {
      enabled: true,
      lowStockThreshold: 10, // Units or percentage
      criticalStockThreshold: 5,
      outOfStockAlert: true,
      overstockAlert: true,
      overstockThreshold: 200,
      alertChannels: ['dashboard', 'email', 'sms'],
      alertFrequency: 'daily', // 'realtime', 'hourly', 'daily'
    },
    purchaseOrders: {
      enabled: true,
      requireApproval: true,
      approvalThreshold: 5000, // Dollar amount
      autoReceiving: false, // Automatically update inventory on PO receipt
      partialReceiving: true,
      trackDeliveryDates: true,
      allowBackorders: true,
      defaultPaymentTerms: 'net30', // 'cod', 'net15', 'net30', 'net60'
    },
    vendors: {
      enableVendorManagement: true,
      trackVendorPerformance: true,
      multipleVendorsPerProduct: true,
      preferredVendorSelection: true,
      vendorPriceComparison: true,
      leadTimeTracking: true,
      minimumOrderQuantity: true,
    },
    stockTakes: {
      enabled: true,
      scheduleRegular: true,
      frequency: 'monthly', // 'weekly', 'monthly', 'quarterly'
      varianceThreshold: 5, // Percentage
      requireManagerApproval: true,
      autoAdjustInventory: false, // Auto-adjust after approval
      trackVarianceReasons: true,
    },
    reorderAutomation: {
      enabled: true,
      method: 'reorder-point', // 'reorder-point', 'periodic', 'demand-based'
      autoCreatePOs: false, // Automatically create purchase orders
      leadTimeDays: 7,
      safetyStockDays: 3,
      orderQuantityMethod: 'eoq', // 'fixed', 'eoq' (Economic Order Quantity)
      considerSeasonality: false, // Future ML feature
    },
    valuation: {
      method: 'fifo', // 'fifo', 'lifo', 'average'
      trackCostOfGoodsSold: true,
      trackLandedCost: true, // Include shipping, duties, etc.
      currencyAdjustments: false,
    },
    tracking: {
      enableSerialNumbers: false, // Track individual units
      enableBatchTracking: true,
      enableExpirationDates: true,
      enableLotNumbers: true,
      trackWastage: true,
      trackShrinkage: true,
      trackDamage: true,
      trackStockMovements: true,
    },
    multiLocation: {
      enabled: false, // Auto-enabled if multi-location plugin active
      trackByLocation: true,
      allowTransfers: true,
      consolidatedView: true,
      separateReorderPoints: true,
    },
    reporting: {
      enableStockReports: true,
      enableValuationReports: true,
      enableMovementReports: true,
      enableVendorReports: true,
      enableVarianceReports: true,
      exportFormats: ['csv', 'excel', 'pdf'],
    },
    notifications: {
      lowStock: true,
      outOfStock: true,
      poApprovalNeeded: true,
      poReceived: true,
      stockTakeScheduled: true,
      varianceDetected: true,
      expiringItems: true,
      slowMovingItems: false,
    },
  },
  requiredPermissions: ['manage_inventory', 'view_inventory'],
  dependencies: [],
  optionalDependencies: ['multi-location', 'analytics-reporting'],
  industries: ['restaurant', 'retail', 'cafe', 'pharmacy', 'salon', 'general', 'ultimate'],
  packageTier: 'professional',
  routes: [
    {
      path: '/admin/inventory/advanced',
      component: 'AdvancedInventoryManagement'
    },
    {
      path: '/admin/inventory/purchase-orders',
      component: 'PurchaseOrders'
    },
    {
      path: '/admin/inventory/vendors',
      component: 'VendorManagement'
    },
    {
      path: '/admin/inventory/stock-takes',
      component: 'StockTakes'
    }
  ],
  adminNavigation: {
    label: 'Advanced Inventory',
    icon: Package,
    path: '/admin/inventory/advanced',
    section: 'inventory',
    order: 2
  },
  features: [
    'Stock level alerts (low, critical, out)',
    'Automated reorder point calculations',
    'Purchase order management',
    'PO approval workflow',
    'Partial receiving',
    'Vendor/supplier database',
    'Vendor performance tracking',
    'Multiple vendors per product',
    'Price comparison across vendors',
    'Stock take/physical count',
    'Variance tracking and reporting',
    'Inventory valuation (FIFO/LIFO/Average)',
    'Cost of Goods Sold (COGS) tracking',
    'Batch and lot tracking',
    'Expiration date management',
    'Wastage and shrinkage tracking',
    'Stock movement history',
    'Multi-location inventory sync',
    'Inventory transfers between locations',
    'Demand forecasting (planned)',
    'Seasonal adjustments (planned)',
    'Economic Order Quantity (EOQ)',
    'Lead time optimization',
    'Safety stock calculations',
    'Slow-moving inventory alerts',
    'Dead stock identification',
    'Inventory turnover ratio',
    'ABC analysis',
    'Consolidated inventory reports',
    'Export capabilities'
  ],
  settings: [
    {
      key: 'stockAlerts.lowStockThreshold',
      label: 'Low Stock Threshold',
      type: 'number',
      defaultValue: 10,
      description: 'Alert when stock falls below this level'
    },
    {
      key: 'stockAlerts.criticalStockThreshold',
      label: 'Critical Stock Threshold',
      type: 'number',
      defaultValue: 5,
      description: 'Urgent alert threshold'
    },
    {
      key: 'purchaseOrders.requireApproval',
      label: 'Require PO Approval',
      type: 'boolean',
      defaultValue: true,
      description: 'Purchase orders need manager approval'
    },
    {
      key: 'purchaseOrders.approvalThreshold',
      label: 'Approval Threshold ($)',
      type: 'number',
      defaultValue: 5000,
      description: 'POs above this amount require approval'
    },
    {
      key: 'stockTakes.frequency',
      label: 'Stock Take Frequency',
      type: 'select',
      options: [
        { label: 'Weekly', value: 'weekly' },
        { label: 'Monthly', value: 'monthly' },
        { label: 'Quarterly', value: 'quarterly' }
      ],
      defaultValue: 'monthly',
      description: 'How often to conduct stock takes'
    },
    {
      key: 'reorderAutomation.enabled',
      label: 'Enable Auto-Reorder',
      type: 'boolean',
      defaultValue: true,
      description: 'Automatically suggest reorders at reorder point'
    },
    {
      key: 'reorderAutomation.leadTimeDays',
      label: 'Lead Time (Days)',
      type: 'number',
      defaultValue: 7,
      description: 'Average delivery time from vendors'
    },
    {
      key: 'valuation.method',
      label: 'Inventory Valuation Method',
      type: 'select',
      options: [
        { label: 'FIFO (First In, First Out)', value: 'fifo' },
        { label: 'LIFO (Last In, First Out)', value: 'lifo' },
        { label: 'Weighted Average', value: 'average' }
      ],
      defaultValue: 'fifo',
      description: 'Method for calculating inventory value'
    },
    {
      key: 'tracking.enableExpirationDates',
      label: 'Track Expiration Dates',
      type: 'boolean',
      defaultValue: true,
      description: 'Monitor product expiration dates'
    }
  ],
  businessBenefits: [
    'Prevent stockouts and lost sales',
    'Reduce excess inventory and holding costs',
    'Optimize reorder timing and quantities',
    'Improve cash flow through better inventory planning',
    'Reduce wastage and spoilage',
    'Negotiate better prices with vendor comparison',
    'Improve inventory accuracy with stock takes',
    'Track true profitability with accurate COGS',
    'Reduce shrinkage through better tracking',
    'Make data-driven purchasing decisions',
    'Automate repetitive inventory tasks',
    'Comply with regulations (expiration tracking)',
    'Reduce manual counting errors',
    'Optimize working capital',
    'Improve vendor relationships'
  ],
  useCases: [
    'Restaurant: Track perishables with expiration dates',
    'Retail: Manage seasonal inventory levels',
    'Pharmacy: Comply with expiration regulations',
    'Cafe: Optimize daily ingredient orders',
    'Multi-location: Balance inventory across stores',
    'Wholesale: Manage large purchase orders',
    'Food service: Minimize food waste',
    'Retail chain: Vendor price comparison',
    'Seasonal business: Forecast demand',
    'High-volume: EOQ for cost optimization'
  ],
  metrics: {
    inventoryValue: 'Total value of inventory on hand',
    inventoryTurnover: 'Times inventory is sold and replaced',
    daysOfInventory: 'Average days of stock available',
    stockoutRate: 'Percentage of time out of stock',
    fillRate: 'Percentage of demand met from stock',
    carryingCost: 'Cost to hold inventory',
    shrinkageRate: 'Inventory loss percentage',
    deadStock: 'Value of non-moving inventory',
    reorderAccuracy: 'Percentage of on-time reorders',
    vendorPerformance: 'On-time delivery rate'
  },
  dataSchema: {
    vendor: {
      id: 'string',
      name: 'string',
      code: 'string',
      contact: {
        name: 'string',
        email: 'string',
        phone: 'string',
        address: 'string'
      },
      paymentTerms: 'string',
      leadTimeDays: 'number',
      minimumOrder: 'number',
      performance: {
        onTimeDeliveryRate: 'number',
        qualityRating: 'number',
        totalOrders: 'number',
        totalSpend: 'number'
      }
    },
    purchaseOrder: {
      id: 'string',
      poNumber: 'string',
      vendorId: 'string',
      status: 'draft | pending | approved | ordered | received | cancelled',
      items: 'array',
      subtotal: 'number',
      tax: 'number',
      shipping: 'number',
      total: 'number',
      orderDate: 'Date',
      expectedDelivery: 'Date',
      receivedDate: 'Date | null',
      createdBy: 'string',
      approvedBy: 'string | null'
    },
    stockTake: {
      id: 'string',
      date: 'Date',
      status: 'scheduled | in-progress | completed | approved',
      location: 'string',
      items: 'array',
      totalVariance: 'number',
      totalValue: 'number',
      conductedBy: 'string',
      approvedBy: 'string | null'
    },
    inventoryMovement: {
      id: 'string',
      productId: 'string',
      type: 'purchase | sale | transfer | adjustment | wastage | damage',
      quantity: 'number',
      unitCost: 'number',
      from: 'string | null',
      to: 'string | null',
      date: 'Date',
      reference: 'string',
      notes: 'string'
    }
  }
};
