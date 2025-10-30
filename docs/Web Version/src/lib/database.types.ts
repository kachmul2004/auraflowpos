// Database type definitions for Supabase
// This file will be auto-generated once Supabase is set up
// For now, we define the types manually based on our schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          price: number;
          category: string;
          barcode: string | null;
          sku: string | null;
          description: string | null;
          image_url: string | null;
          stock_quantity: number;
          low_stock_threshold: number | null;
          cost: number | null;
          taxable: boolean;
          enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          price: number;
          category: string;
          barcode?: string | null;
          sku?: string | null;
          description?: string | null;
          image_url?: string | null;
          stock_quantity?: number;
          low_stock_threshold?: number | null;
          cost?: number | null;
          taxable?: boolean;
          enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          price?: number;
          category?: string;
          barcode?: string | null;
          sku?: string | null;
          description?: string | null;
          image_url?: string | null;
          stock_quantity?: number;
          low_stock_threshold?: number | null;
          cost?: number | null;
          taxable?: boolean;
          enabled?: boolean;
          updated_at?: string;
        };
      };
      customers: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          phone: string | null;
          address: string | null;
          loyalty_points: number;
          total_spent: number;
          visit_count: number;
          birthday: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          loyalty_points?: number;
          total_spent?: number;
          visit_count?: number;
          birthday?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          loyalty_points?: number;
          total_spent?: number;
          visit_count?: number;
          birthday?: string | null;
          notes?: string | null;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_id: string | null;
          user_id: string;
          terminal_id: string | null;
          subtotal: number;
          tax: number;
          discount: number;
          tip: number;
          total: number;
          payment_method: string;
          payment_status: string;
          order_type: string | null;
          table_number: string | null;
          notes: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          customer_id?: string | null;
          user_id: string;
          terminal_id?: string | null;
          subtotal: number;
          tax: number;
          discount?: number;
          tip?: number;
          total: number;
          payment_method: string;
          payment_status?: string;
          order_type?: string | null;
          table_number?: string | null;
          notes?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string | null;
          subtotal?: number;
          tax?: number;
          discount?: number;
          tip?: number;
          total?: number;
          payment_method?: string;
          payment_status?: string;
          order_type?: string | null;
          table_number?: string | null;
          notes?: string | null;
          status?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          product_name: string;
          quantity: number;
          price: number;
          discount: number;
          total: number;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          product_name: string;
          quantity: number;
          price: number;
          discount?: number;
          total: number;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          quantity?: number;
          price?: number;
          discount?: number;
          total?: number;
          notes?: string | null;
        };
      };
      transactions: {
        Row: {
          id: string;
          order_id: string;
          amount: number;
          payment_method: string;
          payment_reference: string | null;
          stripe_payment_id: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          amount: number;
          payment_method: string;
          payment_reference?: string | null;
          stripe_payment_id?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: {
          amount?: number;
          status?: string;
        };
      };
      refunds: {
        Row: {
          id: string;
          order_id: string;
          transaction_id: string | null;
          amount: number;
          reason: string;
          notes: string | null;
          refund_method: string;
          status: string;
          processed_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          transaction_id?: string | null;
          amount: number;
          reason: string;
          notes?: string | null;
          refund_method: string;
          status?: string;
          processed_by: string;
          created_at?: string;
        };
        Update: {
          status?: string;
        };
      };
      shifts: {
        Row: {
          id: string;
          user_id: string;
          terminal_id: string | null;
          clock_in: string;
          clock_out: string | null;
          opening_cash: number;
          closing_cash: number | null;
          total_sales: number;
          total_transactions: number;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          terminal_id?: string | null;
          clock_in: string;
          clock_out?: string | null;
          opening_cash: number;
          closing_cash?: number | null;
          total_sales?: number;
          total_transactions?: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          clock_out?: string | null;
          closing_cash?: number | null;
          total_sales?: number;
          total_transactions?: number;
          status?: string;
          updated_at?: string;
        };
      };
      inventory_adjustments: {
        Row: {
          id: string;
          product_id: string;
          quantity_change: number;
          reason: string;
          notes: string | null;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          quantity_change: number;
          reason: string;
          notes?: string | null;
          user_id: string;
          created_at?: string;
        };
        Update: Record<string, never>;
      };
      settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: Json;
          updated_at?: string;
        };
        Update: {
          value?: Json;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
      order_status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
      shift_status: 'open' | 'closed';
      transaction_status: 'pending' | 'completed' | 'failed' | 'refunded';
      refund_status: 'pending' | 'completed' | 'failed';
    };
  };
}
