import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Target, TrendingUp, Users } from 'lucide-react';
import { useAnalytics } from '../../contexts/AnalyticsContext';

interface FundingMeterProps {
  title: string;
  currentAmount: number;
  targetAmount: number;
  donorCount?: number;
  daysLeft?: number;
  description?: string;
  variant?: 'default' | 'compact';
}

const FundingMeter: React.FC<FundingMeterProps> = ({
  title,
  currentAmount,
  targetAmount,
  donorCount = 0,
  daysLeft,
  description,
  variant = 'default'
}) => {
  const { trackEvent } = useAnalytics();
  const percentage = Math.min((currentAmount / targetAmount) * 100, 100);
  const remaining = Math.max(targetAmount - currentAmount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleDonateClick = () => {
    trackEvent('Funding', 'Donate Click', title);
  };

  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <span className="text-sm font-medium text-primary-600">
            {percentage.toFixed(0)}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="bg-gradient-to-r from-primary-600 to-gold-500 h-3 rounded-full"
          />
        </div>
        
        <div className="flex justify-between text-sm text-gray-600">
          <span>{formatCurrency(currentAmount)}</span>
          <span>{formatCurrency(targetAmount)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="text-center mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center px-4 py-2 bg-primary-50 rounded-full mb-4"
        >
          <Target className="w-5 h-5 text-primary-600 mr-2" />
          <span className="text-primary-700 font-semibold">Fundraising Goal</span>
        </motion.div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        {description && (
          <p className="text-gray-600 max-w-md mx-auto">{description}</p>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-bold text-primary-600">
            {percentage.toFixed(1)}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="bg-gradient-to-r from-primary-600 via-primary-500 to-gold-500 h-4 rounded-full relative overflow-hidden"
          >
            <motion.div
              animate={{ x: ['0%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />
          </motion.div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center p-4 bg-gray-50 rounded-lg"
        >
          <div className="flex items-center justify-center mb-2">
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(currentAmount)}
          </div>
          <div className="text-sm text-gray-600">Raised</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center p-4 bg-gray-50 rounded-lg"
        >
          <div className="flex items-center justify-center mb-2">
            <Target className="w-5 h-5 text-primary-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(targetAmount)}
          </div>
          <div className="text-sm text-gray-600">Goal</div>
        </motion.div>

        {donorCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{donorCount}</div>
            <div className="text-sm text-gray-600">Supporters</div>
          </motion.div>
        )}

        {daysLeft !== undefined && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{daysLeft}</div>
            <div className="text-sm text-gray-600">Days Left</div>
          </motion.div>
        )}
      </div>

      {/* Remaining Amount */}
      {remaining > 0 && (
        <div className="text-center mb-6 p-4 bg-primary-50 rounded-lg">
          <p className="text-primary-700">
            <span className="font-bold">{formatCurrency(remaining)}</span> needed to reach our goal
          </p>
        </div>
      )}

      {/* Call to Action */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleDonateClick}
        className="w-full btn-primary text-lg py-4 flex items-center justify-center"
      >
        <DollarSign className="w-5 h-5 mr-2" />
        Support Kumar's Journey
      </motion.button>

      {/* Progress Milestone */}
      {percentage >= 50 && percentage < 100 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center text-sm text-green-600 font-medium"
        >
          🎉 Over halfway there! Thank you for your support!
        </motion.div>
      )}

      {percentage >= 100 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center text-sm text-green-600 font-bold"
        >
          🏆 Goal achieved! Thank you to all supporters!
        </motion.div>
      )}
    </div>
  );
};

export default FundingMeter;