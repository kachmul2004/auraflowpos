import { useState, useCallback } from 'react';
import { toast } from 'sonner@2.0.3';

// Generic async state
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

// Hook for managing async operations
export function useAsync<T>() {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (
      asyncFunction: () => Promise<T>,
      options?: {
        onSuccess?: (data: T) => void;
        onError?: (error: Error) => void;
        successMessage?: string;
        errorMessage?: string;
        showToast?: boolean;
      }
    ) => {
      setState({ data: null, loading: true, error: null });

      try {
        const data = await asyncFunction();
        setState({ data, loading: false, error: null });

        if (options?.showToast !== false && options?.successMessage) {
          toast.success(options.successMessage);
        }

        options?.onSuccess?.(data);
        return { success: true, data };
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error');
        setState({ data: null, loading: false, error: err });

        if (options?.showToast !== false) {
          toast.error(options?.errorMessage || err.message || 'Operation failed');
        }

        options?.onError?.(err);
        return { success: false, error: err };
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Retry logic with exponential backoff
export async function retryOperation<T>(
  operation: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    backoffMultiplier?: number;
    onRetry?: (attempt: number, error: Error) => void;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2,
    onRetry,
  } = options;

  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (attempt < maxRetries) {
        const delay = Math.min(
          initialDelay * Math.pow(backoffMultiplier, attempt),
          maxDelay
        );
        
        onRetry?.(attempt + 1, lastError);
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}

// Debounced async operation
export function debounceAsync<T extends (...args: any[]) => Promise<any>>(
  func: T,
  delay: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeoutId: NodeJS.Timeout | null = null;
  let pendingResolve: ((value: any) => void) | null = null;
  let pendingReject: ((reason: any) => void) | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    return new Promise<ReturnType<T>>((resolve, reject) => {
      pendingResolve = resolve;
      pendingReject = reject;

      timeoutId = setTimeout(async () => {
        try {
          const result = await func(...args);
          pendingResolve?.(result);
        } catch (error) {
          pendingReject?.(error);
        }
      }, delay);
    });
  };
}

// Throttled async operation
export function throttleAsync<T extends (...args: any[]) => Promise<any>>(
  func: T,
  delay: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> | null {
  let lastExecution = 0;

  return async (...args: Parameters<T>) => {
    const now = Date.now();
    
    if (now - lastExecution >= delay) {
      lastExecution = now;
      return await func(...args);
    }
    
    return null;
  };
}

// Promise timeout wrapper
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutError: string = 'Operation timed out'
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(timeoutError)), timeoutMs)
    ),
  ]);
}

// Batch async operations
export async function batchAsync<T, R>(
  items: T[],
  operation: (item: T) => Promise<R>,
  options: {
    batchSize?: number;
    delayBetweenBatches?: number;
    onProgress?: (completed: number, total: number) => void;
    continueOnError?: boolean;
  } = {}
): Promise<{ results: R[]; errors: Error[] }> {
  const {
    batchSize = 10,
    delayBetweenBatches = 100,
    onProgress,
    continueOnError = false,
  } = options;

  const results: R[] = [];
  const errors: Error[] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    
    const batchResults = await Promise.allSettled(
      batch.map(item => operation(item))
    );

    batchResults.forEach((result) => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        errors.push(result.reason);
        if (!continueOnError) {
          throw result.reason;
        }
      }
    });

    onProgress?.(Math.min(i + batchSize, items.length), items.length);

    // Delay between batches (except for last batch)
    if (i + batchSize < items.length && delayBetweenBatches > 0) {
      await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
    }
  }

  return { results, errors };
}

// Parallel async operations with limit
export async function parallelAsync<T, R>(
  items: T[],
  operation: (item: T) => Promise<R>,
  concurrencyLimit: number = 5
): Promise<R[]> {
  const results: R[] = [];
  const executing: Promise<void>[] = [];

  for (const item of items) {
    const promise = operation(item).then((result) => {
      results.push(result);
    });

    executing.push(promise);

    if (executing.length >= concurrencyLimit) {
      await Promise.race(executing);
      executing.splice(executing.findIndex(p => p === promise), 1);
    }
  }

  await Promise.all(executing);
  return results;
}

// Cache async results
export function cacheAsync<T extends (...args: any[]) => Promise<any>>(
  func: T,
  options: {
    ttl?: number; // Time to live in milliseconds
    key?: (...args: Parameters<T>) => string;
  } = {}
): T {
  const cache = new Map<string, { value: any; timestamp: number }>();
  const { ttl = 60000, key = (...args) => JSON.stringify(args) } = options;

  return (async (...args: Parameters<T>) => {
    const cacheKey = key(...args);
    const cached = cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.value;
    }

    const value = await func(...args);
    cache.set(cacheKey, { value, timestamp: Date.now() });

    // Clean up old entries
    for (const [k, v] of cache.entries()) {
      if (Date.now() - v.timestamp >= ttl) {
        cache.delete(k);
      }
    }

    return value;
  }) as T;
}

// Queue for sequential async operations
export class AsyncQueue {
  private queue: (() => Promise<any>)[] = [];
  private processing = false;

  async add<T>(operation: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await operation();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      this.process();
    });
  }

  private async process() {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0) {
      const operation = this.queue.shift()!;
      await operation();
    }

    this.processing = false;
  }

  clear() {
    this.queue = [];
  }

  get length() {
    return this.queue.length;
  }
}

// Safe async wrapper that catches errors
export async function safeAsync<T>(
  operation: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.error('Async operation failed:', error);
    return fallback;
  }
}

// Poll for a condition
export async function pollUntil(
  condition: () => Promise<boolean> | boolean,
  options: {
    interval?: number;
    timeout?: number;
    onTick?: () => void;
  } = {}
): Promise<boolean> {
  const { interval = 1000, timeout = 30000, onTick } = options;
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const result = await condition();
    
    if (result) {
      return true;
    }

    onTick?.();
    await new Promise(resolve => setTimeout(resolve, interval));
  }

  return false;
}
