import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useStore } from '../../lib/store';
import { 
  Martini, 
  Plus,
  Minus,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface DrinkModifier {
  id: string;
  name: string;
  price: number;
  group: string;
}

const DRINK_MODIFIERS: DrinkModifier[] = [
  // Serving Style
  { id: 'rocks', name: 'On the Rocks', price: 0, group: 'style' },
  { id: 'neat', name: 'Neat', price: 0, group: 'style' },
  { id: 'frozen', name: 'Frozen', price: 1.50, group: 'style' },
  { id: 'blended', name: 'Blended', price: 1.50, group: 'style' },
  
  // Size
  { id: 'single', name: 'Single', price: 0, group: 'size' },
  { id: 'double', name: 'Double', price: 4.00, group: 'size' },
  { id: 'pitcher', name: 'Pitcher', price: 15.00, group: 'size' },
  
  // Spirit Tier
  { id: 'well', name: 'Well', price: 0, group: 'tier' },
  { id: 'call', name: 'Call', price: 2.00, group: 'tier' },
  { id: 'premium', name: 'Premium', price: 4.00, group: 'tier' },
  { id: 'top-shelf', name: 'Top Shelf', price: 8.00, group: 'tier' },
  
  // Mixers
  { id: 'coke', name: 'Coke', price: 0, group: 'mixer' },
  { id: 'sprite', name: 'Sprite', price: 0, group: 'mixer' },
  { id: 'tonic', name: 'Tonic', price: 0, group: 'mixer' },
  { id: 'soda', name: 'Soda', price: 0, group: 'mixer' },
  { id: 'redbull', name: 'Red Bull', price: 3.00, group: 'mixer' },
  
  // Special
  { id: 'salt-rim', name: 'Salt Rim', price: 0, group: 'special' },
  { id: 'sugar-rim', name: 'Sugar Rim', price: 0, group: 'special' },
  { id: 'extra-garnish', name: 'Extra Garnish', price: 0.50, group: 'special' },
  { id: 'no-ice', name: 'No Ice', price: 0, group: 'special' },
  { id: 'light-ice', name: 'Light Ice', price: 0, group: 'special' },
];

export function QuickDrinkBuilder() {
  const addToCart = useStore((state) => state.addToCart);
  const [selectedBase, setSelectedBase] = useState<string | null>(null);
  const [selectedModifiers, setSelectedModifiers] = useState<Record<string, DrinkModifier>>({});
  const [quantity, setQuantity] = useState(1);

  const baseSpirits = [
    { id: 'vodka', name: 'Vodka', price: 8.00 },
    { id: 'rum', name: 'Rum', price: 8.00 },
    { id: 'gin', name: 'Gin', price: 8.00 },
    { id: 'tequila', name: 'Tequila', price: 9.00 },
    { id: 'whiskey', name: 'Whiskey', price: 9.00 },
    { id: 'bourbon', name: 'Bourbon', price: 9.00 },
  ];

  const toggleModifier = (modifier: DrinkModifier) => {
    const newModifiers = { ...selectedModifiers };
    
    // If modifier is in same group, replace it
    const existingInGroup = Object.values(newModifiers).find(m => m.group === modifier.group);
    if (existingInGroup) {
      delete newModifiers[existingInGroup.id];
    }
    
    // Toggle this modifier
    if (newModifiers[modifier.id]) {
      delete newModifiers[modifier.id];
    } else {
      newModifiers[modifier.id] = modifier;
    }
    
    setSelectedModifiers(newModifiers);
  };

  const calculateTotal = () => {
    if (!selectedBase) return 0;
    const base = baseSpirits.find(s => s.id === selectedBase);
    if (!base) return 0;
    
    const modifierTotal = Object.values(selectedModifiers).reduce((sum, mod) => sum + mod.price, 0);
    return (base.price + modifierTotal) * quantity;
  };

  const handleAddToCart = () => {
    if (!selectedBase) {
      toast.error('Select a spirit first');
      return;
    }

    const base = baseSpirits.find(s => s.id === selectedBase);
    if (!base) return;

    // Create a mock product for the drink
    const drinkName = `${base.name}${Object.values(selectedModifiers).length > 0 
      ? ' - ' + Object.values(selectedModifiers).map(m => m.name).join(', ')
      : ''}`;

    toast.success('Added to order', {
      description: `${quantity}x ${drinkName} - $${calculateTotal().toFixed(2)}`
    });

    // Reset
    setSelectedBase(null);
    setSelectedModifiers({});
    setQuantity(1);
  };

  const getModifiersByGroup = (group: string) => {
    return DRINK_MODIFIERS.filter(m => m.group === group);
  };

  const total = calculateTotal();

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="w-5 h-5 text-primary" />
          Quick Drink Builder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Base Spirit Selection */}
        <div>
          <p className="text-sm font-medium mb-2">Select Spirit</p>
          <div className="grid grid-cols-3 gap-2">
            {baseSpirits.map(spirit => (
              <Button
                key={spirit.id}
                variant={selectedBase === spirit.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedBase(spirit.id)}
                className="h-auto py-2"
              >
                <div className="text-center">
                  <div className="font-medium">{spirit.name}</div>
                  <div className="text-xs opacity-80">${spirit.price}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Modifiers */}
        {selectedBase && (
          <Tabs defaultValue="style" className="w-full">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="style">Style</TabsTrigger>
              <TabsTrigger value="size">Size</TabsTrigger>
              <TabsTrigger value="tier">Tier</TabsTrigger>
              <TabsTrigger value="mixer">Mixer</TabsTrigger>
              <TabsTrigger value="special">Special</TabsTrigger>
            </TabsList>

            <TabsContent value="style" className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {getModifiersByGroup('style').map(mod => (
                  <Button
                    key={mod.id}
                    variant={selectedModifiers[mod.id] ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleModifier(mod)}
                  >
                    {mod.name}
                    {mod.price > 0 && <span className="ml-1 text-xs">+${mod.price}</span>}
                  </Button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="size" className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {getModifiersByGroup('size').map(mod => (
                  <Button
                    key={mod.id}
                    variant={selectedModifiers[mod.id] ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleModifier(mod)}
                  >
                    {mod.name}
                    {mod.price > 0 && <span className="ml-1 text-xs">+${mod.price}</span>}
                  </Button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="tier" className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {getModifiersByGroup('tier').map(mod => (
                  <Button
                    key={mod.id}
                    variant={selectedModifiers[mod.id] ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleModifier(mod)}
                  >
                    {mod.name}
                    {mod.price > 0 && <span className="ml-1 text-xs">+${mod.price}</span>}
                  </Button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="mixer" className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {getModifiersByGroup('mixer').map(mod => (
                  <Button
                    key={mod.id}
                    variant={selectedModifiers[mod.id] ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleModifier(mod)}
                  >
                    {mod.name}
                    {mod.price > 0 && <span className="ml-1 text-xs">+${mod.price}</span>}
                  </Button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="special" className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {getModifiersByGroup('special').map(mod => (
                  <Button
                    key={mod.id}
                    variant={selectedModifiers[mod.id] ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleModifier(mod)}
                  >
                    {mod.name}
                    {mod.price > 0 && <span className="ml-1 text-xs">+${mod.price}</span>}
                  </Button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Selected Modifiers Summary */}
        {selectedBase && Object.keys(selectedModifiers).length > 0 && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-xs font-medium mb-2">Selected:</p>
            <div className="flex flex-wrap gap-1">
              {Object.values(selectedModifiers).map(mod => (
                <Badge key={mod.id} variant="secondary" className="text-xs">
                  {mod.name}
                  {mod.price > 0 && ` +$${mod.price}`}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Quantity & Add */}
        {selectedBase && (
          <div className="flex items-center gap-3 pt-3 border-t">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <div className="w-12 text-center font-medium">
                {quantity}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <Button 
              className="flex-1 gap-2"
              onClick={handleAddToCart}
            >
              <Martini className="w-4 h-4" />
              Add ${total.toFixed(2)}
            </Button>
          </div>
        )}

        {/* Hint */}
        {!selectedBase && (
          <div className="text-center py-4 text-sm text-muted-foreground">
            Select a spirit to build a custom drink
          </div>
        )}
      </CardContent>
    </Card>
  );
}
