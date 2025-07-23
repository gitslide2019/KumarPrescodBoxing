import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Settings, 
  Bell,
  FileText,
  BarChart3,
  Shield,
  Edit,
  Eye,
  UserPlus,
  Send
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAnalytics } from '../../contexts/AnalyticsContext';
import { useFunding } from '../../contexts/FundingContext';
import { useCommunity } from '../../contexts/CommunityContext';

interface DashboardStats {
  totalMembers: number;
  newMembersThisMonth: number;
  totalRevenue: number;
  monthlyRevenue: number;
  activeEvents: number;
  pendingApprovals: number;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { trackEvent } = useAnalytics();
  const { stats: fundingStats } = useFunding();
  const { stats: communityStats } = useCommunity();
  
  const [dashboardStats] = useState<DashboardStats>({
    totalMembers: 1247,
    newMembersThisMonth: 156,
    totalRevenue: 185000,
    monthlyRevenue: 15600,
    activeEvents: 8,
    pendingApprovals: 12
  });

  const [recentActivity] = useState([
    {
      id: '1',
      type: 'member_signup',
      user: 'John Smith',
      action: 'Signed up as Premium Member',
      timestamp: '2 hours ago',
      amount: 99
    },
    {
      id: '2',
      type: 'donation',
      user: 'Sarah Wilson',
      action: 'Donated to Training Camp Fund',
      timestamp: '4 hours ago',
      amount: 250
    },
    {
      id: '3',
      type: 'event_registration',
      user: 'Mike Johnson',
      action: 'Registered for VIP Meet & Greet',
      timestamp: '6 hours ago'
    },
    {
      id: '4',
      type: 'content_access',
      user: 'Lisa Brown',
      action: 'Accessed exclusive training video',
      timestamp: '8 hours ago'
    },
    {
      id: '5',
      type: 'volunteer_signup',
      user: 'David Chen',
      action: 'Applied to volunteer for youth program',
      timestamp: '1 day ago'
    }
  ]);

  const [quickActions] = useState([
    { 
      title: 'Create Announcement', 
      icon: Bell, 
      color: 'bg-blue-600', 
      action: 'create_announcement' 
    },
    { 
      title: 'Add Event', 
      icon: Calendar, 
      color: 'bg-green-600', 
      action: 'add_event' 
    },
    { 
      title: 'Upload Content', 
      icon: FileText, 
      color: 'bg-purple-600', 
      action: 'upload_content' 
    },
    { 
      title: 'Manage Members', 
      icon: Users, 
      color: 'bg-orange-600', 
      action: 'manage_members' 
    },
    { 
      title: 'View Analytics', 
      icon: BarChart3, 
      color: 'bg-indigo-600', 
      action: 'view_analytics' 
    },
    { 
      title: 'Send Newsletter', 
      icon: Send, 
      color: 'bg-pink-600', 
      action: 'send_newsletter' 
    }
  ]);

  useEffect(() => {
    trackEvent('Admin', 'Dashboard View');
  }, [trackEvent]);

  const handleQuickAction = (action: string) => {
    trackEvent('Admin', 'Quick Action', action);
    // Handle action routing here
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'member_signup': return UserPlus;
      case 'donation': return DollarSign;
      case 'event_registration': return Calendar;
      case 'content_access': return Eye;
      case 'volunteer_signup': return Users;
      default: return Bell;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'member_signup': return 'text-green-600 bg-green-100';
      case 'donation': return 'text-blue-600 bg-blue-100';
      case 'event_registration': return 'text-purple-600 bg-purple-100';
      case 'content_access': return 'text-orange-600 bg-orange-100';
      case 'volunteer_signup': return 'text-indigo-600 bg-indigo-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Kumar Prescod Boxing</title>
        <meta name="description" content="Administrative dashboard for managing Kumar Prescod Boxing website." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container-max py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center mb-2">
                    <Shield className="w-8 h-8 mr-3" />
                    <span className="text-lg font-semibold opacity-90">Admin Dashboard</span>
                  </div>
                  <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}</h1>
                  <p className="text-lg opacity-90">
                    Manage Kumar's digital presence and community
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {dashboardStats.totalMembers.toLocaleString()}
                  </div>
                  <div className="text-sm opacity-90">Total Members</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Members</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalMembers.toLocaleString()}</p>
                  <p className="text-sm text-green-600">+{dashboardStats.newMembersThisMonth} this month</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashboardStats.totalRevenue)}</p>
                  <p className="text-sm text-green-600">{formatCurrency(dashboardStats.monthlyRevenue)} this month</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Community Served</p>
                  <p className="text-2xl font-bold text-gray-900">{communityStats.peopleServed.toLocaleString()}</p>
                  <p className="text-sm text-blue-600">{communityStats.activePrograms} active programs</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="w-8 h-8 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Events</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.activeEvents}</p>
                  <p className="text-sm text-yellow-600">{dashboardStats.pendingApprovals} pending approval</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleQuickAction(action.action)}
                  className={`${action.color} text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all text-center`}
                >
                  <action.icon className="w-8 h-8 mx-auto mb-3" />
                  <div className="text-sm font-semibold">{action.title}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-xl shadow-md">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <TrendingUp className="w-6 h-6 mr-2 text-primary-600" />
                    Recent Activity
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => {
                      const IconComponent = getActivityIcon(activity.type);
                      const colorClass = getActivityColor(activity.type);
                      
                      return (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                        >
                          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900">
                                {activity.user}
                              </p>
                              <div className="flex items-center space-x-2">
                                {activity.amount && (
                                  <span className="text-sm font-bold text-green-600">
                                    ${activity.amount}
                                  </span>
                                )}
                                <span className="text-xs text-gray-500">
                                  {activity.timestamp}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">
                              {activity.action}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* System Status & Notifications */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              {/* System Status */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-primary-600" />
                  System Status
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Website</span>
                    <span className="text-sm font-medium text-green-600">✓ Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Payment System</span>
                    <span className="text-sm font-medium text-green-600">✓ Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Analytics</span>
                    <span className="text-sm font-medium text-green-600">✓ Tracking</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Email Service</span>
                    <span className="text-sm font-medium text-green-600">✓ Operational</span>
                  </div>
                </div>
              </div>

              {/* Pending Tasks */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-primary-600" />
                  Pending Tasks
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <span className="text-sm text-gray-700">Member applications</span>
                    <span className="text-sm font-bold text-yellow-600">12</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm text-gray-700">Content reviews</span>
                    <span className="text-sm font-bold text-blue-600">5</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-gray-700">Event approvals</span>
                    <span className="text-sm font-bold text-green-600">3</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Today's Highlights</h3>
                <div className="space-y-3">
                  <div className="text-center p-3 bg-primary-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary-600">15</div>
                    <div className="text-sm text-gray-600">New Members</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{formatCurrency(3200)}</div>
                    <div className="text-sm text-gray-600">Revenue Today</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">248</div>
                    <div className="text-sm text-gray-600">Active Users</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;