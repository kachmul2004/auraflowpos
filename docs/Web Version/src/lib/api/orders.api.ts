import { supabase, handleSupabaseError } from '../supabase';
import type { Database } from '../database.types';
import { Order, OrderItem } from '../types';

type OrderRow = Database['public']['Tables']['orders']['Row'];
type OrderInsert = Database['public']['Tables']['orders']['Insert'];
type OrderItemInsert = Database['public']['Tables']['order_items']['Insert'];

export const ordersApi = {
  // Create order with items
  async create(order: {
    orderNumber: string;
    customerId?: string;
    userId: string;
    terminalId?: string;
    items: OrderItem[];
    subtotal: number;
    tax: number;
    discount?: number;
    tip?: number;
    total: number;
    paymentMethod: string;
    orderType?: string;
    tableNumber?: string;
    notes?: string;
  }): Promise<string> {
    if (!supabase) throw new Error('Supabase not configured');

    // Insert order
    const orderInsert: OrderInsert = {
      order_number: order.orderNumber,
      customer_id: order.customerId || null,
      user_id: order.userId,
      terminal_id: order.terminalId || null,
      subtotal: order.subtotal,
      tax: order.tax,
      discount: order.discount || 0,
      tip: order.tip || 0,
      total: order.total,
      payment_method: order.paymentMethod,
      order_type: order.orderType || null,
      table_number: order.tableNumber || null,
      notes: order.notes || null,
      status: 'completed',
      payment_status: 'completed',
    };

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert(orderInsert)
      .select()
      .single();

    if (orderError) throw new Error(handleSupabaseError(orderError));

    // Insert order items
    const itemInserts: OrderItemInsert[] = order.items.map(item => ({
      order_id: orderData.id,
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      price: item.price,
      discount: item.discount || 0,
      total: item.total || (item.price * item.quantity - (item.discount || 0)),
      notes: item.notes || null,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemInserts);

    if (itemsError) throw new Error(handleSupabaseError(itemsError));

    return orderData.id;
  },

  // Get order by ID with items
  async getById(id: string): Promise<Order | null> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (orderError) {
      if (orderError.code === 'PGRST116') return null;
      throw new Error(handleSupabaseError(orderError));
    }

    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', id);

    if (itemsError) throw new Error(handleSupabaseError(itemsError));

    const items: OrderItem[] = itemsData.map(item => ({
      id: item.product_id || '',
      name: item.product_name,
      price: Number(item.price),
      quantity: item.quantity,
      discount: Number(item.discount),
      total: Number(item.total),
      notes: item.notes || undefined,
    }));

    const order: Order = {
      id: orderData.id,
      orderNumber: orderData.order_number,
      customerId: orderData.customer_id || undefined,
      userId: orderData.user_id,
      items,
      subtotal: Number(orderData.subtotal),
      tax: Number(orderData.tax),
      discount: Number(orderData.discount),
      tip: Number(orderData.tip),
      total: Number(orderData.total),
      paymentMethod: orderData.payment_method,
      status: orderData.status as any,
      timestamp: orderData.created_at,
    };

    return order;
  },

  // Get all orders
  async getAll(limit: number = 100, offset: number = 0): Promise<Order[]> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw new Error(handleSupabaseError(error));

    // For performance, we don't fetch items for list view
    // Items can be fetched when viewing specific order
    return data.map(row => ({
      id: row.id,
      orderNumber: row.order_number,
      customerId: row.customer_id || undefined,
      userId: row.user_id,
      items: [],
      subtotal: Number(row.subtotal),
      tax: Number(row.tax),
      discount: Number(row.discount),
      tip: Number(row.tip),
      total: Number(row.total),
      paymentMethod: row.payment_method,
      status: row.status as any,
      timestamp: row.created_at,
    }));
  },

  // Get orders by date range
  async getByDateRange(startDate: string, endDate: string): Promise<Order[]> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false });

    if (error) throw new Error(handleSupabaseError(error));

    return data.map(row => ({
      id: row.id,
      orderNumber: row.order_number,
      customerId: row.customer_id || undefined,
      userId: row.user_id,
      items: [],
      subtotal: Number(row.subtotal),
      tax: Number(row.tax),
      discount: Number(row.discount),
      tip: Number(row.tip),
      total: Number(row.total),
      paymentMethod: row.payment_method,
      status: row.status as any,
      timestamp: row.created_at,
    }));
  },

  // Get orders by customer
  async getByCustomer(customerId: string): Promise<Order[]> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(handleSupabaseError(error));

    return data.map(row => ({
      id: row.id,
      orderNumber: row.order_number,
      customerId: row.customer_id || undefined,
      userId: row.user_id,
      items: [],
      subtotal: Number(row.subtotal),
      tax: Number(row.tax),
      discount: Number(row.discount),
      tip: Number(row.tip),
      total: Number(row.total),
      paymentMethod: row.payment_method,
      status: row.status as any,
      timestamp: row.created_at,
    }));
  },

  // Get sales summary
  async getSalesSummary(startDate?: string, endDate?: string) {
    if (!supabase) throw new Error('Supabase not configured');

    let query = supabase
      .from('orders')
      .select('total, tax, discount, tip, payment_method')
      .eq('status', 'completed');

    if (startDate) query = query.gte('created_at', startDate);
    if (endDate) query = query.lte('created_at', endDate);

    const { data, error } = await query;

    if (error) throw new Error(handleSupabaseError(error));

    const summary = data.reduce(
      (acc, order) => {
        acc.totalSales += Number(order.total);
        acc.totalTax += Number(order.tax);
        acc.totalDiscount += Number(order.discount);
        acc.totalTips += Number(order.tip);
        acc.orderCount++;

        // Group by payment method
        const method = order.payment_method;
        if (!acc.byPaymentMethod[method]) {
          acc.byPaymentMethod[method] = { count: 0, total: 0 };
        }
        acc.byPaymentMethod[method].count++;
        acc.byPaymentMethod[method].total += Number(order.total);

        return acc;
      },
      {
        totalSales: 0,
        totalTax: 0,
        totalDiscount: 0,
        totalTips: 0,
        orderCount: 0,
        byPaymentMethod: {} as Record<string, { count: number; total: number }>,
      }
    );

    return summary;
  },
};
