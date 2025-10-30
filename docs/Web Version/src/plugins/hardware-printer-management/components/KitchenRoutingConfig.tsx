import React, { useState } from 'react';
import { useStore } from '../../../lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { Label } from '../../../components/ui/label';
import { Switch } from '../../../components/ui/switch';
import { Slider } from '../../../components/ui/slider';
import {
  Plus,
  Edit,
  Trash2,
  ChefHat,
  Printer,
  AlertCircle,
  Info,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { KitchenRoutingRule } from '../lib/printer.types';

export function KitchenRoutingConfig() {
  const { printers, kitchenRoutes, categories, addKitchenRoute, updateKitchenRoute, deleteKitchenRoute } = useStore();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<KitchenRoutingRule | null>(null);

  // Filter for kitchen printers only
  const kitchenPrinters = printers.filter(p => p.type === 'kitchen' && p.enabled);

  // Form state
  const [formData, setFormData] = useState({
    categoryId: '',
    printerId: '',
    autoFire: true,
    priority: 3,
    delayMinutes: 0,
    courseTiming: 'immediate' as 'immediate' | 'appetizer' | 'entree' | 'dessert',
  });

  const handleOpenDialog = (route?: KitchenRoutingRule) => {
    if (route) {
      setEditingRoute(route);
      setFormData({
        categoryId: route.categoryId,
        printerId: route.printerId,
        autoFire: route.autoFire,
        priority: route.priority,
        delayMinutes: route.delayMinutes || 0,
        courseTiming: route.courseTiming || 'immediate',
      });
    } else {
      setEditingRoute(null);
      setFormData({
        categoryId: '',
        printerId: '',
        autoFire: true,
        priority: 3,
        delayMinutes: 0,
        courseTiming: 'immediate',
      });
    }
    setEditDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.categoryId || !formData.printerId) {
      toast.error('Please select both category and printer');
      return;
    }

    const category = categories.find(c => c.id === formData.categoryId);
    const printer = printers.find(p => p.id === formData.printerId);

    if (!category || !printer) {
      toast.error('Invalid category or printer');
      return;
    }

    const route: KitchenRoutingRule = {
      id: editingRoute?.id || `route-${Date.now()}`,
      categoryId: formData.categoryId,
      categoryName: category.name,
      printerId: formData.printerId,
      printerName: printer.name,
      station: printer.station || 'Main Kitchen',
      autoFire: formData.autoFire,
      priority: formData.priority,
      delayMinutes: formData.delayMinutes,
      courseTiming: formData.courseTiming,
      enabled: true,
    };

    if (editingRoute) {
      updateKitchenRoute(editingRoute.id, route);
      toast.success('Routing rule updated');
    } else {
      addKitchenRoute(route);
      toast.success('Routing rule added');
    }

    setEditDialogOpen(false);
    setEditingRoute(null);
  };

  const handleDelete = (routeId: string) => {
    if (confirm('Delete this routing rule?')) {
      deleteKitchenRoute(routeId);
      toast.success('Routing rule deleted');
    }
  };

  const handleToggleEnabled = (routeId: string) => {
    const route = kitchenRoutes.find(r => r.id === routeId);
    if (route) {
      updateKitchenRoute(routeId, { ...route, enabled: !route.enabled });
      toast.success(route.enabled ? 'Rule disabled' : 'Rule enabled');
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 5) return 'text-red-500';
    if (priority >= 3) return 'text-orange-500';
    return 'text-blue-500';
  };

  const getPriorityLabel = (priority: number) => {
    if (priority >= 5) return 'Urgent';
    if (priority >= 3) return 'Normal';
    return 'Low';
  };

  const getCourseTimingLabel = (courseTiming: string) => {
    const labels: Record<string, string> = {
      immediate: 'Fire Immediately',
      appetizer: 'Appetizer Course',
      entree: 'Entree Course',
      dessert: 'Dessert Course',
    };
    return labels[courseTiming] || 'Unknown';
  };

  if (kitchenPrinters.length === 0) {
    return (
      <div className="p-6">
        <Alert className="bg-orange-500/10 border-orange-500/20">
          <AlertCircle className="w-4 h-4 text-orange-500" />
          <AlertDescription>
            <strong>No kitchen printers configured.</strong> You need to add at least one kitchen 
            printer before setting up routing rules. Go to the Printers tab to add one.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Info Banner */}
      <Alert className="bg-blue-500/10 border-blue-500/20">
        <Info className="w-4 h-4 text-blue-500" />
        <AlertDescription className="text-sm">
          <strong>Kitchen Routing:</strong> Automatically send menu items to the correct kitchen 
          printer based on category. For example, send all "Pizza" items to the pizza station printer.
        </AlertDescription>
      </Alert>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl">Routing Rules</h2>
          <p className="text-sm text-muted-foreground">
            {kitchenRoutes.length} rule{kitchenRoutes.length !== 1 ? 's' : ''} configured
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Rule
        </Button>
      </div>

      {/* Routing Rules List */}
      {kitchenRoutes.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <ChefHat className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg mb-2">No routing rules configured</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add routing rules to automatically send items to the right kitchen station
              </p>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Rule
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {kitchenRoutes.map((route) => {
            const printer = printers.find(p => p.id === route.printerId);
            const isOnline = printer?.status === 'online';

            return (
              <Card key={route.id} className={!route.enabled ? 'opacity-50' : ''}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        route.enabled ? 'bg-green-500/10' : 'bg-gray-500/10'
                      }`}>
                        <ChefHat className={`w-6 h-6 ${
                          route.enabled ? 'text-green-500' : 'text-gray-500'
                        }`} />
                      </div>

                      {/* Route Details */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">{route.categoryName}</h3>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                          <div className="flex items-center gap-2">
                            <Printer className="w-4 h-4" />
                            <span>{route.printerName}</span>
                          </div>
                          {!isOnline && (
                            <Badge variant="destructive" className="text-xs">
                              Offline
                            </Badge>
                          )}
                        </div>

                        {/* Station */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <span>Station: {route.station}</span>
                        </div>

                        {/* Settings */}
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          {/* Auto-fire */}
                          {route.autoFire && (
                            <Badge variant="secondary" className="gap-1">
                              Auto-fire
                            </Badge>
                          )}

                          {/* Priority */}
                          <Badge variant="outline" className="gap-1">
                            <span className={getPriorityColor(route.priority)}>●</span>
                            {getPriorityLabel(route.priority)} Priority
                          </Badge>

                          {/* Course Timing */}
                          {route.courseTiming && route.courseTiming !== 'immediate' && (
                            <Badge variant="outline" className="gap-1">
                              <Clock className="w-3 h-3" />
                              {getCourseTimingLabel(route.courseTiming)}
                            </Badge>
                          )}

                          {/* Delay */}
                          {route.delayMinutes && route.delayMinutes > 0 && (
                            <Badge variant="outline" className="gap-1">
                              <Clock className="w-3 h-3" />
                              {route.delayMinutes} min delay
                            </Badge>
                          )}

                          {/* Enabled Toggle */}
                          <div className="flex items-center gap-2 ml-auto">
                            <span className="text-xs text-muted-foreground">
                              {route.enabled ? 'Active' : 'Disabled'}
                            </span>
                            <Switch
                              checked={route.enabled}
                              onCheckedChange={() => handleToggleEnabled(route.id)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(route)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(route.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingRoute ? 'Edit Routing Rule' : 'Add Routing Rule'}
            </DialogTitle>
            <DialogDescription>
              Configure how items from a category are routed to kitchen printers
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Category Selection */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Printer Selection */}
            <div className="space-y-2">
              <Label>Kitchen Printer</Label>
              <Select
                value={formData.printerId}
                onValueChange={(value) => setFormData({ ...formData, printerId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select printer" />
                </SelectTrigger>
                <SelectContent>
                  {kitchenPrinters.map((printer) => (
                    <SelectItem key={printer.id} value={printer.id}>
                      {printer.name} - {printer.station || 'Main Kitchen'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Auto-fire Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-fire to Kitchen</Label>
                <p className="text-xs text-muted-foreground">
                  Send to kitchen immediately when item is added
                </p>
              </div>
              <Switch
                checked={formData.autoFire}
                onCheckedChange={(checked) => setFormData({ ...formData, autoFire: checked })}
              />
            </div>

            {/* Course Timing */}
            <div className="space-y-2">
              <Label>Course Timing</Label>
              <Select
                value={formData.courseTiming}
                onValueChange={(value: any) => setFormData({ ...formData, courseTiming: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Fire Immediately</SelectItem>
                  <SelectItem value="appetizer">Appetizer Course</SelectItem>
                  <SelectItem value="entree">Entree Course</SelectItem>
                  <SelectItem value="dessert">Dessert Course</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Priority Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Priority Level</Label>
                <Badge variant="outline" className={getPriorityColor(formData.priority)}>
                  {getPriorityLabel(formData.priority)}
                </Badge>
              </div>
              <Slider
                value={[formData.priority]}
                onValueChange={([value]) => setFormData({ ...formData, priority: value })}
                min={1}
                max={5}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Low</span>
                <span>Normal</span>
                <span>Urgent</span>
              </div>
            </div>

            {/* Delay */}
            {formData.courseTiming === 'immediate' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Fire Delay (minutes)</Label>
                  <span className="text-sm text-muted-foreground">
                    {formData.delayMinutes} min
                  </span>
                </div>
                <Slider
                  value={[formData.delayMinutes]}
                  onValueChange={([value]) => setFormData({ ...formData, delayMinutes: value })}
                  min={0}
                  max={30}
                  step={1}
                  className="w-full"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingRoute ? 'Update' : 'Add'} Rule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
