import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  variant?: 'primary' | 'champion' | 'outline' | 'ghost' | 'knockout' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  href?: string;
  as?: 'button' | 'a';
}

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    children,
    leftIcon,
    rightIcon,
    href,
    as,
    className = '',
    onClick,
    ...props
  }, ref) => {
    const Component = motion[as || (href ? 'a' : 'button')];
    
    const baseClasses = [
      'btn',
      `btn-${size}`,
      `btn-${variant}`,
      fullWidth && 'w-full',
      (disabled || loading) && 'opacity-60 cursor-not-allowed pointer-events-none',
      className
    ].filter(Boolean).join(' ');

    const handleClick = (e: React.MouseEvent) => {
      if (disabled || loading) {
        e.preventDefault();
        return;
      }
      onClick?.(e as any);
    };

    const content = (
      <>
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            {leftIcon && <span className="btn-icon">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="btn-icon">{rightIcon}</span>}
          </>
        )}
      </>
    );

    const motionProps = {
      whileHover: !disabled && !loading ? { 
        scale: size === 'xl' ? 1.02 : 1.05,
        y: -2,
        transition: { duration: 0.2, ease: 'easeOut' }
      } : undefined,
      whileTap: !disabled && !loading ? { 
        scale: 0.98,
        y: 0,
        transition: { duration: 0.1 }
      } : undefined,
      className: baseClasses,
      onClick: handleClick,
      disabled: disabled || loading,
      ...props
    };

    if (href && !disabled && !loading) {
      return (
        <Component
          {...motionProps}
          href={href}
          ref={ref as any}
        >
          {content}
        </Component>
      );
    }

    return (
      <Component
        {...motionProps}
        type="button"
        ref={ref as any}
      >
        {content}
      </Component>
    );
  }
);

Button.displayName = 'Button';

export default Button;