/**
 * StatsWidget Component - Performance metrics and statistics display
 * Shows boxing statistics with animated counters and visual indicators
 */

import React, { useState, useEffect, useRef } from 'react';
import { FightRecord } from '../../types/boxing';

interface StatItem {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: string;
  color?: 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'gray';
  format?: 'number' | 'percentage' | 'time' | 'currency' | 'text';
  showTrend?: boolean;
}

interface StatsWidgetProps {
  title?: string;
  stats: StatItem[];
  record?: FightRecord;
  layout?: 'grid' | 'horizontal' | 'vertical';
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
  showComparison?: boolean;
  className?: string;
  variant?: 'fighter' | 'performance' | 'training' | 'financial';
}

const StatsWidget: React.FC<StatsWidgetProps> = ({
  title = 'Statistics',
  stats,
  record,
  layout = 'grid',
  size = 'medium',
  animated = true,
  showComparison = true,
  className = '',
  variant = 'fighter'
}) => {
  const [animatedValues, setAnimatedValues] = useState<Record<number, number>>({});
  const [isVisible, setIsVisible] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  const colorClasses = {
    red: 'text-red-400 bg-red-900/20 border-red-400/30',
    green: 'text-green-400 bg-green-900/20 border-green-400/30',
    blue: 'text-blue-400 bg-blue-900/20 border-blue-400/30',
    yellow: 'text-yellow-400 bg-yellow-900/20 border-yellow-400/30',
    purple: 'text-purple-400 bg-purple-900/20 border-purple-400/30',
    gray: 'text-gray-400 bg-gray-900/20 border-gray-400/30'
  };

  const sizeClasses = {
    small: {
      container: 'p-4',
      title: 'text-lg',
      value: 'text-xl',
      label: 'text-xs',
      icon: 'text-lg'
    },
    medium: {
      container: 'p-6',
      title: 'text-xl',
      value: 'text-3xl',
      label: 'text-sm',
      icon: 'text-2xl'
    },
    large: {
      container: 'p-8',
      title: 'text-2xl',
      value: 'text-4xl',
      label: 'text-base',
      icon: 'text-3xl'
    }
  };

  const layoutClasses = {
    grid: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4',
    horizontal: 'flex flex-wrap gap-4',
    vertical: 'space-y-4'
  };

  // Intersection Observer for animation trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (widgetRef.current) {
      observer.observe(widgetRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  // Animate numeric values
  useEffect(() => {
    if (isVisible && animated) {
      stats.forEach((stat, index) => {
        if (typeof stat.value === 'number') {
          let start = 0;
          const end = stat.value;
          const duration = 2000; // 2 seconds
          const increment = end / (duration / 16); // 60fps

          const animate = () => {
            start += increment;
            if (start < end) {
              setAnimatedValues(prev => ({ ...prev, [index]: Math.floor(start) }));
              requestAnimationFrame(animate);
            } else {
              setAnimatedValues(prev => ({ ...prev, [index]: end }));
            }
          };

          // Delay animation start based on index
          setTimeout(() => {
            animate();
          }, index * 200);
        }
      });
    }
  }, [isVisible, animated, stats]);

  const formatValue = (value: string | number, format: StatItem['format'] = 'number', index?: number) => {
    if (typeof value === 'string') return value;
    
    const displayValue = animated && index !== undefined ? (animatedValues[index] ?? 0) : value;
    
    switch (format) {
      case 'percentage':
        return `${displayValue}%`;
      case 'time':
        return `${Math.floor(displayValue / 60)}:${(displayValue % 60).toString().padStart(2, '0')}`;
      case 'currency':
        return `$${displayValue.toLocaleString()}`;
      default:
        return displayValue.toLocaleString();
    }
  };

  const getTrendIcon = (change?: number) => {
    if (!change) return null;
    if (change > 0) return '📈';
    if (change < 0) return '📉';
    return '➡️';
  };

  const getTrendColor = (change?: number) => {
    if (!change) return 'text-gray-400';
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  const getVariantColor = (variant: string) => {
    switch (variant) {
      case 'fighter':
        return 'border-red-600';
      case 'performance':
        return 'border-blue-600';
      case 'training':
        return 'border-green-600';
      case 'financial':
        return 'border-yellow-600';
      default:
        return 'border-gray-600';
    }
  };

  const StatCard = ({ stat, index }: { stat: StatItem; index: number }) => (
    <div
      className={`
        bg-gradient-to-br from-gray-900 to-black border-2 border-gray-700 rounded-lg
        hover:border-opacity-100 transition-all duration-300 transform hover:scale-105
        ${colorClasses[stat.color || 'gray']}
        ${sizeClasses[size].container}
        relative overflow-hidden group
      `}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 text-6xl opacity-20">
          {stat.icon || '📊'}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Icon and Label */}
        <div className="flex items-center justify-between mb-2">
          {stat.icon && (
            <span className={`${sizeClasses[size].icon}`}>{stat.icon}</span>
          )}
          <div className="flex-grow text-right">
            <p className={`${sizeClasses[size].label} text-gray-400 font-medium`}>
              {stat.label}
            </p>
          </div>
        </div>

        {/* Value */}
        <div className="mb-2">
          <p className={`${sizeClasses[size].value} font-bold`}>
            {formatValue(stat.value, stat.format, index)}
          </p>
        </div>

        {/* Trend and Change */}
        {stat.showTrend && stat.change !== undefined && (
          <div className={`flex items-center space-x-2 text-sm ${getTrendColor(stat.change)}`}>
            <span>{getTrendIcon(stat.change)}</span>
            <span className="font-medium">
              {stat.change > 0 ? '+' : ''}{stat.change}
              {stat.format === 'percentage' ? '%' : ''}
            </span>
            {stat.changeLabel && (
              <span className="text-gray-500 text-xs">{stat.changeLabel}</span>
            )}
          </div>
        )}
      </div>

      {/* Corner Accent */}
      <div className="absolute top-0 right-0 w-8 h-8">
        <div className="absolute top-0 right-0 w-0 h-0 border-l-8 border-b-8 border-l-transparent border-b-current opacity-20" />
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-current opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
    </div>
  );

  // Calculate record-based stats if record is provided
  const recordStats: StatItem[] = record ? [
    {
      label: 'Total Fights',
      value: record.wins + record.losses + record.draws,
      icon: '🥊',
      color: 'gray',
      format: 'number'
    },
    {
      label: 'Wins',
      value: record.wins,
      icon: '🏆',
      color: 'green',
      format: 'number'
    },
    {
      label: 'Knockouts',
      value: record.knockouts,
      icon: '💥',
      color: 'red',
      format: 'number'
    },
    {
      label: 'KO Percentage',
      value: record.wins > 0 ? Math.round((record.knockouts / record.wins) * 100) : 0,
      icon: '⚡',
      color: 'yellow',
      format: 'percentage'
    }
  ] : [];

  const allStats = [...recordStats, ...stats];

  return (
    <div ref={widgetRef} className={`w-full ${className}`}>
      {/* Header */}
      <div className={`mb-6 pb-4 border-b-2 ${getVariantColor(variant)}`}>
        <h2 className={`${sizeClasses[size].title} font-bold text-white mb-2`}>
          {title}
        </h2>
        {record && (
          <div className="text-sm text-gray-400">
            Professional Record: {record.wins}-{record.losses}-{record.draws}
            {record.knockouts > 0 && ` (${record.knockouts} KOs)`}
          </div>
        )}
      </div>

      {/* Stats Grid/Layout */}
      <div className={layoutClasses[layout]}>
        {allStats.map((stat, index) => (
          <StatCard key={index} stat={stat} index={index} />
        ))}
      </div>

      {/* Comparison Section */}
      {showComparison && variant === 'fighter' && record && (
        <div className="mt-8 p-6 bg-gray-900/50 rounded-lg border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">Performance Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Win Rate */}
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {record.wins + record.losses + record.draws > 0 
                  ? Math.round((record.wins / (record.wins + record.losses + record.draws)) * 100)
                  : 0}%
              </div>
              <p className="text-sm text-gray-400">Win Rate</p>
            </div>

            {/* Finish Rate */}
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400 mb-1">
                {record.wins > 0 ? Math.round(((record.knockouts + record.technicalKnockouts) / record.wins) * 100) : 0}%
              </div>
              <p className="text-sm text-gray-400">Finish Rate</p>
            </div>

            {/* Activity Level */}
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {new Date().getFullYear() - 2023} {/* Assuming career started in 2024 */}
              </div>
              <p className="text-sm text-gray-400">Years Pro</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Note */}
      <div className="mt-6 text-xs text-gray-500 text-center">
        {animated && !isVisible && 'Statistics will animate when visible'}
        {animated && isVisible && 'Live statistics updated in real-time'}
        {!animated && 'Static statistics display'}
      </div>
    </div>
  );
};

export default StatsWidget;