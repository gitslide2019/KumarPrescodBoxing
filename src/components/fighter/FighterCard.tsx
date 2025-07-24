/**
 * FighterCard Component - Display fighter profile with stats, record, and bio
 * Optimized for boxing websites with responsive design and accessibility
 */

import React from 'react';
import { Fighter } from '../../types/boxing';
import { OptimizedImage } from '../common/OptimizedImage';
import { designTokens } from '../../styles/design-tokens';

interface FighterCardProps {
  fighter: Fighter;
  size?: 'small' | 'medium' | 'large';
  showRecord?: boolean;
  showAchievements?: boolean;
  onClick?: () => void;
  className?: string;
  variant?: 'profile' | 'opponent' | 'minimal';
}

const FighterCard: React.FC<FighterCardProps> = ({
  fighter,
  size = 'medium',
  showRecord = true,
  showAchievements = true,
  onClick,
  className = '',
  variant = 'profile'
}) => {
  const sizeClasses = {
    small: 'w-64 h-80',
    medium: 'w-80 h-96',
    large: 'w-96 h-[28rem]'
  };

  const textSizeClasses = {
    small: {
      name: 'text-lg',
      nickname: 'text-sm',
      stats: 'text-xs',
      record: 'text-sm'
    },
    medium: {
      name: 'text-xl',
      nickname: 'text-base',
      stats: 'text-sm',
      record: 'text-base'
    },
    large: {
      name: 'text-2xl',
      nickname: 'text-lg',
      stats: 'text-base',
      record: 'text-lg'
    }
  };

  const formatRecord = (record: Fighter['record']) => {
    return `${record.wins}-${record.losses}-${record.draws}`;
  };

  const getKnockoutPercentage = (record: Fighter['record']) => {
    if (record.wins === 0) return 0;
    return Math.round((record.knockouts / record.wins) * 100);
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        ${className}
        relative overflow-hidden rounded-lg bg-gradient-to-b from-gray-900 to-black
        border-2 border-red-600 shadow-xl hover:shadow-2xl
        transform transition-all duration-300 hover:scale-105
        ${onClick ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500' : ''}
      `}
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      aria-label={onClick ? `View ${fighter.name}'s profile` : undefined}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <OptimizedImage
          src={fighter.profileImage}
          alt={`${fighter.name} - Professional Boxer`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-4 text-white">
        {/* Top Section - Name & Nickname */}
        <div className="text-center">
          <h3 className={`${textSizeClasses[size].name} font-bold text-white mb-1`}>
            {fighter.name}
          </h3>
          {fighter.nickname && (
            <p className={`${textSizeClasses[size].nickname} font-medium`} style={{ color: designTokens.colors.primary.championship_gold }}>
              "{fighter.nickname}"
            </p>
          )}
          <p className={`${textSizeClasses[size].stats} text-gray-300 mt-1`}>
            {fighter.weightClass}
          </p>
        </div>

        {/* Middle Section - Physical Stats */}
        <div className="flex-grow flex items-center justify-center">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className={`${textSizeClasses[size].stats} text-gray-400`}>Age</p>
              <p className={`${textSizeClasses[size].record} font-bold text-white`}>
                {fighter.age}
              </p>
            </div>
            <div>
              <p className={`${textSizeClasses[size].stats} text-gray-400`}>Height</p>
              <p className={`${textSizeClasses[size].record} font-bold text-white`}>
                {fighter.height}
              </p>
            </div>
            <div>
              <p className={`${textSizeClasses[size].stats} text-gray-400`}>Weight</p>
              <p className={`${textSizeClasses[size].record} font-bold text-white`}>
                {fighter.weight}
              </p>
            </div>
            <div>
              <p className={`${textSizeClasses[size].stats} text-gray-400`}>Reach</p>
              <p className={`${textSizeClasses[size].record} font-bold text-white`}>
                {fighter.reach}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section - Record & Stats */}
        {showRecord && (
          <div className="text-center space-y-2">
            <div className="bg-black/60 rounded-lg p-3 backdrop-blur-sm">
              <p className={`${textSizeClasses[size].stats} text-gray-400 mb-1`}>Professional Record</p>
              <p className={`${textSizeClasses[size].record} font-bold`} style={{ color: designTokens.colors.primary.boxing_red }}>
                {formatRecord(fighter.record)}
              </p>
              <div className="flex justify-center space-x-4 mt-2">
                <div>
                  <p className="text-xs text-gray-400">KOs</p>
                  <p className="text-sm font-bold" style={{ color: designTokens.colors.primary.championship_gold }}>{fighter.record.knockouts}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">KO%</p>
                  <p className="text-sm font-bold" style={{ color: designTokens.colors.primary.championship_gold }}>
                    {getKnockoutPercentage(fighter.record)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Stance & Hometown */}
            <div className="flex justify-between text-xs text-gray-400">
              <span>{fighter.stance}</span>
              <span>{fighter.hometown}</span>
            </div>
          </div>
        )}

        {/* Achievements */}
        {showAchievements && fighter.achievements.length > 0 && size !== 'small' && (
          <div className="mt-2">
            <p className="text-xs text-gray-400 mb-1">Latest Achievement</p>
            <p className="text-xs font-medium line-clamp-2" style={{ color: designTokens.colors.primary.championship_gold }}>
              {fighter.achievements[0]?.title}
            </p>
          </div>
        )}
      </div>

      {/* Corner Accent */}
      <div className="absolute top-0 right-0 w-16 h-16">
        <div className="absolute top-0 right-0 w-0 h-0 border-l-16 border-b-16 border-l-transparent" style={{ borderBottomColor: designTokens.colors.primary.boxing_red }} />
        <div className="absolute top-1 right-1 w-0 h-0 border-l-14 border-b-14 border-l-transparent border-b-black" />
      </div>

      {/* Hover Effect Overlay */}
      {onClick && (
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center" style={{ backgroundColor: `${designTokens.colors.primary.boxing_red}10` }}>
          <span className="text-white font-bold text-lg">View Profile</span>
        </div>
      )}
    </div>
  );
};

export default FighterCard;