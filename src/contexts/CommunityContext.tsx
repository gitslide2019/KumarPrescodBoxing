import React, { createContext, useContext, useState } from 'react';

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: 'youth_program' | 'charity' | 'education' | 'mentorship' | 'fundraiser';
  impact: string;
  image?: string;
  participants?: number;
  featured?: boolean;
  status: 'upcoming' | 'ongoing' | 'completed';
  contactEmail?: string;
  volunteerSpots?: number;
  volunteersFilled?: number;
}

export interface CommunityStats {
  totalEvents: number;
  activePrograms: number;
  peopleServed: number;
  volunteersRecruited: number;
  fundsRaised: number;
  schoolsVisited: number;
  youthMentored: number;
  equipmentDonated: number;
}

export interface VolunteerOpportunity {
  id: string;
  title: string;
  description: string;
  skills: string[];
  timeCommitment: string;
  location: string;
  contact: string;
  urgent?: boolean;
}

interface CommunityContextType {
  events: CommunityEvent[];
  stats: CommunityStats;
  volunteerOpportunities: VolunteerOpportunity[];
  addEvent: (event: Omit<CommunityEvent, 'id'>) => void;
  updateEventStatus: (eventId: string, status: CommunityEvent['status']) => void;
  getFeaturedEvents: () => CommunityEvent[];
  getActivePrograms: () => CommunityEvent[];
  getUpcomingEvents: () => CommunityEvent[];
  addVolunteerToEvent: (eventId: string) => void;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (context === undefined) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
};

interface CommunityProviderProps {
  children: React.ReactNode;
}

