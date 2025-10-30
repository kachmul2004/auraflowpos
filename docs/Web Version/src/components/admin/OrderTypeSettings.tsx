import { useState } from 'react';
import { useStore } from '../../lib/store';
import { OrderTypeConfig, OrderType } from '../../lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { UtensilsCrossed, ShoppingBag, Truck, Store, Package, Save, RotateCcw } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const iconMap = {
  'UtensilsCrossed': UtensilsCrossed,
  'ShoppingBag': ShoppingBag,
  'Truck': Truck,
  'Store': Store,
  'Package': Package,
};

export function OrderTypeSettings() {
  const orderTypeConfigs = useStore(state => state.orderTypeConfigs);
  const updateOrderTypeConfig = useStore(state => state.updateOrderTypeConfig);
  const businessProfile = useStore(state => state.businessProfile);
  
  const [editedConfigs, setEditedConfigs] = useState<OrderTypeConfig[]>(orderTypeConfigs);
  
  // Determine which order types are relevant for current business profile
  const relevantTypes: OrderType[] = businessProfile === 'ultimate'
    ? ['in-store', 'pickup', 'delivery']
    : ['dine-in', 'takeout', 'delivery'];
  
  const filteredConfigs = editedConfigs.filter(c => relevantTypes.includes(c.id));
  
  const handleLabelChange = (orderTypeId: OrderType, newLabel: string) => {
    setEditedConfigs(configs =>
      configs.map(c => c.id === orderTypeId ? { ...c, label: newLabel } : c)
    );
  };
  
  const handleEnabledToggle = (orderTypeId: OrderType, enabled: boolean) => {
    setEditedConfigs(configs =>
      configs.map(c => c.id === orderTypeId ? { ...c, enabled } : c)
    );
  };
  
  const handleSave = () => {
    editedConfigs.forEach(config => {
      updateOrderTypeConfig(config.id, config);
    });
    toast.success('Order type settings saved successfully');
  };
  
  const handleReset = () => {
    const defaults: OrderTypeConfig[] = [
      { id: 'dine-in', label: 'Dine In', enabled: true, icon: 'UtensilsCrossed' },
      { id: 'takeout', label: 'Takeout', enabled: true, icon: 'ShoppingBag' },
      { id: 'delivery', label: 'Delivery', enabled: true, icon: 'Truck' },
      { id: 'in-store', label: 'In-Store', enabled: true, icon: 'Store' },
      { id: 'pickup', label: 'Pickup', enabled: true, icon: 'Package' },
    ];
    
    setEditedConfigs(defaults);
    defaults.forEach(config => {
      updateOrderTypeConfig(config.id, config);
    });
    toast.success('Order type settings reset to defaults');
  };
  
  const getIcon = (iconName?: string) => {
    if (!iconName) return null;
    const Icon = iconMap[iconName as keyof typeof iconMap];
    return Icon ? <Icon className="w-4 h-4" /> : null;
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order Type Configuration</CardTitle>
          <CardDescription>
            Customize order type labels and availability for your business.
            {businessProfile === 'ultimate' 
              ? ' Currently showing universal order types for Ultimate POS.' 
              : ' Currently showing restaurant/cafe order types.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {filteredConfigs.map(config => {
            const Icon = getIcon(config.icon);
            
            return (
              <div key={config.id} className="flex items-start gap-4 p-4 border border-border rounded-lg bg-muted/20">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                  {Icon}
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Label className="text-sm font-medium">
                          {config.id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </Label>
                        <Badge variant="outline" className="text-xs">
                          {config.id}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Internal ID: {config.id}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`enabled-${config.id}`} className="text-sm text-muted-foreground">
                        Enabled
                      </Label>
                      <Switch
                        id={`enabled-${config.id}`}
                        checked={config.enabled}
                        onCheckedChange={(checked) => handleEnabledToggle(config.id, checked)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor={`label-${config.id}`} className="text-xs text-muted-foreground">
                      Display Label
                    </Label>
                    <Input
                      id={`label-${config.id}`}
                      value={config.label}
                      onChange={(e) => handleLabelChange(config.id, e.target.value)}
                      placeholder="Enter custom label"
                      className="mt-1"
                      disabled={!config.enabled}
                    />
                  </div>
                </div>
              </div>
            );
          })}
          
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button onClick={handleReset} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Preview Card */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>How your order types will appear to users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {filteredConfigs
              .filter(c => c.enabled)
              .map(config => {
                const Icon = getIcon(config.icon);
                return (
                  <Badge key={config.id} variant="outline" className="px-3 py-2">
                    {Icon && <span className="mr-2">{Icon}</span>}
                    {config.label}
                  </Badge>
                );
              })}
            {filteredConfigs.filter(c => c.enabled).length === 0 && (
              <p className="text-sm text-muted-foreground">No order types enabled</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
