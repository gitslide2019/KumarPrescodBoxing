import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RefreshCw, Home, AlertTriangle, Mail } from 'lucide-react';
import { useAnalytics } from '../contexts/AnalyticsContext';
import { designTokens } from '../styles/design-tokens';

interface ServerErrorProps {
  error?: Error;
  resetError?: () => void;
}

const ServerError: React.FC<ServerErrorProps> = ({ error, resetError }) => {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    trackEvent('Error', '500 Server Error', error?.message || 'Unknown server error');
  }, [trackEvent, error]);

  const handleAction = (action: string) => {
    trackEvent('500 Error Action', 'Click', action);
  };

  const handleRefresh = () => {
    handleAction('Page Refresh');
    if (resetError) {
      resetError();
    } else {
      window.location.reload();
    }
  };

  const handleReportError = () => {
    handleAction('Report Error');
    const subject = encodeURIComponent('Website Error Report');
    const body = encodeURIComponent(`
Error Details:
- URL: ${window.location.href}
- Time: ${new Date().toISOString()}
- Error: ${error?.message || 'Server error occurred'}
- User Agent: ${navigator.userAgent}

Additional Information:
Please describe what you were doing when this error occurred.
    `);
    window.open(`mailto:tech@kumarprescod.com?subject=${subject}&body=${body}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-black flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Error Icon Animation */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, -2, 2, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative flex justify-center"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-4 border-dashed border-red-500/30"
                style={{ width: '120px', height: '120px' }}
              />
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center m-3"
                style={{ backgroundColor: `${designTokens.colors.primary.boxing_red}20` }}
              >
                <AlertTriangle 
                  className="w-12 h-12" 
                  style={{ color: designTokens.colors.primary.boxing_red }}
                />
              </div>
            </div>
          </motion.div>

          {/* Error Code */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">
              500
            </div>
          </motion.div>

          {/* Main Message */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white font-display">
              Server Error
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Something went wrong on our end! 🥊
            </p>
            <p className="text-lg text-gray-400 max-w-xl mx-auto">
              We're experiencing technical difficulties. Our team has been notified 
              and is working to fix the issue. Please try again in a few moments.
            </p>
          </div>

          {/* Error Details (Development) */}
          {process.env.NODE_ENV === 'development' && error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 p-4 bg-black/60 rounded-lg border border-red-600/30 text-left"
            >
              <h3 className="text-red-400 font-semibold mb-2">Development Error Details:</h3>
              <pre className="text-sm text-gray-300 whitespace-pre-wrap overflow-x-auto">
                {error.message}
                {error.stack && (
                  <>
                    {'\n\nStack Trace:\n'}
                    {error.stack}
                  </>
                )}
              </pre>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12"
          >
            <button
              onClick={handleRefresh}
              className="flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
              style={{ 
                background: designTokens.colors.gradients.victory,
                color: designTokens.colors.primary.victory_white
              }}
            >
              <RefreshCw className="w-5 h-5" />
              <span>Try Again</span>
            </button>
            
            <Link
              to="/"
              onClick={() => handleAction('Home Navigation')}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300"
            >
              <Home className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>

            <button
              onClick={handleReportError}
              className="flex items-center space-x-2 px-6 py-3 bg-red-900/50 text-red-200 rounded-lg hover:bg-red-900/70 transition-colors duration-300"
            >
              <Mail className="w-5 h-5" />
              <span>Report Issue</span>
            </button>
          </motion.div>

          {/* Status Updates */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 space-y-4"
          >
            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-3">What you can do:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <div className="space-y-2">
                  <div className="text-yellow-400 font-medium">Wait a moment</div>
                  <div className="text-gray-400 text-sm">The issue might resolve itself in a few minutes</div>
                </div>
                <div className="space-y-2">
                  <div className="text-yellow-400 font-medium">Check your connection</div>
                  <div className="text-gray-400 text-sm">Make sure you have a stable internet connection</div>
                </div>
                <div className="space-y-2">
                  <div className="text-yellow-400 font-medium">Contact support</div>
                  <div className="text-gray-400 text-sm">If the problem persists, let us know</div>
                </div>
              </div>
            </div>

            <p className="text-gray-500 text-sm">
              Error occurred at {new Date().toLocaleString()}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ServerError;