import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

interface CountdownTimerProps {
  targetDate: string | Date;
  onComplete?: () => void;
  showLabels?: boolean;
  showSeconds?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'glass' | 'neuro' | 'minimal';
  className?: string;
}

interface TimeUnit {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  onComplete,
  showLabels = true,
  showSeconds = true,
  size = 'md',
  variant = 'default',
  className = ''
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeUnit>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isComplete, setIsComplete] = useState(false);
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if (!isComplete) {
          setIsComplete(true);
          onComplete?.();
        }
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete, isComplete]);

  const sizeClasses = {
    sm: 'text-lg md:text-xl',
    md: 'text-2xl md:text-3xl',
    lg: 'text-3xl md:text-4xl lg:text-5xl',
    xl: 'text-4xl md:text-5xl lg:text-6xl xl:text-7xl'
  };

  const containerSizeClasses = {
    sm: 'w-12 h-12 md:w-16 md:h-16',
    md: 'w-16 h-16 md:w-20 md:h-20',
    lg: 'w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28',
    xl: 'w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36'
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'glass':
        return 'bg-white/10 backdrop-blur-md border border-white/20 shadow-xl';
      case 'neuro':
        return 'bg-gray-100 shadow-[inset_6px_6px_12px_#d1d9e6,inset_-6px_-6px_12px_#ffffff] border-none';
      case 'minimal':
        return 'bg-transparent border-2 border-primary-600';
      default:
        return 'bg-gradient-to-br from-primary-600 to-primary-700 shadow-lg';
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'glass':
        return 'text-white';
      case 'neuro':
        return 'text-gray-800';
      case 'minimal':
        return 'text-primary-600';
      default:
        return 'text-white';
    }
  };

  const units = [
    { value: timeLeft.days, label: 'Days', key: 'days' },
    { value: timeLeft.hours, label: 'Hours', key: 'hours' },
    { value: timeLeft.minutes, label: 'Minutes', key: 'minutes' },
    ...(showSeconds ? [{ value: timeLeft.seconds, label: 'Seconds', key: 'seconds' }] : [])
  ];

  const flipVariants = {
    initial: { rotateX: 0 },
    flip: { rotateX: 180 },
    exit: { rotateX: 0 }
  };

  return (
    <div ref={ref} className={`flex items-center justify-center space-x-2 md:space-x-4 ${className}`}>
      <AnimatePresence>
        {isVisible && !isComplete && units.map((unit, index) => (
          <motion.div
            key={unit.key}
            initial={{ opacity: 0, scale: 0.5, rotateY: -90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ 
              delay: index * 0.1,
              duration: 0.6,
              type: 'spring',
              bounce: 0.4
            }}
            className="text-center"
          >
            <div className={`
              ${containerSizeClasses[size]} 
              ${getVariantClasses()}
              rounded-xl flex items-center justify-center relative overflow-hidden
              transform transition-all duration-300 hover:scale-110 hover:shadow-xl
            `}>
              {/* Animated background pulse */}
              <motion.div
                className="absolute inset-0 bg-white/20 rounded-xl"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              
              {/* Number with flip animation */}
              <AnimatePresence mode="wait">
                <motion.span
                  key={unit.value}
                  variants={flipVariants}
                  initial="initial"
                  animate="flip"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className={`
                    ${sizeClasses[size]} 
                    ${getTextColor()}
                    font-bold relative z-10 font-mono
                  `}
                  style={{
                    transformStyle: 'preserve-3d',
                    textShadow: variant === 'default' ? '0 2px 4px rgba(0,0,0,0.3)' : 'none'
                  }}
                >
                  {unit.value.toString().padStart(2, '0')}
                </motion.span>
              </AnimatePresence>

              {/* Glow effect */}
              {variant === 'default' && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary-400/30 to-transparent rounded-xl"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
            </div>
            
            {showLabels && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index * 0.1) + 0.3 }}
                className={`
                  mt-2 text-xs md:text-sm font-medium
                  ${variant === 'minimal' ? 'text-primary-600' : 'text-gray-600'}
                `}
              >
                {unit.label}
              </motion.p>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {isComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            className="text-4xl md:text-6xl font-bold text-primary-600 mb-2"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            🥊
          </motion.div>
          <motion.h3
            className="text-xl md:text-2xl font-bold text-primary-600"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Fight Night!
          </motion.h3>
        </motion.div>
      )}
    </div>
  );
};

export default CountdownTimer;