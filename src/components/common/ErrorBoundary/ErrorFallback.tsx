import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

import Button from '@/components/common/Button';

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
  level?: 'page' | 'section' | 'component';
  title?: string;
  message?: string;
  showRetry?: boolean;
  showHome?: boolean;
}

/**
 * ErrorFallback - Reusable error fallback component
 * 
 * A customizable error fallback component that can be used with ErrorBoundary
 * or as a standalone error display component.
 * 
 * @example
 * ```tsx
 * <ErrorFallback
 *   error={error}
 *   resetError={resetError}
 *   level="section"
 *   title="Failed to load data"
 *   message="Please check your connection and try again."
 * />
 * ```
 */
const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  level = 'component',
  title,
  message,
  showRetry = true,
  showHome = false,
}) => {
  const isPageLevel = level === 'page';
  const isSectionLevel = level === 'section';

  const defaultTitle = isPageLevel 
    ? 'Something went wrong' 
    : isSectionLevel 
    ? 'Section unavailable' 
    : 'Error occurred';

  const defaultMessage = isPageLevel
    ? 'We encountered an unexpected error. Please try refreshing the page.'
    : isSectionLevel
    ? 'This section is temporarily unavailable. Please try again later.'
    : 'Something went wrong with this component.';

  const handleReload = (): void => {
    window.location.reload();
  };

  const handleGoHome = (): void => {
    window.location.href = '/';
  };

  return (
    <div
      className={`
        flex flex-col items-center justify-center p-6 text-center
        ${isPageLevel ? 'min-h-screen bg-gray-50' : ''}
        ${isSectionLevel ? 'min-h-64 bg-gray-100 rounded-lg' : 'min-h-32 bg-gray-50 rounded'}
      `}
      role="alert"
      aria-live="assertive"
    >
      <div className="max-w-sm mx-auto">
        <div className="mb-4">
          <AlertTriangle 
            className={`mx-auto text-red-500 ${isPageLevel ? 'w-12 h-12' : 'w-8 h-8'}`}
            aria-hidden="true"
          />
        </div>

        <h3 className={`font-semibold text-gray-900 mb-2 ${isPageLevel ? 'text-xl' : 'text-lg'}`}>
          {title || defaultTitle}
        </h3>

        <p className="text-gray-600 text-sm mb-4">
          {message || defaultMessage}
        </p>

        {(showRetry || showHome) && (
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            {showRetry && resetError && (
              <Button
                onClick={resetError}
                variant="primary"
                size="sm"
                className="inline-flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            )}

            {showRetry && !resetError && isPageLevel && (
              <Button
                onClick={handleReload}
                variant="primary"
                size="sm"
                className="inline-flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reload Page
              </Button>
            )}

            {showHome && (
              <Button
                onClick={handleGoHome}
                variant="outline"
                size="sm"
                className="inline-flex items-center"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            )}
          </div>
        )}

        {process.env.NODE_ENV === 'development' && error && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-xs font-medium text-gray-500 hover:text-gray-700">
              Error Details (Dev)
            </summary>
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs">
              <p className="text-red-700 font-mono break-all">{error.message}</p>
            </div>
          </details>
        )}
      </div>
    </div>
  );
};

export default ErrorFallback;