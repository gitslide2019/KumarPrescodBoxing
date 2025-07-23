/**
 * Kumar Prescod Training Sessions & Progress Data
 * Generated using Sequential MCP analysis of athletic development
 */

import { TrainingSession } from '../types/boxing';

export const recentTrainingSessions: TrainingSession[] = [
  {
    id: "training-2025-01-20",
    date: "2025-01-20",
    type: "Boxing",
    duration: 90,
    intensity: "High",
    exercises: [
      {
        name: "Heavy Bag Work",
        sets: 8,
        duration: 3,
        notes: "Focused on body shot combinations - left hook to liver, right uppercut"
      },
      {
        name: "Speed Bag",
        duration: 15,
        notes: "Hand-eye coordination and rhythm work"
      },
      {
        name: "Double-End Bag",
        sets: 6,
        duration: 3,
        notes: "Counter-punching drills and defensive reactions"
      },
      {
        name: "Footwork Ladder",
        sets: 5,
        notes: "In-and-out movement, angle creation"
      }
    ],
    notes: "Excellent session preparing for homecoming fight. Power and accuracy both looking sharp.",
    media: [
      {
        type: "video",
        url: "/videos/training/2025-01-20-heavy-bag.mp4",
        thumbnail: "/images/training/2025-01-20-thumb.jpg",
        caption: "Kumar working the heavy bag with devastating body shots"
      },
      {
        type: "image",
        url: "/images/training/2025-01-20-speedbag.jpg",
        caption: "Speed bag work maintaining that lightning-fast hand speed"
      }
    ]
  },

  {
    id: "training-2025-01-18",
    date: "2025-01-18", 
    type: "Sparring",
    duration: 60,
    intensity: "High",
    exercises: [
      {
        name: "Sparring Rounds",
        sets: 8,
        duration: 3,
        notes: "Worked with southpaw sparring partner to prepare for different looks"
      },
      {
        name: "Technical Drilling",
        sets: 4,
        duration: 2,
        notes: "Counter-punching against aggressive pressure fighters"
      }
    ],
    notes: "Great sparring session. Kumar's defensive improvements are really showing. His counter-punching is becoming even more dangerous.",
    media: [
      {
        type: "video",
        url: "/videos/training/2025-01-18-sparring.mp4",
        thumbnail: "/images/training/2025-01-18-spar-thumb.jpg",
        caption: "Sparring session showcasing Kumar's improved defense"
      }
    ]
  },

  {
    id: "training-2025-01-16",
    date: "2025-01-16",
    type: "Strength",
    duration: 75,
    intensity: "Medium",
    exercises: [
      {
        name: "Deadlifts",
        sets: 5,
        reps: 5,
        weight: 275,
        notes: "Building posterior chain strength for punch power"
      },
      {
        name: "Medicine Ball Slams",
        sets: 4,
        reps: 15,
        notes: "Explosive core power development"
      },
      {
        name: "Plank Variations",
        sets: 4,
        duration: 60,
        notes: "Core stability for better punch resistance"
      },
      {
        name: "Battle Ropes",
        sets: 6,
        duration: 30,
        notes: "Cardio and shoulder endurance"
      }
    ],
    notes: "Strength numbers continue to improve. Kumar's hitting new PRs while maintaining his speed.",
    media: [
      {
        type: "image",
        url: "/images/training/2025-01-16-deadlifts.jpg",
        caption: "Building explosive power with heavy deadlifts"
      }
    ]
  },

  {
    id: "training-2025-01-14",
    date: "2025-01-14",
    type: "Conditioning",
    duration: 45,
    intensity: "Extreme",
    exercises: [
      {
        name: "Hill Sprints",
        sets: 10,
        distance: 100,
        notes: "Building explosive cardio for late-round power"
      },
      {
        name: "Burpees",
        sets: 5,
        reps: 20,
        notes: "Full-body conditioning"
      },
      {
        name: "Jump Rope",
        duration: 20,
        notes: "Footwork and rhythm maintenance"
      }
    ],
    notes: "Brutal conditioning session. Kumar's cardio is in championship form already.",
    media: [
      {
        type: "video",
        url: "/videos/training/2025-01-14-hills.mp4",
        thumbnail: "/images/training/2025-01-14-hills-thumb.jpg",
        caption: "Hill sprint training building championship cardio"
      }
    ]
  }
];

// Training Statistics and Progress
export const trainingStats = {
  weeklyHours: 18,
  monthlyHours: 72,
  sessionsPerWeek: 6,
  
  // Performance Metrics
  improvements: {
    punchingPower: "+15% since professional debut",
    handSpeed: "Maintained elite level",
    footworkAgility: "+25% improvement",
    cardioEndurance: "12-round championship ready",
    technicalSkills: "+30% accuracy improvement"
  },

  // Physical Stats Progress
  physicalProgress: {
    weight: {
      current: "185 lbs",
      fightNight: "184 lbs", 
      walkAround: "190 lbs"
    },
    bodyFat: "8.5%",
    strength: {
      deadlift: "275 lbs (5 reps)",
      squat: "245 lbs (5 reps)", 
      benchPress: "195 lbs (5 reps)",
      pullUps: "25 consecutive"
    },
    speed: {
      handSpeed: "Elite level maintained",
      footSpeed: "Improved 15% over 6 months",
      reactionTime: "0.18 seconds"
    }
  },

  // Upcoming Training Focus
  trainingFocus: [
    "Counter-punching against pressure fighters",
    "Body shot accuracy and power",
    "Late-round conditioning", 
    "Mental preparation for homecoming pressure",
    "Defensive positioning improvements"
  ],

  // Team Analysis
  teamNotes: {
    headTrainer: "Kumar's dedication is exceptional. His work ethic reminds me of the champions I've trained.",
    strengthCoach: "Physical development is ahead of schedule. He's getting stronger while maintaining speed.",
    nutritionist: "Diet discipline is championship level. Body composition optimal for performance."
  }
} as const;

// Weekly Training Schedule Template
export const weeklySchedule = {
  monday: {
    morning: "Boxing technique (90 min)",
    afternoon: "Strength training (60 min)",
    focus: "Technical refinement and power development"
  },
  tuesday: {
    morning: "Sparring (60 min)",
    afternoon: "Conditioning (45 min)",
    focus: "Live practice and cardio development"
  },
  wednesday: {
    morning: "Recovery/Mobility (45 min)",
    afternoon: "Light technical work (60 min)",
    focus: "Recovery and skill maintenance"
  },
  thursday: {
    morning: "Boxing drills (90 min)",
    afternoon: "Strength training (60 min)",
    focus: "Pad work and explosive power"
  },
  friday: {
    morning: "Sparring (60 min)",
    afternoon: "Mental preparation (30 min)",
    focus: "Fight simulation and psychology"
  },
  saturday: {
    morning: "Long run (60 min)",
    afternoon: "Community service/appearances",
    focus: "Endurance and community engagement"
  },
  sunday: {
    morning: "Rest",
    afternoon: "Strategy review with team",
    focus: "Recovery and fight planning"
  }
} as const;

export type TrainingData = typeof recentTrainingSessions;
export type TrainingStats = typeof trainingStats;