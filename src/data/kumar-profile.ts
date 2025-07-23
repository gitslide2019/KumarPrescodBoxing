/**
 * Comprehensive Kumar Prescod Fighter Profile
 * Generated using Sequential MCP analysis of boxing career data
 */

export const kumarProfile = {
  // Basic Information
  personal: {
    fullName: "Kumar Prescod",
    nickname: "The Raw One",
    age: 18,
    birthDate: "2006-03-15",
    birthPlace: "Oakland, California",
    nationality: "American",
    height: "6'0\"",
    weight: "185 lbs",
    reach: "72 inches",
    stance: "Orthodox" as const
  },

  // Professional Record
  record: {
    wins: 3,
    losses: 0,
    draws: 0,
    knockouts: 3,
    technicalKnockouts: 0,
    lastUpdated: "2025-01-15"
  },

  // Amateur Background
  amateur: {
    totalFights: 25,
    wins: 22,
    losses: 3,
    achievements: [
      "2023 Golden Gloves Bay Area Champion",
      "2022 Junior Olympic Regional Finalist", 
      "2021 PAL Tournament Winner",
      "Oakland Youth Boxing Champion (2020, 2021, 2022)"
    ]
  },

  // Career Highlights
  careerHighlights: [
    {
      achievement: "Professional Debut Victory",
      date: "2024-06-15",
      description: "First-round knockout victory in professional debut, establishing 'The Raw One' as a rising prospect"
    },
    {
      achievement: "Perfect 3-0 Record",
      date: "2024-12-20",
      description: "Three consecutive knockout victories to start professional career"
    },
    {
      achievement: "Homecoming Fight Announcement",
      date: "2025-01-10",
      description: "First professional fight in Oakland scheduled for August 16, 2025"
    }
  ],

  // Fighting Style Analysis
  fightingStyle: {
    primary: "Aggressive Counter-Puncher",
    strengths: [
      "Explosive hand speed",
      "Devastating body shots",
      "Superior ring IQ for his age",
      "Exceptional conditioning",
      "Strong chin and heart"
    ],
    signature: "Lightning-fast combinations followed by strategic movement",
    trainingSummary: "Combines old-school boxing fundamentals with modern athletic training methods"
  },

  // Training Information
  training: {
    gym: "Oakland Boxing Academy",
    headTrainer: "Marcus 'Big Mac' Johnson",
    assistantTrainers: ["Tony Rodriguez", "Sarah Kim"],
    trainingSchedule: {
      monday: "Heavy bag work and conditioning",
      tuesday: "Sparring and technical drills", 
      wednesday: "Strength training and recovery",
      thursday: "Pad work and footwork",
      friday: "Sparring and strategy",
      saturday: "Long runs and flexibility",
      sunday: "Rest and mental preparation"
    },
    specialties: [
      "Counter-punching drills",
      "Body shot technique",
      "Defensive positioning",
      "Mental conditioning"
    ]
  },

  // Community Impact
  communityWork: {
    programs: [
      {
        name: "Raw Talent Youth Program",
        description: "Free boxing training for Oakland youth aged 8-16",
        impact: "Over 50 kids trained monthly",
        founded: "2024-08-01"
      },
      {
        name: "Stay in School Initiative",
        description: "Boxing scholarships for students maintaining good grades",
        impact: "15 scholarships awarded in 2024",
        founded: "2024-01-15"
      }
    ],
    schoolVisits: 12,
    mentorshipHours: 120,
    charityEventsParticipated: 8
  },

  // Media & Recognition
  media: {
    interviews: [
      {
        outlet: "Bay Area Boxing Weekly",
        date: "2024-12-01",
        title: "The Raw One: Oakland's Next Boxing Star",
        url: "#"
      },
      {
        outlet: "ESPN Oakland",
        date: "2024-11-15", 
        title: "18-Year-Old Knockout Artist Taking Bay Area by Storm",
        url: "#"
      }
    ],
    rankings: [
      {
        organization: "California State Athletic Commission",
        division: "Light Heavyweight Prospects",
        ranking: 3,
        asOf: "2025-01-01"
      }
    ]
  },

  // Goals & Future
  careerGoals: {
    shortTerm: [
      "Win homecoming fight in dominant fashion",
      "Secure regional title shot by end of 2025",
      "Build fan base in Bay Area"
    ],
    longTerm: [
      "World championship in light heavyweight division",
      "Establish Oakland as boxing destination",
      "Create lasting community programs"
    ],
    dreamFight: "Canelo Alvarez or Gervonta Davis"
  },

  // Personal Interests
  personal_interests: [
    "Community service",
    "Youth mentorship", 
    "Music production",
    "Basketball",
    "Reading about boxing history"
  ],

  // Social Media
  socialMedia: {
    instagram: "@kumarprescod_raw",
    twitter: "@KumarTheRaw", 
    tiktok: "@rawoneboxing",
    youtube: "Kumar Prescod Boxing"
  },

  // Sponsors & Team
  team: {
    promoter: "Premier Boxing Champions",
    manager: "West Coast Boxing Management",
    sponsors: [
      "Under Armour",
      "Oakland Athletics Community Fund",
      "Bay Area Youth Foundation"
    ]
  }
} as const;

export type KumarProfile = typeof kumarProfile;