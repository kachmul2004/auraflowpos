import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../../lib/store';
import { Order } from '../../../lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Separator } from '../../../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Switch } from '../../../components/ui/switch';
import { Label } from '../../../components/ui/label';
import { ScrollArea } from '../../../components/ui/scroll-area';
import {
  Clock,
  ChefHat,
  CheckCircle,
  AlertCircle,
  Utensils,
  PlayCircle,
  XCircle,
  FastForward,
  Volume2,
  VolumeX,
  RefreshCw,
  TrendingUp,
  Maximize2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

type KitchenStatus = 'new' | 'preparing' | 'ready' | 'served';
type StatusFilter = 'all' | KitchenStatus;

interface KitchenOrder extends Order {
  kitchenStatus: KitchenStatus;
  fireTime: Date;
  elapsedMinutes: number;
  priority: 'low' | 'medium' | 'high';
}

export function KitchenDisplaySystem() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const { currentShift, updateOrderKitchenStatus } = useStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Get kitchen orders (orders with kitchen status)
  const orders = currentShift?.orders || [];
  const kitchenOrders: KitchenOrder[] = orders
    .filter(order => order.kitchenStatus && order.fireTime)
    .map(order => {
      const fireTime = order.fireTime instanceof Date ? order.fireTime : new Date(order.fireTime);
      const elapsedMinutes = Math.floor((currentTime.getTime() - fireTime.getTime()) / 60000);
      const priority = elapsedMinutes > 20 ? 'high' : elapsedMinutes > 10 ? 'medium' : 'low';

      return {
        ...order,
        kitchenStatus: order.kitchenStatus as KitchenStatus,
        fireTime,
        elapsedMinutes,
        priority,
      };
    })
    .filter(order => order.kitchenStatus !== 'served') // Don't show served orders
    .sort((a, b) => a.fireTime.getTime() - b.fireTime.getTime()); // Oldest first

  // Filter orders by status
  const filteredOrders = kitchenOrders.filter(order => {
    if (statusFilter === 'all') return true;
    return order.kitchenStatus === statusFilter;
  });

  // Group by status for counts
  const statusCounts = {
    new: kitchenOrders.filter(o => o.kitchenStatus === 'new').length,
    preparing: kitchenOrders.filter(o => o.kitchenStatus === 'preparing').length,
    ready: kitchenOrders.filter(o => o.kitchenStatus === 'ready').length,
  };

  const getStatusColor = (status: KitchenStatus) => {
    switch (status) {
      case 'new':
        return 'bg-blue-500';
      case 'preparing':
        return 'bg-amber-500';
      case 'ready':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityBorder = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-500 border-2';
      case 'medium':
        return 'border-amber-500 border-2';
      default:
        return 'border-border';
    }
  };

  const handleStatusUpdate = (orderId: string, newStatus: KitchenStatus) => {
    updateOrderKitchenStatus(orderId, newStatus);
  };

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.play();
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2">
            <ChefHat className="w-8 h-8" />
            Kitchen Display System
          </h1>
          <p className="text-muted-foreground">
            Real-time order tracking and management
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          Auto-refresh every 5 seconds
        </div>
      </div>

      {/* Status Tabs */}
      <Tabs value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            All Orders ({kitchenOrders.length})
          </TabsTrigger>
          <TabsTrigger value="new">
            New ({statusCounts.new})
          </TabsTrigger>
          <TabsTrigger value="preparing">
            Preparing ({statusCounts.preparing})
          </TabsTrigger>
          <TabsTrigger value="ready">
            Ready ({statusCounts.ready})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={statusFilter} className="space-y-4 mt-6">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Utensils className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {statusFilter === 'all'
                    ? 'No active kitchen orders'
                    : `No ${statusFilter} orders`}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredOrders.map((order) => (
                <Card key={order.id} className={getPriorityBorder(order.priority)}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          Order #{order.orderNumber}
                          <Badge className={getStatusColor(order.kitchenStatus)}>
                            {order.kitchenStatus}
                          </Badge>
                        </CardTitle>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          {order.tableId && (
                            <span>Table {order.tableId}</span>
                          )}
                          {order.orderType && (
                            <span className="capitalize">{order.orderType}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span className={`font-medium ${order.priority === 'high' ? 'text-red-500' : ''}`}>
                          {order.elapsedMinutes}m
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{item.quantity}x</span>
                              <span>{item.name}</span>
                              {item.seatNumber && (
                                <Badge variant="outline" className="text-xs">
                                  Seat {item.seatNumber}
                                </Badge>
                              )}
                              {item.course && (
                                <Badge variant="secondary" className="text-xs">
                                  {item.course}
                                </Badge>
                              )}
                            </div>
                            {item.modifiers && item.modifiers.length > 0 && (
                              <div className="ml-8 text-xs text-muted-foreground">
                                {item.modifiers.map((mod, idx) => (
                                  <div key={idx}>+ {mod.name}</div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Special Notes */}
                    {order.notes && (
                      <>
                        <Separator />
                        <div className="flex items-start gap-2 text-sm">
                          <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
                          <p className="text-muted-foreground">{order.notes}</p>
                        </div>
                      </>
                    )}

                    {/* Server Info */}
                    {order.serverId && (
                      <div className="text-sm text-muted-foreground">
                        Server: {order.serverId}
                      </div>
                    )}

                    <Separator />

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {order.kitchenStatus === 'new' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(order.id, 'preparing')}
                            className="flex-1"
                          >
                            <PlayCircle className="w-4 h-4 mr-2" />
                            Start
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(order.id, 'ready')}
                          >
                            <FastForward className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      {order.kitchenStatus === 'preparing' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(order.id, 'ready')}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark Ready
                        </Button>
                      )}
                      {order.kitchenStatus === 'ready' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(order.id, 'served')}
                          className="flex-1"
                          variant="secondary"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Mark Served
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Controls */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-2">
          <Switch
            checked={autoRefresh}
            onCheckedChange={(checked) => setAutoRefresh(checked)}
          />
          <Label className="text-sm text-muted-foreground">Auto-refresh</Label>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setCurrentTime(new Date());
              toast.success('Refreshed orders');
            }}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              playSound();
              toast.success('Played sound');
            }}
          >
            <Volume2 className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.volume = volume;
                audioRef.current.play();
              }
              toast.success('Played sound');
            }}
          >
            <VolumeX className="w-4 h-4" />
          </Button>
          <Label className="text-sm text-muted-foreground">Sound</Label>
        </div>
      </div>

      {/* Audio */}
      <audio ref={audioRef} src="/sounds/notification.mp3" />
    </div>
  );
}

export default KitchenDisplaySystem;