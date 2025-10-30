import { supabase, handleSupabaseError } from '../supabase';
import type { Database } from '../database.types';

type RefundInsert = Database['public']['Tables']['refunds']['Insert'];
type RefundRow = Database['public']['Tables']['refunds']['Row'];

export interface Refund {
  id: string;
  orderId: string;
  transactionId?: string;
  amount: number;
  reason: string;
  notes?: string;
  refundMethod: 'original' | 'cash' | 'store_credit';
  status: 'pending' | 'completed' | 'failed';
  processedBy: string;
  createdAt: string;
}

function toRefund(row: RefundRow): Refund {
  return {
    id: row.id,
    orderId: row.order_id,
    transactionId: row.transaction_id || undefined,
    amount: Number(row.amount),
    reason: row.reason,
    notes: row.notes || undefined,
    refundMethod: row.refund_method as any,
    status: row.status as any,
    processedBy: row.processed_by,
    createdAt: row.created_at,
  };
}

export const refundsApi = {
  // Create refund
  async create(refund: {
    orderId: string;
    transactionId?: string;
    amount: number;
    reason: string;
    notes?: string;
    refundMethod: 'original' | 'cash' | 'store_credit';
    processedBy: string;
  }): Promise<Refund> {
    if (!supabase) throw new Error('Supabase not configured');

    // Validate order exists
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, total, payment_status')
      .eq('id', refund.orderId)
      .single();

    if (orderError || !order) {
      throw new Error('Order not found');
    }

    // Check if amount is valid
    if (refund.amount <= 0 || refund.amount > Number(order.total)) {
      throw new Error('Invalid refund amount');
    }

    // Create refund record
    const refundInsert: RefundInsert = {
      order_id: refund.orderId,
      transaction_id: refund.transactionId || null,
      amount: refund.amount,
      reason: refund.reason,
      notes: refund.notes || null,
      refund_method: refund.refundMethod,
      status: 'pending',
      processed_by: refund.processedBy,
    };

    const { data: refundData, error: refundError } = await supabase
      .from('refunds')
      .insert(refundInsert)
      .select()
      .single();

    if (refundError) throw new Error(handleSupabaseError(refundError));

    // In a real implementation, this is where you would:
    // 1. Process the actual refund through Stripe/payment processor
    // 2. Update the refund status based on the result
    // For now, we'll mark it as completed immediately

    await this.complete(refundData.id);

    // Update order payment status
    await supabase
      .from('orders')
      .update({ payment_status: 'refunded' })
      .eq('id', refund.orderId);

    return toRefund({ ...refundData, status: 'completed' });
  },

  // Complete refund (mark as processed)
  async complete(id: string): Promise<Refund> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('refunds')
      .update({ status: 'completed' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(handleSupabaseError(error));
    return toRefund(data);
  },

  // Fail refund (mark as failed)
  async fail(id: string): Promise<Refund> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('refunds')
      .update({ status: 'failed' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(handleSupabaseError(error));
    return toRefund(data);
  },

  // Get refund by ID
  async getById(id: string): Promise<Refund | null> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('refunds')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(handleSupabaseError(error));
    }

    return toRefund(data);
  },

  // Get refunds for an order
  async getByOrder(orderId: string): Promise<Refund[]> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('refunds')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(handleSupabaseError(error));
    return data.map(toRefund);
  },

  // Get all refunds
  async getAll(limit: number = 100, offset: number = 0): Promise<Refund[]> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('refunds')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw new Error(handleSupabaseError(error));
    return data.map(toRefund);
  },

  // Get refunds by date range
  async getByDateRange(startDate: string, endDate: string): Promise<Refund[]> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('refunds')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false });

    if (error) throw new Error(handleSupabaseError(error));
    return data.map(toRefund);
  },

  // Get refund summary
  async getSummary(startDate?: string, endDate?: string) {
    if (!supabase) throw new Error('Supabase not configured');

    let query = supabase
      .from('refunds')
      .select('amount, status, refund_method');

    if (startDate) query = query.gte('created_at', startDate);
    if (endDate) query = query.lte('created_at', endDate);

    const { data, error } = await query;

    if (error) throw new Error(handleSupabaseError(error));

    const summary = data.reduce(
      (acc, refund) => {
        acc.totalAmount += Number(refund.amount);
        acc.count++;

        // Group by status
        acc.byStatus[refund.status] = (acc.byStatus[refund.status] || 0) + 1;

        // Group by method
        const method = refund.refund_method;
        if (!acc.byMethod[method]) {
          acc.byMethod[method] = { count: 0, total: 0 };
        }
        acc.byMethod[method].count++;
        acc.byMethod[method].total += Number(refund.amount);

        return acc;
      },
      {
        totalAmount: 0,
        count: 0,
        byStatus: {} as Record<string, number>,
        byMethod: {} as Record<string, { count: number; total: number }>,
      }
    );

    return summary;
  },

  // Process refund through payment processor
  async processRefund(refundId: string, paymentIntentId?: string): Promise<Refund> {
    if (!supabase) throw new Error('Supabase not configured');

    // Get refund details
    const refund = await this.getById(refundId);
    if (!refund) throw new Error('Refund not found');

    try {
      // TODO: In Phase 3, integrate with Stripe here
      // For now, we just mark it as completed
      
      // Example Stripe integration (commented out):
      /*
      if (refund.refundMethod === 'original' && paymentIntentId) {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        await stripe.refunds.create({
          payment_intent: paymentIntentId,
          amount: Math.round(refund.amount * 100), // Convert to cents
        });
      }
      */

      // Mark as completed
      return await this.complete(refundId);
    } catch (error) {
      // Mark as failed
      await this.fail(refundId);
      throw error;
    }
  },
};
