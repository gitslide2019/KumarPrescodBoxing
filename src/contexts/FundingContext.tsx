import React, { createContext, useContext, useState, useEffect } from 'react';

interface FundingGoal {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  donorCount: number;
  startDate: string;
  endDate?: string;
  category: 'training' | 'equipment' | 'travel' | 'medical' | 'general';
  active: boolean;
}

interface RecentDonation {
  id: string;
  amount: number;
  donorName: string;
  message?: string;
  timestamp: string;
  anonymous: boolean;
}

interface FundingStats {
  totalRaised: number;
  totalGoals: number;
  activeGoals: number;
  totalDonors: number;
  averageDonation: number;
}

interface FundingContextType {
  goals: FundingGoal[];
  recentDonations: RecentDonation[];
  stats: FundingStats;
  addGoal: (goal: Omit<FundingGoal, 'id' | 'currentAmount' | 'donorCount'>) => void;
  updateGoalProgress: (goalId: string, amount: number) => void;
  addDonation: (donation: Omit<RecentDonation, 'id' | 'timestamp'>) => void;
  getActiveGoals: () => FundingGoal[];
  getGoalById: (id: string) => FundingGoal | undefined;
}

const FundingContext = createContext<FundingContextType | undefined>(undefined);

export const useFunding = () => {
  const context = useContext(FundingContext);
  if (context === undefined) {
    throw new Error('useFunding must be used within a FundingProvider');
  }
  return context;
};

interface FundingProviderProps {
  children: React.ReactNode;
}

export const FundingProvider: React.FC<FundingProviderProps> = ({ children }) => {
  const [goals, setGoals] = useState<FundingGoal[]>([
    {
      id: 'training-camp-2024',
      title: 'Elite Training Camp',
      description: 'Support Kumar\'s training camp preparation for his upcoming championship fight. This includes coaching fees, sparring partners, and specialized training equipment.',
      targetAmount: 25000,
      currentAmount: 18500,
      donorCount: 127,
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      category: 'training',
      active: true
    },
    {
      id: 'equipment-upgrade',
      title: 'Professional Equipment',
      description: 'Help Kumar upgrade his training equipment including heavy bags, speed bags, and recovery equipment for optimal performance.',
      targetAmount: 8000,
      currentAmount: 5200,
      donorCount: 89,
      startDate: '2024-02-01',
      category: 'equipment',
      active: true
    },
    {
      id: 'travel-expenses',
      title: 'Fight Travel Fund',
      description: 'Cover travel expenses for Kumar and his team to attend fights and training camps across the country.',
      targetAmount: 15000,
      currentAmount: 12300,
      donorCount: 156,
      startDate: '2024-01-15',
      endDate: '2024-12-31',
      category: 'travel',
      active: true
    }
  ]);

  const [recentDonations, setRecentDonations] = useState<RecentDonation[]>([
    {
      id: '1',
      amount: 500,
      donorName: 'Sarah M.',
      message: 'Keep pushing, Kumar! Oakland is behind you!',
      timestamp: '2024-01-14T10:30:00Z',
      anonymous: false
    },
    {
      id: '2',
      amount: 100,
      donorName: 'Anonymous',
      message: 'Rooting for you!',
      timestamp: '2024-01-14T09:15:00Z',
      anonymous: true
    },
    {
      id: '3',
      amount: 250,
      donorName: 'Mike Rodriguez',
      message: 'Proud to support a local champion. Go Kumar!',
      timestamp: '2024-01-13T16:45:00Z',
      anonymous: false
    },
    {
      id: '4',
      amount: 75,
      donorName: 'Oakland Boxing Club',
      message: 'From your training family',
      timestamp: '2024-01-13T14:20:00Z',
      anonymous: false
    },
    {
      id: '5',
      amount: 1000,
      donorName: 'Anonymous',
      timestamp: '2024-01-12T11:00:00Z',
      anonymous: true
    }
  ]);

  const [stats, setStats] = useState<FundingStats>({
    totalRaised: 0,
    totalGoals: 0,
    activeGoals: 0,
    totalDonors: 0,
    averageDonation: 0
  });

  // Calculate stats whenever goals or donations change
  useEffect(() => {
    const activeGoals = goals.filter(goal => goal.active);
    const totalRaised = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
    const totalDonors = goals.reduce((sum, goal) => sum + goal.donorCount, 0);
    const averageDonation = totalDonors > 0 ? totalRaised / totalDonors : 0;

    setStats({
      totalRaised,
      totalGoals: goals.length,
      activeGoals: activeGoals.length,
      totalDonors,
      averageDonation
    });
  }, [goals]);

  const addGoal = (goalData: Omit<FundingGoal, 'id' | 'currentAmount' | 'donorCount'>) => {
    const newGoal: FundingGoal = {
      ...goalData,
      id: `goal-${Date.now()}`,
      currentAmount: 0,
      donorCount: 0
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const updateGoalProgress = (goalId: string, amount: number) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { 
            ...goal, 
            currentAmount: goal.currentAmount + amount,
            donorCount: goal.donorCount + 1
          }
        : goal
    ));
  };

  const addDonation = (donationData: Omit<RecentDonation, 'id' | 'timestamp'>) => {
    const newDonation: RecentDonation = {
      ...donationData,
      id: `donation-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    setRecentDonations(prev => [newDonation, ...prev.slice(0, 9)]); // Keep only 10 most recent
  };

  const getActiveGoals = () => goals.filter(goal => goal.active);

  const getGoalById = (id: string) => goals.find(goal => goal.id === id);

  const value: FundingContextType = {
    goals,
    recentDonations,
    stats,
    addGoal,
    updateGoalProgress,
    addDonation,
    getActiveGoals,
    getGoalById
  };

  return (
    <FundingContext.Provider value={value}>
      {children}
    </FundingContext.Provider>
  );
};

export default FundingProvider;