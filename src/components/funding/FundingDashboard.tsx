import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Target, DollarSign, Calendar, MessageCircle } from 'lucide-react';
import { useFunding } from '../../contexts/FundingContext';
import FundingMeter from './FundingMeter';

const FundingDashboard: React.FC = () => {
  const { goals, recentDonations, stats, getActiveGoals } = useFunding();
  const activeGoals = getActiveGoals();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Raised</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.totalRaised)}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Supporters</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDonors}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Target className="w-8 h-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Goals</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeGoals}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Donation</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.averageDonation)}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Active Goals */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Active Fundraising Goals</h3>
        <div className="grid gap-6 lg:grid-cols-2">
          {activeGoals.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <FundingMeter
                title={goal.title}
                currentAmount={goal.currentAmount}
                targetAmount={goal.targetAmount}
                donorCount={goal.donorCount}
                description={goal.description}
                variant="compact"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Donations */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <MessageCircle className="w-6 h-6 mr-2 text-primary-600" />
            Recent Supporters
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentDonations.map((donation, index) => (
              <motion.div
                key={donation.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-primary-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {donation.donorName}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-green-600">
                        {formatCurrency(donation.amount)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(donation.timestamp)}
                      </span>
                    </div>
                  </div>
                  {donation.message && (
                    <p className="text-sm text-gray-600 mt-1 italic">
                      "{donation.message}"
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundingDashboard;