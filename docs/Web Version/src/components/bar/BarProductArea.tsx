import { useState } from 'react';
import { useStore } from '../../lib/store';
import { usePlugins } from '../../core/hooks/usePlugins';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  Beer, 
  Wine, 
  Martini, 
  GlassWater,
  Users,
  CreditCard
} from 'lucide-react';
import { TabsManagementView } from './TabsManagementView';
import { BarSectionView } from './BarSectionView';
import { QuickDrinkBuilder } from './QuickDrinkBuilder';
import { Product } from '../../lib/types';
import { toast } from 'sonner@2.0.3';
import { playSound, sounds } from '../../lib/audioUtils';

interface BarProductAreaProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function BarProductArea({ searchQuery = '', onSearchChange }: BarProductAreaProps) {
  const products = useStore((state) => state.products);
  const addToCart = useStore((state) => state.addToCart);
  const { isActive } = usePlugins();
  const [activeView, setActiveView] = useState<'quick-order' | 'tabs' | 'sections'>('quick-order');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Check if required plugins are active
  const hasAgeVerification = isActive('age-verification');
  const hasOpenTabs = isActive('open-tabs');

  // Filter products for bar categories
  const barProducts = products.filter(p => 
    ['Beer', 'Wine', 'Spirits', 'Cocktails', 'Shots', 'Non-Alcoholic', 'Food'].includes(p.category)
  );

  const categories = [
    { id: 'all', label: 'All Drinks', icon: Martini },
    { id: 'Beer', label: 'Beer', icon: Beer },
    { id: 'Wine', label: 'Wine', icon: Wine },
    { id: 'Cocktails', label: 'Cocktails', icon: Martini },
    { id: 'Spirits', label: 'Spirits', icon: GlassWater },
    { id: 'Shots', label: 'Shots', icon: GlassWater },
    { id: 'Non-Alcoholic', label: 'Non-Alcoholic', icon: GlassWater },
  ];

  // Filter products by category and search
  const filteredProducts = barProducts.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleQuickAdd = (product: Product) => {
    if (product.category !== 'Non-Alcoholic' && hasAgeVerification && !sessionStorage.getItem('age_verified')) {
      toast.error('Age verification required', {
        description: 'Please verify customer age before selling alcohol'
      });
      return;
    }
    
    addToCart(product);
    playSound(sounds.addToCart);
    toast.success('Added to order', {
      description: product.name
    });
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* View Tabs */}
      <div className="border-b bg-card px-4 py-2">
        <div className="flex gap-2">
          <Button
            variant={activeView === 'quick-order' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveView('quick-order')}
            className="gap-2"
          >
            <Martini className="w-4 h-4" />
            Quick Order
          </Button>
          
          {hasOpenTabs && (
            <Button
              variant={activeView === 'tabs' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveView('tabs')}
              className="gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Open Tabs
            </Button>
          )}
          
          <Button
            variant={activeView === 'sections' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveView('sections')}
            className="gap-2"
          >
            <Users className="w-4 h-4" />
            Sections
          </Button>

          {/* Age Verification Badge */}
          {hasAgeVerification && activeView === 'quick-order' && (
            <Badge variant="outline" className="gap-1 ml-auto">
              <span className="text-xs">21+ Verification Active</span>
            </Badge>
          )}
        </div>
      </div>

      {/* View Content */}
      <div className="flex-1 overflow-auto p-4">
        {activeView === 'quick-order' && (
          <div className="space-y-4">
            {/* Category Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map(cat => {
                const Icon = cat.icon;
                return (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.id)}
                    className="gap-2 whitespace-nowrap"
                  >
                    <Icon className="w-4 h-4" />
                    {cat.label}
                  </Button>
                );
              })}
            </div>

            {/* Quick Drink Builder */}
            <QuickDrinkBuilder />

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filteredProducts.map(product => (
                <Card
                  key={product.id}
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => handleQuickAdd(product)}
                >
                  <CardContent className="p-3">
                    <div className="aspect-square rounded-md bg-muted mb-2 flex items-center justify-center">
                      {product.category === 'Beer' && <Beer className="w-8 h-8 text-muted-foreground" />}
                      {product.category === 'Wine' && <Wine className="w-8 h-8 text-muted-foreground" />}
                      {(product.category === 'Cocktails' || product.category === 'Spirits') && (
                        <Martini className="w-8 h-8 text-muted-foreground" />
                      )}
                      {product.category === 'Non-Alcoholic' && <GlassWater className="w-8 h-8 text-muted-foreground" />}
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-sm line-clamp-2">{product.name}</p>
                      <p className="text-sm text-primary">
                        ${product.price.toFixed(2)}
                      </p>
                      {product.category !== 'Non-Alcoholic' && (
                        <Badge variant="outline" className="text-xs">
                          21+
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <GlassWater className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">
                  {searchQuery ? 'No drinks found' : 'No products in this category'}
                </p>
              </div>
            )}
          </div>
        )}

        {activeView === 'tabs' && hasOpenTabs && (
          <TabsManagementView />
        )}

        {activeView === 'sections' && (
          <BarSectionView />
        )}
      </div>
    </div>
  );
}
