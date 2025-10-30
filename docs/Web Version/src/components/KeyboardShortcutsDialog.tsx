import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';

interface KeyboardShortcutsDialogProps {
  open: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsDialog({ open, onClose }: KeyboardShortcutsDialogProps) {
  const shortcuts = [
    { category: 'General', items: [
      { keys: ['F1'], description: 'Show keyboard shortcuts' },
      { keys: ['F2'], description: 'Quick payment (Cash)' },
      { keys: ['F3'], description: 'Search products' },
      { keys: ['Ctrl', 'K'], description: 'Quick search' },
      { keys: ['Ctrl', 'P'], description: 'Print receipt' },
      { keys: ['Esc'], description: 'Close dialogs / Clear search' },
    ]},
    { category: 'Payment', items: [
      { keys: ['F4'], description: 'Cash payment' },
      { keys: ['F5'], description: 'Card payment' },
      { keys: ['F6'], description: 'Process payment' },
      { keys: ['Ctrl', 'T'], description: 'Add tip' },
    ]},
    { category: 'Orders', items: [
      { keys: ['F7'], description: 'Recent orders' },
      { keys: ['F8'], description: 'Process return' },
      { keys: ['Ctrl', 'R'], description: 'Reload parked sale' },
      { keys: ['Ctrl', 'N'], description: 'Clear cart / New order' },
    ]},
    { category: 'Cash Drawer', items: [
      { keys: ['F9'], description: 'Open cash drawer' },
      { keys: ['F10'], description: 'No sale (open drawer)' },
      { keys: ['Ctrl', 'D'], description: 'Cash in/out' },
    ]},
    { category: 'Cart Actions', items: [
      { keys: ['Delete'], description: 'Remove selected item' },
      { keys: ['Ctrl', '+'], description: 'Increase quantity' },
      { keys: ['Ctrl', '-'], description: 'Decrease quantity' },
      { keys: ['Ctrl', 'I'], description: 'Apply item discount' },
      { keys: ['Ctrl', 'P'], description: 'Price override' },
    ]},
    { category: 'Admin', items: [
      { keys: ['F11'], description: 'Toggle fullscreen mode' },
      { keys: ['F12'], description: 'View transactions' },
      { keys: ['Ctrl', 'L'], description: 'Lock screen' },
      { keys: ['Ctrl', 'Shift', 'T'], description: 'Toggle training mode' },
    ]},
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Speed up your workflow with these keyboard shortcuts
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-6">
            {shortcuts.map((section) => (
              <div key={section.category}>
                <h3 className="font-medium mb-3">{section.category}</h3>
                <div className="space-y-2">
                  {section.items.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <span className="text-sm">{shortcut.description}</span>
                      <div className="flex gap-1">
                        {shortcut.keys.map((key, i) => (
                          <span key={i} className="flex items-center gap-1">
                            <Badge variant="outline" className="font-mono text-xs">
                              {key}
                            </Badge>
                            {i < shortcut.keys.length - 1 && (
                              <span className="text-xs text-muted-foreground">+</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}