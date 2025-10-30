import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useStore } from '../../lib/store';
import { Plus, Edit, Trash2, Monitor, Printer } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { toast } from 'sonner@2.0.3';

export function TerminalsModule() {
  const terminals = useStore((state) => state.terminals);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingTerminal, setEditingTerminal] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    receiptHeader: '',
    receiptFooter: '',
    printerEnabled: true,
  });

  const handleCreate = () => {
    setFormData({
      name: '',
      location: '',
      receiptHeader: '',
      receiptFooter: '',
      printerEnabled: true,
    });
    setEditingTerminal(null);
    setShowCreateDialog(true);
  };

  const handleEdit = (terminal: any) => {
    setFormData({
      name: terminal.name,
      location: terminal.location,
      receiptHeader: 'AuraFlow POS\n123 Main Street\nCity, State 12345',
      receiptFooter: 'Thank you for your business!',
      printerEnabled: true,
    });
    setEditingTerminal(terminal);
    setShowCreateDialog(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingTerminal) {
      toast.success('Terminal updated successfully');
    } else {
      toast.success('Terminal created successfully');
    }

    setShowCreateDialog(false);
  };

  const handleDelete = (terminalId: string, terminalName: string) => {
    if (confirm(`Are you sure you want to delete terminal "${terminalName}"?`)) {
      toast.success('Terminal deleted successfully');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium mb-2">Terminals</h1>
          <p className="text-muted-foreground">
            Manage POS terminals and receipt configurations
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Terminal
        </Button>
      </div>

      {/* Terminals Grid */}
      {terminals.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12">
            <div className="text-center">
              <Monitor className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-20" />
              <p className="text-muted-foreground mb-4">No terminals configured</p>
              <Button variant="outline" onClick={handleCreate}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Terminal
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {terminals.map((terminal) => (
            <Card key={terminal.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Monitor className="w-5 h-5 text-primary" />
                      {terminal.name}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {terminal.location}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Printer className="w-4 h-4" />
                    Receipt Printer
                  </span>
                  <Badge variant="outline" className="text-xs">
                    Enabled
                  </Badge>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(terminal)}
                  >
                    <Edit className="w-3 h-3 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(terminal.id, terminal.name)}
                  >
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTerminal ? 'Edit Terminal' : 'Create New Terminal'}
            </DialogTitle>
            <DialogDescription>
              {editingTerminal
                ? 'Update terminal configuration'
                : 'Add a new POS terminal to the system'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="terminalName">
                  Terminal Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="terminalName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Main Register"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">
                  Location <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Front Counter"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="receiptHeader">Receipt Header</Label>
              <Textarea
                id="receiptHeader"
                value={formData.receiptHeader}
                onChange={(e) =>
                  setFormData({ ...formData, receiptHeader: e.target.value })
                }
                placeholder="Store name, address, etc."
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                This will appear at the top of printed receipts
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="receiptFooter">Receipt Footer</Label>
              <Textarea
                id="receiptFooter"
                value={formData.receiptFooter}
                onChange={(e) =>
                  setFormData({ ...formData, receiptFooter: e.target.value })
                }
                placeholder="Thank you message, return policy, etc."
                rows={2}
              />
              <p className="text-xs text-muted-foreground">
                This will appear at the bottom of printed receipts
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="space-y-0.5">
                <Label className="text-base">Receipt Printer</Label>
                <p className="text-sm text-muted-foreground">
                  Enable automatic printing of receipts
                </p>
              </div>
              <Switch
                checked={formData.printerEnabled}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, printerEnabled: checked })
                }
              />
            </div>

            <div className="p-4 bg-primary/10 rounded-lg text-sm">
              <p className="font-medium mb-2">Additional Configuration</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Barcode scanner setup</li>
                <li>• Cash drawer connection</li>
                <li>• Card reader integration</li>
                <li>• Customer display setup</li>
              </ul>
              <p className="mt-2 text-xs">These settings will be available in future updates.</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingTerminal ? 'Update Terminal' : 'Create Terminal'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}