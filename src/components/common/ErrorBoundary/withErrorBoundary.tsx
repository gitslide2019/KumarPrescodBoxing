import React, { ComponentType, ReactNode } from 'react';
import ErrorBoundary from './ErrorBoundary';
import ErrorFallback from './ErrorFallback';

interface WithErrorBoundaryOptions {
  fallback?: ReactNode;
  level?: 'page' | 'section' | 'component';
  showDetails?: boolean;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  fallbackProps?: {
    title?: string;
    message?: string;
    showRetry?: boolean;
    showHome?: boolean;
  };
}

/**
 * Higher-order component that wraps a component with an ErrorBoundary
 * 
 * @param Component - The component to wrap
 * @param options - ErrorBoundary configuration options
 * @returns Component wrapped with ErrorBoundary
 * 
 * @example
 * ```tsx
 * const SafeComponent = withErrorBoundary(MyComponent, {
 *   level: 'section',
 *   fallbackProps: {
 *     title: 'Failed to load component',
 *     message: 'Please try again later.'
 *   }
 * });
 * ```
 */
export function withErrorBoundary<P extends object>(
  Component: ComponentType<P>,
  options: WithErrorBoundaryOptions = {}
) {
  const {
    fallback,
    level = 'component',
    showDetails = false,
    onError,
    fallbackProps = {},
  } = options;

  const WrappedComponent = (props: P) => {
    const errorFallback = fallback || (
      <ErrorFallback
        level={level}
        {...fallbackProps}
      />
    );

    return (
      <ErrorBoundary
        fallback={errorFallback}
        level={level}
        showDetails={showDetails}
        onError={onError}
      >
        <Component {...props} />
      </ErrorBoundary>
    );
  };

  // Preserve component name for debugging
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

/**
 * Hook for creating error boundaries with custom fallbacks
 * 
 * @param options - ErrorBoundary configuration options
 * @returns Function to wrap components with ErrorBoundary
 * 
 * @example
 * ```tsx
 * const useErrorBoundary = createErrorBoundaryHook({
 *   level: 'section',
 *   onError: (error) => console.error('Section error:', error)
 * });
 * 
 * const SafeComponent = useErrorBoundary(MyComponent);
 * ```
 */
export function createErrorBoundaryHook(options: WithErrorBoundaryOptions = {}) {
  return function useErrorBoundary<P extends object>(Component: ComponentType<P>) {
    return withErrorBoundary(Component, options);
  };
}

/**
 * Decorator for class components to add error boundary
 * 
 * @param options - ErrorBoundary configuration options
 * @returns Class decorator
 * 
 * @example
 * ```tsx
 * @errorBoundary({ level: 'section' })
 * class MyComponent extends React.Component {
 *   render() {
 *     return <div>Content</div>;
 *   }
 * }
 * ```
 */
export function errorBoundary(options: WithErrorBoundaryOptions = {}) {
  return function <T extends ComponentType<any>>(Component: T): T {
    return withErrorBoundary(Component, options) as T;
  };
}

export default withErrorBoundary;