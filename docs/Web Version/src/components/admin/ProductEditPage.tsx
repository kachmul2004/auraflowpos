import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ArrowLeft, Plus, Trash2, Layers, Save } from 'lucide-react';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { toast } from 'sonner@2.0.3';
import { Product, ProductVariation } from '../../lib/types';
import { Separator } from '../ui/separator';

interface ProductEditPageProps {
  product: Product | null;
  onBack: () => void;
  onSave: (productData: any, variations: ProductVariation[]) => void;
}

export function ProductEditPage({ product, onBack, onSave }: ProductEditPageProps) {
  const isEditMode = product !== null;

  // Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    cost: '',
    category: '',
    sku: '',
    stockQuantity: '',
    inStock: true,
    isVariable: false,
    description: '',
    hasVariations: false,
    variationTypeName: '',
  });

  const [variations, setVariations] = useState<ProductVariation[]>([]);

  // Mock categories (in real app, would come from store/API)
  const categories = [
    { id: '1', name: 'Beverages' },
    { id: '2', name: 'Food' },
    { id: '3', name: 'Snacks' },
  ];

  // Load product data when editing
  useEffect(() => {
    if (product) {
      const hasVariations = (product.variations?.length || 0) > 0;
      setProductForm({
        name: product.name,
        price: product.price.toString(),
        cost: product.cost?.toString() || '',
        category: product.category,
        sku: product.sku || '',
        stockQuantity: product.stockQuantity.toString(),
        inStock: product.inStock,
        isVariable: product.isVariable || false,
        description: '',
        hasVariations,
        variationTypeName: product.variationType?.name || '',
      });
      setVariations(product.variations || []);
    }
  }, [product]);

  // Variation Handlers
  const handleAddVariation = () => {
    const newVariation: ProductVariation = {
      id: `var-${Date.now()}`,
      name: '',
      price: 0,
      stockQuantity: 0,
      sku: '',
    };
    setVariations([...variations, newVariation]);
  };

  const handleUpdateVariation = (index: number, field: keyof ProductVariation, value: any) => {
    const updatedVariations = [...variations];
    updatedVariations[index] = {
      ...updatedVariations[index],
      [field]: value,
    };
    setVariations(updatedVariations);
  };

  const handleRemoveVariation = (index: number) => {
    const updatedVariations = variations.filter((_, i) => i !== index);
    setVariations(updatedVariations);
  };

  const handleSave = () => {
    if (!productForm.name || !productForm.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate variations if enabled
    if (productForm.hasVariations) {
      if (!productForm.variationTypeName) {
        toast.error('Please enter a variation type name (e.g., Size, Color)');
        return;
      }

      if (variations.length === 0) {
        toast.error('Please add at least one variation');
        return;
      }

      const invalidVariation = variations.find(v => !v.name || v.price <= 0);
      if (invalidVariation) {
        toast.error('All variations must have a name and price');
        return;
      }
    } else if (!productForm.price) {
      toast.error('Please enter a price');
      return;
    }

    onSave(productForm, variations);
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      onBack();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
            <div>
              <h2 className="text-2xl">
                {isEditMode ? 'Edit Product' : 'Create Product'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isEditMode
                  ? 'Update product information and variations'
                  : 'Add a new product to your catalog'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              {isEditMode ? 'Update' : 'Create'} Product
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Basic Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Product Name *</Label>
                  <Input
                    value={productForm.name}
                    onChange={(e) =>
                      setProductForm({ ...productForm, name: e.target.value })
                    }
                    placeholder="Enter product name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>SKU</Label>
                  <Input
                    value={productForm.sku}
                    onChange={(e) =>
                      setProductForm({ ...productForm, sku: e.target.value })
                    }
                    placeholder="Enter SKU"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({ ...productForm, description: e.target.value })
                  }
                  placeholder="Optional product description"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Inventory Card */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cost Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={productForm.cost}
                    onChange={(e) =>
                      setProductForm({ ...productForm, cost: e.target.value })
                    }
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Selling Price {!productForm.hasVariations && '*'}</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({ ...productForm, price: e.target.value })
                    }
                    placeholder={productForm.hasVariations ? 'Set in variations' : '0.00'}
                    disabled={productForm.hasVariations}
                  />
                  {productForm.hasVariations && (
                    <p className="text-xs text-muted-foreground">
                      Price is set per variation below
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select
                    value={productForm.category}
                    onValueChange={(value) =>
                      setProductForm({ ...productForm, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Stock Quantity</Label>
                  <Input
                    type="number"
                    min="0"
                    value={productForm.stockQuantity}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        stockQuantity: e.target.value,
                      })
                    }
                    placeholder={productForm.hasVariations ? 'Set in variations' : '0'}
                    disabled={productForm.hasVariations}
                  />
                  {productForm.hasVariations && (
                    <p className="text-xs text-muted-foreground">
                      Stock is tracked per variation below
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Options Card */}
          <Card>
            <CardHeader>
              <CardTitle>Product Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2 p-3 bg-muted rounded-lg">
                <div className="space-y-0.5">
                  <Label>Variable Weight/Price Product</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable for products sold by weight or with varying prices
                  </p>
                </div>
                <Switch
                  checked={productForm.isVariable}
                  onCheckedChange={(checked) =>
                    setProductForm({ ...productForm, isVariable: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between space-x-2 p-3 bg-muted rounded-lg">
                <div className="space-y-0.5">
                  <Label>Product Has Variations</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable if product comes in different sizes, colors, etc.
                  </p>
                </div>
                <Switch
                  checked={productForm.hasVariations}
                  onCheckedChange={(checked) => {
                    setProductForm({ ...productForm, hasVariations: checked });
                    if (!checked) {
                      setVariations([]);
                    }
                  }}
                />
              </div>

              <div className="flex items-center justify-between space-x-2 p-3 bg-muted rounded-lg">
                <div className="space-y-0.5">
                  <Label>In Stock</Label>
                  <p className="text-sm text-muted-foreground">
                    Product is available for sale
                  </p>
                </div>
                <Switch
                  checked={productForm.inStock}
                  onCheckedChange={(checked) =>
                    setProductForm({ ...productForm, inStock: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Variations Card */}
          {productForm.hasVariations && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5" />
                    <CardTitle>Product Variations</CardTitle>
                  </div>
                  <Badge variant="secondary">
                    {variations.length} Variation{variations.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Variation Type Name *</Label>
                  <Input
                    value={productForm.variationTypeName}
                    onChange={(e) =>
                      setProductForm({ ...productForm, variationTypeName: e.target.value })
                    }
                    placeholder="e.g., Size, Color, Style"
                  />
                  <p className="text-xs text-muted-foreground">
                    What varies about this product? (e.g., Size for Small/Medium/Large)
                  </p>
                </div>

                <Separator />

                {variations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Layers className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No variations added yet</p>
                    <p className="text-xs mt-1">Click "Add Variation" to get started</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {variations.map((variation, index) => (
                      <div
                        key={variation.id}
                        className="grid grid-cols-12 gap-3 p-4 bg-muted/50 rounded-lg border border-border"
                      >
                        <div className="col-span-3 space-y-1">
                          <Label className="text-xs">Name *</Label>
                          <Input
                            value={variation.name}
                            onChange={(e) =>
                              handleUpdateVariation(index, 'name', e.target.value)
                            }
                            placeholder="e.g., Small"
                          />
                        </div>

                        <div className="col-span-2 space-y-1">
                          <Label className="text-xs">Price *</Label>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={variation.price}
                            onChange={(e) =>
                              handleUpdateVariation(index, 'price', parseFloat(e.target.value) || 0)
                            }
                            placeholder="0.00"
                          />
                        </div>

                        <div className="col-span-2 space-y-1">
                          <Label className="text-xs">Stock</Label>
                          <Input
                            type="number"
                            min="0"
                            value={variation.stockQuantity}
                            onChange={(e) =>
                              handleUpdateVariation(index, 'stockQuantity', parseInt(e.target.value) || 0)
                            }
                            placeholder="0"
                          />
                        </div>

                        <div className="col-span-4 space-y-1">
                          <Label className="text-xs">SKU</Label>
                          <Input
                            value={variation.sku || ''}
                            onChange={(e) =>
                              handleUpdateVariation(index, 'sku', e.target.value)
                            }
                            placeholder="Optional SKU"
                          />
                        </div>

                        <div className="col-span-1 flex items-end">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveVariation(index)}
                            className="h-9"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddVariation}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Variation
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Bottom Actions */}
          <div className="flex justify-end gap-2 pb-6">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              {isEditMode ? 'Update' : 'Create'} Product
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
