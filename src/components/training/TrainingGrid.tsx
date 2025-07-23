/**
 * TrainingGrid Component - Display recent training sessions with media
 * Shows training progress with filtering and responsive grid layout
 */

import React, { useState, useMemo } from 'react';
import { TrainingSession, TrainingType, TrainingIntensity } from '../../types/boxing';
import { OptimizedImage } from '../common/OptimizedImage';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface TrainingGridProps {
  sessions: TrainingSession[];
  period?: 'week' | 'month' | 'year';
  showFilters?: boolean;
  onSessionClick?: (session: TrainingSession) => void;
  className?: string;
  title?: string;
}

const TrainingGrid: React.FC<TrainingGridProps> = ({
  sessions,
  period = 'month',
  showFilters = true,
  onSessionClick,
  className = '',
  title = 'Training Sessions'
}) => {
  const [selectedType, setSelectedType] = useState<TrainingType | 'all'>('all');
  const [selectedIntensity, setSelectedIntensity] = useState<TrainingIntensity | 'all'>('all');
  const [loadingSessions, setLoadingSessions] = useState<Record<string, boolean>>({});
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const trainingTypes: (TrainingType | 'all')[] = [
    'all', 'Boxing', 'Conditioning', 'Strength', 'Cardio', 'Sparring', 'Technique', 'Recovery'
  ];

  const intensityLevels: (TrainingIntensity | 'all')[] = [
    'all', 'Low', 'Medium', 'High', 'Extreme'
  ];

  const getIntensityColor = (intensity: TrainingIntensity) => {
    switch (intensity) {
      case 'Low':
        return 'bg-green-600 text-green-100';
      case 'Medium':
        return 'bg-yellow-600 text-yellow-100';
      case 'High':
        return 'bg-orange-600 text-orange-100';
      case 'Extreme':
        return 'bg-red-600 text-red-100';
      default:
        return 'bg-gray-600 text-gray-100';
    }
  };

  const getTypeIcon = (type: TrainingType) => {
    switch (type) {
      case 'Boxing':
        return '🥊';
      case 'Conditioning':
        return '💪';
      case 'Strength':
        return '🏋️';
      case 'Cardio':
        return '🏃';
      case 'Sparring':
        return '🤼';
      case 'Technique':
        return '🎯';
      case 'Recovery':
        return '🧘';
      default:
        return '📋';
    }
  };

  const filteredSessions = useMemo(() => {
    return sessions.filter(session => {
      const typeMatch = selectedType === 'all' || session.type === selectedType;
      const intensityMatch = selectedIntensity === 'all' || session.intensity === selectedIntensity;
      return typeMatch && intensityMatch;
    });
  }, [sessions, selectedType, selectedIntensity]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const handleSessionClick = (session: TrainingSession) => {
    if (onSessionClick) {
      setLoadingSessions(prev => ({ ...prev, [session.id]: true }));
      onSessionClick(session);
      // Reset loading state after a delay
      setTimeout(() => {
        setLoadingSessions(prev => ({ ...prev, [session.id]: false }));
      }, 1000);
    }
  };

  const handleImageError = (sessionId: string, mediaIndex?: number) => {
    const key = mediaIndex !== undefined ? `${sessionId}-${mediaIndex}` : sessionId;
    setImageErrors(prev => ({ ...prev, [key]: true }));
  };

  const SessionCard = ({ session }: { session: TrainingSession }) => (
    <div
      className={`
        bg-gradient-to-br from-gray-900 to-black border-2 border-gray-700 rounded-lg
        hover:border-red-600 transition-all duration-300 transform hover:scale-[1.02]
        ${onSessionClick ? 'cursor-pointer' : ''}
        relative overflow-hidden group
      `}
      onClick={() => handleSessionClick(session)}
      role={onSessionClick ? 'button' : undefined}
      tabIndex={onSessionClick ? 0 : undefined}
      aria-label={onSessionClick ? `View details for ${session.type} training session` : undefined}
    >
      {/* Loading Overlay */}
      {loadingSessions[session.id] && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
          <LoadingSpinner size="sm" />
        </div>
      )}

      {/* Media Section */}
      {session.media && session.media.length > 0 && (
        <div className="relative h-48 overflow-hidden">
          {session.media[0].type === 'image' && !imageErrors[`${session.id}-0`] ? (
            <OptimizedImage
              src={session.media[0].url}
              alt={session.media[0].caption || `${session.type} training session`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={() => handleImageError(session.id, 0)}
              loading="lazy"
            />
          ) : session.media[0].type === 'video' ? (
            <div className="w-full h-full bg-gradient-to-br from-red-900 to-black flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">🎥</div>
                <p className="text-white text-sm">Video Training</p>
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">{getTypeIcon(session.type)}</div>
                <p className="text-white text-sm">{session.type}</p>
              </div>
            </div>
          )}
          
          {/* Media Count Badge */}
          {session.media.length > 1 && (
            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
              +{session.media.length - 1} more
            </div>
          )}

          {/* Video Play Button Overlay */}
          {session.media[0].type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white text-2xl hover:bg-red-700 transition-colors">
                ▶
              </div>
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      {/* Content Section */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getTypeIcon(session.type)}</span>
            <h3 className="text-lg font-bold text-white">{session.type}</h3>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-bold ${getIntensityColor(session.intensity)}`}>
            {session.intensity}
          </div>
        </div>

        {/* Date and Duration */}
        <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
          <span>{formatDate(session.date)}</span>
          <span>{formatDuration(session.duration)}</span>
        </div>

        {/* Exercise Summary */}
        <div className="mb-3">
          <p className="text-xs text-gray-400 mb-1">Exercises ({session.exercises.length})</p>
          <div className="flex flex-wrap gap-1">
            {session.exercises.slice(0, 3).map((exercise, index) => (
              <span
                key={index}
                className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded"
              >
                {exercise.name}
              </span>
            ))}
            {session.exercises.length > 3 && (
              <span className="text-xs text-red-400">
                +{session.exercises.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Exercise Details */}
        <div className="space-y-2">
          {session.exercises.slice(0, 2).map((exercise, index) => (
            <div key={index} className="text-sm">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">{exercise.name}</span>
                <div className="text-xs text-gray-400">
                  {exercise.sets && `${exercise.sets} sets`}
                  {exercise.reps && ` × ${exercise.reps}`}
                  {exercise.duration && ` × ${exercise.duration}min`}
                  {exercise.weight && ` @ ${exercise.weight}lbs`}
                </div>
              </div>
              {exercise.notes && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{exercise.notes}</p>
              )}
            </div>
          ))}
        </div>

        {/* Session Notes */}
        {session.notes && (
          <div className="mt-4 p-3 bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
            <p className="text-sm text-gray-300 italic line-clamp-3">{session.notes}</p>
          </div>
        )}

        {/* Media Caption */}
        {session.media && session.media.length > 0 && session.media[0].caption && (
          <div className="mt-3 text-xs text-gray-400 italic">
            "{session.media[0].caption}"
          </div>
        )}
      </div>

      {/* Corner Accent */}
      <div className="absolute top-0 right-0 w-8 h-8">
        <div className="absolute top-0 right-0 w-0 h-0 border-l-8 border-b-8 border-l-transparent border-b-red-600/30" />
      </div>

      {/* Hover Overlay */}
      {onSessionClick && (
        <div className="absolute inset-0 bg-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white font-bold">View Details</span>
        </div>
      )}
    </div>
  );

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
        <div className="flex items-center space-x-6 text-sm text-gray-400">
          <span>Total Sessions: {filteredSessions.length}</span>
          <span>
            This {period}: {filteredSessions.filter(s => {
              const sessionDate = new Date(s.date);
              const now = new Date();
              const periodMs = period === 'week' ? 7 * 24 * 60 * 60 * 1000 : 
                              period === 'month' ? 30 * 24 * 60 * 60 * 1000 : 
                              365 * 24 * 60 * 60 * 1000;
              return now.getTime() - sessionDate.getTime() <= periodMs;
            }).length}
          </span>
        </div>
        <div className="w-24 h-1 bg-red-600 mt-4" />
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap gap-4">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Training Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as TrainingType | 'all')}
                className="bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {trainingTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : `${getTypeIcon(type as TrainingType)} ${type}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Intensity Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Intensity
              </label>
              <select
                value={selectedIntensity}
                onChange={(e) => setSelectedIntensity(e.target.value as TrainingIntensity | 'all')}
                className="bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {intensityLevels.map(intensity => (
                  <option key={intensity} value={intensity}>
                    {intensity === 'all' ? 'All Intensities' : intensity}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          {(selectedType !== 'all' || selectedIntensity !== 'all') && (
            <button
              onClick={() => {
                setSelectedType('all');
                setSelectedIntensity('all');
              }}
              className="text-red-400 hover:text-red-300 text-sm underline"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Sessions Grid */}
      {filteredSessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map(session => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🥊</div>
          <h3 className="text-xl font-bold text-white mb-2">No Training Sessions Found</h3>
          <p className="text-gray-400">
            {selectedType !== 'all' || selectedIntensity !== 'all' 
              ? 'Try adjusting your filters to see more results.'
              : 'No training sessions available for this period.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default TrainingGrid;