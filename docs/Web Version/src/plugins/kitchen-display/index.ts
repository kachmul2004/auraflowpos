/**
 * Kitchen Display Plugin
 * 
 * Real-time order display system for kitchen staff.
 * Shows incoming orders, tracks preparation status, and manages order flow.
 */

import { Plugin } from '../../core/lib/types/plugin.types';
import KitchenDisplaySystem from './components/KitchenDisplaySystem';

export const kitchenDisplayPlugin: Plugin = {
  id: 'kitchen-display',
  name: 'Kitchen Display System',
  version: '1.0.0',
  description: 'Real-time order display and tracking for kitchen staff',
  author: 'AuraFlow',
  
  components: {
    adminModule: KitchenDisplaySystem,
  },
  
  config: {
    features: {
      autoAdvance: true,
      showAllOrders: true,
      enableBumping: true,
      soundAlerts: true,
    },
    ui: {
      columnsPerView: 3,
      showTimer: true,
      highlightUrgent: true,
    },
    timing: {
      prepWarningMinutes: 15,
      urgentMinutes: 20,
    },
  },
  
  recommendedFor: ['restaurant', 'cafe', 'catering', 'hotel'],
  tier: 'standard',
};

export default kitchenDisplayPlugin;