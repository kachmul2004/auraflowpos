import { Plugin } from '../../core/lib/types/plugin.types';
import { OpenTabsView } from './components/OpenTabsView';

export const openTabsPlugin: Plugin = {
  id: 'open-tabs',
  name: 'Open Tabs',
  version: '1.0.0',
  description: 'View and manage all open customer tabs',
  author: 'AuraFlow',
  
  components: {
    adminModule: OpenTabsView,
  },
  
  config: {
    features: {
      autoClose: false,
      maxTabDuration: 480, // 8 hours in minutes
      allowAddItems: true,
    },
    ui: {
      showDuration: true,
      showTotal: true,
    },
  },
  
  recommendedFor: ['restaurant', 'bar', 'salon', 'hotel'],
  tier: 'standard',
};

export default openTabsPlugin;