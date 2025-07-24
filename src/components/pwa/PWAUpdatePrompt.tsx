import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, X, Download } from 'lucide-react';
import { designTokens } from '../../styles/design-tokens';

interface PWAUpdatePromptProps {
  onUpdate?: () => void;
}

const PWAUpdatePrompt: React.FC<PWAUpdatePromptProps> = ({ onUpdate }) => {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    // Check for service worker updates
    const checkForUpdates = () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then(registration => {
          if (registration) {
            // Check for waiting service worker
            if (registration.waiting) {
              setWaitingWorker(registration.waiting);
              setShowUpdatePrompt(true);
            }

            // Listen for service worker updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    setWaitingWorker(newWorker);
                    setShowUpdatePrompt(true);
                  }
                });
              }
            });

            // Listen for controller change (when update is applied)
            navigator.serviceWorker.addEventListener('controllerchange', () => {
              window.location.reload();
            });
          }
        });

        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
            setShowUpdatePrompt(true);
          }
        });
      }
    };

    checkForUpdates();

    // Check for updates periodically (every 30 minutes)
    const updateCheckInterval = setInterval(checkForUpdates, 30 * 60 * 1000);

    return () => {
      clearInterval(updateCheckInterval);
    };
  }, []);

  const handleUpdateClick = async () => {
    if (!waitingWorker) return;

    setIsUpdating(true);

    try {
      // Tell the waiting service worker to skip waiting
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      
      // Track update acceptance
      if (window.gtag) {
        window.gtag('event', 'pwa_update_accepted', {
          event_category: 'pwa',
          event_label: 'boxing_app_update'
        });
      }

      // Call onUpdate callback if provided
      onUpdate?.();

      // The page will reload automatically when the new service worker takes control
      
    } catch (error) {
      console.error('🥊 Error updating service worker:', error);
      setIsUpdating(false);
    }
  };

  const handleDismissUpdate = () => {
    setShowUpdatePrompt(false);
    
    // Track dismissal
    if (window.gtag) {
      window.gtag('event', 'pwa_update_dismissed', {
        event_category: 'pwa',
        event_label: 'user_dismissed'
      });
    }

    // Don't show again for this session
    sessionStorage.setItem('pwa-update-dismissed', 'true');
  };

  // Don't show if user already dismissed in this session
  useEffect(() => {
    const dismissed = sessionStorage.getItem('pwa-update-dismissed');
    if (dismissed === 'true') {
      setShowUpdatePrompt(false);
    }
  }, []);

  return (
    <AnimatePresence>
      {showUpdatePrompt && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto"
        >
          <div 
            className="rounded-lg shadow-2xl p-4 border border-green-500/30 backdrop-blur-sm"
            style={{ 
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(5, 46, 22, 0.95) 100%)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
            }}
          >
            {/* Close button */}
            <button
              onClick={handleDismissUpdate}
              disabled={isUpdating}
              className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              aria-label="Dismiss update prompt"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Update icon and content */}
            <div className="flex items-start space-x-3">
              {/* Update icon */}
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ 
                  background: designTokens.colors.semantic.success + '20',
                  border: `1px solid ${designTokens.colors.semantic.success}40`
                }}
              >
                <motion.div
                  animate={isUpdating ? { rotate: 360 } : {}}
                  transition={{ duration: 1, repeat: isUpdating ? Infinity : 0, ease: "linear" }}
                >
                  <RefreshCw 
                    className="w-5 h-5" 
                    style={{ color: designTokens.colors.semantic.success }}
                  />
                </motion.div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-white mb-1">
                  🥊 Boxing App Update Available
                </h3>
                <p className="text-xs text-gray-300 mb-3">
                  A new version of the Kumar Prescod Boxing app is ready with improvements and new features.
                </p>

                {/* What's new */}
                <div className="mb-3">
                  <h4 className="text-xs font-medium text-green-400 mb-1">
                    What's New:
                  </h4>
                  <ul className="text-xs text-gray-400 space-y-0.5">
                    <li className="flex items-center space-x-1">
                      <div className="w-1 h-1 rounded-full bg-green-400"></div>
                      <span>Performance improvements</span>
                    </li>
                    <li className="flex items-center space-x-1">
                      <div className="w-1 h-1 rounded-full bg-green-400"></div>
                      <span>Enhanced offline support</span>
                    </li>
                    <li className="flex items-center space-x-1">
                      <div className="w-1 h-1 rounded-full bg-green-400"></div>
                      <span>Bug fixes and stability updates</span>
                    </li>
                  </ul>
                </div>

                {/* Action buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={handleUpdateClick}
                    disabled={isUpdating}
                    className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-md text-xs font-medium text-white transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    style={{ 
                      background: designTokens.colors.semantic.success,
                      boxShadow: '0 2px 6px rgba(34, 197, 94, 0.3)'
                    }}
                  >
                    {isUpdating ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <RefreshCw className="w-3 h-3" />
                        </motion.div>
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3 h-3" />
                        <span>Update Now</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleDismissUpdate}
                    disabled={isUpdating}
                    className="px-3 py-2 text-xs text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                  >
                    Later
                  </button>
                </div>

                {/* Update info */}
                <div className="mt-2 pt-2 border-t border-gray-700/50">
                  <p className="text-xs text-gray-500">
                    {isUpdating 
                      ? '🔄 Installing update...' 
                      : '⚡ Update installs instantly'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PWAUpdatePrompt;