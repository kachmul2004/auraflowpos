import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useStore } from '../../lib/store';
import { Plus, Edit, Trash2, Package, FolderTree, ChefHat, Layers } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { toast } from 'sonner@2.0.3';
import { DataTable } from './DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Product, Category, Recipe, ProductVariation } from '../../lib/types';
import { Separator } from '../ui/separator';

interface ProductsModuleProps {
  onNavigateToEdit: (product?: Product) => void;
}

export function ProductsModule({ onNavigateToEdit }: ProductsModuleProps) {
  const products = useStore((state) => state.products);
  const [activeTab, setActiveTab] = useState('products');

  // Category Dialog State
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    industry: '' as string,
  });

  // Recipe Dialog State
  const [showRecipeDialog, setShowRecipeDialog] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  // Mock categories and recipes data
  const categories: Category[] = [
    { id: '1', name: 'Beverages', description: 'Hot and cold drinks', industry: 'restaurant' },
    { id: '2', name: 'Food', description: 'Food items', industry: 'restaurant' },
    { id: '3', name: 'Snacks', description: 'Light snacks', industry: 'retail' },
    { id: '4', name: 'Electronics', description: 'Electronic devices', industry: 'retail' },
    { id: '5', name: 'Produce', description: 'Fresh fruits and vegetables', industry: 'grocery' },
    { id: '6', name: 'Medications', description: 'Prescription and OTC medicines', industry: 'pharmacy' },
  ];

  const recipes: Recipe[] = [
    {
      id: '1',
      name: 'Latte',
      description: 'Espresso with steamed milk',
      ingredients: [
        { productId: '1', productName: 'Espresso Shot', quantity: 2, unit: 'shots' },
        { productId: '2', productName: 'Milk', quantity: 8, unit: 'oz' },
      ],
      yield: 1,
      unit: 'cup',
    },
  ];

  // Product Columns
  const productColumns: ColumnDef<Product>[] = [
    {
      accessorKey: 'name',
      header: 'Product Name',
    },
    {
      accessorKey: 'sku',
      header: 'SKU',
      cell: ({ row }) => row.original.sku || '-',
    },
    {
      accessorKey: 'category',
      header: 'Category',
    },
    {
      accessorKey: 'cost',
      header: 'Cost',
      cell: ({ row }) => row.original.cost ? `$${row.original.cost.toFixed(2)}` : '-',
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => {
        const hasVariations = (row.original.variations?.length || 0) > 0;
        if (hasVariations && row.original.variations) {
          const prices = row.original.variations.map(v => v.price);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          if (minPrice === maxPrice) {
            return `${minPrice.toFixed(2)}`;
          }
          return `${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}`;
        }
        return `${row.original.price.toFixed(2)}`;
      },
    },
    {
      accessorKey: 'stockQuantity',
      header: 'Stock',
    },
    {
      accessorKey: 'isVariable',
      header: 'Type',
      cell: ({ row }) => {
        const hasVariations = (row.original.variations?.length || 0) > 0;
        if (hasVariations) {
          return (
            <Badge variant="secondary">
              <Layers className="w-3 h-3 mr-1" />
              {row.original.variations?.length} Variations
            </Badge>
          );
        }
        return (
          <Badge variant={row.original.isVariable ? 'secondary' : 'outline'}>
            {row.original.isVariable ? 'Variable' : 'Standard'}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onNavigateToEdit(row.original)}
          >
            <Edit className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDeleteProduct(row.original)}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      ),
    },
  ];

  // Category Columns
  const categoryColumns: ColumnDef<Category>[] = [
    {
      accessorKey: 'name',
      header: 'Category Name',
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => row.original.description || '-',
    },
    {
      accessorKey: 'industry',
      header: 'Industry',
      cell: ({ row }) => {
        if (!row.original.industry) return <span className="text-muted-foreground">All Industries</span>;
        const industryLabels: Record<string, string> = {
          restaurant: 'Restaurant',
          retail: 'Retail',
          grocery: 'Grocery',
          pharmacy: 'Pharmacy',
          furniture: 'Furniture',
          general: 'General',
        };
        return <Badge variant="outline">{industryLabels[row.original.industry] || row.original.industry}</Badge>;
      },
    },
    {
      id: 'productCount',
      header: 'Products',
      cell: ({ row }) => {
        const count = products.filter((p) => p.category === row.original.name).length;
        return <Badge variant="secondary">{count}</Badge>;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEditCategory(row.original)}
          >
            <Edit className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDeleteCategory(row.original)}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      ),
    },
  ];

  // Recipe Columns
  const recipeColumns: ColumnDef<Recipe>[] = [
    {
      accessorKey: 'name',
      header: 'Recipe Name',
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => row.original.description || '-',
    },
    {
      id: 'ingredients',
      header: 'Ingredients',
      cell: ({ row }) => (
        <Badge variant="secondary">{row.original.ingredients.length} items</Badge>
      ),
    },
    {
      id: 'yield',
      header: 'Yield',
      cell: ({ row }) => `${row.original.yield} ${row.original.unit}`,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEditRecipe(row.original)}
          >
            <Edit className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDeleteRecipe(row.original)}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      ),
    },
  ];

  // Product Handlers
  const handleDeleteProduct = (product: Product) => {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      toast.success('Product deleted successfully');
    }
  };

  // Category Handlers
  const handleCreateCategory = () => {
    setCategoryForm({
      name: '',
      description: '',
      industry: '',
    });
    setEditingCategory(null);
    setShowCategoryDialog(true);
  };

  const handleEditCategory = (category: Category) => {
    setCategoryForm({
      name: category.name,
      description: category.description || '',
      industry: category.industry || '',
    });
    setEditingCategory(category);
    setShowCategoryDialog(true);
  };

  const handleSaveCategory = () => {
    if (!categoryForm.name) {
      toast.error('Please enter a category name');
      return;
    }

    if (editingCategory) {
      toast.success('Category updated successfully');
    } else {
      toast.success('Category created successfully');
    }

    setShowCategoryDialog(false);
  };

  const handleDeleteCategory = (category: Category) => {
    const productsInCategory = products.filter((p) => p.category === category.name);
    if (productsInCategory.length > 0) {
      toast.error(`Cannot delete category with ${productsInCategory.length} products`);
      return;
    }

    if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
      toast.success('Category deleted successfully');
    }
  };

  // Recipe Handlers
  const handleCreateRecipe = () => {
    setEditingRecipe(null);
    setShowRecipeDialog(true);
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setShowRecipeDialog(true);
  };

  const handleDeleteRecipe = (recipe: Recipe) => {
    if (confirm(`Are you sure you want to delete "${recipe.name}"?`)) {
      toast.success('Recipe deleted successfully');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Products & Inventory</h2>
          <p className="text-muted-foreground">
            Manage products, categories, and recipes
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="products" className="gap-2">
            <Package className="w-4 h-4" />
            Products
          </TabsTrigger>
          <TabsTrigger value="categories" className="gap-2">
            <FolderTree className="w-4 h-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="recipes" className="gap-2">
            <ChefHat className="w-4 h-4" />
            Recipes
          </TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Products</CardTitle>
                <CardDescription>Manage your product catalog</CardDescription>
              </div>
              <Button onClick={() => onNavigateToEdit()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={productColumns}
                data={products}
                searchKey="name"
                searchPlaceholder="Search products..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Categories</CardTitle>
                <CardDescription>Organize products into categories</CardDescription>
              </div>
              <Button onClick={handleCreateCategory}>
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={categoryColumns}
                data={categories}
                searchKey="name"
                searchPlaceholder="Search categories..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recipes Tab */}
        <TabsContent value="recipes" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recipes</CardTitle>
                <CardDescription>
                  Define recipes to track ingredient inventory
                </CardDescription>
              </div>
              <Button onClick={handleCreateRecipe}>
                <Plus className="w-4 h-4 mr-2" />
                Add Recipe
              </Button>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={recipeColumns}
                data={recipes}
                searchKey="name"
                searchPlaceholder="Search recipes..."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Category Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Create Category'}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? 'Update category information'
                : 'Add a new category'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Category Name *</Label>
              <Input
                value={categoryForm.name}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, name: e.target.value })
                }
                placeholder="Enter category name"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={categoryForm.description}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, description: e.target.value })
                }
                placeholder="Optional description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Industry</Label>
              <Select
                value={categoryForm.industry}
                onValueChange={(value) =>
                  setCategoryForm({ ...categoryForm, industry: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select industry (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Industries</SelectItem>
                  <SelectItem value="restaurant">Restaurant / Café</SelectItem>
                  <SelectItem value="retail">Retail Store</SelectItem>
                  <SelectItem value="grocery">Grocery Store</SelectItem>
                  <SelectItem value="pharmacy">Pharmacy</SelectItem>
                  <SelectItem value="furniture">Furniture Store</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Select an industry to show this category only for that industry type. Leave empty to show for all industries.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCategoryDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCategory}>
              {editingCategory ? 'Update' : 'Create'} Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Recipe Dialog - Placeholder */}
      <Dialog open={showRecipeDialog} onOpenChange={setShowRecipeDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {editingRecipe ? 'Edit Recipe' : 'Create Recipe'}
            </DialogTitle>
            <DialogDescription>
              Define ingredients and quantities for this recipe
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Recipe builder interface coming soon...
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRecipeDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowRecipeDialog(false)}>
              {editingRecipe ? 'Update' : 'Create'} Recipe
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
