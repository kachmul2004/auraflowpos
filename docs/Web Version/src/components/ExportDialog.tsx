import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Download, FileSpreadsheet, FileJson, Loader2, Calendar } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { ExportFormat, ExportOptions, getExportFormats } from '../lib/exportUtils';
import { Separator } from './ui/separator';

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
  onExport: (options: ExportOptions) => void;
  title: string;
  description?: string;
  availableFields?: { value: string; label: string }[];
  defaultFilename?: string;
  enableDateRange?: boolean;
}

export function ExportDialog({
  open,
  onClose,
  onExport,
  title,
  description,
  availableFields = [],
  defaultFilename,
  enableDateRange = true,
}: ExportDialogProps) {
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [filename, setFilename] = useState(defaultFilename || 'export');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(true);
  const [useDateRange, setUseDateRange] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [exporting, setExporting] = useState(false);

  const exportFormats = getExportFormats();

  const handleFieldToggle = (field: string) => {
    setSelectedFields(prev => {
      if (prev.includes(field)) {
        return prev.filter(f => f !== field);
      } else {
        return [...prev, field];
      }
    });
    setSelectAll(false);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedFields([]);
    } else {
      setSelectedFields(availableFields.map(f => f.value));
    }
    setSelectAll(!selectAll);
  };

  const handleExport = async () => {
    // Validation
    if (!filename.trim()) {
      toast.error('Please enter a filename');
      return;
    }

    if (useDateRange && (!startDate || !endDate)) {
      toast.error('Please select both start and end dates');
      return;
    }

    if (useDateRange && new Date(startDate) > new Date(endDate)) {
      toast.error('Start date must be before end date');
      return;
    }

    setExporting(true);

    try {
      const options: ExportOptions = {
        format,
        filename: `${filename}.${format}`,
        selectedFields: selectAll || selectedFields.length === 0 ? undefined : selectedFields,
        includeHeaders: true,
      };

      if (useDateRange && startDate && endDate) {
        options.dateRange = {
          start: new Date(startDate),
          end: new Date(endDate),
        };
      }

      await onExport(options);
      
      toast.success(`Export completed: ${filename}.${format}`);
      
      // Close dialog after short delay
      setTimeout(() => {
        onClose();
        // Reset form
        setFormat('csv');
        setFilename(defaultFilename || 'export');
        setSelectedFields([]);
        setSelectAll(true);
        setUseDateRange(false);
        setStartDate('');
        setEndDate('');
      }, 500);
    } catch (error: any) {
      console.error('Export error:', error);
      toast.error(error.message || 'Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  const getFormatIcon = (fmt: ExportFormat) => {
    switch (fmt) {
      case 'csv':
      case 'xlsx':
        return <FileSpreadsheet className="w-4 h-4" />;
      case 'json':
        return <FileJson className="w-4 h-4" />;
      default:
        return <Download className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Export Format */}
          <div className="space-y-2">
            <Label>Export Format</Label>
            <Select value={format} onValueChange={(v) => setFormat(v as ExportFormat)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {exportFormats.map(fmt => (
                  <SelectItem key={fmt.value} value={fmt.value}>
                    <div className="flex items-center gap-2">
                      {getFormatIcon(fmt.value)}
                      <div>
                        <div>{fmt.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {fmt.description}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filename */}
          <div className="space-y-2">
            <Label htmlFor="filename">Filename</Label>
            <div className="flex gap-2">
              <Input
                id="filename"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="export"
              />
              <div className="flex items-center px-3 bg-muted rounded-md text-sm text-muted-foreground">
                .{format}
              </div>
            </div>
          </div>

          <Separator />

          {/* Date Range Filter */}
          {enableDateRange && (
            <>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dateRange"
                  checked={useDateRange}
                  onCheckedChange={(checked) => setUseDateRange(checked as boolean)}
                />
                <Label
                  htmlFor="dateRange"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Filter by date range
                </Label>
              </div>

              {useDateRange && (
                <div className="grid grid-cols-2 gap-4 pl-6">
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="text-xs">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="text-xs">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <Separator />
            </>
          )}

          {/* Field Selection */}
          {availableFields.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Fields to Export</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAll}
                >
                  {selectAll ? 'Deselect All' : 'Select All'}
                </Button>
              </div>

              <div className="border rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
                {availableFields.map(field => (
                  <div key={field.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={field.value}
                      checked={selectAll || selectedFields.includes(field.value)}
                      onCheckedChange={() => handleFieldToggle(field.value)}
                    />
                    <Label
                      htmlFor={field.value}
                      className="text-sm font-normal cursor-pointer flex-1"
                    >
                      {field.label}
                    </Label>
                  </div>
                ))}
              </div>

              <p className="text-xs text-muted-foreground">
                {selectAll
                  ? 'All fields will be exported'
                  : `${selectedFields.length} field(s) selected`}
              </p>
            </div>
          )}

          {/* Export Preview Info */}
          <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 mt-0.5 text-blue-600 dark:text-blue-400" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Export will include:</strong>
                <ul className="mt-1 space-y-0.5 text-xs">
                  <li>• Format: {exportFormats.find(f => f.value === format)?.label}</li>
                  <li>• Filename: {filename}.{format}</li>
                  {useDateRange && startDate && endDate && (
                    <li>• Date range: {startDate} to {endDate}</li>
                  )}
                  <li>
                    • Fields: {selectAll ? 'All' : selectedFields.length > 0 ? selectedFields.length : 'All'}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={exporting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={exporting}
          >
            {exporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
