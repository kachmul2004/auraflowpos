/**
 * Plugin Registry
 * 
 * Central import point for all available plugins.
 * Import and export all plugins here to make them available to the system.
 */

import { Plugin } from '../core/lib/types/plugin.types';

// Restaurant plugins
import tableManagementPlugin from './table-management';
import kitchenDisplayPlugin from './kitchen-display';
import splitChecksPlugin from './split-checks';
import courseManagementPlugin from './course-management';
import orderTypesPlugin from './order-types';
import openTabsPlugin from './open-tabs';

// Retail/General plugins
import barcodeScannerPlugin from './barcode-scanner';
import loyaltyProgramPlugin from './loyalty-program';
import inventoryAdvancedPlugin from './inventory-advanced';

// Analytics & Reporting
import { analyticsReportingPlugin } from './analytics-reporting';

// Customer Management
import { customerManagementAdvancedPlugin } from './customer-management-advanced';

// Multi-Location
import { multiLocationPlugin } from './multi-location';

// Employee Performance
import { employeePerformancePlugin } from './employee-performance';

// Inventory Management Advanced
import { inventoryManagementAdvancedPlugin } from './inventory-management-advanced';

// Reporting & Export Advanced
import { reportingExportAdvancedPlugin } from './reporting-export-advanced';

// Discount Management
import { discountManagementPlugin } from './discount-management';

// Offline Mode
import { offlineModePlugin } from './offline-mode';

// Hardware & Printer Management
import { hardwarePrinterManagementPlugin } from './hardware-printer-management';

// Service plugins
import appointmentsPlugin from './appointments';

// Specialized plugins
import priceCheckerPlugin from './price-checker';
import layawayPlugin from './layaway';
import ageVerificationPlugin from './age-verification';
import prescriptionTrackingPlugin from './prescription-tracking';

// Create registry
export const pluginRegistry: Record<string, Plugin> = {
  // Restaurant
  'table-management': tableManagementPlugin,
  'kitchen-display': kitchenDisplayPlugin,
  'split-checks': splitChecksPlugin,
  'course-management': courseManagementPlugin,
  'order-types': orderTypesPlugin,
  'open-tabs': openTabsPlugin,
  
  // Retail/General
  'barcode-scanner': barcodeScannerPlugin,
  'loyalty-program': loyaltyProgramPlugin,
  'inventory-advanced': inventoryAdvancedPlugin,
  
  // Analytics
  'analytics-reporting': analyticsReportingPlugin,
  
  // Customer Management
  'customer-management-advanced': customerManagementAdvancedPlugin,
  
  // Multi-Location
  'multi-location': multiLocationPlugin,
  
  // Employee Performance
  'employee-performance': employeePerformancePlugin,
  
  // Inventory Management Advanced
  'inventory-management-advanced': inventoryManagementAdvancedPlugin,
  
  // Reporting & Export Advanced
  'reporting-export-advanced': reportingExportAdvancedPlugin,
  
  // Discount Management
  'discount-management': discountManagementPlugin,
  
  // Offline Mode
  'offline-mode': offlineModePlugin,
  
  // Hardware & Printer Management
  'hardware-printer-management': hardwarePrinterManagementPlugin,
  
  // Services
  'appointments': appointmentsPlugin,
  
  // Specialized
  'price-checker': priceCheckerPlugin,
  'layaway': layawayPlugin,
  'age-verification': ageVerificationPlugin,
  'prescription-tracking': prescriptionTrackingPlugin,
};

/**
 * Get all available plugins as an array
 */
export function getAllPlugins(): Plugin[] {
  return Object.values(pluginRegistry);
}

/**
 * Get a plugin by ID
 */
export function getPluginById(id: string): Plugin | undefined {
  return pluginRegistry[id];
}

/**
 * Export individual plugins for direct import
 */
export {
  // Restaurant
  tableManagementPlugin,
  kitchenDisplayPlugin,
  splitChecksPlugin,
  courseManagementPlugin,
  orderTypesPlugin,
  openTabsPlugin,
  
  // Retail/General
  barcodeScannerPlugin,
  loyaltyProgramPlugin,
  inventoryAdvancedPlugin,
  
  // Analytics
  analyticsReportingPlugin,
  
  // Customer Management
  customerManagementAdvancedPlugin,
  
  // Multi-Location
  multiLocationPlugin,
  
  // Employee Performance
  employeePerformancePlugin,
  
  // Inventory Management Advanced
  inventoryManagementAdvancedPlugin,
  
  // Reporting & Export Advanced
  reportingExportAdvancedPlugin,
  
  // Discount Management
  discountManagementPlugin,
  
  // Offline Mode
  offlineModePlugin,
  
  // Hardware & Printer Management
  hardwarePrinterManagementPlugin,
  
  // Services
  appointmentsPlugin,
  
  // Specialized
  priceCheckerPlugin,
  layawayPlugin,
  ageVerificationPlugin,
  prescriptionTrackingPlugin,
};