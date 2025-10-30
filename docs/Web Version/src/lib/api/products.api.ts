import { supabase, handleSupabaseError } from '../supabase';
import type { Database } from '../database.types';
import { Product } from '../types';

type ProductRow = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];

// Convert database row to app Product type
function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    category: row.category,
    barcode: row.barcode || undefined,
    sku: row.sku || undefined,
    description: row.description || undefined,
    image: row.image_url || undefined,
    stockQuantity: row.stock_quantity,
    lowStockThreshold: row.low_stock_threshold || undefined,
    cost: row.cost ? Number(row.cost) : undefined,
    taxable: row.taxable,
    enabled: row.enabled,
  };
}

// Convert app Product to database insert
function toProductInsert(product: Partial<Product>): ProductInsert {
  return {
    name: product.name!,
    price: product.price!,
    category: product.category!,
    barcode: product.barcode || null,
    sku: product.sku || null,
    description: product.description || null,
    image_url: product.image || null,
    stock_quantity: product.stockQuantity || 0,
    low_stock_threshold: product.lowStockThreshold || null,
    cost: product.cost || null,
    taxable: product.taxable !== false,
    enabled: product.enabled !== false,
  };
}

export const productsApi = {
  // Get all products
  async getAll(): Promise<Product[]> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name');

    if (error) throw new Error(handleSupabaseError(error));
    return data.map(toProduct);
  },

  // Get products by category
  async getByCategory(category: string): Promise<Product[]> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .eq('enabled', true)
      .order('name');

    if (error) throw new Error(handleSupabaseError(error));
    return data.map(toProduct);
  },

  // Get single product
  async getById(id: string): Promise<Product | null> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(handleSupabaseError(error));
    }

    return toProduct(data);
  },

  // Get product by barcode
  async getByBarcode(barcode: string): Promise<Product | null> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('barcode', barcode)
      .eq('enabled', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(handleSupabaseError(error));
    }

    return toProduct(data);
  },

  // Create product
  async create(product: Partial<Product>): Promise<Product> {
    if (!supabase) throw new Error('Supabase not configured');

    const insert = toProductInsert(product);

    const { data, error } = await supabase
      .from('products')
      .insert(insert)
      .select()
      .single();

    if (error) throw new Error(handleSupabaseError(error));
    return toProduct(data);
  },

  // Update product
  async update(id: string, updates: Partial<Product>): Promise<Product> {
    if (!supabase) throw new Error('Supabase not configured');

    const update: ProductUpdate = {};
    
    if (updates.name !== undefined) update.name = updates.name;
    if (updates.price !== undefined) update.price = updates.price;
    if (updates.category !== undefined) update.category = updates.category;
    if (updates.barcode !== undefined) update.barcode = updates.barcode || null;
    if (updates.sku !== undefined) update.sku = updates.sku || null;
    if (updates.description !== undefined) update.description = updates.description || null;
    if (updates.image !== undefined) update.image_url = updates.image || null;
    if (updates.stockQuantity !== undefined) update.stock_quantity = updates.stockQuantity;
    if (updates.lowStockThreshold !== undefined) update.low_stock_threshold = updates.lowStockThreshold || null;
    if (updates.cost !== undefined) update.cost = updates.cost || null;
    if (updates.taxable !== undefined) update.taxable = updates.taxable;
    if (updates.enabled !== undefined) update.enabled = updates.enabled;

    const { data, error } = await supabase
      .from('products')
      .update(update)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(handleSupabaseError(error));
    return toProduct(data);
  },

  // Delete product
  async delete(id: string): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured');

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw new Error(handleSupabaseError(error));
  },

  // Adjust stock
  async adjustStock(id: string, change: number, reason: string, userId: string): Promise<Product> {
    if (!supabase) throw new Error('Supabase not configured');

    // Get current product
    const product = await this.getById(id);
    if (!product) throw new Error('Product not found');

    // Calculate new stock
    const newStock = product.stockQuantity + change;
    if (newStock < 0) throw new Error('Insufficient stock');

    // Update product stock
    const updated = await this.update(id, { stockQuantity: newStock });

    // Log adjustment
    await supabase.from('inventory_adjustments').insert({
      product_id: id,
      quantity_change: change,
      reason,
      user_id: userId,
    });

    return updated;
  },

  // Get low stock products
  async getLowStock(): Promise<Product[]> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .lte('stock_quantity', supabase.raw('low_stock_threshold'))
      .eq('enabled', true)
      .order('stock_quantity');

    if (error) throw new Error(handleSupabaseError(error));
    return data.map(toProduct);
  },

  // Search products
  async search(query: string): Promise<Product[]> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,barcode.ilike.%${query}%,sku.ilike.%${query}%`)
      .eq('enabled', true)
      .order('name')
      .limit(50);

    if (error) throw new Error(handleSupabaseError(error));
    return data.map(toProduct);
  },

  // Get categories
  async getCategories(): Promise<string[]> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('products')
      .select('category')
      .eq('enabled', true);

    if (error) throw new Error(handleSupabaseError(error));
    
    const categories = [...new Set(data.map(p => p.category))];
    return categories.sort();
  },
};
