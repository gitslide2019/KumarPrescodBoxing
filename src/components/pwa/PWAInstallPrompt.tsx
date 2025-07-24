import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Monitor, Tablet } from 'lucide-react';
import { designTokens } from '../../styles/design-tokens';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deviceType, setDeviceType] = useState<'mobile' | 'desktop' | 'tablet'>('desktop');

  useEffect(() => {
    // Check if app is already installed
    const checkInstallation = () => {
      // Check for PWA display mode
      const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
      const isInFullscreenMode = window.matchMedia('(display-mode: fullscreen)').matches;
      const isInMinimalUiMode = window.matchMedia('(display-mode: minimal-ui)').matches;
      
      // Check for iOS PWA
      const isIOSPWA = (window.navigator as any).standalone === true;
      
      setIsInstalled(isInStandaloneMode || isInFullscreenMode || isInMinimalUiMode || isIOSPWA);
    };

    // Detect device type
    const detectDeviceType = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const width = window.innerWidth;
      
      if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
        setDeviceType('mobile');
      } else if (/tablet|ipad/i.test(userAgent) || (width >= 768 && width <= 1024)) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    checkInstallation();
    detectDeviceType();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after a delay if not installed
      if (!isInstalled) {
        setTimeout(() => {
          setShowPrompt(true);
        }, 10000); // Show after 10 seconds
      }
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      
      // Track installation
      if (window.gtag) {
        window.gtag('event', 'pwa_installed', {
          event_category: 'pwa',
          event_label: 'boxing_app_install',
          device_type: deviceType
        });
      }
      
      console.log('🥊 Boxing app installed successfully!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled, deviceType]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      // Show the install prompt
      await deferredPrompt.prompt();
      
      // Wait for the user to respond
      const { outcome } = await deferredPrompt.userChoice;
      
      // Track user choice
      if (window.gtag) {
        window.gtag('event', 'pwa_install_prompt', {
          event_category: 'pwa',
          event_label: outcome,
          device_type: deviceType
        });
      }
      
      if (outcome === 'accepted') {
        console.log('🥊 User accepted the install prompt');
      } else {
        console.log('🥊 User dismissed the install prompt');
      }
      
      // Clear the deferredPrompt
      setDeferredPrompt(null);
      setShowPrompt(false);
      
    } catch (error) {
      console.error('🥊 Error showing install prompt:', error);
    }
  };

  const handleClosePrompt = () => {
    setShowPrompt(false);
    
    // Track dismissal
    if (window.gtag) {
      window.gtag('event', 'pwa_prompt_dismissed', {
        event_category: 'pwa',
        event_label: 'user_closed',
        device_type: deviceType
      });
    }
    
    // Don't show again for 24 hours
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  // Check if prompt was recently dismissed
  useEffect(() => {
    const dismissedTime = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissedTime) {
      const timeSinceDismissal = Date.now() - parseInt(dismissedTime);
      const oneDay = 24 * 60 * 60 * 1000;
      
      if (timeSinceDismissal < oneDay) {
        setShowPrompt(false);
      }
    }
  }, []);

  const getDeviceIcon = () => {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone className="w-6 h-6" />;
      case 'tablet':
        return <Tablet className="w-6 h-6" />;
      default:
        return <Monitor className="w-6 h-6" />;
    }
  };

  const getInstallInstructions = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    if (isIOS) {
      return {
        title: 'Install Boxing App on iOS',
        steps: [
          'Tap the Share button in Safari',
          'Scroll down and tap "Add to Home Screen"',
          'Tap "Add" to install the boxing app'
        ]
      };
    } else if (isAndroid) {
      return {
        title: 'Install Boxing App on Android',
        steps: [
          'Tap "Install" when prompted',
          'Or tap the menu (3 dots) and select "Install app"',
          'The app will be added to your home screen'
        ]
      };
    } else {
      return {
        title: 'Install Boxing App on Desktop',
        steps: [
          'Click the install icon in your address bar',
          'Or click "Install" in the browser menu',
          'The app will be added to your desktop/applications'
        ]
      };
    }
  };

  // Don't show if already installed or no install prompt available
  if (isInstalled || (!deferredPrompt && !showPrompt)) {
    return null;
  }

  const instructions = getInstallInstructions();

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto"
        >
          <div 
            className="rounded-lg shadow-2xl p-6 border border-gray-700/50 backdrop-blur-sm"
            style={{ 
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
            }}
          >
            {/* Close button */}
            <button
              onClick={handleClosePrompt}
              className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white transition-colors"
              aria-label="Close install prompt"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon and title */}
            <div className="flex items-center space-x-3 mb-4">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ 
                  background: designTokens.colors.gradients.victory,
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
                }}
              >
                <span className="text-2xl">🥊</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Install Boxing App
                </h3>
                <p className="text-sm text-gray-300">
                  Get the full experience!
                </p>
              </div>
            </div>

            {/* Benefits */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-300 mb-2">
                Why install?
              </h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: designTokens.colors.primary.championship_gold }}></div>
                  <span>Faster loading and offline access</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: designTokens.colors.primary.championship_gold }}></div>
                  <span>Push notifications for fights</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: designTokens.colors.primary.championship_gold }}></div>
                  <span>Native app experience</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: designTokens.colors.primary.championship_gold }}></div>
                  <span>Quick access from home screen</span>
                </li>
              </ul>
            </div>

            {/* Install button */}
            {deferredPrompt ? (
              <button
                onClick={handleInstallClick}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 active:scale-95"
                style={{ 
                  background: designTokens.colors.gradients.victory,
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
                }}
              >
                <Download className="w-5 h-5" />
                <span>Install Boxing App</span>
                {getDeviceIcon()}
              </button>
            ) : (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold" style={{ color: designTokens.colors.primary.championship_gold }}>
                  {instructions.title}
                </h4>
                <ol className="text-sm text-gray-300 space-y-1">
                  {instructions.steps.map((step, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span 
                        className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ backgroundColor: designTokens.colors.primary.boxing_red }}
                      >
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Device info */}
            <div className="mt-4 pt-4 border-t border-gray-700/50">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Compatible with your {deviceType}</span>
                <span>⚡ Enhanced performance</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;