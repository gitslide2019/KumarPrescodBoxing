import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Instagram, Twitter, Youtube, Facebook, User, LogOut, Settings, Crown } from 'lucide-react';
import { useAnalytics } from '../../contexts/AnalyticsContext';
import { useAuth } from '../../contexts/AuthContext';
import LoginModal from '../auth/LoginModal';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const { trackEvent } = useAnalytics();
  const { user, isAuthenticated, logout, isAdmin, isMember, isVolunteer } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Fights', href: '/fights' },
    { name: 'Shop', href: '/shop' },
    { name: 'Podcast', href: '/podcast' },
    { name: 'Journey', href: '/journey' },
    { name: 'Sponsors', href: '/sponsors' },
    { name: 'Contact', href: '/contact' },
  ];

  const socialLinks = [
    { name: 'Instagram', href: 'https://instagram.com/kumarprescod', icon: Instagram },
    { name: 'Twitter', href: 'https://twitter.com/kumarprescod', icon: Twitter },
    { name: 'YouTube', href: 'https://youtube.com/@kumarprescod', icon: Youtube },
    { name: 'Facebook', href: 'https://facebook.com/kumarprescod', icon: Facebook },
  ];

  const handleNavClick = (pageName: string) => {
    trackEvent('Navigation', 'Click', pageName);
    setIsOpen(false);
  };

  const handleSocialClick = (platform: string) => {
    trackEvent('Social', 'Click', platform);
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
    trackEvent('Auth', 'Login Modal Open');
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    trackEvent('Auth', 'Logout Click');
  };

  const getUserDashboardPath = () => {
    if (isAdmin()) return '/admin';
    if (isMember() || isVolunteer()) return '/member';
    return '/';
  };

  const getUserRoleDisplay = () => {
    if (isAdmin()) return 'Admin';
    if (isMember()) return 'Member';
    if (isVolunteer()) return 'Volunteer';
    return 'User';
  };

  const getUserRoleIcon = () => {
    if (isAdmin()) return Settings;
    if (isMember()) return Crown;
    return User;
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-900 via-red-900 to-amber-900 shadow-xl"
    >
      <div className="container-max">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2"
            onClick={() => handleNavClick('Logo')}
          >
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-primary-600 to-gold-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg lg:text-xl">KP</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl lg:text-2xl font-black text-white drop-shadow-lg">
                Kumar <span className="ring-text">Prescod</span>
              </h1>
              <p className="text-xs text-gold-300 font-semibold">Professional Boxer</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navigation.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link
                  to={item.href}
                  className={`relative px-4 py-2 font-bold rounded-lg transition-all duration-300 transform hover:scale-105 border-2 ${
                    location.pathname === item.href
                      ? 'text-white bg-primary-600 border-primary-600 shadow-lg'
                      : 'text-white border-transparent hover:text-black hover:bg-gold-400 hover:border-gold-400 hover:shadow-lg'
                  } group`}
                  onClick={() => handleNavClick(item.name)}
                >
                  <span className="relative z-10">{item.name}</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary-500 to-gold-500 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                    whileHover={{ scale: 1.05 }}
                  />
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Auth & Social Links */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Social Links */}
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + (index * 0.1), duration: 0.3 }}
                className="p-2 rounded-full transition-all duration-300 transform hover:scale-110 text-white/80 hover:text-black hover:bg-white/90"
                whileHover={{ rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSocialClick(social.name)}
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
            
            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 bg-primary-50 hover:bg-primary-100 text-primary-700 px-3 py-2 rounded-lg transition-colors duration-200"
                >
                  {(() => {
                    const IconComponent = getUserRoleIcon();
                    return <IconComponent className="w-5 h-5" />;
                  })()}
                  <span className="font-medium">{user?.name}</span>
                </button>
                
                {/* User Dropdown */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-600">{getUserRoleDisplay()}</p>
                      </div>
                      
                      <Link
                        to={getUserDashboardPath()}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={handleLoginClick}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-md transition-colors duration-200 text-white hover:text-primary-300 hover:bg-white/10"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-gradient-to-b from-amber-800 to-red-800 border-t border-gold-400/30"
            >
              <div className="px-4 py-6 space-y-2">
                {navigation.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <Link
                      to={item.href}
                      className={`block px-4 py-3 font-bold rounded-lg transition-all duration-300 transform hover:scale-105 border-2 ${
                        location.pathname === item.href
                          ? 'text-white bg-gold-600 border-gold-500 shadow-lg'
                          : 'text-gold-100 border-transparent hover:text-white hover:bg-gold-600 hover:border-gold-500 hover:shadow-md'
                      }`}
                      onClick={() => handleNavClick(item.name)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                
                {/* Mobile Social Links */}
                <div className="flex items-center justify-center space-x-4 pt-4 border-t border-gray-200">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + (index * 0.1), duration: 0.3 }}
                      className="p-3 rounded-full text-secondary-600 hover:text-white hover:bg-primary-600 transition-all duration-300 transform hover:scale-110"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSocialClick(social.name)}
                    >
                      <social.icon className="w-6 h-6" />
                    </motion.a>
                  ))}
                </div>
                
                {/* Mobile Auth Section */}
                <div className="pt-4 border-t border-gray-200">
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      <div className="px-4 py-2 bg-primary-50 rounded-lg">
                        <p className="text-sm font-medium text-primary-700">{user?.name}</p>
                        <p className="text-xs text-primary-600">{getUserRoleDisplay()}</p>
                      </div>
                      <Link
                        to={getUserDashboardPath()}
                        className="block text-secondary-700 hover:text-primary-600 font-medium transition-colors duration-200"
                        onClick={() => {
                          handleNavClick('Dashboard');
                          setIsOpen(false);
                        }}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                        className="block text-secondary-700 hover:text-primary-600 font-medium transition-colors duration-200"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        handleLoginClick();
                        setIsOpen(false);
                      }}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                    >
                      Sign In
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </header>
  );
};

export default Header; 