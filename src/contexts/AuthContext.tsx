import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAnalytics } from './AnalyticsContext';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'member' | 'volunteer';
  avatar?: string;
  joinDate: string;
  lastLogin?: string;
  preferences: {
    notifications: boolean;
    newsletter: boolean;
    eventUpdates: boolean;
  };
  membershipTier?: 'basic' | 'premium' | 'vip';
  volunteerSkills?: string[];
  donationHistory?: {
    amount: number;
    date: string;
    goalId: string;
  }[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  isAdmin: () => boolean;
  isMember: () => boolean;
  isVolunteer: () => boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'member' | 'volunteer';
  volunteerSkills?: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { trackEvent } = useAnalytics();

  // Demo users for development
  const demoUsers: User[] = [
    {
      id: 'admin-1',
      email: 'admin@kumarprescod.com',
      name: 'Kumar Prescod Admin',
      role: 'admin',
      joinDate: '2024-01-01',
      lastLogin: new Date().toISOString(),
      preferences: {
        notifications: true,
        newsletter: true,
        eventUpdates: true
      }
    },
    {
      id: 'member-1',
      email: 'fan@example.com',
      name: 'John Smith',
      role: 'member',
      joinDate: '2024-02-15',
      lastLogin: new Date().toISOString(),
      membershipTier: 'premium',
      preferences: {
        notifications: true,
        newsletter: true,
        eventUpdates: true
      },
      donationHistory: [
        { amount: 100, date: '2024-01-20', goalId: 'training-camp-2024' },
        { amount: 50, date: '2024-02-10', goalId: 'equipment-upgrade' }
      ]
    },
    {
      id: 'volunteer-1',
      email: 'volunteer@example.com',
      name: 'Sarah Johnson',
      role: 'volunteer',
      joinDate: '2024-01-10',
      lastLogin: new Date().toISOString(),
      preferences: {
        notifications: true,
        newsletter: true,
        eventUpdates: true
      },
      volunteerSkills: ['Boxing coaching', 'Event planning', 'Social media']
    }
  ];

  useEffect(() => {
    // Simulate checking for existing session
    const storedUser = localStorage.getItem('kumar_boxing_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        trackEvent('Auth', 'Session Restored', userData.role);
      } catch (error) {
        localStorage.removeItem('kumar_boxing_user');
      }
    }
    setIsLoading(false);
  }, [trackEvent]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find demo user
      const foundUser = demoUsers.find(u => u.email === email);
      
      if (!foundUser) {
        trackEvent('Auth', 'Login Failed', 'User Not Found');
        return { success: false, error: 'Invalid email or password' };
      }

      // In a real app, you'd verify the password hash
      if (password !== 'password123' && !(foundUser.role === 'admin' && password === 'admin123')) {
        trackEvent('Auth', 'Login Failed', 'Invalid Password');
        return { success: false, error: 'Invalid email or password' };
      }

      // Update last login
      const userWithLogin = {
        ...foundUser,
        lastLogin: new Date().toISOString()
      };

      setUser(userWithLogin);
      localStorage.setItem('kumar_boxing_user', JSON.stringify(userWithLogin));
      
      trackEvent('Auth', 'Login Success', foundUser.role);
      return { success: true };
      
    } catch (error) {
      trackEvent('Auth', 'Login Error');
      return { success: false, error: 'Login failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const existingUser = demoUsers.find(u => u.email === userData.email);
      if (existingUser) {
        trackEvent('Auth', 'Registration Failed', 'Email Exists');
        return { success: false, error: 'An account with this email already exists' };
      }

      // Create new user
      const newUser: User = {
        id: `${userData.role}-${Date.now()}`,
        email: userData.email,
        name: userData.name,
        role: userData.role || 'member',
        joinDate: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        preferences: {
          notifications: true,
          newsletter: true,
          eventUpdates: true
        },
        membershipTier: userData.role === 'member' ? 'basic' : undefined,
        volunteerSkills: userData.volunteerSkills,
        donationHistory: []
      };

      setUser(newUser);
      localStorage.setItem('kumar_boxing_user', JSON.stringify(newUser));
      
      trackEvent('Auth', 'Registration Success', newUser.role);
      return { success: true };
      
    } catch (error) {
      trackEvent('Auth', 'Registration Error');
      return { success: false, error: 'Registration failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    if (user) {
      trackEvent('Auth', 'Logout', user.role);
    }
    setUser(null);
    localStorage.removeItem('kumar_boxing_user');
  };

  const updateProfile = async (updates: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated' };
    
    try {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('kumar_boxing_user', JSON.stringify(updatedUser));
      
      trackEvent('Auth', 'Profile Updated', user.role);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update profile' };
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = demoUsers.find(u => u.email === email);
      if (!foundUser) {
        return { success: false, error: 'No account found with this email address' };
      }
      
      trackEvent('Auth', 'Password Reset Requested');
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to send reset email' };
    }
  };

  const isAdmin = () => user?.role === 'admin';
  const isMember = () => user?.role === 'member';
  const isVolunteer = () => user?.role === 'volunteer';
  const isAuthenticated = user !== null;

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    resetPassword,
    isAdmin,
    isMember,
    isVolunteer
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;