import { Button } from '../../../components/ui/button';
import { useStore } from '../../../lib/store';
import { UtensilsCrossed, ShoppingBag, Truck, Store, Package } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { OrderType } from '../../../lib/types';

export function OrderTypeSelector() {
  const cart = useStore((state) => state.cart);
  const setOrderType = useStore((state) => state.setOrderType);
  const getEnabledOrderTypes = useStore((state) => state.getEnabledOrderTypes);
  const getOrderTypeLabel = useStore((state) => state.getOrderTypeLabel);

  const iconMap: Record<string, any> = {
    'UtensilsCrossed': UtensilsCrossed,
    'ShoppingBag': ShoppingBag,
    'Truck': Truck,
    'Store': Store,
    'Package': Package,
  };

  const colorMap: Record<OrderType, string> = {
    'dine-in': 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20',
    'takeout': 'bg-green-500/10 text-green-600 hover:bg-green-500/20',
    'delivery': 'bg-purple-500/10 text-purple-600 hover:bg-purple-500/20',
    'in-store': 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20',
    'pickup': 'bg-green-500/10 text-green-600 hover:bg-green-500/20',
  };

  const enabledOrderTypes = getEnabledOrderTypes();

  const handleOrderTypeChange = (type: OrderType) => {
    setOrderType(type);
    toast.success(`Order type set to ${getOrderTypeLabel(type)}`);
  };

  if (enabledOrderTypes.length === 0) return null;

  return (
    <div className="flex gap-2 p-3 border-b border-border bg-card">
      {enabledOrderTypes.map((orderType) => {
        const Icon = orderType.icon ? iconMap[orderType.icon] : Store;
        const isActive = cart.orderType === orderType.id;
        const color = colorMap[orderType.id] || 'bg-gray-500/10 text-gray-600 hover:bg-gray-500/20';

        return (
          <Button
            key={orderType.id}
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            className={`flex-1 gap-2 ${!isActive && color}`}
            onClick={() => handleOrderTypeChange(orderType.id)}
          >
            {Icon && <Icon className="w-4 h-4" />}
            {orderType.label}
          </Button>
        );
      })}
    </div>
  );
}
