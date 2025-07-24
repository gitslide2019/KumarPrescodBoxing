import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'fight' | 'champion' | 'glass' | 'outline' | 'elevated';
  hover?: boolean;
  clickable?: boolean;
  className?: string;
  children: React.ReactNode;
}

export interface CardHeaderProps extends HTMLMotionProps<'div'> {
  className?: string;
  children: React.ReactNode;
}

export interface CardBodyProps extends HTMLMotionProps<'div'> {
  className?: string;
  children: React.ReactNode;
}

export interface CardFooterProps extends HTMLMotionProps<'div'> {
  className?: string;
  children: React.ReactNode;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ 
    variant = 'default', 
    hover = true, 
    clickable = false,
    className = '', 
    children, 
    ...props 
  }, ref) => {
    const getVariantClasses = () => {
      const baseClasses = 'card transition-all duration-300';
      
      switch (variant) {
        case 'fight':
          return `${baseClasses} fight-card`;
        case 'champion':
          return `${baseClasses} champion-card animate-champion-glow`;
        case 'glass':
          return `${baseClasses} bg-white/10 backdrop-blur-md border-white/20`;
        case 'outline':
          return `${baseClasses} bg-transparent border-2 border-neutral-300 hover:border-primary-500`;
        case 'elevated':
          return `${baseClasses} shadow-lg hover:shadow-xl`;
        default:
          return baseClasses;
      }
    };

    const motionProps = {
      className: `${getVariantClasses()} ${className}`,
      whileHover: hover ? {
        y: clickable ? -8 : -4,
        scale: clickable ? 1.02 : 1.01,
        transition: { duration: 0.3, ease: 'easeOut' }
      } : undefined,
      whileTap: clickable ? {
        scale: 0.98,
        y: -2,
        transition: { duration: 0.1 }
      } : undefined,
      ...props
    };

    return (
      <motion.div ref={ref} {...motionProps}>
        {children}
      </motion.div>
    );
  }
);

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = '', children, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={`card-header ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
);

const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className = '', children, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={`card-body ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
);

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className = '', children, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={`card-footer ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
);

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardBody.displayName = 'CardBody';
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardBody, CardFooter };