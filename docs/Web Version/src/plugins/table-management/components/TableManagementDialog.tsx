import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { TableFloorPlan } from './TableFloorPlan';

interface TableManagementDialogProps {
  open: boolean;
  onClose: () => void;
}

export function TableManagementDialog({ open, onClose }: TableManagementDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Table Management</DialogTitle>
          <DialogDescription>
            View and manage restaurant tables, assign orders to tables
          </DialogDescription>
        </DialogHeader>

        <TableFloorPlan onTableSelect={() => {}} onClose={onClose} />

        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
