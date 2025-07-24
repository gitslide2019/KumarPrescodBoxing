import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Zap, 
  Target, 
  Clock, 
  TrendingUp, 
  Calendar,
  BarChart3,
  Flame,
  Timer,
  Award
} from 'lucide-react';
import { TrainingSession, TrainingIntensity, TrainingType } from '../../types/boxing';
import { designTokens } from '../../styles/design-tokens';

interface TrainingStatsWidgetProps {
  sessions: TrainingSession[];
  period?: 'week' | 'month';
  className?: string;
  size?: 'compact' | 'full';
}

interface TrainingMetrics {
  totalSessions: number;
  totalDuration: number;
  averageIntensity: number;
  intensityDistribution: Record<TrainingIntensity, number>;
  typeDistribution: Record<TrainingType, number>;
  streak: number;
  weeklyProgress: number;
}

interface IntensityConfig {
  color: string;
  bgColor: string;
  icon: React.ReactNode;
  label: string;
}

const TrainingStatsWidget: React.FC<TrainingStatsWidgetProps> = ({
  sessions,
  period = 'week',
  className = '',
  size = 'full'
}) => {
  const [viewPeriod, setViewPeriod] = useState<'week' | 'month'>(period);
  const [animationKey, setAnimationKey] = useState(0);

  // Calculate training metrics
  const calculateMetrics = (): TrainingMetrics => {
    const now = new Date();
    const periodStart = new Date();
    
    if (viewPeriod === 'week') {
      periodStart.setDate(now.getDate() - 7);
    } else {
      periodStart.setMonth(now.getMonth() - 1);
    }

    const filteredSessions = sessions.filter(session => 
      new Date(session.date) >= periodStart
    );

    const totalSessions = filteredSessions.length;
    const totalDuration = filteredSessions.reduce((sum, session) => sum + session.duration, 0);
    
    // Calculate intensity distribution
    const intensityDistribution: Record<TrainingIntensity, number> = {
      'Low': 0,
      'Medium': 0,
      'High': 0,
      'Extreme': 0
    };

    // Calculate type distribution
    const typeDistribution: Record<TrainingType, number> = {
      'Boxing': 0,
      'Conditioning': 0,
      'Strength': 0,
      'Cardio': 0,
      'Sparring': 0,
      'Technique': 0,
      'Recovery': 0
    };

    filteredSessions.forEach(session => {
      intensityDistribution[session.intensity]++;
      typeDistribution[session.type]++;
    });

    // Calculate average intensity (weighted)
    const intensityWeights = { 'Low': 1, 'Medium': 2, 'High': 3, 'Extreme': 4 };
    const weightedIntensity = filteredSessions.reduce((sum, session) => 
      sum + intensityWeights[session.intensity], 0
    );
    const averageIntensity = totalSessions > 0 ? weightedIntensity / totalSessions : 0;

    // Calculate training streak
    const sortedSessions = [...sessions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const session of sortedSessions) {
      const sessionDate = new Date(session.date);
      sessionDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }

    // Calculate weekly progress (comparing current week to previous week)
    const thisWeekStart = new Date();
    thisWeekStart.setDate(now.getDate() - 7);
    const lastWeekStart = new Date();
    lastWeekStart.setDate(now.getDate() - 14);

    const thisWeekSessions = sessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= thisWeekStart;
    });

    const lastWeekSessions = sessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= lastWeekStart && sessionDate < thisWeekStart;
    });

    const thisWeekDuration = thisWeekSessions.reduce((sum, session) => sum + session.duration, 0);
    const lastWeekDuration = lastWeekSessions.reduce((sum, session) => sum + session.duration, 0);
    
    const weeklyProgress = lastWeekDuration > 0 
      ? ((thisWeekDuration - lastWeekDuration) / lastWeekDuration) * 100 
      : 0;

    return {
      totalSessions,
      totalDuration,
      averageIntensity,
      intensityDistribution,
      typeDistribution,
      streak,
      weeklyProgress
    };
  };

  const metrics = calculateMetrics();

  const intensityConfigs: Record<TrainingIntensity, IntensityConfig> = {
    'Low': {
      color: designTokens.boxing.intensity.low,
      bgColor: `${designTokens.boxing.intensity.low}20`,
      icon: <Activity className="w-4 h-4" />,
      label: 'Recovery'
    },
    'Medium': {
      color: designTokens.boxing.intensity.medium,
      bgColor: `${designTokens.boxing.intensity.medium}20`,
      icon: <Target className="w-4 h-4" />,
      label: 'Moderate'
    },
    'High': {
      color: designTokens.boxing.intensity.high,
      bgColor: `${designTokens.boxing.intensity.high}20`,
      icon: <Zap className="w-4 h-4" />,
      label: 'Intense'
    },
    'Extreme': {
      color: designTokens.boxing.intensity.extreme,
      bgColor: `${designTokens.boxing.intensity.extreme}20`,
      icon: <Flame className="w-4 h-4" />,
      label: 'Extreme'
    }
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getIntensityLevel = (average: number): TrainingIntensity => {
    if (average >= 3.5) return 'Extreme';
    if (average >= 2.5) return 'High';
    if (average >= 1.5) return 'Medium';
    return 'Low';
  };

  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [viewPeriod]);

  const containerClass = size === 'compact' 
    ? 'w-full max-w-md' 
    : 'w-full max-w-2xl';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        ${containerClass}
        bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900
        rounded-3xl border border-neutral-700/50
        shadow-2xl hover:shadow-boxing
        overflow-hidden
        ${className}
      `}
    >
      {/* Header */}
      <div className="p-6 pb-4 border-b border-neutral-700/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-championship_gold" />
              Training Stats
            </h3>
            <p className="text-neutral-400 text-sm">
              Performance metrics and progress tracking
            </p>
          </div>
          
          {/* Period Toggle */}
          <div className="flex bg-neutral-800/50 rounded-xl p-1 border border-neutral-700/50">
            {(['week', 'month'] as const).map((periodOption) => (
              <button
                key={periodOption}
                onClick={() => setViewPeriod(periodOption)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                  ${viewPeriod === periodOption
                    ? 'bg-championship_gold text-knockout_black shadow-md'
                    : 'text-neutral-400 hover:text-white'
                  }
                `}
              >
                {periodOption === 'week' ? 'Week' : 'Month'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="p-6">
        <motion.div
          key={animationKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          {/* Total Sessions */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-neutral-800/50 rounded-2xl p-4 border border-neutral-700/30 hover:border-championship_gold/30 transition-all duration-300"
          >
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-championship_gold" />
              <span className="text-neutral-400 text-xs uppercase tracking-wide">Sessions</span>
            </div>
            <div className="text-2xl font-bold text-white">{metrics.totalSessions}</div>
          </motion.div>

          {/* Total Duration */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-neutral-800/50 rounded-2xl p-4 border border-neutral-700/30 hover:border-championship_gold/30 transition-all duration-300"
          >
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-championship_gold" />
              <span className="text-neutral-400 text-xs uppercase tracking-wide">Duration</span>
            </div>
            <div className="text-2xl font-bold text-white">{formatDuration(metrics.totalDuration)}</div>
          </motion.div>

          {/* Training Streak */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-neutral-800/50 rounded-2xl p-4 border border-neutral-700/30 hover:border-championship_gold/30 transition-all duration-300"
          >
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-championship_gold" />
              <span className="text-neutral-400 text-xs uppercase tracking-wide">Streak</span>
            </div>
            <div className="text-2xl font-bold text-white">{metrics.streak} days</div>
          </motion.div>

          {/* Weekly Progress */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-neutral-800/50 rounded-2xl p-4 border border-neutral-700/30 hover:border-championship_gold/30 transition-all duration-300"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-championship_gold" />
              <span className="text-neutral-400 text-xs uppercase tracking-wide">Progress</span>
            </div>
            <div className={`text-2xl font-bold ${metrics.weeklyProgress >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {metrics.weeklyProgress >= 0 ? '+' : ''}{metrics.weeklyProgress.toFixed(0)}%
            </div>
          </motion.div>
        </motion.div>

        {/* Intensity Visualization */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-championship_gold" />
            Training Intensity
          </h4>
          
          <div className="space-y-3">
            {(Object.entries(intensityConfigs) as [TrainingIntensity, IntensityConfig][]).map(([intensity, config]) => {
              const count = metrics.intensityDistribution[intensity];
              const percentage = metrics.totalSessions > 0 ? (count / metrics.totalSessions) * 100 : 0;
              
              return (
                <motion.div
                  key={intensity}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="flex items-center gap-2 w-20">
                    <div style={{ color: config.color }}>
                      {config.icon}
                    </div>
                    <span className="text-neutral-300 text-sm font-medium">
                      {config.label}
                    </span>
                  </div>
                  
                  <div className="flex-1 bg-neutral-800/50 rounded-full h-3 border border-neutral-700/30 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: config.color }}
                    />
                  </div>
                  
                  <div className="text-neutral-400 text-sm w-12 text-right">
                    {count} ({percentage.toFixed(0)}%)
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Overall Intensity Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-neutral-800/50 to-neutral-700/50 rounded-2xl p-4 border border-neutral-700/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-white font-semibold mb-1">Current Intensity Level</h5>
              <p className="text-neutral-400 text-sm">Average training intensity</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                style={{ 
                  backgroundColor: intensityConfigs[getIntensityLevel(metrics.averageIntensity)].bgColor,
                  color: intensityConfigs[getIntensityLevel(metrics.averageIntensity)].color
                }}
              >
                {intensityConfigs[getIntensityLevel(metrics.averageIntensity)].icon}
              </div>
              
              <div className="text-right">
                <div 
                  className="text-xl font-bold"
                  style={{ color: intensityConfigs[getIntensityLevel(metrics.averageIntensity)].color }}
                >
                  {getIntensityLevel(metrics.averageIntensity)}
                </div>
                <div className="text-neutral-400 text-sm">
                  {metrics.averageIntensity.toFixed(1)}/4.0
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TrainingStatsWidget;