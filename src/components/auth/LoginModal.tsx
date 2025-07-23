import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, Lock, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAnalytics } from '../../contexts/AnalyticsContext';
import toast from 'react-hot-toast';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, defaultTab = 'login' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'member' as 'member' | 'volunteer',
    volunteerSkills: [] as string[]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { login, register, resetPassword, isLoading } = useAuth();
  const { trackEvent } = useAnalytics();

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

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (activeTab === 'register' && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (activeTab === 'register') {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      if (formData.role === 'volunteer' && formData.volunteerSkills.length === 0) {
        newErrors.volunteerSkills = 'Please select at least one skill';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (activeTab === 'login') {
        const result = await login(formData.email, formData.password);
        if (result.success) {
          toast.success('Welcome back!');
          onClose();
        } else {
          toast.error(result.error || 'Login failed');
        }
      } else {
        const result = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          volunteerSkills: formData.role === 'volunteer' ? formData.volunteerSkills : undefined
        });
        
        if (result.success) {
          toast.success('Account created successfully!');
          onClose();
        } else {
          toast.error(result.error || 'Registration failed');
        }
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setErrors({ email: 'Please enter your email address' });
      return;
    }

    const result = await resetPassword(formData.email);
    if (result.success) {
      toast.success('Password reset email sent!');
    } else {
      toast.error(result.error || 'Failed to send reset email');
    }
  };

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      volunteerSkills: prev.volunteerSkills.includes(skill)
        ? prev.volunteerSkills.filter(s => s !== skill)
        : [...prev.volunteerSkills, skill]
    }));
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      name: '',
      role: 'member',
      volunteerSkills: []
    });
    setErrors({});
  };

  const switchTab = (tab: 'login' | 'register') => {
    setActiveTab(tab);
    resetForm();
    trackEvent('Auth', 'Tab Switch', tab);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              {activeTab === 'login' ? 'Welcome Back' : 'Join the Team'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => switchTab('login')}
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                activeTab === 'login'
                  ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => switchTab('register')}
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                activeTab === 'register'
                  ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field (Register only) */}
              {activeTab === 'register' && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Role Selection (Register only) */}
              {activeTab === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    I want to join as a:
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="role"
                        value="member"
                        checked={formData.role === 'member'}
                        onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'member' | 'volunteer' }))}
                        className="mr-3 text-primary-600"
                      />
                      <div>
                        <div className="font-medium">Fan/Member</div>
                        <div className="text-sm text-gray-600">Get updates, exclusive content, and support Kumar</div>
                      </div>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="role"
                        value="volunteer"
                        checked={formData.role === 'volunteer'}
                        onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'member' | 'volunteer' }))}
                        className="mr-3 text-primary-600"
                      />
                      <div>
                        <div className="font-medium">Volunteer</div>
                        <div className="text-sm text-gray-600">Help with community programs and events</div>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Volunteer Skills (Register + Volunteer only) */}
              {activeTab === 'register' && formData.role === 'volunteer' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills & Interests
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {volunteerSkillOptions.map(skill => (
                      <label key={skill} className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={formData.volunteerSkills.includes(skill)}
                          onChange={() => handleSkillToggle(skill)}
                          className="mr-2 text-primary-600"
                        />
                        {skill}
                      </label>
                    ))}
                  </div>
                  {errors.volunteerSkills && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.volunteerSkills}
                    </p>
                  )}
                </div>
              )}

              {/* Demo Credentials Info */}
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm text-blue-700 font-medium mb-1">Demo Credentials:</p>
                <div className="text-xs text-blue-600 space-y-1">
                  <div><strong>Admin:</strong> admin@kumarprescod.com / admin123</div>
                  <div><strong>Member:</strong> fan@example.com / password123</div>
                  <div><strong>Volunteer:</strong> volunteer@example.com / password123</div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {activeTab === 'login' ? 'Signing In...' : 'Creating Account...'}
                  </>
                ) : (
                  <>
                    {activeTab === 'login' ? 'Sign In' : 'Create Account'}
                    <CheckCircle className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>

              {/* Forgot Password (Login only) */}
              {activeTab === 'login' && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    Forgot your password?
                  </button>
                </div>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LoginModal;