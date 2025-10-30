import { useState, useEffect } from 'react';
import { useStore } from '../../../lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Progress } from '../../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  Play,
  RefreshCw,
  Trash2,
  Wifi,
  WifiOff,
  XCircle,
  Zap,
  BarChart3,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Printer, PrinterStatus } from '../lib/printer.types';

interface PrintJob {
  id: string;
  printerId: string;
  printerName: string;
  timestamp: Date;
  status: 'pending' | 'printing' | 'completed' | 'failed';
  content: string;
  error?: string;
  duration?: number;
}

interface ErrorLog {
  id: string;
  printerId: string;
  printerName: string;
  timestamp: Date;
  errorType: 'connection' | 'paper' | 'hardware' | 'timeout' | 'unknown';
  message: string;
  severity: 'low' | 'medium' | 'high';
}

interface PrinterStats {
  totalJobs: number;
  successfulJobs: number;
  failedJobs: number;
  averageDuration: number;
  uptime: number;
  lastUsed?: Date;
}

export function DiagnosticsPanel() {
  const { printers, testPrinter } = useStore();
  
  // State
  const [printJobs, setPrintJobs] = useState<PrintJob[]>([]);
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [systemHealth, setSystemHealth] = useState({
    overall: 95,
    connectivity: 98,
    performance: 92,
    reliability: 96,
  });
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState<Map<string, boolean>>(new Map());
  
  // Generate mock print jobs for demo
  useEffect(() => {
    const mockJobs: PrintJob[] = [];
    const now = new Date();
    
    printers.forEach((printer, idx) => {
      // Add some completed jobs
      for (let i = 0; i < 3 + Math.floor(Math.random() * 5); i++) {
        const timestamp = new Date(now.getTime() - (Math.random() * 86400000)); // Last 24 hours
        mockJobs.push({
          id: `job-${printer.id}-${i}`,
          printerId: printer.id,
          printerName: printer.name,
          timestamp,
          status: Math.random() > 0.1 ? 'completed' : 'failed',
          content: `Order #${1000 + i}`,
          duration: Math.floor(Math.random() * 3000) + 500,
          error: Math.random() > 0.9 ? 'Connection timeout' : undefined,
        });
      }
      
      // Add a pending job for some printers
      if (Math.random() > 0.7) {
        mockJobs.push({
          id: `job-${printer.id}-pending`,
          printerId: printer.id,
          printerName: printer.name,
          timestamp: new Date(),
          status: 'pending',
          content: `Order #${2000 + idx}`,
        });
      }
    });
    
    setPrintJobs(mockJobs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
  }, [printers]);
  
  // Generate mock error logs
  useEffect(() => {
    const mockErrors: ErrorLog[] = [];
    const now = new Date();
    
    printers.forEach((printer) => {
      if (printer.status === 'error' || Math.random() > 0.8) {
        const errorTypes: ErrorLog['errorType'][] = ['connection', 'paper', 'hardware', 'timeout'];
        const errorType = errorTypes[Math.floor(Math.random() * errorTypes.length)];
        
        mockErrors.push({
          id: `error-${printer.id}-${Date.now()}`,
          printerId: printer.id,
          printerName: printer.name,
          timestamp: new Date(now.getTime() - Math.random() * 3600000),
          errorType,
          message: getErrorMessage(errorType),
          severity: errorType === 'connection' || errorType === 'hardware' ? 'high' : 'medium',
        });
      }
    });
    
    setErrorLogs(mockErrors.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
  }, [printers]);
  
  const getErrorMessage = (type: ErrorLog['errorType']): string => {
    const messages = {
      connection: 'Failed to establish connection with printer',
      paper: 'Paper jam or out of paper detected',
      hardware: 'Hardware malfunction detected',
      timeout: 'Print job timed out after 30 seconds',
      unknown: 'Unknown error occurred',
    };
    return messages[type];
  };
  
  const getStatusIcon = (status: PrinterStatus) => {
    switch (status) {
      case 'online':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'offline':
        return <WifiOff className="w-4 h-4 text-gray-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };
  
  const getStatusBadge = (status: PrinterStatus) => {
    const variants = {
      online: 'default',
      offline: 'secondary',
      error: 'destructive',
    } as const;
    
    return (
      <Badge variant={variants[status]} className="capitalize">
        {status}
      </Badge>
    );
  };
  
  const calculatePrinterStats = (printerId: string): PrinterStats => {
    const jobs = printJobs.filter(j => j.printerId === printerId);
    const successful = jobs.filter(j => j.status === 'completed').length;
    const failed = jobs.filter(j => j.status === 'failed').length;
    const durations = jobs.filter(j => j.duration).map(j => j.duration!);
    const avgDuration = durations.length > 0 
      ? durations.reduce((a, b) => a + b, 0) / durations.length 
      : 0;
    
    const lastJob = jobs[0];
    const uptime = failed > 0 ? (successful / (successful + failed)) * 100 : 100;
    
    return {
      totalJobs: jobs.length,
      successfulJobs: successful,
      failedJobs: failed,
      averageDuration: avgDuration,
      uptime,
      lastUsed: lastJob?.timestamp,
    };
  };
  
  const handleTestAllPrinters = async () => {
    setTesting(true);
    setTestResults(new Map());
    
    for (const printer of printers) {
      try {
        const result = await testPrinter(printer.id);
        setTestResults(prev => new Map(prev).set(printer.id, result));
        
        if (result) {
          toast.success(`${printer.name} test passed`);
        } else {
          toast.error(`${printer.name} test failed`);
        }
      } catch (error) {
        setTestResults(prev => new Map(prev).set(printer.id, false));
        toast.error(`${printer.name} test failed`);
      }
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setTesting(false);
    toast.success('All printer tests completed');
  };
  
  const handleTestPrinter = async (printerId: string, printerName: string) => {
    try {
      const result = await testPrinter(printerId);
      setTestResults(prev => new Map(prev).set(printerId, result));
      
      if (result) {
        toast.success(`${printerName} is responding correctly`);
      } else {
        toast.error(`${printerName} failed to respond`);
      }
    } catch (error) {
      toast.error(`Failed to test ${printerName}`);
    }
  };
  
  const clearErrorLogs = () => {
    setErrorLogs([]);
    toast.success('Error logs cleared');
  };
  
  const clearPrintQueue = () => {
    setPrintJobs(prev => prev.filter(j => j.status !== 'pending'));
    toast.success('Print queue cleared');
  };
  
  const getJobStatusIcon = (status: PrintJob['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'printing':
        return <Play className="w-4 h-4 text-blue-500" />;
    }
  };
  
  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };
  
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  const onlinePrinters = printers.filter(p => p.status === 'online').length;
  const errorPrinters = printers.filter(p => p.status === 'error').length;
  const pendingJobs = printJobs.filter(j => j.status === 'pending').length;
  const recentErrors = errorLogs.filter(e => {
    const diff = new Date().getTime() - e.timestamp.getTime();
    return diff < 3600000; // Last hour
  }).length;

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Overall Health</CardDescription>
              <Activity className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{systemHealth.overall}%</span>
                <Badge variant="default" className="bg-green-500">
                  Excellent
                </Badge>
              </div>
              <Progress value={systemHealth.overall} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Printers Online</CardDescription>
              <Wifi className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{onlinePrinters}/{printers.length}</span>
                {errorPrinters > 0 && (
                  <Badge variant="destructive">{errorPrinters} errors</Badge>
                )}
              </div>
              <Progress 
                value={(onlinePrinters / Math.max(printers.length, 1)) * 100} 
                className="h-2" 
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Print Queue</CardDescription>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{pendingJobs}</span>
                <span className="text-sm text-muted-foreground">pending</span>
              </div>
              {pendingJobs > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearPrintQueue}
                  className="w-full"
                >
                  Clear Queue
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Recent Errors</CardDescription>
              <AlertCircle className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{recentErrors}</span>
                <span className="text-sm text-muted-foreground">last hour</span>
              </div>
              {errorLogs.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearErrorLogs}
                  className="w-full"
                >
                  Clear Logs
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="printers" className="w-full">
        <TabsList>
          <TabsTrigger value="printers">Printer Status</TabsTrigger>
          <TabsTrigger value="queue">Print Queue</TabsTrigger>
          <TabsTrigger value="errors">Error Logs</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        {/* Printer Status Tab */}
        <TabsContent value="printers" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg">Printer Health Checks</h3>
            <Button 
              onClick={handleTestAllPrinters}
              disabled={testing || printers.length === 0}
            >
              {testing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Test All Printers
                </>
              )}
            </Button>
          </div>

          {printers.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No printers configured. Add a printer to start monitoring.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              {printers.map((printer) => {
                const stats = calculatePrinterStats(printer.id);
                const testResult = testResults.get(printer.id);
                
                return (
                  <Card key={printer.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(printer.status)}
                          <div>
                            <CardTitle className="text-base">{printer.name}</CardTitle>
                            <CardDescription className="text-sm">
                              {printer.type} • {printer.connection}
                              {printer.station && ` • ${printer.station}`}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(printer.status)}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTestPrinter(printer.id, printer.name)}
                          >
                            <Zap className="w-3 h-3 mr-1" />
                            Test
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Total Jobs</p>
                          <p className="font-medium">{stats.totalJobs}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Success Rate</p>
                          <p className="font-medium">{stats.uptime.toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Avg Duration</p>
                          <p className="font-medium">
                            {stats.averageDuration > 0 ? formatDuration(stats.averageDuration) : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Last Used</p>
                          <p className="font-medium">
                            {stats.lastUsed ? formatTimestamp(stats.lastUsed) : 'Never'}
                          </p>
                        </div>
                      </div>
                      
                      {testResult !== undefined && (
                        <Alert className="mt-3">
                          {testResult ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <AlertDescription>
                            {testResult 
                              ? 'Connection test passed successfully' 
                              : 'Connection test failed - check printer connection'}
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Print Queue Tab */}
        <TabsContent value="queue" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg">Print Job History</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {printJobs.length} total jobs
              </Badge>
              {pendingJobs > 0 && (
                <Badge variant="default">
                  {pendingJobs} pending
                </Badge>
              )}
            </div>
          </div>

          <ScrollArea className="h-[500px] rounded-md border">
            <div className="p-4 space-y-2">
              {printJobs.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No print jobs yet</p>
                </div>
              ) : (
                printJobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {getJobStatusIcon(job.status)}
                      <div>
                        <p className="font-medium">{job.content}</p>
                        <p className="text-sm text-muted-foreground">
                          {job.printerName} • {formatTimestamp(job.timestamp)}
                        </p>
                        {job.error && (
                          <p className="text-sm text-red-500 mt-1">{job.error}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={
                        job.status === 'completed' ? 'default' :
                        job.status === 'failed' ? 'destructive' :
                        job.status === 'pending' ? 'secondary' : 'outline'
                      }>
                        {job.status}
                      </Badge>
                      {job.duration && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatDuration(job.duration)}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Error Logs Tab */}
        <TabsContent value="errors" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg">Error Logs</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {errorLogs.length} total errors
              </Badge>
              {errorLogs.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearErrorLogs}>
                  <Trash2 className="w-3 h-3 mr-1" />
                  Clear All
                </Button>
              )}
            </div>
          </div>

          <ScrollArea className="h-[500px] rounded-md border">
            <div className="p-4 space-y-2">
              {errorLogs.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No errors logged</p>
                  <p className="text-sm mt-2">System running smoothly!</p>
                </div>
              ) : (
                errorLogs.map((error) => (
                  <Alert 
                    key={error.id}
                    variant={error.severity === 'high' ? 'destructive' : 'default'}
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{error.printerName}</p>
                          <p className="text-sm mt-1">{error.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {error.errorType} • {formatTimestamp(error.timestamp)}
                          </p>
                        </div>
                        <Badge variant={
                          error.severity === 'high' ? 'destructive' :
                          error.severity === 'medium' ? 'default' : 'secondary'
                        }>
                          {error.severity}
                        </Badge>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="stats" className="space-y-4 mt-4">
          <h3 className="text-lg">Performance Statistics</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Print Jobs</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{printJobs.length}</p>
                <Progress 
                  value={100} 
                  className="h-2 mt-2" 
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Success Rate</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {printJobs.length > 0 
                    ? ((printJobs.filter(j => j.status === 'completed').length / printJobs.length) * 100).toFixed(1)
                    : 0}%
                </p>
                <Progress 
                  value={printJobs.length > 0 
                    ? (printJobs.filter(j => j.status === 'completed').length / printJobs.length) * 100
                    : 0
                  } 
                  className="h-2 mt-2" 
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Average Speed</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {printJobs.filter(j => j.duration).length > 0
                    ? formatDuration(
                        printJobs
                          .filter(j => j.duration)
                          .reduce((sum, j) => sum + j.duration!, 0) /
                          printJobs.filter(j => j.duration).length
                      )
                    : 'N/A'}
                </p>
                <Progress value={75} className="h-2 mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Per-Printer Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Per-Printer Performance</CardTitle>
              <CardDescription>
                Detailed statistics for each configured printer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {printers.map((printer) => {
                  const stats = calculatePrinterStats(printer.id);
                  return (
                    <div key={printer.id} className="border-b pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(printer.status)}
                          <span className="font-medium">{printer.name}</span>
                        </div>
                        <Badge variant="outline">
                          {stats.uptime.toFixed(1)}% uptime
                        </Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Jobs</p>
                          <p className="font-medium">{stats.totalJobs}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Successful</p>
                          <p className="font-medium text-green-500">{stats.successfulJobs}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Failed</p>
                          <p className="font-medium text-red-500">{stats.failedJobs}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Avg Speed</p>
                          <p className="font-medium">
                            {stats.averageDuration > 0 ? formatDuration(stats.averageDuration) : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {printers.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No printer statistics available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
