import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireMember?: boolean;
  requireVolunteer?: boolean;
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
  requireMember = false,
  requireVolunteer = false,
  fallbackPath = '/'
}) => {
  const { isAuthenticated, isLoading, user, isAdmin, isMember, isVolunteer } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </motion.div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check role-based access
  const hasRequiredRole = () => {
    if (requireAdmin) return isAdmin();
    if (requireMember) return isMember();
    if (requireVolunteer) return isVolunteer();
    return true; // No specific role required
  };

  if (!hasRequiredRole()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. 
            {requireAdmin && ' Admin access required.'}
            {requireMember && ' Member access required.'}
            {requireVolunteer && ' Volunteer access required.'}
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>Current role: <span className="font-medium capitalize">{user?.role}</span></p>
            <p>Required role: <span className="font-medium">
              {requireAdmin && 'Admin'}
              {requireMember && 'Member'}
              {requireVolunteer && 'Volunteer'}
            </span></p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
            className="mt-6 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;