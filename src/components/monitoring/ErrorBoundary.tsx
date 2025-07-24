import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, RefreshCw, Bug } from 'lucide-react';
import { reportReactError } from '../../utils/errorReporting';
import { designTokens } from '../../styles/design-tokens';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  eventId?: string;
}

class BoxingErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Report to error tracking service
    try {
      reportReactError(error, errorInfo);
      
      // Call custom error handler if provided
      this.props.onError?.(error, errorInfo);
      
      // Track error in analytics
      if (window.gtag) {
        window.gtag('event', 'exception', {
          description: error.message,
          fatal: true,
          event_category: 'error_boundary'
        });
      }
    } catch (reportingError) {
      console.error('🥊 Failed to report error:', reportingError);
    }

    // Log error details in development
    if (process.env.NODE_ENV === 'development') {
      console.error('🥊 Boxing Error Boundary caught an error:', error, errorInfo);
    }
  }

  private handleRetry = (): void => {
    // Reset error boundary state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: undefined
    });

    // Track retry attempt
    if (window.gtag) {
      window.gtag('event', 'error_boundary_retry', {
        event_category: 'error_recovery',
        event_label: this.state.error?.message
      });
    }
  };

  private handleReload = (): void => {
    // Track reload attempt
    if (window.gtag) {
      window.gtag('event', 'error_boundary_reload', {
        event_category: 'error_recovery',
        event_label: this.state.error?.message
      });
    }

    window.location.reload();
  };

  private handleGoHome = (): void => {
    // Track navigation to home
    if (window.gtag) {
      window.gtag('event', 'error_boundary_home', {
        event_category: 'error_recovery',
        event_label: this.state.error?.message
      });
    }

    window.location.href = '/';
  };

  private copyErrorDetails = (): void => {
    const errorDetails = {
      message: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };

    navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2)).then(() => {
      alert('Error details copied to clipboard!');
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = JSON.stringify(errorDetails, null, 2);
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Error details copied to clipboard!');
    });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, errorInfo } = this.state;
      const showDetails = this.props.showDetails || process.env.NODE_ENV === 'development';

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Error Icon */}
              <motion.div
                animate={{ 
                  rotate: [0, -5, 5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative flex justify-center"
              >
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center"
                  style={{ 
                    backgroundColor: `${designTokens.colors.semantic.error}20`,
                    boxShadow: `0 0 30px ${designTokens.colors.semantic.error}40`
                  }}
                >
                  <AlertTriangle 
                    className="w-12 h-12" 
                    style={{ color: designTokens.colors.semantic.error }}
                  />
                </div>
              </motion.div>

              {/* Error Message */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold text-white font-display">
                  Something went wrong
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                  The boxing app encountered an unexpected error 🥊
                </p>
                <p className="text-lg text-gray-400 max-w-xl mx-auto">
                  Don't worry - our team has been notified and we're working to fix this issue.
                </p>
              </div>

              {/* Error Details (Development/Debug) */}
              {showDetails && error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-red-500/30 text-left"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-red-400 flex items-center space-x-2">
                      <Bug className="w-5 h-5" />
                      <span>Error Details</span>
                    </h3>
                    <button
                      onClick={this.copyErrorDetails}
                      className="px-3 py-1 bg-gray-700 text-gray-300 rounded text-sm hover:bg-gray-600 transition-colors"
                    >
                      Copy Details
                    </button>
                  </div>
                  
                  <div className="space-y-4 text-sm">
                    <div>
                      <div className="text-red-400 font-medium mb-1">Message:</div>
                      <div className="text-gray-300 font-mono bg-black/50 p-2 rounded">
                        {error.message}
                      </div>
                    </div>
                    
                    {error.stack && (
                      <div>
                        <div className="text-red-400 font-medium mb-1">Stack Trace:</div>
                        <div className="text-gray-300 font-mono bg-black/50 p-2 rounded max-h-40 overflow-y-auto">
                          {error.stack}
                        </div>
                      </div>
                    )}
                    
                    {errorInfo?.componentStack && (
                      <div>
                        <div className="text-red-400 font-medium mb-1">Component Stack:</div>
                        <div className="text-gray-300 font-mono bg-black/50 p-2 rounded max-h-40 overflow-y-auto">
                          {errorInfo.componentStack}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8"
              >
                <button
                  onClick={this.handleRetry}
                  className="flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                  style={{ 
                    background: designTokens.colors.gradients.victory,
                    color: designTokens.colors.primary.victory_white
                  }}
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Try Again</span>
                </button>
                
                <button
                  onClick={this.handleReload}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Reload Page</span>
                </button>
                
                <button
                  onClick={this.handleGoHome}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 hover:text-white transition-colors duration-300"
                >
                  <Home className="w-5 h-5" />
                  <span>Go Home</span>
                </button>
              </motion.div>

              {/* Support Information */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-12 space-y-4"
              >
                <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50">
                  <h3 className="text-lg font-semibold text-white mb-3">Need Help?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="space-y-2">
                      <div style={{ color: designTokens.colors.primary.championship_gold, fontWeight: '500' }}>
                        Contact Support
                      </div>
                      <div className="text-gray-400 text-sm">
                        Email us at support@kumarprescod.com with details about what you were doing
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div style={{ color: designTokens.colors.primary.championship_gold, fontWeight: '500' }}>
                        Try These Steps
                      </div>
                      <div className="text-gray-400 text-sm">
                        Refresh the page, clear your browser cache, or try a different browser
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-500 text-sm">
                  Error ID: {this.state.eventId || 'N/A'} • Kumar Prescod Boxing App v1.0
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default BoxingErrorBoundary;