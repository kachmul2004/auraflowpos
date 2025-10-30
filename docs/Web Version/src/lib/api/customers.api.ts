import { supabase, handleSupabaseError } from '../supabase';
import type { Database } from '../database.types';
import { Customer } from '../types';

type CustomerRow = Database['public']['Tables']['customers']['Row'];
type CustomerInsert = Database['public']['Tables']['customers']['Insert'];
type CustomerUpdate = Database['public']['Tables']['customers']['Update'];

// Convert database row to app Customer type
function toCustomer(row: CustomerRow): Customer {
  return {
    id: row.id,
    name: row.name,
    email: row.email || undefined,
    phone: row.phone || undefined,
    address: row.address || undefined,
    loyaltyPoints: row.loyalty_points,
    totalSpent: Number(row.total_spent),
    visitCount: row.visit_count,
    birthday: row.birthday || undefined,
    notes: row.notes || undefined,
  };
}

// Convert app Customer to database insert
function toCustomerInsert(customer: Partial<Customer>): CustomerInsert {
  return {
    name: customer.name!,
    email: customer.email || null,
    phone: customer.phone || null,
    address: customer.address || null,
    loyalty_points: customer.loyaltyPoints || 0,
    total_spent: customer.totalSpent || 0,
    visit_count: customer.visitCount || 0,
    birthday: customer.birthday || null,
    notes: customer.notes || null,
  };
}

export const customersApi = {
  // Get all customers
  async getAll(): Promise<Customer[]> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('name');

    if (error) throw new Error(handleSupabaseError(error));
    return data.map(toCustomer);
  },

  // Get single customer
  async getById(id: string): Promise<Customer | null> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(handleSupabaseError(error));
    }

    return toCustomer(data);
  },

  // Search customers
  async search(query: string): Promise<Customer[]> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
      .order('name')
      .limit(50);

    if (error) throw new Error(handleSupabaseError(error));
    return data.map(toCustomer);
  },

  // Create customer
  async create(customer: Partial<Customer>): Promise<Customer> {
    if (!supabase) throw new Error('Supabase not configured');

    const insert = toCustomerInsert(customer);

    const { data, error } = await supabase
      .from('customers')
      .insert(insert)
      .select()
      .single();

    if (error) throw new Error(handleSupabaseError(error));
    return toCustomer(data);
  },

  // Update customer
  async update(id: string, updates: Partial<Customer>): Promise<Customer> {
    if (!supabase) throw new Error('Supabase not configured');

    const update: CustomerUpdate = {};

    if (updates.name !== undefined) update.name = updates.name;
    if (updates.email !== undefined) update.email = updates.email || null;
    if (updates.phone !== undefined) update.phone = updates.phone || null;
    if (updates.address !== undefined) update.address = updates.address || null;
    if (updates.loyaltyPoints !== undefined) update.loyalty_points = updates.loyaltyPoints;
    if (updates.totalSpent !== undefined) update.total_spent = updates.totalSpent;
    if (updates.visitCount !== undefined) update.visit_count = updates.visitCount;
    if (updates.birthday !== undefined) update.birthday = updates.birthday || null;
    if (updates.notes !== undefined) update.notes = updates.notes || null;

    const { data, error } = await supabase
      .from('customers')
      .update(update)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(handleSupabaseError(error));
    return toCustomer(data);
  },

  // Delete customer
  async delete(id: string): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured');

    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);

    if (error) throw new Error(handleSupabaseError(error));
  },

  // Add loyalty points
  async addLoyaltyPoints(id: string, points: number): Promise<Customer> {
    if (!supabase) throw new Error('Supabase not configured');

    const customer = await this.getById(id);
    if (!customer) throw new Error('Customer not found');

    const newPoints = customer.loyaltyPoints + points;
    return await this.update(id, { loyaltyPoints: newPoints });
  },

  // Redeem loyalty points
  async redeemLoyaltyPoints(id: string, points: number): Promise<Customer> {
    if (!supabase) throw new Error('Supabase not configured');

    const customer = await this.getById(id);
    if (!customer) throw new Error('Customer not found');
    if (customer.loyaltyPoints < points) {
      throw new Error('Insufficient loyalty points');
    }

    const newPoints = customer.loyaltyPoints - points;
    return await this.update(id, { loyaltyPoints: newPoints });
  },

  // Get top customers by spend
  async getTopCustomers(limit: number = 10): Promise<Customer[]> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('total_spent', { ascending: false })
      .limit(limit);

    if (error) throw new Error(handleSupabaseError(error));
    return data.map(toCustomer);
  },
};
