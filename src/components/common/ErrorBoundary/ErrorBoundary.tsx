import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

import { logError } from '@/utils/errorLogger';
import Button from '@/components/common/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
  level?: 'page' | 'section' | 'component';
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  eventId: string | null;
}

/**
 * ErrorBoundary - Catches JavaScript errors anywhere in the child component tree
 * 
 * This component provides a fallback UI when an error occurs and logs the error
 * for debugging purposes. It supports different levels of error boundaries and
 * custom fallback components.
 * 
 * @example
 * ```tsx
 * <ErrorBoundary level="page" showDetails={false}>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
class ErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: number | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const { onError, level = 'component' } = this.props;

    // Log error with context
    const eventId = logError(error, {
      ...errorInfo,
      level,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    });

    this.setState({
      errorInfo,
      eventId,
    });

    // Call custom error handler if provided
    onError?.(error, errorInfo);

    // Report to external error tracking service
    if (process.env.NODE_ENV === 'production') {
      this.reportToErrorService(error, errorInfo, eventId);
    }
  }

  componentWillUnmount(): void {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  private reportToErrorService = (
    error: Error,
    errorInfo: ErrorInfo,
    eventId: string
  ): void => {
    // Integration with error tracking service (e.g., Sentry, LogRocket)
    try {
      // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
      console.error('Error reported to tracking service:', { error, errorInfo, eventId });
    } catch (reportingError) {
      console.error('Failed to report error to tracking service:', reportingError);
    }
  };

  private handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null,
    });
  };

  private handleReload = (): void => {
    window.location.reload();
  };

  private handleGoHome = (): void => {
    window.location.href = '/';
  };

  private handleReportBug = (): void => {
    const { error, errorInfo, eventId } = this.state;
    const bugReportUrl = `mailto:support@kumarprescod.com?subject=Bug Report - ${eventId}&body=${encodeURIComponent(
      `Error: ${error?.message}\n\nStack: ${error?.stack}\n\nComponent Stack: ${errorInfo?.componentStack}\n\nEvent ID: ${eventId}\n\nURL: ${window.location.href}\n\nUser Agent: ${navigator.userAgent}`
    )}`;
    window.open(bugReportUrl);
  };

  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback, showDetails = false, level = 'component' } = this.props;

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Render appropriate error UI based on level
      return this.renderErrorUI(error, errorInfo, level, showDetails);
    }

    return children;
  }

  private renderErrorUI = (
    error: Error | null,
    errorInfo: ErrorInfo | null,
    level: string,
    showDetails: boolean
  ): ReactNode => {
    const isPageLevel = level === 'page';
    const isSectionLevel = level === 'section';

    return (
      <div
        className={`
          flex flex-col items-center justify-center p-8 text-center
          ${isPageLevel ? 'min-h-screen bg-gray-50' : ''}
          ${isSectionLevel ? 'min-h-96 bg-gray-100 rounded-lg' : 'min-h-48 bg-gray-50 rounded'}
        `}
        role="alert"
        aria-live="assertive"
      >
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <AlertTriangle 
              className={`mx-auto text-red-500 ${isPageLevel ? 'w-16 h-16' : 'w-12 h-12'}`}
              aria-hidden="true"
            />
          </div>

          <h2 className={`font-bold text-gray-900 mb-4 ${isPageLevel ? 'text-2xl' : 'text-xl'}`}>
            {isPageLevel ? 'Something went wrong' : 'Error loading content'}
          </h2>

          <p className="text-gray-600 mb-6">
            {isPageLevel
              ? 'We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.'
              : 'This section failed to load properly. You can try again or continue browsing other parts of the site.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <Button
              onClick={this.handleRetry}
              variant="primary"
              className="inline-flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>

            {isPageLevel && (
              <>
                <Button
                  onClick={this.handleReload}
                  variant="outline"
                  className="inline-flex items-center"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reload Page
                </Button>

                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="inline-flex items-center"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </>
            )}
          </div>

          <div className="flex justify-center">
            <Button
              onClick={this.handleReportBug}
              variant="ghost"
              size="sm"
              className="inline-flex items-center text-gray-500 hover:text-gray-700"
            >
              <Bug className="w-4 h-4 mr-2" />
              Report Bug
            </Button>
          </div>

          {showDetails && process.env.NODE_ENV === 'development' && (
            <details className="mt-8 text-left">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                Error Details (Development Only)
              </summary>
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="mb-4">
                  <h4 className="font-medium text-red-800">Error Message:</h4>
                  <p className="text-sm text-red-700 font-mono">{error?.message}</p>
                </div>
                
                {error?.stack && (
                  <div className="mb-4">
                    <h4 className="font-medium text-red-800">Stack Trace:</h4>
                    <pre className="text-xs text-red-700 font-mono whitespace-pre-wrap overflow-auto max-h-40">
                      {error.stack}
                    </pre>
                  </div>
                )}

                {errorInfo?.componentStack && (
                  <div>
                    <h4 className="font-medium text-red-800">Component Stack:</h4>
                    <pre className="text-xs text-red-700 font-mono whitespace-pre-wrap overflow-auto max-h-40">
                      {errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}
        </div>
      </div>
    );
  };
}

export default ErrorBoundary;