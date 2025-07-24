import React from 'react';
import { Helmet } from 'react-helmet-async';
import {
  fightEventSchema,
  athleteSchema,  
  organizationSchema,
  gymSchema,
  faqSchema,
  generateBreadcrumbSchema,
  type StructuredData as StructuredDataType
} from '../../data/seo-metadata';

interface StructuredDataProps {
  schema: StructuredDataType | StructuredDataType[];
  children?: React.ReactNode;
}

interface BoxingEventProps {
  eventName: string;
  eventDate: string;
  venue: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  fighters: Array<{
    name: string;
    nickname?: string;
    record?: string;
    instagram?: string;
    twitter?: string;
  }>;
  ticketUrl?: string;
  ticketPriceRange?: {
    min: number;
    max: number;
  };
  broadcastNetwork?: string;
  promoter?: string;
}

interface BoxingFighterProps {
  name: string;
  nickname?: string;
  birthDate?: string;
  birthPlace?: string;
  nationality?: string;
  height?: string;
  weight?: string;
  stance?: 'Orthodox' | 'Southpaw' | 'Switch';
  record?: {
    wins: number;
    losses: number;
    draws: number;
    knockouts: number;
  };
  titles?: string[];
  achievements?: string[];
  socialMedia?: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string;
  };
  gym?: string;
  trainer?: string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

// Base structured data component
const StructuredData: React.FC<StructuredDataProps> = ({ schema, children }) => {
  const schemaArray = Array.isArray(schema) ? schema : [schema];
  
  return (
    <>
      <Helmet>
        {schemaArray.map((schemaObj, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(schemaObj, null, 2)
            }}
          />
        ))}
      </Helmet>
      {children}
    </>
  );
};

// Boxing event structured data component
export const BoxingEventStructuredData: React.FC<BoxingEventProps> = ({
  eventName,
  eventDate,
  venue,
  address,
  fighters,  
  ticketUrl,
  ticketPriceRange,
  broadcastNetwork,
  promoter
}) => {
  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": eventName,
    "description": `${fighters.map(f => f.name).join(' vs ')} - Professional Boxing Match`,
    "startDate": eventDate,
    "sport": "Boxing",
    "location": {
      "@type": "Place",
      "name": venue,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": address.street,
        "addressLocality": address.city,
        "addressRegion": address.state,
        "postalCode": address.zip,
        "addressCountry": "US"
      }
    },
    "organizer": promoter ? {
      "@type": "Organization",
      "name": promoter
    } : undefined,
    "performer": fighters.map(fighter => ({
      "@type": "Person",
      "name": fighter.name,
      "alternateName": fighter.nickname,
      "description": `Professional boxer with record ${fighter.record || 'TBD'}`,
      "sameAs": [
        fighter.instagram,
        fighter.twitter
      ].filter(Boolean)
    })),
    "offers": ticketUrl && ticketPriceRange ? {
      "@type": "Offer",
      "name": "Boxing Event Tickets",
      "url": ticketUrl,
      "priceCurrency": "USD",
      "lowPrice": ticketPriceRange.min,
      "highPrice": ticketPriceRange.max,
      "availability": "https://schema.org/InStock"
    } : undefined,
    "broadcastingService": broadcastNetwork ? {
      "@type": "BroadcastService",
      "name": broadcastNetwork,
      "broadcastDisplayName": broadcastNetwork
    } : undefined
  };

  return <StructuredData schema={eventSchema} />;
};

// Boxing fighter structured data component  
export const BoxingFighterStructuredData: React.FC<BoxingFighterProps> = ({
  name,
  nickname,
  birthDate,
  birthPlace,
  nationality,
  height,
  weight,
  stance,
  record,
  titles,
  achievements,
  socialMedia,
  gym,
  trainer
}) => {
  const fightRecord = record ? `${record.wins}-${record.losses}-${record.draws}` : undefined;
  const koPercentage = record ? Math.round((record.knockouts / record.wins) * 100) : undefined;

  const fighterSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": name,
    "alternateName": nickname,
    "description": `Professional boxer${fightRecord ? ` with record ${fightRecord}` : ''}${koPercentage ? ` and ${koPercentage}% knockout rate` : ''}`,
    "birthDate": birthDate,
    "birthPlace": birthPlace ? {
      "@type": "Place",
      "name": birthPlace
    } : undefined,
    "nationality": nationality,
    "height": height,
    "weight": weight,
    "jobTitle": "Professional Boxer",
    "sport": "Boxing",
    "award": [
      ...(titles || []),
      ...(achievements || []),
      fightRecord ? `Professional Record: ${fightRecord}` : undefined,
      koPercentage ? `Knockout Rate: ${koPercentage}%` : undefined
    ].filter(Boolean),
    "sameAs": socialMedia ? [
      socialMedia.instagram,
      socialMedia.twitter,
      socialMedia.youtube,
      socialMedia.tiktok
    ].filter(Boolean) : undefined,
    "memberOf": gym ? {
      "@type": "SportsTeam",
      "name": gym,
      "sport": "Boxing"
    } : undefined,
    "coach": trainer ? {
      "@type": "Person",
      "name": trainer,
      "jobTitle": "Boxing Trainer"
    } : undefined,
    "additionalProperty": [
      stance ? {
        "@type": "PropertyValue",
        "name": "Fighting Stance",
        "value": stance
      } : undefined,
      record ? {
        "@type": "PropertyValue", 
        "name": "Professional Record",
        "value": fightRecord
      } : undefined
    ].filter(Boolean)
  };

  return <StructuredData schema={fighterSchema} />;
};

// Breadcrumb structured data component
export const BreadcrumbStructuredData: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return <StructuredData schema={breadcrumbSchema} />;
};

// Boxing gym/organization structured data
export const BoxingGymStructuredData: React.FC<{
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  phone?: string;
  website?: string;
  openingHours?: string[];
  description?: string;
  trainers?: string[];
  fighters?: string[];
}> = ({ name, address, phone, website, openingHours, description, trainers, fighters }) => {
  const gymSchema = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    "name": name,
    "description": description || `Professional boxing training facility`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": address.street,
      "addressLocality": address.city,
      "addressRegion": address.state,
      "postalCode": address.zip,
      "addressCountry": "US"
    },
    "telephone": phone,
    "url": website,
    "sport": "Boxing",
    "openingHours": openingHours,
    "employee": trainers?.map(trainer => ({
      "@type": "Person",
      "name": trainer,
      "jobTitle": "Boxing Trainer"
    })),
    "alumniOf": fighters?.map(fighter => ({
      "@type": "Person", 
      "name": fighter,
      "jobTitle": "Professional Boxer"
    }))
  };

  return <StructuredData schema={gymSchema} />;
};

// FAQ structured data for boxing-related questions
export const BoxingFAQStructuredData: React.FC<{
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}> = ({ faqs }) => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return <StructuredData schema={faqSchema} />;
};

// Website organization structured data
export const WebsiteOrganizationStructuredData: React.FC<{
  name: string;
  alternateName?: string;
  description: string;
  url: string;
  logo?: string;
  socialMedia?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    youtube?: string;
  };
  contactInfo?: {
    email?: string;
    phone?: string;
  };
}> = ({ name, alternateName, description, url, logo, socialMedia, contactInfo }) => {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": name,
    "alternateName": alternateName,
    "description": description,
    "url": url,
    "logo": logo,
    "sameAs": socialMedia ? [
      socialMedia.instagram,
      socialMedia.twitter,
      socialMedia.facebook,
      socialMedia.youtube
    ].filter(Boolean) : undefined,
    "contactPoint": contactInfo ? {
      "@type": "ContactPoint",
      "contactType": "General Inquiries",
      "email": contactInfo.email,
      "telephone": contactInfo.phone
    } : undefined
  };

  return <StructuredData schema={orgSchema} />;
};

// Video structured data for training/fight videos
export const BoxingVideoStructuredData: React.FC<{
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration?: string;
  embedUrl?: string;
  fighter?: string;
  category?: 'Training' | 'Fight' | 'Interview' | 'Highlights';
}> = ({ name, description, thumbnailUrl, uploadDate, duration, embedUrl, fighter, category }) => {
  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": name,
    "description": description,
    "thumbnailUrl": thumbnailUrl,
    "uploadDate": uploadDate,
    "duration": duration,
    "embedUrl": embedUrl,
    "about": fighter ? {
      "@type": "Person",
      "name": fighter,
      "jobTitle": "Professional Boxer"
    } : undefined,
    "genre": category,
    "sport": "Boxing",
    "keywords": [
      "boxing",
      fighter,
      category?.toLowerCase(),
      "professional boxing",
      "training"
    ].filter(Boolean).join(", ")
  };

  return <StructuredData schema={videoSchema} />;
};

