import { useState, useEffect } from 'react';
import { useStore } from '../../lib/store';
import { usePlugins } from '../../core/hooks/usePlugins';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { 
  Beer, 
  Wine, 
  Martini, 
  GlassWater,
  Users,
  CreditCard,
  Split,
  Clock,
  DollarSign,
  ShieldCheck,
  Search,
  Plus,
  X
} from 'lucide-react';
import { ShoppingCart } from '../ShoppingCart';
import { TabsManagementView } from './TabsManagementView';
import { BarSectionView } from './BarSectionView';
import { QuickDrinkBuilder } from './QuickDrinkBuilder';
import { Product } from '../../lib/types';
import { toast } from 'sonner@2.0.3';

export function BarPOSView() {
  const products = useStore((state) => state.products);
  const cart = useStore((state) => state.cart);
  const addToCart = useStore((state) => state.addToCart);
  const currentShift = useStore((state) => state.currentShift);
  const { isActive } = usePlugins();
  const [activeView, setActiveView] = useState<'quick-order' | 'tabs' | 'sections'>('quick-order');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Check if required plugins are active
  const hasAgeVerification = isActive('age-verification');
  const hasOpenTabs = isActive('open-tabs');
  const hasSplitChecks = isActive('split-checks');

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
    toast.success('Added to order', {
      description: product.name
    });
  };

  if (!currentShift) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="p-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Beer className="w-5 h-5" />
              Bar POS - Shift Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Please start a shift to begin taking orders at the bar.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <div className="border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Beer className="w-6 h-6 text-primary" />
              <div>
                <h1 className="text-xl font-bold">Bar POS</h1>
                <p className="text-xs text-muted-foreground">
                  {currentShift.terminalId} • {currentShift.userId}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-4">
            {hasAgeVerification && (
              <Badge variant="outline" className="gap-1">
                <ShieldCheck className="w-3 h-3" />
                Age Verification Active
              </Badge>
            )}
            
            {hasOpenTabs && (
              <Badge variant="outline" className="gap-1">
                <CreditCard className="w-3 h-3" />
                Tabs Enabled
              </Badge>
            )}

            {cart.items.length > 0 && (
              <Badge className="gap-1">
                {cart.items.length} items in cart
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side - Product Selection / Views */}
        <div className="flex-1 flex flex-col overflow-hidden">
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
            </div>
          </div>

          {/* View Content */}
          <div className="flex-1 overflow-auto p-4">
            {activeView === 'quick-order' && (
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search drinks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                      onClick={() => setSearchQuery('')}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>

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
                <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
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
                          <p className="text-sm text-primary font-bold">
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

        {/* Right Side - Shopping Cart */}
        <div className="w-96 border-l bg-card overflow-hidden flex flex-col">
          <ShoppingCart />
        </div>
      </div>
    </div>
  );
}
