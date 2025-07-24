import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { designTokens } from '../../styles/design-tokens';

interface BackToTopProps {
  threshold?: number;
  smooth?: boolean;
}

const BackToTop: React.FC<BackToTopProps> = ({ 
  threshold = 400, 
  smooth = true 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const toggleVisibility = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      setScrollProgress(scrollPercent);
      setIsVisible(scrollTop > threshold);
    };

    // Throttled scroll handler for better performance
    let timeoutId: NodeJS.Timeout;
    const handleScroll = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(toggleVisibility, 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [threshold]);

  const scrollToTop = () => {
    if (smooth) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo(0, 0);
    }
    
    // Analytics tracking
    if (window.gtag) {
      window.gtag('event', 'scroll_to_top', {
        event_category: 'navigation',
        event_label: 'back_to_top_button'
      });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 17 
          }}
          className="fixed bottom-6 right-6 z-50"
        >
          <button
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            className="group relative w-14 h-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-red-500/30"
            style={{ 
              background: designTokens.colors.gradients.victory,
              boxShadow: '0 8px 32px rgba(220, 38, 38, 0.3)'
            }}
          >
            {/* Progress ring */}
            <svg 
              className="absolute inset-0 w-full h-full -rotate-90 opacity-40"
              viewBox="0 0 56 56"
            >
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
              />
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="rgba(255,255,255,0.8)"
                strokeWidth="2"
                strokeDasharray={`${2 * Math.PI * 24}`}
                strokeDashoffset={`${2 * Math.PI * 24 * (1 - scrollProgress / 100)}`}
                className="transition-all duration-300"
              />
            </svg>
            
            {/* Arrow icon */}
            <div className="relative z-10 flex items-center justify-center w-full h-full">
              <ArrowUp 
                className="w-6 h-6 text-white transition-transform duration-300 group-hover:-translate-y-0.5"
                strokeWidth={2.5}
              />
            </div>
            
            {/* Pulse effect on hover */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ 
                background: designTokens.colors.gradients.victory,
                opacity: 0
              }}
              whileHover={{ 
                scale: [1, 1.2, 1],
                opacity: [0, 0.3, 0]
              }}
              transition={{ 
                duration: 0.6,
                ease: "easeOut"
              }}
            />
          </button>
          
          {/* Boxing glove tooltip */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 0 }}
            whileHover={{ opacity: 1, x: -8 }}
            className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-2 bg-black/90 text-white text-sm rounded-lg whitespace-nowrap pointer-events-none"
            style={{ backdropFilter: 'blur(8px)' }}
          >
            Back to top 🥊
            <div 
              className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-black/90"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;