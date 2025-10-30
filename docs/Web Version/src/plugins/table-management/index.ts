/**
 * Table Management Plugin
 * 
 * Provides table assignment, status tracking, and floor plan management
 * for restaurants, cafes, bars, and other table-service establishments.
 */

import { Plugin } from '../../core/lib/types/plugin.types';
import { TableManagementDialog } from './components/TableManagementDialog';

export const tableManagementPlugin: Plugin = {
  id: 'table-management',
  name: 'Table Management',
  version: '1.0.0',
  description: 'Manage table assignments, status, and floor plans',
  author: 'AuraFlow',
  
  components: {
    posView: TableManagementDialog,
  },
  
  services: {
    assignTable: (orderId: string, tableNumber: number) => {
      // Service implementation handled by store
      console.log(`Assigning order ${orderId} to table ${tableNumber}`);
    },
    
    releaseTable: (tableNumber: number) => {
      console.log(`Releasing table ${tableNumber}`);
    },
  },
  
  config: {
    features: {
      enableSections: true,
      enableReservations: false,
      enableFloorPlan: true,
    },
    ui: {
      showFloorPlan: true,
      defaultSections: ['Main Dining', 'Bar', 'Patio'],
      tablesPerSection: 10,
    },
    shortcuts: {
      openTableManagement: 'Ctrl+T',
    },
  },
  
  recommendedFor: ['restaurant', 'cafe', 'bar', 'hotel'],
  tier: 'standard',
};

export default tableManagementPlugin;