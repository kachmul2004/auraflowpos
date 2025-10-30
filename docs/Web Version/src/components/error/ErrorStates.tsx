import { ReactNode } from 'react';
import { 
  AlertTriangle, 
  WifiOff, 
  ServerCrash, 
  FileQuestion,
  RefreshCcw,
  Home,
  Search
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

interface ErrorStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'An error occurred. Please try again.',
  icon,
  action,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <div className="text-center max-w-md">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          {icon || <AlertTriangle className="h-8 w-8 text-destructive" />}
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-6">{description}</p>
        {action || (
          onRetry && (
            <Button onClick={onRetry}>
              <RefreshCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )
        )}
      </div>
    </div>
  );
}

// Network Error
export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="Network Error"
      description="Unable to connect to the server. Please check your internet connection and try again."
      icon={<WifiOff className="h-8 w-8 text-destructive" />}
      onRetry={onRetry}
    />
  );
}

// Server Error
export function ServerError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="Server Error"
      description="The server encountered an error. Please try again later."
      icon={<ServerCrash className="h-8 w-8 text-destructive" />}
      onRetry={onRetry}
    />
  );
}

// Not Found Error
export function NotFoundError({ 
  resource = 'page',
  onGoHome 
}: { 
  resource?: string;
  onGoHome?: () => void;
}) {
  return (
    <ErrorState
      title={`${resource} not found`}
      description={`The ${resource} you're looking for doesn't exist or has been removed.`}
      icon={<FileQuestion className="h-8 w-8 text-muted-foreground" />}
      action={
        <Button onClick={onGoHome || (() => window.location.href = '/')}>
          <Home className="w-4 h-4 mr-2" />
          Go Home
        </Button>
      }
    />
  );
}

// Generic API Error with details
interface ApiErrorProps {
  error: {
    status?: number;
    message?: string;
    details?: string;
  };
  onRetry?: () => void;
}

export function ApiError({ error, onRetry }: ApiErrorProps) {
  const getErrorTitle = (status?: number) => {
    if (!status) return 'Request Failed';
    if (status >= 500) return 'Server Error';
    if (status === 404) return 'Not Found';
    if (status === 403) return 'Access Denied';
    if (status === 401) return 'Unauthorized';
    return 'Request Failed';
  };

  return (
    <ErrorState
      title={getErrorTitle(error.status)}
      description={error.message || 'An error occurred while processing your request.'}
      onRetry={onRetry}
      action={
        error.details && (
          <details className="mt-4 text-left">
            <summary className="text-sm cursor-pointer hover:text-primary">
              View details
            </summary>
            <Card className="mt-2">
              <CardContent className="p-3">
                <pre className="text-xs overflow-auto">{error.details}</pre>
              </CardContent>
            </Card>
          </details>
        )
      }
    />
  );
}

// Inline Error (smaller, for use within components)
export function InlineError({ 
  message,
  onRetry 
}: { 
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 border border-destructive/50 bg-destructive/10 rounded-lg">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 text-destructive" />
        <p className="text-sm text-destructive">{message}</p>
      </div>
      {onRetry && (
        <Button size="sm" variant="ghost" onClick={onRetry}>
          <RefreshCcw className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
