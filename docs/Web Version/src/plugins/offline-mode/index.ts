import { Plugin } from '../../core/lib/types/plugin.types';
import { WifiOff } from 'lucide-react';

export const offlineModePlugin: Plugin = {
  id: 'offline-mode',
  name: 'Offline Mode',
  description: 'Work seamlessly without internet connection. Queue transactions locally and auto-sync when connection is restored.',
  version: '1.0.0',
  category: 'infrastructure',
  icon: WifiOff,
  author: 'AuraFlow',
  enabled: true,
  config: {
    storage: {
      enabled: true,
      engine: 'indexedDB', // 'localStorage' | 'indexedDB'
      maxStorageSize: 50, // MB
      compressionEnabled: true,
      encryptSensitiveData: false, // Future feature
    },
    sync: {
      autoSync: true,
      syncInterval: 60, // seconds (check for connection)
      batchSize: 50, // Max items per sync batch
      retryAttempts: 3,
      retryDelay: 5, // seconds
      conflictResolution: 'server-wins', // 'server-wins' | 'client-wins' | 'manual'
    },
    offline: {
      allowTransactions: true,
      allowProductUpdates: false,
      allowCustomerUpdates: true,
      allowInventoryUpdates: false,
      queueLimit: 1000, // Max queued operations
      showOfflineIndicator: true,
      offlineWarnings: true,
    },
    data: {
      cacheProducts: true,
      cacheCustomers: true,
      cacheInventory: true,
      cacheSettings: true,
      cacheReports: false,
      cacheDuration: 24, // hours
    },
    ui: {
      showSyncStatus: true,
      showQueueCount: true,
      showLastSyncTime: true,
      notifyOnSync: true,
      notifyOnConflict: true,
      offlineBanner: true,
      connectionIndicatorPosition: 'top-right', // 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
    },
    performance: {
      backgroundSync: true,
      incrementalSync: true, // Only sync changes, not full dataset
      optimisticUI: true, // Update UI immediately, sync in background
      persistentQueue: true, // Survive browser/app restarts
    },
  },
  requiredPermissions: [],
  dependencies: [],
  optionalDependencies: [],
  industries: ['restaurant', 'retail', 'cafe', 'pharmacy', 'salon', 'general', 'ultimate'],
  packageTier: 'professional', // Core reliability feature
  features: [
    'Work offline without internet',
    'Auto-detect connection status',
    'Queue transactions locally',
    'Auto-sync when online',
    'Visual offline indicator',
    'Sync status notifications',
    'Transaction queue management',
    'Conflict resolution',
    'Local data caching',
    'IndexedDB storage',
    'Data compression',
    'Batch syncing',
    'Retry failed syncs',
    'Optimistic UI updates',
    'Background synchronization',
    'Persistent queue (survives restart)',
    'Incremental sync (changes only)',
    'Queue count display',
    'Last sync timestamp',
    'Manual sync trigger',
    'Clear queue option',
    'Offline mode warnings',
    'Connection recovery alerts',
    'Sync progress indicator',
    'Bandwidth-efficient sync',
  ],
  settings: [
    {
      key: 'offline.allowTransactions',
      label: 'Allow Offline Transactions',
      type: 'boolean',
      defaultValue: true,
      description: 'Enable creating transactions while offline',
    },
    {
      key: 'sync.autoSync',
      label: 'Auto-Sync When Online',
      type: 'boolean',
      defaultValue: true,
      description: 'Automatically sync queued data when connection restored',
    },
    {
      key: 'sync.syncInterval',
      label: 'Connection Check Interval (seconds)',
      type: 'number',
      defaultValue: 60,
      description: 'How often to check for internet connection',
    },
    {
      key: 'sync.retryAttempts',
      label: 'Sync Retry Attempts',
      type: 'number',
      defaultValue: 3,
      description: 'Number of times to retry failed sync',
    },
    {
      key: 'offline.queueLimit',
      label: 'Queue Limit',
      type: 'number',
      defaultValue: 1000,
      description: 'Maximum number of queued operations',
    },
    {
      key: 'ui.showSyncStatus',
      label: 'Show Sync Status',
      type: 'boolean',
      defaultValue: true,
      description: 'Display sync status in UI',
    },
    {
      key: 'ui.offlineBanner',
      label: 'Show Offline Banner',
      type: 'boolean',
      defaultValue: true,
      description: 'Display banner when offline',
    },
    {
      key: 'performance.optimisticUI',
      label: 'Optimistic UI Updates',
      type: 'boolean',
      defaultValue: true,
      description: 'Update UI immediately before sync completes',
    },
    {
      key: 'data.cacheDuration',
      label: 'Cache Duration (hours)',
      type: 'number',
      defaultValue: 24,
      description: 'How long to keep cached data',
    },
  ],
  businessBenefits: [
    'Never lose a sale due to internet outage',
    'Continue operations during outages',
    'No downtime = no lost revenue',
    'Improved reliability',
    'Better customer experience',
    'Peace of mind during connectivity issues',
    'Seamless failover',
    'Automatic recovery',
    'No manual intervention needed',
    'Works in remote locations',
    'Mobile POS reliability',
    'Event/festival readiness',
    'Construction/temporary site support',
    'Disaster recovery',
    'Multi-location resilience',
  ],
  useCases: [
    'Internet outage handling',
    'Weak WiFi areas',
    'Mobile POS at events',
    'Food trucks / mobile vendors',
    'Remote location sales',
    'Pop-up shops',
    'Outdoor markets',
    'Construction sites',
    'Temporary locations',
    'Festival booths',
    'Trade shows',
    'Farmers markets',
    'Delivery vehicles',
    'Field sales',
    'Emergency backup',
  ],
  metrics: {
    offlineTime: 'Total time spent offline',
    transactionsQueued: 'Number of transactions queued',
    syncSuccessRate: 'Percentage of successful syncs',
    averageSyncTime: 'Average time to sync queue',
    conflictsResolved: 'Number of sync conflicts',
    queueSize: 'Current number of queued items',
    lastSyncTime: 'Timestamp of last successful sync',
    failedSyncs: 'Number of failed sync attempts',
    dataLocallyStored: 'Size of locally cached data',
    uptime: 'Percentage of online time',
  },
  dataSchema: {
    queuedTransaction: {
      id: 'string',
      type: 'sale | return | void | exchange',
      data: 'object', // Transaction data
      timestamp: 'Date',
      retryCount: 'number',
      status: 'pending | syncing | failed | synced',
      error: 'string | null',
      priority: 'high | normal | low',
    },
    syncLog: {
      id: 'string',
      timestamp: 'Date',
      itemsSynced: 'number',
      duration: 'number', // milliseconds
      success: 'boolean',
      conflicts: 'number',
      errors: 'string[]',
    },
    cachedData: {
      key: 'string',
      data: 'object',
      cachedAt: 'Date',
      expiresAt: 'Date',
      size: 'number', // bytes
      checksum: 'string',
    },
    connectionStatus: {
      isOnline: 'boolean',
      lastOnline: 'Date',
      lastOffline: 'Date',
      uptime: 'number', // percentage
      outages: 'number', // count
    },
  },
};
