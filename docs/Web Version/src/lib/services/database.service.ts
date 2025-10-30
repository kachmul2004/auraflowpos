/**
 * Database Service Layer
 * 
 * Abstracts Supabase operations and provides:
 * - Offline queue management
 * - Retry logic
 * - Error handling
 * - Optimistic updates
 * - Cache management
 */

import { supabase, isSupabaseConfigured } from '../supabase';
import { offlineQueue } from '../offline/queue-manager';
import type { Product, Customer, Order, OrderItem } from '../types';

// Helper type for database operations
type Operation = 'insert' | 'update' | 'delete';

interface QueuedOperation {
  id: string;
  table: string;
  operation: Operation;
  data: any;
  timestamp: number;
  retryCount: number;
}

/**
 * Base Database Service
 * All specific services (products, orders, etc.) extend this
 */
export class DatabaseService {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  /**
   * Check if we're online and Supabase is configured
   */
  protected get isOnline(): boolean {
    return navigator.onLine && isSupabaseConfigured();
  }

  /**
   * Execute operation with offline queue fallback
   */
  protected async executeWithQueue<T>(
    operation: () => Promise<T>,
    queueData: Omit<QueuedOperation, 'id' | 'timestamp' | 'retryCount'>
  ): Promise<T> {
    if (this.isOnline) {
      try {
        return await operation();
      } catch (error) {
        console.error('Operation failed, adding to queue:', error);
        await offlineQueue.add(queueData);
        throw error;
      }
    } else {
      // Offline - add to queue
      await offlineQueue.add(queueData);
      throw new Error('Offline - operation queued for sync');
    }
  }

  /**
   * Get all records from table
   */
  async getAll<T>(): Promise<T[]> {
    if (!this.isOnline || !supabase) {
      throw new Error('Cannot fetch data while offline');
    }

    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as T[];
  }

  /**
   * Get record by ID
   */
  async getById<T>(id: string): Promise<T | null> {
    if (!this.isOnline || !supabase) {
      throw new Error('Cannot fetch data while offline');
    }

    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }

