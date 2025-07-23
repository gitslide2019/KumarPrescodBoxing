/**
 * FightRecord Component - Show fight history with opponent details and results
 * Displays comprehensive fight information with boxing-themed styling
 */

import React, { useState } from 'react';
import { Fight } from '../../types/boxing';
import { OptimizedImage } from '../common/OptimizedImage';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface FightRecordProps {
  fights: Fight[];
  title?: string;
  showOpponentDetails?: boolean;
  showVenue?: boolean;
  layout?: 'list' | 'grid' | 'timeline';
  className?: string;
  onFightClick?: (fight: Fight) => void;
}

const FightRecord: React.FC<FightRecordProps> = ({
  fights,
  title = 'Fight Record',
  showOpponentDetails = true,
  showVenue = true,
  layout = 'list',
  className = '',
  onFightClick
}) => {
  const [loadingFights, setLoadingFights] = useState<Record<string, boolean>>({});
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const getResultColor = (outcome: string) => {
    switch (outcome.toLowerCase()) {
      case 'win':
        return 'text-green-400 bg-green-900/20 border-green-400';
      case 'loss':
        return 'text-red-400 bg-red-900/20 border-red-400';
      case 'draw':
        return 'text-yellow-400 bg-yellow-900/20 border-yellow-400';
      default:
        return 'text-gray-400 bg-gray-900/20 border-gray-400';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method.toLowerCase()) {
      case 'ko':
        return 'text-red-500 font-bold';
      case 'tko':
        return 'text-orange-400 font-bold';
      case 'submission':
        return 'text-purple-400 font-bold';
      default:
        return 'text-blue-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (round?: number, time?: string) => {
    if (!round) return 'Decision';
    if (!time) return `Round ${round}`;
    return `R${round} ${time}`;
  };

  const handleFightClick = (fight: Fight) => {
    if (onFightClick) {
      setLoadingFights(prev => ({ ...prev, [fight.id]: true }));
      onFightClick(fight);
      // Reset loading state after a delay
      setTimeout(() => {
        setLoadingFights(prev => ({ ...prev, [fight.id]: false }));
      }, 1000);
    }
  };

  const handleImageError = (fightId: string) => {
    setImageErrors(prev => ({ ...prev, [fightId]: true }));
  };

  const FightCard = ({ fight, index }: { fight: Fight; index: number }) => (
    <div
      className={`
        bg-gradient-to-r from-gray-900 to-black border-2 border-gray-700 rounded-lg
        hover:border-red-600 transition-all duration-300 transform hover:scale-[1.02]
        ${onFightClick ? 'cursor-pointer' : ''}
        relative overflow-hidden
      `}
      onClick={() => handleFightClick(fight)}
      role={onFightClick ? 'button' : undefined}
      tabIndex={onFightClick ? 0 : undefined}
      aria-label={onFightClick ? `View details for fight against ${fight.opponent.name}` : undefined}
    >
      {/* Loading Overlay */}
      {loadingFights[fight.id] && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
          <LoadingSpinner size="sm" />
        </div>
      )}

      <div className="p-6">
        {/* Fight Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-white">#{fights.length - index}</div>
            <div>
              <h3 className="text-lg font-bold text-white">{fight.title || 'Professional Fight'}</h3>
              <p className="text-sm text-gray-400">{formatDate(fight.date)}</p>
            </div>
          </div>

          {/* Result Badge */}
          <div className={`px-3 py-1 rounded-full border text-sm font-bold ${getResultColor(fight.result.outcome)}`}>
            {fight.result.outcome}
          </div>
        </div>

        {/* Opponent Section */}
        <div className="flex items-center space-x-4 mb-4">
          {/* Opponent Image */}
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-600 flex-shrink-0">
            {!imageErrors[fight.id] ? (
              <OptimizedImage
                src={fight.opponent.profileImage}
                alt={`${fight.opponent.name} profile`}
                className="w-full h-full object-cover"
                onError={() => handleImageError(fight.id)}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <span className="text-gray-400 text-xs font-bold">
                  {fight.opponent.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            )}
          </div>

          {/* Opponent Details */}
          <div className="flex-grow">
            <h4 className="text-lg font-bold text-white">{fight.opponent.name}</h4>
            {fight.opponent.nickname && (
              <p className="text-sm text-red-400">"{fight.opponent.nickname}"</p>
            )}
            {showOpponentDetails && (
              <div className="flex space-x-4 text-xs text-gray-400 mt-1">
                <span>{fight.opponent.age} years</span>
                <span>{fight.opponent.height}</span>
                <span>{fight.opponent.reach} reach</span>
                <span>{fight.opponent.stance}</span>
              </div>
            )}
          </div>

          {/* Opponent Record */}
          <div className="text-right">
            <p className="text-sm text-gray-400">Record</p>
            <p className="text-white font-bold">
              {fight.opponent.record.wins}-{fight.opponent.record.losses}-{fight.opponent.record.draws}
            </p>
          </div>
        </div>

        {/* Fight Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-gray-700">
          <div className="text-center">
            <p className="text-xs text-gray-400">Method</p>
            <p className={`font-bold ${getMethodColor(fight.method)}`}>{fight.method}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400">Time</p>
            <p className="text-white font-bold">{formatTime(fight.round, fight.time)}</p>
          </div>
          {showVenue && (
            <>
              <div className="text-center">
                <p className="text-xs text-gray-400">Venue</p>
                <p className="text-white font-bold text-sm">{fight.venue.name}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Location</p>
                <p className="text-white font-bold text-sm">
                  {fight.venue.city}, {fight.venue.state}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Fight Details */}
        {fight.result.details && (
          <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
            <p className="text-sm text-gray-300">{fight.result.details}</p>
          </div>
        )}

        {/* Fight Notes */}
        {fight.notes && (
          <div className="mt-3 p-3 bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
            <p className="text-sm text-gray-300 italic">{fight.notes}</p>
          </div>
        )}

        {/* Highlights */}
        {fight.highlights && fight.highlights.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-400">
              {fight.highlights.length} highlight{fight.highlights.length > 1 ? 's' : ''} available
            </span>
            <button
              className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                // Handle highlights view
              }}
            >
              View Highlights →
            </button>
          </div>
        )}
      </div>

      {/* Corner Accent */}
      <div className="absolute top-0 right-0 w-12 h-12">
        <div className="absolute top-0 right-0 w-0 h-0 border-l-12 border-b-12 border-l-transparent border-b-red-600/20" />
      </div>
    </div>
  );

  const TimelineFightCard = ({ fight, index }: { fight: Fight; index: number }) => (
    <div className="flex items-center space-x-6 relative">
      {/* Timeline Line */}
      <div className="flex flex-col items-center">
        <div className={`w-4 h-4 rounded-full border-2 ${getResultColor(fight.result.outcome).split(' ')[2]} bg-black`} />
        {index < fights.length - 1 && <div className="w-0.5 h-16 bg-gray-600 mt-2" />}
      </div>

      {/* Fight Content */}
      <div className="flex-grow">
        <FightCard fight={fight} index={index} />
      </div>
    </div>
  );

  if (!fights || fights.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-gray-400 text-lg">No fights recorded yet</p>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
        <div className="flex items-center space-x-6 text-sm text-gray-400">
          <span>Total Fights: {fights.length}</span>
          <span>
            Wins: {fights.filter(f => f.result.outcome === 'Win').length}
          </span>
          <span>
            KOs: {fights.filter(f => f.method === 'KO').length}
          </span>
        </div>
        <div className="w-24 h-1 bg-red-600 mt-4" />
      </div>

      {/* Fights Display */}
      <div className={`
        ${layout === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : ''}
        ${layout === 'list' ? 'space-y-6' : ''}
        ${layout === 'timeline' ? 'space-y-0' : ''}
      `}>
        {fights.map((fight, index) => (
          <div key={fight.id}>
            {layout === 'timeline' ? (
              <TimelineFightCard fight={fight} index={index} />
            ) : (
              <FightCard fight={fight} index={index} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FightRecord;