export const CommunityProvider: React.FC<CommunityProviderProps> = ({ children }) => {
  const [events] = useState<CommunityEvent[]>([
    {
      id: 'youth-boxing-program',
      title: 'Oakland Youth Boxing Program',
      description: 'Weekly training sessions for underprivileged youth in Oakland, teaching boxing fundamentals, discipline, and life skills.',
      date: 'Every Saturday',
      location: 'Oakland Community Center',
      type: 'youth_program',
      impact: 'Trained over 150 local youth',
      participants: 45,
      featured: true,
      status: 'ongoing',
      volunteerSpots: 10,
      volunteersFilled: 7,
      contactEmail: 'youth@kumarprescod.com'
    },
    {
      id: 'school-visits',
      title: 'Anti-Bullying School Visits',
      description: 'Visiting local elementary and middle schools to speak about anti-bullying, self-confidence, and pursuing your dreams.',
      date: 'Monthly',
      location: 'Oakland Public Schools',
      type: 'education',
      impact: 'Reached 2,000+ students',
      participants: 500,
      status: 'ongoing',
      contactEmail: 'education@kumarprescod.com'
    },
    {
      id: 'food-drive',
      title: 'Holiday Food Drive',
      description: 'Organizing and distributing holiday meals to families in need throughout the Oakland community.',
      date: 'December 2023',
      location: 'Multiple Oakland locations',
      type: 'charity',
      impact: '500 families fed',
      participants: 75,
      featured: true,
      status: 'completed'
    },
    {
      id: 'mentorship',
      title: 'One-on-One Mentorship',
      description: 'Personal mentoring program for at-risk youth, providing guidance, support, and positive role modeling.',
      date: 'Ongoing',
      location: 'Various Oakland locations',
      type: 'mentorship',
      impact: '25 active mentees',
      participants: 25,
      status: 'ongoing',
      volunteerSpots: 5,
      volunteersFilled: 5,
      contactEmail: 'mentorship@kumarprescod.com'
    },
    {
      id: 'equipment-donation',
      title: 'Boxing Equipment Donation',
      description: 'Donated boxing gloves, punching bags, and training equipment to local community centers and schools.',
      date: 'September 2023',
      location: 'Oakland Community Centers',
      type: 'charity',
      impact: '$15,000 in equipment donated',
      status: 'completed'
    },
    {
      id: 'college-prep',
      title: 'College Prep Workshops',
      description: 'Helping high school students with college applications, scholarship searches, and career planning.',
      date: 'Quarterly',
      location: 'Oakland High Schools',
      type: 'education',
      impact: '80% of participants applied to college',
      participants: 120,
      status: 'ongoing',
      volunteerSpots: 8,
      volunteersFilled: 6,
      contactEmail: 'college@kumarprescod.com'
    },
    {
      id: 'summer-camp',
      title: 'Summer Boxing & Life Skills Camp',
      description: 'Intensive 8-week summer program combining boxing training with academic support and life skills development.',
      date: 'June - August 2024',
      location: 'Oakland Recreation Center',
      type: 'youth_program',
      impact: 'Expected to serve 200+ youth',
      status: 'upcoming',
      volunteerSpots: 15,
      volunteersFilled: 8,
      contactEmail: 'summer@kumarprescod.com'
    }
  ]);

  const [stats] = useState<CommunityStats>({
    totalEvents: 12,
    activePrograms: 5,
    peopleServed: 3200,
    volunteersRecruited: 85,
    fundsRaised: 125000,
    schoolsVisited: 18,
    youthMentored: 150,
    equipmentDonated: 25000
  });

  const [volunteerOpportunities] = useState<VolunteerOpportunity[]>([
    {
      id: 'boxing-coach',
      title: 'Youth Boxing Coach Assistant',
      description: 'Help with Saturday youth boxing sessions. Assist with training, safety, and mentoring young athletes.',
      skills: ['Boxing experience', 'Working with youth', 'CPR certified (preferred)'],
      timeCommitment: '4 hours every Saturday',
      location: 'Oakland Community Center',
      contact: 'youth@kumarprescod.com',
      urgent: true
    },
    {
      id: 'tutor',
      title: 'Academic Tutor',
      description: 'Support students in our college prep workshops with homework help and test preparation.',
      skills: ['Teaching/tutoring experience', 'College degree', 'Patience with students'],
      timeCommitment: '2-3 hours weekly',
      location: 'Oakland High Schools',
      contact: 'college@kumarprescod.com'
    },
    {
      id: 'event-coordinator',
      title: 'Community Event Coordinator',
      description: 'Help organize and coordinate community service events, food drives, and fundraising activities.',
      skills: ['Event planning', 'Organization', 'Communication'],
      timeCommitment: '5-10 hours monthly',
      location: 'Various Oakland locations',
      contact: 'events@kumarprescod.com'
    },
    {
      id: 'social-media',
      title: 'Social Media Volunteer',
      description: 'Document community events, create social media content, and help spread awareness of our programs.',
      skills: ['Social media experience', 'Photography/videography', 'Content creation'],
      timeCommitment: '3-5 hours weekly',
      location: 'Remote + event attendance',
      contact: 'media@kumarprescod.com'
    }
  ]);

  const addEvent = (eventData: Omit<CommunityEvent, 'id'>) => {
    // In a real app, this would make an API call
    console.log('Adding new community event:', eventData);
  };

  const updateEventStatus = (eventId: string, status: CommunityEvent['status']) => {
    // In a real app, this would make an API call
    console.log(`Updating event ${eventId} status to ${status}`);
  };

  const getFeaturedEvents = () => events.filter(event => event.featured);

  const getActivePrograms = () => events.filter(event => event.status === 'ongoing');

  const getUpcomingEvents = () => events.filter(event => event.status === 'upcoming');

  const addVolunteerToEvent = (eventId: string) => {
    // In a real app, this would make an API call
    console.log(`Adding volunteer to event ${eventId}`);
  };

  const value: CommunityContextType = {
    events,
    stats,
    volunteerOpportunities,
    addEvent,
    updateEventStatus,
    getFeaturedEvents,
    getActivePrograms,
    getUpcomingEvents,
    addVolunteerToEvent
  };

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  );
};

export default CommunityProvider;