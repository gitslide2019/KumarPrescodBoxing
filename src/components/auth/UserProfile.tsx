import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Edit, Save, X, Camera, Crown, Star, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAnalytics } from '../../contexts/AnalyticsContext';
import toast from 'react-hot-toast';

const UserProfile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { trackEvent } = useAnalytics();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    preferences: {
      notifications: user?.preferences.notifications || false,
      newsletter: user?.preferences.newsletter || false,
      eventUpdates: user?.preferences.eventUpdates || false
    },
    volunteerSkills: user?.volunteerSkills || []
  });

  const volunteerSkillOptions = [
    'Boxing coaching',
    'Event planning',
    'Social media',
    'Photography',
    'Fundraising',
    'Youth mentoring',
    'Administrative support',
    'Technical skills'
  ];

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'admin': return Shield;
      case 'member': return Crown;
      case 'volunteer': return Star;
      default: return User;
    }
  };

  const getRoleColor = () => {
    switch (user?.role) {
      case 'admin': return 'from-gray-600 to-gray-700';
      case 'member': return 'from-purple-600 to-purple-700';
      case 'volunteer': return 'from-blue-600 to-blue-700';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const handleSave = async () => {
    try {
      const result = await updateProfile({
        name: formData.name,
        preferences: formData.preferences,
        volunteerSkills: user?.role === 'volunteer' ? formData.volunteerSkills : undefined
      });

      if (result.success) {
        setIsEditing(false);
        toast.success('Profile updated successfully!');
        trackEvent('Profile', 'Update Success');
      } else {
        toast.error(result.error || 'Failed to update profile');
        trackEvent('Profile', 'Update Failed');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      trackEvent('Profile', 'Update Error');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      preferences: {
        notifications: user?.preferences.notifications || false,
        newsletter: user?.preferences.newsletter || false,
        eventUpdates: user?.preferences.eventUpdates || false
      },
      volunteerSkills: user?.volunteerSkills || []
    });
    setIsEditing(false);
    trackEvent('Profile', 'Edit Cancelled');
  };

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      volunteerSkills: prev.volunteerSkills.includes(skill)
        ? prev.volunteerSkills.filter(s => s !== skill)
        : [...prev.volunteerSkills, skill]
    }));
  };

  if (!user) return null;

  const RoleIcon = getRoleIcon();

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getRoleColor()} p-6 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <div className="flex items-center space-x-2">
                <RoleIcon className="w-5 h-5" />
                <span className="capitalize text-lg opacity-90">{user.role}</span>
                {user.membershipTier && (
                  <>
                    <span className="text-white/60">•</span>
                    <span className="capitalize opacity-90">{user.membershipTier} Tier</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              if (isEditing) {
                handleCancel();
              } else {
                setIsEditing(true);
                trackEvent('Profile', 'Edit Started');
              }
            }}
            className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
          >
            {isEditing ? <X className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">{user.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="flex items-center text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-400 mr-2" />
                  {user.email}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Contact support to change your email address
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Member Since
                </label>
                <div className="flex items-center text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                  {new Date(user.joinDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Preferences & Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Notification Settings
                </label>
                <div className="space-y-3">
                  {[
                    { key: 'notifications', label: 'Push Notifications', desc: 'Receive notifications for important updates' },
                    { key: 'newsletter', label: 'Newsletter', desc: 'Weekly newsletter with latest news' },
                    { key: 'eventUpdates', label: 'Event Updates', desc: 'Notifications about upcoming events' }
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.preferences[key as keyof typeof formData.preferences]}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            [key]: e.target.checked
                          }
                        }))}
                        disabled={!isEditing}
                        className="mt-1 text-primary-600 focus:ring-primary-500"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{label}</div>
                        <div className="text-xs text-gray-500">{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Volunteer Skills (for volunteers only) */}
              {user.role === 'volunteer' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Skills & Interests
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {volunteerSkillOptions.map(skill => (
                      <label key={skill} className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={formData.volunteerSkills.includes(skill)}
                          onChange={() => handleSkillToggle(skill)}
                          disabled={!isEditing}
                          className="mr-2 text-primary-600 focus:ring-primary-500"
                        />
                        {skill}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Member Stats (for members) */}
        {user.role === 'member' && user.donationHistory && user.donationHistory.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Support History</h3>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  ${user.donationHistory.reduce((sum, donation) => sum + donation.amount, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Contributed</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {user.donationHistory.length}
                </div>
                <div className="text-sm text-gray-600">Donations Made</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.floor((Date.now() - new Date(user.joinDate).getTime()) / (1000 * 60 * 60 * 24))}
                </div>
                <div className="text-sm text-gray-600">Days Supporting</div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Recent Donations</h4>
              <div className="space-y-2">
                {user.donationHistory.slice(-3).map((donation, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                      {new Date(donation.date).toLocaleDateString()}
                    </span>
                    <span className="font-medium text-green-600">
                      ${donation.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 pt-8 border-t border-gray-200 flex justify-end space-x-4"
          >
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;