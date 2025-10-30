import React, { useState, useEffect } from 'react';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Progress } from '../../../components/ui/progress';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Separator } from '../../../components/ui/separator';
import { useStore } from '../../../lib/store';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Upload,
  Database,
  Activity
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { format } from 'date-fns';

interface QueuedItem {
  id: string;
  type: 'sale' | 'return' | 'void' | 'customer_update';
  timestamp: Date;
  status: 'pending' | 'syncing' | 'failed' | 'synced';
  retryCount: number;
  data: any;
}

interface OfflineIndicatorProps {
  mode?: 'floating' | 'inline';
}

export function OfflineIndicator({ mode = 'floating' }: OfflineIndicatorProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showDetails, setShowDetails] = useState(false);
  const [queuedItems, setQueuedItems] = useState<QueuedItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Connection restored', {
        description: 'Syncing queued transactions...',
        icon: <Wifi className="w-4 h-4" />,
      });
      
      // Auto-sync when coming back online
      setTimeout(() => {
        handleSync();
      }, 1000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('Connection lost', {
        description: 'Transactions will be queued for sync',
        icon: <WifiOff className="w-4 h-4" />,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Periodic connection check (every 60 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      const currentStatus = navigator.onLine;
      if (currentStatus !== isOnline) {
        setIsOnline(currentStatus);
      }
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, [isOnline]);

  // Mock sync function - In real app, this would sync with backend
  const handleSync = async () => {
    if (!isOnline || queuedItems.length === 0) return;

    setIsSyncing(true);
    setSyncProgress(0);

    try {
      const pendingItems = queuedItems.filter(item => item.status === 'pending' || item.status === 'failed');
      
      for (let i = 0; i < pendingItems.length; i++) {
        const item = pendingItems[i];
        
        // Update status to syncing
        setQueuedItems(prev => prev.map(q => 
          q.id === item.id ? { ...q, status: 'syncing' as const } : q
        ));

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        // Update progress
        setSyncProgress(((i + 1) / pendingItems.length) * 100);

        // Mark as synced (in real app, handle actual API response)
        setQueuedItems(prev => prev.map(q => 
          q.id === item.id ? { ...q, status: 'synced' as const } : q
        ));
      }

      setLastSyncTime(new Date());
      toast.success(`Synced ${pendingItems.length} items successfully`);

      // Clear synced items after a delay
      setTimeout(() => {
        setQueuedItems(prev => prev.filter(item => item.status !== 'synced'));
      }, 2000);

    } catch (error) {
      toast.error('Sync failed', {
        description: 'Will retry automatically',
      });
      
      // Mark items as failed
      setQueuedItems(prev => prev.map(q => 
        q.status === 'syncing' 
          ? { ...q, status: 'failed' as const, retryCount: q.retryCount + 1 } 
          : q
      ));
    } finally {
      setIsSyncing(false);
      setSyncProgress(0);
    }
  };

  // Mock function to add item to queue (called from other parts of app)
  const queueTransaction = (type: QueuedItem['type'], data: any) => {
    const newItem: QueuedItem = {
      id: `queue-${Date.now()}-${Math.random()}`,
      type,
      timestamp: new Date(),
      status: 'pending',
      retryCount: 0,
      data,
    };

    setQueuedItems(prev => [...prev, newItem]);

    if (!isOnline) {
      toast.info('Transaction queued', {
        description: 'Will sync when connection is restored',
      });
    }
  };

  const pendingCount = queuedItems.filter(item => 
    item.status === 'pending' || item.status === 'failed'
  ).length;

  const failedCount = queuedItems.filter(item => item.status === 'failed').length;

  const getStatusIcon = (status: QueuedItem['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'syncing':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'synced':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusLabel = (status: QueuedItem['status']) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'syncing':
        return 'Syncing';
      case 'synced':
        return 'Synced';
      case 'failed':
        return 'Failed';
    }
  };

  const getTypeLabel = (type: QueuedItem['type']) => {
    switch (type) {
      case 'sale':
        return 'Sale';
      case 'return':
        return 'Return';
      case 'void':
        return 'Void';
      case 'customer_update':
        return 'Customer Update';
    }
  };

  return (
    <>
      {/* Connection Indicator */}
      {mode === 'inline' ? (
        <button 
          className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-accent transition-colors cursor-pointer"
          onClick={() => setShowDetails(true)}
        >
          {isOnline ? (
            <>
              <Wifi className="w-4 h-4 text-emerald-500 dark:text-emerald-500" />
              <span className="text-sm">Online</span>
              {pendingCount > 0 && (
                <Badge variant="secondary" className="text-xs h-5 px-1.5">
                  {pendingCount}
                </Badge>
              )}
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-red-500 dark:text-red-500 animate-pulse" />
              <span className="text-sm text-red-500 dark:text-red-500">Offline</span>
              {pendingCount > 0 && (
                <Badge variant="destructive" className="text-xs h-5 px-1.5">
                  {pendingCount}
                </Badge>
              )}
            </>
          )}
        </button>
      ) : (
        <div 
          className="fixed top-20 right-4 z-50 cursor-pointer"
          onClick={() => setShowDetails(true)}
        >
          <div className="flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            {isOnline ? (
              <>
                <Wifi className="w-5 h-5 text-green-500" />
                <div className="flex flex-col">
                  <span className="text-xs font-medium">Online</span>
                  {pendingCount > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {pendingCount} queued
                    </span>
                  )}
                </div>
              </>
            ) : (
              <>
                <WifiOff className="w-5 h-5 text-red-500 animate-pulse" />
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-red-500">Offline</span>
                  {pendingCount > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {pendingCount} queued
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Offline Banner (full width) */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-yellow-500/90 text-yellow-900 dark:text-yellow-100 px-4 py-2 text-center text-sm font-medium">
          <div className="flex items-center justify-center gap-2">
            <WifiOff className="w-4 h-4" />
            <span>Working Offline - Transactions will be synced when connection is restored</span>
            {pendingCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {pendingCount} pending
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Offline Mode & Sync Status
            </DialogTitle>
            <DialogDescription>
              Monitor connection status and sync queue
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Status Cards */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    {isOnline ? (
                      <Wifi className="w-4 h-4 text-green-500" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-red-500" />
                    )}
                    Connection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant={isOnline ? 'default' : 'destructive'}>
                    {isOnline ? 'Online' : 'Offline'}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Queue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingCount}</div>
                  <p className="text-xs text-muted-foreground">Items pending</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Last Sync
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {lastSyncTime ? (
                    <>
                      <div className="text-sm font-medium">
                        {format(lastSyncTime, 'HH:mm:ss')}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {format(lastSyncTime, 'MMM dd')}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">Never</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sync Progress */}
            {isSyncing && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Syncing...
                      </span>
                      <span>{Math.round(syncProgress)}%</span>
                    </div>
                    <Progress value={syncProgress} />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sync Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {failedCount > 0 && (
                  <Badge variant="destructive" className="gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {failedCount} failed
                  </Badge>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQueuedItems([])}
                  disabled={queuedItems.length === 0}
                >
                  Clear Queue
                </Button>
                <Button
                  size="sm"
                  onClick={handleSync}
                  disabled={!isOnline || pendingCount === 0 || isSyncing}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Sync Now
                </Button>
              </div>
            </div>

            <Separator />

            {/* Queue List */}
            <div>
              <h3 className="font-medium mb-2">Queued Items</h3>
              {queuedItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Database className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p>No queued items</p>
                </div>
              ) : (
                <ScrollArea className="h-[300px] border border-border rounded-lg">
                  <div className="p-4 space-y-2">
                    {queuedItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {getStatusIcon(item.status)}
                          <div>
                            <p className="text-sm font-medium">{getTypeLabel(item.type)}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(item.timestamp, 'MMM dd, HH:mm:ss')}
                              {item.retryCount > 0 && ` • ${item.retryCount} retries`}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="gap-1">
                          {getStatusLabel(item.status)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>

            {/* Info */}
            <Card className="bg-blue-500/10 border-blue-500/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-blue-600 dark:text-blue-400">
                      Offline Mode Active
                    </p>
                    <p className="text-xs text-blue-600/80 dark:text-blue-400/80 mt-1">
                      All transactions are saved locally and will automatically sync when connection is restored.
                      You can continue working normally.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}