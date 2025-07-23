/**
 * SEO Metadata and Structured Data for Kumar Prescod Boxing Website
 * Optimized using Context7 research on boxing industry standards
 */

// Structured Data for Boxing Events (Schema.org)
export const fightEventSchema = {
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  "name": "Kumar Prescod Homecoming Fight",
  "description": "Kumar 'The Raw One' Prescod returns to Oakland for his highly anticipated homecoming fight at Oakland Arena",
  "startDate": "2025-08-16T19:00:00-07:00",
  "endDate": "2025-08-16T23:00:00-07:00",
  "location": {
    "@type": "Place",
    "name": "Oakland Arena",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "7000 Coliseum Way",
      "addressLocality": "Oakland",
      "addressRegion": "CA",
      "postalCode": "94621",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "37.7503",
      "longitude": "-122.2011"
    }
  },
  "organizer": {
    "@type": "Organization",
    "name": "Premier Boxing Champions",
    "url": "https://www.premierboxingchampions.com/"
  },
  "performer": [
    {
      "@type": "Person",
      "name": "Kumar Prescod",
      "description": "Professional boxer from Oakland, CA",
      "sameAs": [
        "https://www.instagram.com/kumarprescod_raw",
        "https://twitter.com/KumarTheRaw"
      ]
    }
  ],
  "offers": {
    "@type": "Offer",
    "name": "Fight Tickets",
    "url": "https://kumarprescod.com/tickets/checkout",
    "priceCurrency": "USD",
    "lowPrice": "50",
    "highPrice": "500",
    "availability": "https://schema.org/InStock"
  }
};

// Athlete Profile Structured Data
export const athleteSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Kumar Prescod",
  "alternateName": "The Raw One",
  "description": "18-year-old professional boxer from Oakland, CA with a perfect 3-0 record and 100% knockout rate",
  "birthDate": "2006-03-15",
  "birthPlace": {
    "@type": "Place",
    "name": "Oakland, California, USA"
  },
  "nationality": "American",
  "height": "6 feet 0 inches",
  "weight": "185 lbs",
  "jobTitle": "Professional Boxer",
  "sport": "Boxing",
  "award": [
    "2023 Golden Gloves Bay Area Champion",
    "2022 Junior Olympic Regional Finalist",
    "Perfect 3-0 Professional Record"
  ],
  "sameAs": [
    "https://www.instagram.com/kumarprescod_raw",
    "https://twitter.com/KumarTheRaw",
    "https://www.tiktok.com/@rawoneboxing",
    "https://www.youtube.com/channel/KumarPrescod"
  ],
  "image": "https://kumarprescod.com/images/kumar-prescod-profile.jpg",
  "url": "https://kumarprescod.com"
};

// Organization Schema for Kumar Prescod Brand
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Kumar Prescod Boxing",
  "alternateName": "The Raw One Boxing",
  "description": "Official website of Kumar 'The Raw One' Prescod, professional boxer from Oakland, CA",
  "url": "https://kumarprescod.com",
  "logo": "https://kumarprescod.com/images/logo.png",
  "image": "https://kumarprescod.com/images/kumar-prescod-hero.jpg",
  "foundingDate": "2024-06-15",
  "foundingLocation": {
    "@type": "Place",
    "name": "Oakland, California, USA"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "General Inquiries",
    "email": "info@kumarprescod.com"
  },
  "sameAs": [
    "https://www.instagram.com/kumarprescod_raw",
    "https://twitter.com/KumarTheRaw",
    "https://www.facebook.com/KumarPrescod",
    "https://www.youtube.com/channel/KumarPrescod"
  ]
};

