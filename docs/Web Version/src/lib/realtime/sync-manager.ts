/**
 * Real-time Sync Manager
 * 
 * Manages real-time synchronization across devices:
 * - Subscribes to database changes
 * - Updates local state when remote changes occur
 * - Handles conflict resolution
 * - Provides presence tracking
 */

import { supabase } from '../supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

type ChangeCallback = (payload: any) => void;
type PresenceCallback = (state: any) => void;

/**
 * Real-time Sync Manager
 */
class SyncManager {
  private channels: Map<string, RealtimeChannel> = new Map();
  private callbacks: Map<string, Set<ChangeCallback>> = new Map();

  /**
   * Subscribe to table changes
   */
  subscribeToTable(
    table: string,
    callback: ChangeCallback,
    filter?: { column: string; value: any }
  ): () => void {
    if (!supabase) {
      console.warn('Supabase not configured - real-time disabled');
      return () => {};
    }

    const channelKey = filter 
      ? `${table}_${filter.column}_${filter.value}`
      : table;

    // Check if channel already exists
    if (this.channels.has(channelKey)) {
      // Add callback to existing channel
      const callbacks = this.callbacks.get(channelKey) || new Set();
      callbacks.add(callback);
      this.callbacks.set(channelKey, callbacks);

      return () => this.unsubscribe(channelKey, callback);
    }

    // Create new channel
    const config: any = {
      event: '*',
      schema: 'public',
      table,
    };

    if (filter) {
      config.filter = `${filter.column}=eq.${filter.value}`;
    }

    const channel = supabase
      .channel(`${channelKey}_changes`)
      .on('postgres_changes', config, (payload) => {
        // Call all registered callbacks
        const callbacks = this.callbacks.get(channelKey);
        if (callbacks) {
          callbacks.forEach(cb => cb(payload));
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Subscribed to ${channelKey} changes`);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`Error subscribing to ${channelKey}`);
        }
      });

    this.channels.set(channelKey, channel);
    
    // Store callback
    const callbacks = new Set<ChangeCallback>();
    callbacks.add(callback);
    this.callbacks.set(channelKey, callbacks);

    // Return unsubscribe function
    return () => this.unsubscribe(channelKey, callback);
  }

  /**
   * Unsubscribe from table changes
   */
  private unsubscribe(channelKey: string, callback: ChangeCallback): void {
    const callbacks = this.callbacks.get(channelKey);
    if (callbacks) {
      callbacks.delete(callback);
      
      // If no more callbacks, remove channel
      if (callbacks.size === 0) {
        const channel = this.channels.get(channelKey);
        if (channel) {
          supabase?.removeChannel(channel);
          this.channels.delete(channelKey);
          this.callbacks.delete(channelKey);
          console.log(`Unsubscribed from ${channelKey}`);
        }
      }
    }
  }

  /**
   * Subscribe to multiple tables
   */
  subscribeToTables(
    tables: string[],
    callback: ChangeCallback
  ): () => void {
    const unsubscribers = tables.map(table => 
      this.subscribeToTable(table, callback)
    );

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }

  /**
   * Presence tracking for active users
   */
  trackPresence(
    room: string,
    userData: any,
    onUpdate: PresenceCallback
  ): () => void {
    if (!supabase) {
      console.warn('Supabase not configured - presence disabled');
      return () => {};
    }

    const channel = supabase.channel(`presence:${room}`, {
      config: {
        presence: {
          key: userData.id || 'anonymous',
        },
      },
    });

    // Track presence
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        onUpdate(state);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track(userData);
          console.log(`Tracking presence in ${room}`);
        }
      });

    this.channels.set(`presence:${room}`, channel);

    // Return untrack function
    return () => {
      channel.untrack();
      supabase?.removeChannel(channel);
      this.channels.delete(`presence:${room}`);
    };
  }

  /**
   * Broadcast message to channel
   */
  async broadcast(
    channel: string,
    event: string,
    payload: any
  ): Promise<void> {
    if (!supabase) {
      console.warn('Supabase not configured - broadcast disabled');
      return;
    }

    const ch = this.channels.get(channel) || supabase.channel(channel);
    
    await ch.send({
      type: 'broadcast',
      event,
      payload,
    });
  }

  /**
   * Listen to broadcast messages
   */
  subscribeToBroadcast(
    channel: string,
    event: string,
    callback: (payload: any) => void
  ): () => void {
    if (!supabase) {
      console.warn('Supabase not configured - broadcast disabled');
      return () => {};
    }

    const ch = supabase.channel(channel)
      .on('broadcast', { event }, (payload) => {
        callback(payload);
      })
      .subscribe();

    this.channels.set(`broadcast:${channel}:${event}`, ch);

    return () => {
      supabase?.removeChannel(ch);
      this.channels.delete(`broadcast:${channel}:${event}`);
    };
  }

  /**
   * Unsubscribe from all channels
   */
  unsubscribeAll(): void {
    this.channels.forEach(channel => {
      supabase?.removeChannel(channel);
    });
    
    this.channels.clear();
    this.callbacks.clear();
    
    console.log('Unsubscribed from all channels');
  }

  /**
   * Get connection status
   */
  isConnected(): boolean {
    return Array.from(this.channels.values()).some(
      channel => channel.state === 'joined'
    );
  }

  /**
   * Reconnect all channels
   */
  async reconnectAll(): Promise<void> {
    console.log('Reconnecting all channels...');
    
    for (const [key, channel] of this.channels) {
      if (channel.state !== 'joined') {
        await channel.subscribe();
      }
    }
  }
}

/**
 * Export singleton instance
 */
export const syncManager = new SyncManager();

/**
 * Helper hooks for common sync patterns
 */
export const createSyncHooks = () => {
  return {
    /**
     * Sync products in real-time
     */
    useProductSync: (onUpdate: ChangeCallback) => {
      return syncManager.subscribeToTable('products', onUpdate);
    },

    /**
     * Sync orders in real-time
     */
    useOrderSync: (onUpdate: ChangeCallback) => {
      return syncManager.subscribeToTable('orders', onUpdate);
    },

    /**
     * Sync customers in real-time
     */
    useCustomerSync: (onUpdate: ChangeCallback) => {
      return syncManager.subscribeToTable('customers', onUpdate);
    },

    /**
     * Sync inventory in real-time
     */
    useInventorySync: (onUpdate: ChangeCallback) => {
      return syncManager.subscribeToTables(
        ['products', 'inventory_adjustments'],
        onUpdate
      );
    },

    /**
     * Track active terminals
     */
    useTerminalPresence: (
      terminalId: string,
      terminalData: any,
      onUpdate: PresenceCallback
    ) => {
      return syncManager.trackPresence('terminals', {
        id: terminalId,
        ...terminalData,
      }, onUpdate);
    },

    /**
     * Broadcast to kitchen
     */
    broadcastToKitchen: (order: any) => {
      return syncManager.broadcast('kitchen', 'new_order', order);
    },

    /**
     * Listen for kitchen updates
     */
    useKitchenUpdates: (callback: (payload: any) => void) => {
      return syncManager.subscribeToBroadcast('kitchen', 'order_update', callback);
    },
  };
};

/**
 * Auto-reconnect on network changes
 */
if (typeof window !== 'undefined') {
  window.addEventListener('online', async () => {
    console.log('Network online - reconnecting real-time...');
    await syncManager.reconnectAll();
  });

  window.addEventListener('offline', () => {
    console.log('Network offline - real-time paused');
  });
}
