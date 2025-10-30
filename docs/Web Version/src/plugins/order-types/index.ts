import { Plugin } from '../../core/lib/types/plugin.types';
import { OrderTypeSelector } from './components/OrderTypeSelector';

export const orderTypesPlugin: Plugin = {
  id: 'order-types',
  name: 'Order Types',
  version: '1.0.0',
  description: 'Dine-in, takeout, and delivery order type selection',
  author: 'AuraFlow',
  
  components: {
    posView: OrderTypeSelector,
  },
  
  config: {
    features: {
      enableDineIn: true,
      enableTakeout: true,
      enableDelivery: true,
    },
    ui: {
      defaultType: 'dine-in',
      showTypeSelector: true,
    },
  },
  
  recommendedFor: ['restaurant', 'cafe', 'bakery', 'pizzeria'],
  tier: 'free',
};

export default orderTypesPlugin;