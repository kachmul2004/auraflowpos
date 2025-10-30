/**
 * Salon Preset
 * 
 * Hair salon / spa configuration with appointments and service management.
 */

import { Preset } from '../core/lib/types/plugin.types';

export const salonPreset: Preset = {
  id: 'salon',
  name: 'Hair Salon / Spa',
  description: 'Salon POS with appointments, open tabs during service, and loyalty rewards',
  icon: '💇',
  category: 'services',
  
  plugins: [
    'appointments',
    'open-tabs',
    'loyalty-program',
  ],
  
  pluginConfig: {
    'appointments': {
      features: {
        enableBooking: true,
        enableReminders: true,
        enableWaitlist: true,
      },
      scheduling: {
        slotDuration: 30, // 30 minute slots
        advanceBooking: 90, // 90 days in advance
      },
      ui: {
        showCalendar: true,
        showAvailability: true,
      },
    },
    'open-tabs': {
      features: {
        autoClose: false, // Tabs stay open during service
        allowAddItems: true,
      },
    },
    'loyalty-program': {
      features: {
        enablePoints: true,
        enableRewards: true,
        enableReferrals: true,
      },
      points: {
        pointsPerDollar: 2, // Higher rewards for salons
        redeemableAt: 100,
      },
    },
  },
  
  coreSettings: {
    enableTipping: true,
    defaultTaxRate: 0.08,
    receiptFooter: 'Thank you! We look forward to seeing you again!',
    requireCustomer: true, // For appointments
  },
  
  ui: {
    theme: 'dark',
    primaryColor: '#EC4899',
    layout: 'sidebar-cart',
  },
};