// Page-specific SEO metadata
export const pageMetadata = {
  home: {
    title: "Kumar Prescod - Professional Boxer | The Raw One | Oakland, CA",
    description: "Follow the journey of Kumar 'The Raw One' Prescod, 18-year-old undefeated professional boxer from Oakland, CA. Buy tickets, merchandise, and stay updated with fights and news.",
    keywords: "Kumar Prescod, The Raw One, Oakland boxer, professional boxing, undefeated boxer, Bay Area boxing, Oakland Arena, boxing tickets",
    canonical: "https://kumarprescod.com/",
    openGraph: {
      title: "Kumar 'The Raw One' Prescod - Undefeated Professional Boxer",
      description: "18-year-old boxing sensation from Oakland with perfect 3-0 record and 100% knockout rate. Homecoming fight August 16, 2025.",
      image: "https://kumarprescod.com/images/og-home.jpg",
      url: "https://kumarprescod.com/"
    },
    twitter: {
      card: "summary_large_image",
      title: "Kumar 'The Raw One' Prescod - Oakland's Boxing Star",
      description: "Undefeated professional boxer returning home to Oakland Arena August 16, 2025",
      image: "https://kumarprescod.com/images/twitter-home.jpg"
    }
  },
  
  fights: {
    title: "Kumar Prescod Fights | Fight Schedule & Results | The Raw One",
    description: "View Kumar Prescod's complete fight record, upcoming bouts, and fight highlights. Perfect 3-0 record with 100% knockout rate. Next fight: Oakland Arena August 16, 2025.",
    keywords: "Kumar Prescod fights, boxing schedule, fight results, Oakland Arena, boxing tickets, professional boxing record",
    canonical: "https://kumarprescod.com/fights",
    openGraph: {
      title: "Kumar Prescod Fight Schedule & Results",
      description: "Perfect 3-0 record with 100% knockout rate. Homecoming fight at Oakland Arena August 16, 2025.",
      image: "https://kumarprescod.com/images/og-fights.jpg",
      url: "https://kumarprescod.com/fights"
    }
  },

  about: {
    title: "About Kumar Prescod | The Raw One's Boxing Journey | Oakland Boxer",
    description: "Learn about Kumar 'The Raw One' Prescod's journey from amateur standout to undefeated professional boxer. Oakland native making waves in boxing world.",
    keywords: "Kumar Prescod biography, Oakland boxer, The Raw One story, professional boxing career, Golden Gloves champion",
    canonical: "https://kumarprescod.com/about",
    openGraph: {
      title: "About Kumar 'The Raw One' Prescod",
      description: "From Oakland amateur champion to undefeated professional boxer. The inspiring journey of an 18-year-old boxing sensation.",
      image: "https://kumarprescod.com/images/og-about.jpg",
      url: "https://kumarprescod.com/about"
    }
  },

  shop: {
    title: "Kumar Prescod Merchandise | Official Boxing Gear | The Raw One Shop",
    description: "Shop official Kumar 'The Raw One' Prescod merchandise. Boxing gear, apparel, and exclusive items from Oakland's undefeated boxing star.",
    keywords: "Kumar Prescod merchandise, boxing gear, The Raw One apparel, Oakland boxing, professional boxer merch",
    canonical: "https://kumarprescod.com/shop",
    openGraph: {
      title: "Official Kumar Prescod Merchandise Store",
      description: "Exclusive gear and apparel from Oakland's undefeated boxing sensation",
      image: "https://kumarprescod.com/images/og-shop.jpg",
      url: "https://kumarprescod.com/shop"
    }
  },

  journey: {
    title: "Kumar Prescod's Boxing Journey | From Amateur to Pro | The Raw One",
    description: "Follow Kumar Prescod's complete boxing journey from Oakland amateur tournaments to professional success. Training updates, fight preparation, and career milestones.",
    keywords: "Kumar Prescod journey, boxing training, professional boxer career, Oakland boxing story, The Raw One training",
    canonical: "https://kumarprescod.com/journey",
    openGraph: {
      title: "The Raw One's Boxing Journey",
      description: "From Oakland gyms to professional success - follow Kumar Prescod's complete boxing story",
      image: "https://kumarprescod.com/images/og-journey.jpg",
      url: "https://kumarprescod.com/journey"
    }
  }
};

// Local Business Schema for Oakland Boxing Academy
export const gymSchema = {
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  "name": "Oakland Boxing Academy",
  "description": "Premier boxing training facility in Oakland, CA. Home gym of professional boxer Kumar 'The Raw One' Prescod",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "1234 Oakland Ave",
    "@addressLocality": "Oakland",
    "addressRegion": "CA",
    "postalCode": "94601",
    "addressCountry": "US"
  },
  "telephone": "+1-510-555-0123",
  "sport": "Boxing",
  "hasMap": "https://maps.google.com/maps?q=Oakland+Boxing+Academy",
  "openingHours": [
    "Mo-Fr 06:00-22:00",
    "Sa-Su 08:00-20:00"
  ]
};

// FAQ Schema for Boxing-related Questions
export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "When is Kumar Prescod's next fight?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Kumar Prescod's homecoming fight is scheduled for August 16, 2025, at Oakland Arena in Oakland, California."
      }
    },
    {
      "@type": "Question", 
      "name": "What is Kumar Prescod's professional boxing record?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Kumar 'The Raw One' Prescod has a perfect professional record of 3-0 with 3 knockouts (100% knockout rate)."
      }
    },
    {
      "@type": "Question",
      "name": "How can I buy tickets for Kumar Prescod's fights?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Tickets for Kumar Prescod's fights are available through official channels including Ticketmaster and the Kumar Prescod website. VIP packages and meet-and-greet opportunities are also available."
      }
    },
    {
      "@type": "Question",
      "name": "Where does Kumar Prescod train?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Kumar Prescod trains at Oakland Boxing Academy in Oakland, California, under head trainer Marcus 'Big Mac' Johnson."
      }
    }
  ]
};

// Breadcrumb Schema
export const generateBreadcrumbSchema = (path: string[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": path.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item,
    "item": `https://kumarprescod.com${path.slice(0, index + 1).join('/').toLowerCase()}`
  }))
});

export type SEOMetadata = typeof pageMetadata;
export type StructuredData = typeof fightEventSchema;