// Pre-configured Kumar Prescod schemas
export const KumarPrescod = {
  // Kumar's fighter profile
  Fighter: () => (
    <BoxingFighterStructuredData
      name="Kumar Prescod"
      nickname="The Raw One"
      birthDate="2006-03-15"
      birthPlace="Oakland, California, USA"
      nationality="American"
      height="6 feet 0 inches"
      weight="185 lbs"
      stance="Orthodox"
      record={{
        wins: 3,
        losses: 0,
        draws: 0,
        knockouts: 3
      }}
      achievements={[
        "Perfect 3-0 Professional Record",
        "100% Knockout Rate",
        "2023 Golden Gloves Bay Area Champion",
        "2022 Junior Olympic Regional Finalist"
      ]}
      socialMedia={{
        instagram: "https://www.instagram.com/kumarprescod_raw",
        twitter: "https://twitter.com/KumarTheRaw",
        youtube: "https://www.youtube.com/channel/KumarPrescod",
        tiktok: "https://www.tiktok.com/@rawoneboxing"
      }}
      gym="Oakland Boxing Academy"
      trainer="Marcus 'Big Mac' Johnson"
    />
  ),

  // Homecoming fight event
  HomecomingFight: () => (
    <BoxingEventStructuredData
      eventName="Kumar Prescod Homecoming Fight - Straight Outta Oakland"
      eventDate="2025-08-16T19:00:00-07:00"
      venue="Oakland Marriott City Center"
      address={{
        street: "1001 Broadway",
        city: "Oakland", 
        state: "CA",
        zip: "94607"
      }}
      fighters={[
        {
          name: "Kumar Prescod",
          nickname: "The Raw One",
          record: "3-0 (3 KOs)",
          instagram: "https://www.instagram.com/kumarprescod_raw",
          twitter: "https://twitter.com/KumarTheRaw"
        }
      ]}
      ticketUrl="https://www.paypal.com/ncp/payment/DE5Y9AGCDPUBY"
      ticketPriceRange={{ min: 105, max: 500 }}
      broadcastNetwork="FOX Sports"
      promoter="G1 & Lion's Den Promotions"
    />
  ),

  // Website organization
  Organization: () => (
    <WebsiteOrganizationStructuredData
      name="Kumar Prescod Boxing"
      alternateName="The Raw One Boxing"
      description="Official website of Kumar 'The Raw One' Prescod, undefeated professional boxer from Oakland, CA"
      url="https://kumarprescod.com"
      logo="https://kumarprescod.com/images/logo.png"
      socialMedia={{
        instagram: "https://www.instagram.com/kumarprescod_raw",
        twitter: "https://twitter.com/KumarTheRaw",
        facebook: "https://www.facebook.com/KumarPrescod",
        youtube: "https://www.youtube.com/channel/KumarPrescod"
      }}
      contactInfo={{
        email: "info@kumarprescod.com"
      }}
    />
  ),

  // Boxing gym
  Gym: () => (
    <BoxingGymStructuredData
      name="Oakland Boxing Academy"
      address={{
        street: "1234 Oakland Ave",
        city: "Oakland",
        state: "CA", 
        zip: "94601"
      }}
      phone="+1-510-555-0123"
      description="Premier boxing training facility in Oakland, CA. Home gym of professional boxer Kumar 'The Raw One' Prescod"
      openingHours={[
        "Mo-Fr 06:00-22:00",
        "Sa-Su 08:00-20:00"
      ]}
      trainers={["Marcus 'Big Mac' Johnson"]}
      fighters={["Kumar 'The Raw One' Prescod"]}
    />
  ),

  // Common boxing FAQs
  FAQ: () => (
    <BoxingFAQStructuredData
      faqs={[
        {
          question: "When is Kumar Prescod's next fight?",
          answer: "Kumar Prescod's homecoming fight is scheduled for August 16, 2025, at Oakland Marriott City Center in Oakland, California."
        },
        {
          question: "What is Kumar Prescod's professional boxing record?",
          answer: "Kumar 'The Raw One' Prescod has a perfect professional record of 3-0 with 3 knockouts (100% knockout rate)."
        },
        {
          question: "How can I buy tickets for Kumar Prescod's fights?",
          answer: "Tickets for Kumar Prescod's fights are available through official channels including the Kumar Prescod website. VIP packages and meet-and-greet opportunities are also available."
        },
        {
          question: "Where does Kumar Prescod train?",
          answer: "Kumar Prescod trains at Oakland Boxing Academy in Oakland, California, under head trainer Marcus 'Big Mac' Johnson."
        }
      ]}
    />
  )
};

export default StructuredData;