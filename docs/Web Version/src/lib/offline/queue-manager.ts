/**
 * Offline Queue Manager
 * 
 * Manages offline operations queue:
 * - Stores operations in IndexedDB when offline
 * - Syncs operations when back online
 * - Handles retry logic and failures
 * - Provides queue status
 */

import Dexie, { Table } from 'dexie';
import { supabase } from '../supabase';

// Queue item structure
export interface QueueItem {
  id?: number;
  table: string;
  operation: 'insert' | 'update' | 'delete';
  data: any;
  timestamp: number;
  synced: boolean;
  retryCount: number;
  lastError?: string;
}

/**
 * IndexedDB for offline storage
 */
class OfflineDatabase extends Dexie {
  queue!: Table<QueueItem, number>;

  constructor() {
    super('AuraFlowOfflineQueue');
    
    this.version(1).stores({
      queue: '++id, timestamp, synced, table',
    });
  }
}

const db = new OfflineDatabase();

/**
 * Queue Manager Class
 */
class QueueManager {
  private syncInProgress = false;
  private maxRetries = 3;
  private retryDelay = 5000; // 5 seconds

  /**
   * Add operation to queue
   */
  async add(item: Omit<QueueItem, 'id' | 'timestamp' | 'synced' | 'retryCount'>): Promise<void> {
    await db.queue.add({
      ...item,
      timestamp: Date.now(),
      synced: false,
      retryCount: 0,
    });

    console.log('Operation queued:', item);
  }

  /**
   * Get all queued items
   */
  async getAll(): Promise<QueueItem[]> {
    return await db.queue.toArray();
  }

  /**
   * Get unsynced items
   */
  async getUnsynced(): Promise<QueueItem[]> {
    return await db.queue
      .where('synced')
      .equals(false)
      .toArray();
  }

  /**
   * Get queue count
   */
  async count(): Promise<number> {
    return await db.queue.where('synced').equals(false).count();
  }

  /**
   * Clear synced items older than X days
   */
  async clearOldSynced(daysOld: number = 7): Promise<void> {
    const cutoffTime = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
    
    await db.queue
      .where('synced')
      .equals(true)
      .and(item => item.timestamp < cutoffTime)
      .delete();
  }

  /**
   * Sync a single item
   */
  private async syncItem(item: QueueItem): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    try {
      switch (item.operation) {
        case 'insert':
          const { error: insertError } = await supabase
            .from(item.table)
            .insert([item.data]);
          if (insertError) throw insertError;
          break;

        case 'update':
          const { id, ...updates } = item.data;
          const { error: updateError } = await supabase
            .from(item.table)
            .update(updates)
            .eq('id', id);
          if (updateError) throw updateError;
          break;

        case 'delete':
          const { error: deleteError } = await supabase
            .from(item.table)
            .delete()
            .eq('id', item.data.id);
          if (deleteError) throw deleteError;
          break;
      }

      // Mark as synced
      if (item.id) {
        await db.queue.update(item.id, { synced: true });
      }

      console.log('Synced:', item);
    } catch (error: any) {
      console.error('Sync failed:', error);

      // Increment retry count
      if (item.id) {
        const newRetryCount = item.retryCount + 1;
        
        if (newRetryCount >= this.maxRetries) {
          // Max retries reached - mark as failed
          await db.queue.update(item.id, {
            retryCount: newRetryCount,
            lastError: error.message,
          });
          
          console.error('Max retries reached for item:', item);
        } else {
          // Retry later
          await db.queue.update(item.id, {
            retryCount: newRetryCount,
            lastError: error.message,
          });
        }
      }

      throw error;
    }
  }

  /**
   * Sync all queued items
   */
  async syncAll(): Promise<{ success: number; failed: number }> {
    if (this.syncInProgress) {
      console.log('Sync already in progress');
      return { success: 0, failed: 0 };
    }

    if (!navigator.onLine) {
      console.log('Cannot sync while offline');
      return { success: 0, failed: 0 };
    }

    this.syncInProgress = true;

    try {
      const items = await this.getUnsynced();
      
      if (items.length === 0) {
        console.log('No items to sync');
        return { success: 0, failed: 0 };
      }

      console.log(`Syncing ${items.length} items...`);

      let success = 0;
      let failed = 0;

      for (const item of items) {
        try {
          await this.syncItem(item);
          success++;
        } catch (error) {
          failed++;
        }
      }

      console.log(`Sync complete: ${success} success, ${failed} failed`);

      // Clean up old synced items
      await this.clearOldSynced();

      return { success, failed };
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Get sync status
   */
  async getStatus(): Promise<{
    total: number;
    synced: number;
    unsynced: number;
    failed: number;
  }> {
    const all = await db.queue.toArray();
    const synced = all.filter(item => item.synced).length;
    const failed = all.filter(item => item.retryCount >= this.maxRetries).length;
    const unsynced = all.length - synced;

    return {
      total: all.length,
      synced,
      unsynced,
      failed,
    };
  }

  /**
   * Clear all queue items (careful!)
   */
  async clearAll(): Promise<void> {
    await db.queue.clear();
    console.log('Queue cleared');
  }

  /**
   * Retry failed items
   */
  async retryFailed(): Promise<void> {
    const failed = await db.queue
      .where('retryCount')
      .aboveOrEqual(this.maxRetries)
      .toArray();

    for (const item of failed) {
      if (item.id) {
        await db.queue.update(item.id, {
          retryCount: 0,
          lastError: undefined,
        });
      }
    }

    console.log(`Reset ${failed.length} failed items for retry`);

    // Trigger sync
    await this.syncAll();
  }
}

/**
 * Export singleton instance
 */
export const offlineQueue = new QueueManager();

/**
 * Auto-sync when coming back online
 */
if (typeof window !== 'undefined') {
  window.addEventListener('online', async () => {
    console.log('Back online - syncing queue...');
    await offlineQueue.syncAll();
  });

  // Periodic sync check (every 30 seconds if online)
  setInterval(async () => {
    if (navigator.onLine) {
      const count = await offlineQueue.count();
      if (count > 0) {
        console.log(`${count} items in queue - attempting sync...`);
        await offlineQueue.syncAll();
      }
    }
  }, 30000);
}
