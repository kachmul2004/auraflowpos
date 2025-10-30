import { TableFloorPlan } from '../plugins/table-management/components/TableFloorPlan';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import { useStore } from '../lib/store';

interface TableManagementPageProps {
  onBack?: () => void;
}

export function TableManagementPage({ onBack }: TableManagementPageProps) {
  const currentShift = useStore((state) => state.currentShift);
  const currentUser = useStore((state) => state.currentUser);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border bg-card">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to POS
              </Button>
            )}
            <div>
              <h1 className="text-2xl">Table Management</h1>
              <p className="text-sm text-muted-foreground">
                View and manage restaurant tables, assign orders to tables
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentUser && (
              <div className="text-right text-sm">
                <p className="text-muted-foreground">Server</p>
                <p>{currentUser.name}</p>
              </div>
            )}
            {currentShift && (
              <div className="text-right text-sm">
                <p className="text-muted-foreground">Shift</p>
                <p>
                  {new Date(currentShift.startTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 max-w-[1800px]">
          <TableFloorPlan onClose={onBack} />
        </div>
      </div>
    </div>
  );
}