    return data as T;
  }

  /**
   * Insert record
   */
  async insert<T>(record: Partial<T>): Promise<T> {
    return this.executeWithQueue(
      async () => {
        if (!supabase) throw new Error('Supabase not configured');

        const { data, error } = await supabase
          .from(this.tableName)
          .insert([record])
          .select()
          .single();

        if (error) throw error;
        return data as T;
      },
      {
        table: this.tableName,
        operation: 'insert',
        data: record,
      }
    );
  }

  /**
   * Update record
   */
  async update<T>(id: string, updates: Partial<T>): Promise<T> {
    return this.executeWithQueue(
      async () => {
        if (!supabase) throw new Error('Supabase not configured');

        const { data, error } = await supabase
          .from(this.tableName)
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return data as T;
      },
      {
        table: this.tableName,
        operation: 'update',
        data: { id, ...updates },
      }
    );
  }

  /**
   * Delete record
   */
  async delete(id: string): Promise<void> {
    return this.executeWithQueue(
      async () => {
        if (!supabase) throw new Error('Supabase not configured');

        const { error } = await supabase
          .from(this.tableName)
          .delete()
          .eq('id', id);

        if (error) throw error;
      },
      {
        table: this.tableName,
        operation: 'delete',
        data: { id },
      }
    );
  }

  /**
   * Search records
   */
  async search<T>(column: string, query: string): Promise<T[]> {
    if (!this.isOnline || !supabase) {
      throw new Error('Cannot search while offline');
    }

    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .ilike(column, `%${query}%`);

    if (error) throw error;
    return data as T[];
  }

  /**
   * Subscribe to real-time changes
   */
  subscribe(callback: (payload: any) => void) {
    if (!supabase) {
      console.warn('Supabase not configured, real-time disabled');
      return null;
    }

    const channel = supabase
      .channel(`${this.tableName}_changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: this.tableName,
        },
        callback
      )
      .subscribe();

    return channel;
  }
}

/**
 * Products Service
 */
export class ProductsService extends DatabaseService {
  constructor() {
    super('products');
  }

  async getByCategory(category: string): Promise<Product[]> {
    if (!this.isOnline || !supabase) {
      throw new Error('Cannot fetch data while offline');
    }

    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('category', category)
      .eq('enabled', true);

    if (error) throw error;
    return data as Product[];
  }

  async getByBarcode(barcode: string): Promise<Product | null> {
    if (!this.isOnline || !supabase) {
      throw new Error('Cannot fetch data while offline');
    }

    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('barcode', barcode)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data as Product;
  }

  async getLowStock(threshold?: number): Promise<Product[]> {
    if (!this.isOnline || !supabase) {
      throw new Error('Cannot fetch data while offline');
    }

    let query = supabase
      .from(this.tableName)
      .select('*')
      .eq('enabled', true);

    if (threshold) {
      query = query.lt('stock_quantity', threshold);
    } else {
      query = query.filter('stock_quantity', 'lt', 'low_stock_threshold');
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as Product[];
  }

  async updateStock(productId: string, quantityChange: number, reason: string): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured');

    // Get current stock
    const { data: product, error: fetchError } = await supabase
      .from(this.tableName)
      .select('stock_quantity')
      .eq('id', productId)
      .single();

    if (fetchError) throw fetchError;

    const newQuantity = (product.stock_quantity || 0) + quantityChange;

    // Update stock
    const { error: updateError } = await supabase
      .from(this.tableName)
      .update({ stock_quantity: newQuantity })
      .eq('id', productId);

    if (updateError) throw updateError;

    // Log inventory adjustment
    const { error: logError } = await supabase
      .from('inventory_adjustments')
      .insert([{
        product_id: productId,
        quantity_change: quantityChange,
        reason,
        user_id: (await supabase.auth.getUser()).data.user?.id,
      }]);

    if (logError) throw logError;
  }
}

/**
 * Customers Service
 */
export class CustomersService extends DatabaseService {
  constructor() {
    super('customers');
  }

  async searchByNameOrPhone(query: string): Promise<Customer[]> {
    if (!this.isOnline || !supabase) {
      throw new Error('Cannot search while offline');
    }

    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .or(`name.ilike.%${query}%,phone.ilike.%${query}%,email.ilike.%${query}%`)
      .limit(10);

    if (error) throw error;
    return data as Customer[];
  }

  async addLoyaltyPoints(customerId: string, points: number): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data: customer, error: fetchError } = await supabase
      .from(this.tableName)
      .select('loyalty_points')
      .eq('id', customerId)
      .single();

    if (fetchError) throw fetchError;

    const newPoints = (customer.loyalty_points || 0) + points;

    const { error: updateError } = await supabase
      .from(this.tableName)
      .update({ loyalty_points: newPoints })
      .eq('id', customerId);

    if (updateError) throw updateError;
  }
}

/**
 * Orders Service
 */
export class OrdersService extends DatabaseService {
  constructor() {
    super('orders');
  }

  async createOrder(order: Partial<Order>, items: OrderItem[]): Promise<Order> {
    if (!supabase) throw new Error('Supabase not configured');

    // Start transaction
    const { data: orderData, error: orderError } = await supabase
      .from(this.tableName)
      .insert([order])
      .select()
      .single();

    if (orderError) throw orderError;

    // Insert order items
    const itemsWithOrderId = items.map(item => ({
      ...item,
      order_id: orderData.id,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsWithOrderId);

    if (itemsError) {
      // Rollback order if items fail
      await supabase.from(this.tableName).delete().eq('id', orderData.id);
      throw itemsError;
    }

    return orderData as Order;
  }

  async getByDateRange(startDate: Date, endDate: Date): Promise<Order[]> {
    if (!this.isOnline || !supabase) {
      throw new Error('Cannot fetch data while offline');
    }

    const { data, error } = await supabase
      .from(this.tableName)
      .select('*, order_items(*)')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Order[];
  }

  async getByCustomer(customerId: string): Promise<Order[]> {
    if (!this.isOnline || !supabase) {
      throw new Error('Cannot fetch data while offline');
    }

    const { data, error } = await supabase
      .from(this.tableName)
      .select('*, order_items(*)')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Order[];
  }
}

/**
 * Export service instances
 */
export const productsService = new ProductsService();
export const customersService = new CustomersService();
export const ordersService = new OrdersService();
