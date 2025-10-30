import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Search, ChevronLeft, ChevronRight, Package, ShoppingBag, Coffee, Pill, Scissors, UtensilsCrossed, Apple, Milk, Beef, Carrot, Wine, Fish, Beer, Martini, Flame, Droplet, Salad } from 'lucide-react';
import { Product } from '../lib/types';
import { categories } from '../lib/mockData';
import { useStore } from '../lib/store';
import { Badge } from './ui/badge';
import { VariationModal } from './VariationModal';
import { sounds, playSound } from '../lib/audioUtils';
import { ImageWithFallback } from './figma/ImageWithFallback';

// Category icon mapping
const categoryIcons: Record<string, any> = {
  'Fruits': Apple,
  'Bakery': ShoppingBag,
  'Dairy': Milk,
  'Meat': Beef,
  'Vegetables': Carrot,
  'Coffee': Coffee,
  'Pharmacy': Pill,
  'Medications': Pill,
  'Wellness': Pill,
  'Salon': Scissors,
  'Restaurant': UtensilsCrossed,
  'Beverages': Wine,
  'Seafood': Fish,
  // Bar categories
  'Beer': Beer,
  'Wine': Wine,
  'Spirits': Martini,
  'Cocktails': Martini,
  'Shots': Flame,
  'Non-Alcoholic': Droplet,
  'Food': Salad,
  // General
  'Electronics': Package,
  'Clothing': Package,
  'Living Room': Package,
  'Bedroom': Package,
  'Office': Package,
  'General': Package,
  'Miscellaneous': Package,
  'All': Package,
};

interface ProductGridProps {
  searchQuery?: string;
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export function ProductGrid({ 
  searchQuery = '', 
  selectedCategory = 'All',
  onCategoryChange 
}: ProductGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const products = useStore(state => state.products);
  const addToCart = useStore(state => state.addToCart);
  const getAvailableStock = useStore(state => state.getAvailableStock);
  const cart = useStore(state => state.cart); // Subscribe to cart changes to trigger re-renders
  const businessProfile = useStore(state => state.businessProfile);
  const subscribedPresets = useStore(state => state.subscribedPresets);
  
  // Filter categories based on subscribed presets
  const industryFilteredCategories = categories.filter(cat => {
    // If category doesn't specify an industry, it's available to all
    if (!cat.industry) return true;
    // Show categories from any subscribed preset
    return subscribedPresets.includes(cat.industry as any);
  });
  
  const handleProductClick = (product: Product) => {
    // If product has variations or modifiers, show modal
    if (product.variations || product.modifiers) {
      setSelectedProduct(product);
    } else {
      // Simple product, add directly
      addToCart(product);
      playSound(sounds.addToCart);
    }
  };
  
  const getCategoryIcon = (category: string) => {
    const Icon = categoryIcons[category] || Package;
    return Icon;
  };
  
  // Items per page to fill the grid
  // Large screens (1024px+): 5 rows × 5 columns = 25 items
  // Medium screens (768-1023px): 4 rows × 5 columns = 20 items
  // Small screens (<768px): 4 rows × 3 columns = 12 items
  const getItemsPerPage = () => {
    const width = window.innerWidth;
    if (width >= 1024) return 25; // lg: 5 columns × 5 rows
    if (width >= 768) return 20; // md: 5 columns × 4 rows (for tablets like 800px)
    return 12; // sm: 3 columns × 4 rows
  };
  
  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(getItemsPerPage());
    };
    
    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter products based on search query and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchQuery 
      ? product.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  
  // Create placeholder items to fill remaining slots
  const placeholderCount = itemsPerPage - paginatedProducts.length;
  const placeholders = Array.from({ length: placeholderCount }, (_, i) => ({ id: `placeholder-${i}` }));

  return (
    <div className="flex flex-col h-full">
      {/* Categories - Desktop Only */}
      <div className="hidden lg:block px-4 pb-4 pt-4">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-2">
            <Button
              variant={selectedCategory === 'All' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                onCategoryChange?.('All');
                setCurrentPage(1);
              }}
              className="shrink-0"
            >
              <Package className="w-4 h-4 mr-2" />
              <span>All</span>
            </Button>
            {industryFilteredCategories.map((category) => {
              const Icon = getCategoryIcon(category.name);
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.name ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    onCategoryChange?.(category.name);
                    setCurrentPage(1);
                  }}
                  className="shrink-0"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  <span>{category.name}</span>
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Product Grid - Non-scrollable, fits available space */}
      <div className="flex-1 p-3 overflow-hidden" style={{ backgroundColor: '#D9D9D9' }}>
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-2 h-full grid-rows-[repeat(4,1fr)] md:grid-rows-[repeat(4,1fr)] lg:grid-rows-[repeat(5,1fr)]">
          {paginatedProducts.map((product) => {
            const Icon = getCategoryIcon(product.category);
            const availableStock = getAvailableStock(product.id);
            const isOutOfStock = availableStock <= 0;
            
            return (
              <button
                key={product.id}
                onClick={() => !isOutOfStock && handleProductClick(product)}
                disabled={isOutOfStock}
                className={`group relative bg-card border border-border transition-all duration-200 rounded-lg overflow-hidden text-left flex flex-row h-full shadow-sm ${
                  isOutOfStock 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5'
                }`}
              >
                {/* Left Side: Product Info (50%) */}
                <div className="flex-1 p-2 flex flex-col justify-between bg-card relative">
                  {/* Stock Badge */}
                  <Badge 
                    variant={isOutOfStock ? 'destructive' : availableStock <= 5 ? 'destructive' : 'secondary'}
                    className="absolute top-1 left-1 text-xs px-1.5 py-0 h-5 z-10"
                  >
                    {isOutOfStock ? 'Out' : availableStock}
                  </Badge>
                  
                  <div className="flex-1 flex flex-col justify-center pt-6">
                    <p className={`product-card-name text-xs line-clamp-3 mb-1 transition-colors ${
                      isOutOfStock ? '' : 'group-hover:text-primary'
                    }`}>
                      {product.name}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-sm">{product.priceDisplay}</span>
                    {(product.variations || product.modifiers) && (
                      <Badge variant="outline" className="text-xs px-1 py-0 h-4">
                        +
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Right Side: Product Image (50%) */}
                <div className="relative flex-1 bg-gradient-to-br from-muted/80 to-muted flex items-center justify-center overflow-hidden">
                  {!isOutOfStock && (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                  
                  {product.imageUrl ? (
                    <ImageWithFallback
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Icon className={`w-8 h-8 transition-colors ${
                      isOutOfStock 
                        ? 'text-muted-foreground/20' 
                        : 'text-muted-foreground/40 group-hover:text-primary/60'
                    }`} />
                  )}
                </div>
                
                {/* Hover indicator */}
                {!isOutOfStock && (
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                )}
              </button>
            );
          })}
          {placeholders.map((placeholder) => (
            <div
              key={placeholder.id}
              className="bg-muted/80 border-2 border-dashed border-border/60 rounded-lg h-full pointer-events-none flex items-center justify-center"
            >
              <div className="text-muted-foreground/40 text-xs">Empty</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="p-3 lg:p-4 border-t border-border flex items-center justify-center gap-4 bg-card">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="h-9 w-9"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <span className="text-sm tabular-nums min-w-[60px] text-center">
          {currentPage} / {totalPages || 1}
        </span>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="h-9 w-9"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Variation Modal */}
      {selectedProduct && (
        <VariationModal
          open={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          product={selectedProduct}
        />
      )}
    </div>
  );
}