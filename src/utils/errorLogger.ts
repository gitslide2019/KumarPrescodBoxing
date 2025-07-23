/**
 * Error Logging Utilities
 * Centralized error logging and reporting functionality
 */

interface ErrorContext {
  level?: 'page' | 'section' | 'component';
  timestamp?: string;
  userAgent?: string;
  url?: string;
  userId?: string;
  sessionId?: string;
  componentStack?: string;
  [key: string]: any;
}

interface LoggedError {
  id: string;
  error: Error;
  context: ErrorContext;
  timestamp: Date;
}

// In-memory error store for development
const errorStore: LoggedError[] = [];

/**
 * Generates a unique error ID
 */
function generateErrorId(): string {
  return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Logs an error with context information
 * 
 * @param error - The error to log
 * @param context - Additional context information
 * @returns Unique error ID
 */
export function logError(error: Error, context: ErrorContext = {}): string {
  const errorId = generateErrorId();
  const timestamp = new Date();

  const loggedError: LoggedError = {
    id: errorId,
    error,
    context: {
      ...context,
      timestamp: timestamp.toISOString(),
      userAgent: context.userAgent || navigator.userAgent,
      url: context.url || window.location.href,
    },
    timestamp,
  };

  // Store error in memory (for development)
  errorStore.push(loggedError);

  // Keep only last 100 errors to prevent memory leaks
  if (errorStore.length > 100) {
    errorStore.shift();
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.group(`🚨 Error ${errorId}`);
    console.error('Error:', error);
    console.log('Context:', context);
    console.log('Stack:', error.stack);
    console.groupEnd();
  }

  // Send to external logging service in production
  if (process.env.NODE_ENV === 'production') {
    sendToLoggingService(loggedError);
  }

  return errorId;
}

/**
 * Logs a warning message
 * 
 * @param message - Warning message
 * @param context - Additional context
 */
export function logWarning(message: string, context: Record<string, any> = {}): void {
  const warning = {
    message,
    context,
    timestamp: new Date().toISOString(),
    level: 'warning',
  };

  if (process.env.NODE_ENV === 'development') {
    console.warn('⚠️ Warning:', message, context);
  }

  if (process.env.NODE_ENV === 'production') {
    // Send warnings to logging service
    sendToLoggingService(warning);
  }
}

/**
 * Logs an info message
 * 
 * @param message - Info message
 * @param context - Additional context
 */
export function logInfo(message: string, context: Record<string, any> = {}): void {
  const info = {
    message,
    context,
    timestamp: new Date().toISOString(),
    level: 'info',
  };

  if (process.env.NODE_ENV === 'development') {
    console.log('ℹ️ Info:', message, context);
  }

  if (process.env.NODE_ENV === 'production') {
    sendToLoggingService(info);
  }
}

/**
 * Sends error data to external logging service
 * 
 * @param data - Error or log data to send
 */
async function sendToLoggingService(data: any): Promise<void> {
  try {
    // Example integration with logging service
    // Replace with actual service integration (e.g., Sentry, LogRocket, DataDog)
    
    const payload = {
      ...data,
      environment: process.env.NODE_ENV,
      version: process.env.REACT_APP_VERSION || '1.0.0',
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    };

    // Example: Send to logging endpoint
    await fetch('/api/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // Example: Sentry integration
    // Sentry.captureException(data.error, {
    //   contexts: { custom: data.context },
    //   tags: { level: data.context.level },
    // });

  } catch (loggingError) {
    // Fail silently to avoid infinite error loops
    console.error('Failed to send error to logging service:', loggingError);
  }
}

/**
 * Retrieves logged errors (for development/debugging)
 * 
 * @param limit - Maximum number of errors to return
 * @returns Array of logged errors
 */
export function getLoggedErrors(limit: number = 50): LoggedError[] {
  return errorStore.slice(-limit);
}

/**
 * Clears the error store (for development/debugging)
 */
export function clearErrorStore(): void {
  errorStore.length = 0;
}

/**
 * Creates an error logger with predefined context
 * 
 * @param defaultContext - Default context to include with all logs
 * @returns Error logging function
 */
export function createErrorLogger(defaultContext: ErrorContext) {
  return (error: Error, additionalContext: ErrorContext = {}): string => {
    return logError(error, { ...defaultContext, ...additionalContext });
  };
}

/**
 * Wraps a function to automatically log any errors it throws
 * 
 * @param fn - Function to wrap
 * @param context - Context to include with logged errors
 * @returns Wrapped function
 */
export function withErrorLogging<T extends (...args: any[]) => any>(
  fn: T,
  context: ErrorContext = {}
): T {
  return ((...args: any[]) => {
    try {
      const result = fn(...args);
      
      // Handle async functions
      if (result instanceof Promise) {
        return result.catch((error) => {
          logError(error, { ...context, functionName: fn.name });
          throw error;
        });
      }
      
      return result;
    } catch (error) {
      logError(error as Error, { ...context, functionName: fn.name });
      throw error;
    }
  }) as T;
}

/**
 * Error boundary error handler
 * 
 * @param error - The error that occurred
 * @param errorInfo - React error info
 * @param context - Additional context
 * @returns Error ID
 */
export function handleBoundaryError(
  error: Error,
  errorInfo: React.ErrorInfo,
  context: ErrorContext = {}
): string {
  return logError(error, {
    ...context,
    componentStack: errorInfo.componentStack,
    type: 'boundary_error',
  });
}

/**
 * Network error handler
 * 
 * @param error - Network error
 * @param request - Request details
 * @returns Error ID
 */
export function handleNetworkError(
  error: Error,
  request: {
    url: string;
    method: string;
    status?: number;
    statusText?: string;
  }
): string {
  return logError(error, {
    type: 'network_error',
    url: request.url,
    method: request.method,
    status: request.status,
    statusText: request.statusText,
  });
}

/**
 * Async operation error handler
 * 
 * @param error - Async error
 * @param operation - Operation details
 * @returns Error ID
 */
export function handleAsyncError(
  error: Error,
  operation: {
    name: string;
    params?: any;
    duration?: number;
  }
): string {
  return logError(error, {
    type: 'async_error',
    operation: operation.name,
    params: operation.params,
    duration: operation.duration,
  });
}

/**
 * Performance monitoring for error-prone operations
 * 
 * @param operation - Operation to monitor
 * @param context - Context information
 * @returns Promise with operation result
 */
export async function monitorOperation<T>(
  operation: () => Promise<T>,
  context: { name: string; [key: string]: any }
): Promise<T> {
  const startTime = performance.now();
  
  try {
    const result = await operation();
    const duration = performance.now() - startTime;
    
    // Log slow operations
    if (duration > 1000) {
      logWarning(`Slow operation detected: ${context.name}`, {
        ...context,
        duration,
      });
    }
    
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    handleAsyncError(error as Error, {
      name: context.name,
      params: context,
      duration,
    });
    throw error;
  }
}

// Global error handlers
if (typeof window !== 'undefined') {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logError(new Error(event.reason), {
      type: 'unhandled_promise_rejection',
      reason: event.reason,
    });
  });

  // Handle global JavaScript errors
  window.addEventListener('error', (event) => {
    logError(event.error || new Error(event.message), {
      type: 'global_error',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });
}

export default {
  logError,
  logWarning,
  logInfo,
  getLoggedErrors,
  clearErrorStore,
  createErrorLogger,
  withErrorLogging,
  handleBoundaryError,
  handleNetworkError,
  handleAsyncError,
  monitorOperation,
};