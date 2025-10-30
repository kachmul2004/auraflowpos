import { Plugin } from '../../core/lib/types/plugin.types';

export const loyaltyProgramPlugin: Plugin = {
  id: 'loyalty-program',
  name: 'Loyalty Program',
  version: '1.0.0',
  description: 'Comprehensive customer loyalty points, tiers, and rewards system',
  author: 'AuraFlow',
  
  config: {
    features: {
      enablePoints: true,
      enableTiers: true,
      enableRewards: true,
      autoApplyTierDiscounts: true,
    },
    points: {
      pointsPerDollar: 1,
      welcomeBonus: 50,
      birthdayBonus: 100,
      minPurchaseForPoints: 0,
      pointsExpireDays: 0, // 0 = never expire
    },
    tiers: {
      bronze: { minPoints: 0, maxPoints: 499, multiplier: 1.0, discount: 0 },
      silver: { minPoints: 500, maxPoints: 1499, multiplier: 1.2, discount: 5 },
      gold: { minPoints: 1500, maxPoints: 2999, multiplier: 1.5, discount: 10 },
      platinum: { minPoints: 3000, multiplier: 2.0, discount: 15 },
    },
  },
  
  recommendedFor: ['retail', 'restaurant', 'cafe', 'salon', 'ultimate'],
  tier: 'standard',
};

export default loyaltyProgramPlugin;

// Export components
export { LoyaltyProgramDialog } from './components/LoyaltyProgramDialog';
