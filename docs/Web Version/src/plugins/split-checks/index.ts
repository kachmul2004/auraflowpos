import { Plugin } from '../../core/lib/types/plugin.types';
import { SplitCheckDialog } from './components/SplitCheckDialog';

export const splitChecksPlugin: Plugin = {
  id: 'split-checks',
  name: 'Split Checks',
  version: '1.0.0',
  description: 'Split orders by seat, item, or evenly among guests',
  author: 'AuraFlow',
  
  components: {
    posView: SplitCheckDialog,
  },
  
  config: {
    features: {
      enableBySeat: true,
      enableByItem: true,
      enableEvenly: true,
    },
  },
  
  recommendedFor: ['restaurant', 'bar', 'cafe'],
  tier: 'premium',
};

export default splitChecksPlugin;