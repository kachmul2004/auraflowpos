import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { categories } from '../lib/mockData';
import { useStore } from '../lib/store';
import { Package, ShoppingBag, Coffee, Pill, Scissors, UtensilsCrossed, Apple, Milk, Beef, Carrot, Wine, Fish } from 'lucide-react';

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
  'Electronics': Package,
  'Clothing': Package,
  'Living Room': Package,
  'Bedroom': Package,
  'Office': Package,
  'All': Package,
};

interface MobileCategoryFilterProps {
  open: boolean;
  onClose: () => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function MobileCategoryFilter({ 
  open, 
  onClose, 
  selectedCategory, 
  onSelectCategory 
}: MobileCategoryFilterProps) {
  const businessProfile = useStore(state => state.businessProfile);
  
  // Filter categories based on current industry
  const industryFilteredCategories = categories.filter(cat => {
    // If category doesn't specify an industry, it's available to all
    if (!cat.industry) return true;
    // Show categories matching current industry
    return cat.industry === businessProfile;
  });
  
  const handleSelect = (category: string) => {
    onSelectCategory(category);
    onClose();
  };

  const getCategoryIcon = (category: string) => {
    const Icon = categoryIcons[category] || Package;
    return Icon;
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-80 p-0 [&>button]:hidden">
        <div className="p-6">
          <SheetHeader className="p-0 mb-6">
            <SheetTitle>Filter by Category</SheetTitle>
            <SheetDescription>
              Select a category to filter products
            </SheetDescription>
          </SheetHeader>
          
          <div className="space-y-2">
            <Button
              variant={selectedCategory === 'All' ? 'default' : 'outline'}
              onClick={() => handleSelect('All')}
              className="w-full justify-start"
            >
              <Package className="w-4 h-4 mr-2" />
              <span>All Products</span>
            </Button>
            
            {industryFilteredCategories.map((category) => {
              const Icon = getCategoryIcon(category.name);
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.name ? 'default' : 'outline'}
                  onClick={() => handleSelect(category.name)}
                  className="w-full justify-start"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  <span>{category.name}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}