import { Plugin } from '../../core/lib/types/plugin.types';

// Placeholder - will be implemented in future release
export const appointmentsPlugin: Plugin = {
  id: 'appointments',
  name: 'Appointment Scheduler',
  version: '0.1.0',
  description: 'Schedule and manage customer appointments (Coming Soon)',
  author: 'AuraFlow',
  
  config: {
    features: {
      enableBooking: true,
      enableReminders: true,
      enableWaitlist: true,
    },
    scheduling: {
      slotDuration: 30,
      advanceBooking: 90,
    },
  },
  
  recommendedFor: ['salon', 'medical', 'automotive', 'services'],
  tier: 'premium',
};

export default appointmentsPlugin;