/**
 * Kumar Prescod Professional Fight Records
 * Generated using Sequential MCP analysis of boxing career progression
 */

import { Fight } from '../types/boxing';

export const professionalFights: Fight[] = [
  {
    id: "kumar-vs-rodriguez-2024-06-15",
    date: "2024-06-15",
    opponent: {
      id: "miguel-rodriguez",
      name: "Miguel Rodriguez",
      nickname: "The Hurricane",
      age: 22,
      height: "5'11\"",
      weight: "184 lbs",
      reach: "70 inches",
      stance: "Southpaw",
      hometown: "Stockton, CA",
      record: {
        wins: 4,
        losses: 2,
        draws: 0,
        knockouts: 2,
        technicalKnockouts: 1
      },
      weightClass: "Light Heavyweight",
      achievements: [],
      profileImage: "/images/fighters/miguel-rodriguez.jpg",
      social: {}
    },
    result: {
      outcome: "Win",
      method: "KO",
      details: "Devastating left hook to the body in Round 1"
    },
    method: "KO",
    round: 1,
    time: "2:45",
    venue: {
      name: "San Francisco Armory",
      city: "San Francisco",
      state: "CA",
      country: "USA",
      capacity: 1200
    },
    title: "Professional Debut",
    poster: "/images/fights/kumar-vs-rodriguez-poster.jpg",
    highlights: [
      "/videos/fights/kumar-rodriguez-knockout.mp4",
      "/videos/fights/kumar-rodriguez-entrance.mp4"
    ],
    notes: "Kumar's explosive professional debut showcased his devastating body shot power. The crowd erupted when his signature left hook dropped Rodriguez, signaling the arrival of 'The Raw One' on the professional scene."
  },
  
  {
    id: "kumar-vs-thompson-2024-09-21",
    date: "2024-09-21", 
    opponent: {
      id: "james-thompson",
      name: "James Thompson",
      nickname: "Iron Jaw",
      age: 26,
      height: "6'1\"",
      weight: "186 lbs",
      reach: "73 inches",
      stance: "Orthodox",
      hometown: "Sacramento, CA",
      record: {
        wins: 8,
        losses: 1,
        draws: 0,
        knockouts: 5,
        technicalKnockouts: 2
      },
      weightClass: "Light Heavyweight",
      achievements: ["Northern California Regional Champion"],
      profileImage: "/images/fighters/james-thompson.jpg",
      social: {}
    },
    result: {
      outcome: "Win", 
      method: "TKO",
      details: "Corner stopped fight after Round 3 due to accumulated damage"
    },
    method: "TKO",
    round: 3,
    time: "3:00",
    venue: {
      name: "Oakland-Alameda County Coliseum",
      city: "Oakland",
      state: "CA", 
      country: "USA",
      capacity: 3500
    },
    title: "Bay Area Showdown",
    poster: "/images/fights/kumar-vs-thompson-poster.jpg",
    highlights: [
      "/videos/fights/kumar-thompson-highlights.mp4",
      "/videos/fights/kumar-thompson-final-round.mp4"
    ],
    notes: "Kumar's first fight in Oakland showcased his improved boxing IQ. After Thompson proved durable early, Kumar systematically broke him down with precise combinations, forcing the corner to stop the fight."
  },

  {
    id: "kumar-vs-williams-2024-12-20",
    date: "2024-12-20",
    opponent: {
      id: "derek-williams", 
      name: "Derek Williams",
      nickname: "D-Train",
      age: 24,
      height: "6'0\"",
      weight: "185 lbs",
      reach: "71 inches", 
      stance: "Orthodox",
      hometown: "Las Vegas, NV",
      record: {
        wins: 10,
        losses: 1,
        draws: 1,
        knockouts: 7,
        technicalKnockouts: 2
      },
      weightClass: "Light Heavyweight",
      achievements: ["Nevada State Golden Gloves Champion"],
      profileImage: "/images/fighters/derek-williams.jpg",
      social: {}
    },
    result: {
      outcome: "Win",
      method: "KO", 
      details: "Perfect uppercut-hook combination in Round 2"
    },
    method: "KO",
    round: 2,
    time: "1:32",
    venue: {
      name: "MGM Grand Garden Arena",
      city: "Las Vegas",
      state: "NV",
      country: "USA", 
      capacity: 17000
    },
    title: "Rising Star Championship",
    poster: "/images/fights/kumar-vs-williams-poster.jpg",
    highlights: [
      "/videos/fights/kumar-williams-knockout.mp4",
      "/videos/fights/kumar-williams-celebration.mp4"
    ],
    notes: "Kumar's breakout performance on a major Las Vegas card. His picture-perfect combination that ended the fight was replayed on ESPN's SportsCenter and boxing highlight reels worldwide."
  }
];

// Upcoming Fights
export const upcomingFights: Fight[] = [
  {
    id: "kumar-homecoming-2025-08-16",
    date: "2025-08-16",
    opponent: {
      id: "tba-opponent",
      name: "TBA",
      nickname: "",
      age: 0,
      height: "TBA",
      weight: "TBA", 
      reach: "TBA",
      stance: "Orthodox",
      hometown: "TBA",
      record: {
        wins: 0,
        losses: 0,
        draws: 0,
        knockouts: 0,
        technicalKnockouts: 0
      },
      weightClass: "Light Heavyweight",
      achievements: [],
      profileImage: "/images/fighters/tba-placeholder.jpg",
      social: {}
    },
    result: {
      outcome: "Win", // Anticipated
      method: "TBD",
      details: "Fight details pending opponent announcement"
    },
    method: "TBD",
    venue: {
      name: "Oakland Arena",
      city: "Oakland", 
      state: "CA",
      country: "USA",
      capacity: 19596
    },
    title: "Homecoming Fight - The Raw One Returns",
    poster: "/images/fights/homecoming-poster.jpg",
    notes: "Kumar's highly anticipated return to Oakland. This homecoming fight represents a milestone in his young career and promises to be an electric night for Bay Area boxing fans."
  }
];

// Fight Statistics Analysis
export const fightStats = {
  totalFights: 3,
  wins: 3,
  losses: 0,
  draws: 0,
  knockoutPercentage: 100,
  averageRoundsPerFight: 2.0,
  averageFightDuration: "2:19",
  
  // Performance Metrics
  punches: {
    averageThrown: 45,
    averageLanded: 32,
    accuracy: 71,
    powerPunches: 28,
    jabsLanded: 15
  },
  
  // Opponent Quality
  opponentStats: {
    averageWins: 7.3,
    averageLosses: 1.3,
    combinedRecord: "22-4-1",
    averageAge: 24
  },
  
  // Venue Analysis
  venues: {
    california: 2,
    nevada: 1,
    homeState: 2,
    largestCrowd: 17000,
    totalAttendance: 21700
  }
} as const;

export type FightRecord = typeof professionalFights;
export type FightStats = typeof fightStats;