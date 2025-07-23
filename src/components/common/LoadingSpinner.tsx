import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'dots' | 'pulse' | 'bars' | 'boxing';
  color?: 'primary' | 'secondary' | 'white' | 'gold';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  color = 'primary',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'border-primary-600',
    secondary: 'border-secondary-600',
    white: 'border-white',
    gold: 'border-gold-500'
  };

  const dotColorClasses = {
    primary: 'bg-primary-600',
    secondary: 'bg-secondary-600',
    white: 'bg-white',
    gold: 'bg-gold-500'
  };

  if (variant === 'dots') {
    return (
      <div className={`flex items-center justify-center space-x-2 ${className}`}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`w-3 h-3 rounded-full ${dotColorClasses[color]}`}
            animate={{
              y: [0, -10, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <motion.div
        className={`${sizeClasses[size]} rounded-full ${dotColorClasses[color]} ${className}`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    );
  }

  if (variant === 'bars') {
    return (
      <div className={`flex items-end justify-center space-x-1 ${className}`}>
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className={`w-1 ${dotColorClasses[color]}`}
            animate={{
              height: [10, 20, 10],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.1
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'boxing') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <motion.div
          className="text-4xl"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          🥊
        </motion.div>
      </div>
    );
  }

  // Default spinner
  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className={`
        w-full h-full border-4 border-t-4 rounded-full animate-spin
        ${colorClasses[color]} border-opacity-20
      `} 
      style={{
        borderTopColor: color === 'primary' ? '#dc2626' : 
                       color === 'secondary' ? '#475569' :
                       color === 'white' ? '#ffffff' : '#f59e0b'
      }} />
    </div>
  );
};

export default LoadingSpinner;

// Skeleton loading component
export const SkeletonLoader: React.FC<{
  className?: string;
  lines?: number;
  avatar?: boolean;
}> = ({ className = '', lines = 3, avatar = false }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {avatar && (
        <div className="w-12 h-12 bg-gray-300 rounded-full mb-4"></div>
      )}
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`h-4 bg-gray-300 rounded ${
              i === lines - 1 ? 'w-3/4' : 'w-full'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Full page loading overlay
export const LoadingOverlay: React.FC<{
  isLoading: boolean;
  message?: string;
}> = ({ isLoading, message = 'Loading...' }) => {
  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center"
    >
      <div className="bg-white rounded-xl p-8 flex flex-col items-center">
        <LoadingSpinner size="lg" variant="boxing" />
        <p className="mt-4 text-gray-700 font-medium">{message}</p>
      </div>
    </motion.div>
  );
};