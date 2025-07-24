// Ticket Purchase Tracking Utilities
// Enhanced tracking system for Kumar Prescod Boxing ticket sales

export interface TicketTrackingData {
  source: string;
  component: string;
  page: string;
  ticketType: string;
  price: number;
  membershipTier?: string;
}

export interface PayPalConfig {
  baseUrl: string;
  returnUrl?: string;
  cancelUrl?: string;
}

const PAYPAL_BASE_URL = 'https://www.paypal.com/ncp/payment/DE5Y9AGCDPUBY';

/**
 * Generate enhanced PayPal URL with UTM tracking parameters
 */
export const generateTrackedPayPalUrl = (trackingData: TicketTrackingData): string => {
  const { source, component, page, ticketType, membershipTier } = trackingData;
  
  // Generate UTM parameters
  const utmParams = new URLSearchParams({
    utm_source: source,
    utm_medium: 'website',
    utm_campaign: 'kumar_prescod_homecoming_2025',
    utm_content: `${component}_${page}`,
    utm_term: ticketType,
    // Custom tracking parameters
    kp_source: source,
    kp_component: component,
    kp_page: page,
    kp_ticket_type: ticketType,
    kp_membership: membershipTier || 'none',
    kp_timestamp: new Date().toISOString(),
  });

  return `${PAYPAL_BASE_URL}?${utmParams.toString()}`;
};

/**
 * Generate return URL for PayPal success tracking
 */
export const generateReturnUrl = (trackingData: TicketTrackingData): string => {
  const baseUrl = window.location.origin;
  const params = new URLSearchParams({
    success: 'true',
    source: trackingData.source,
    component: trackingData.component,
    page: trackingData.page,
    ticket_type: trackingData.ticketType,
    membership_tier: trackingData.membershipTier || 'none',
  });
  
  return `${baseUrl}/ticket-success?${params.toString()}`;
};

/**
 * Generate cancel URL for PayPal cancel tracking
 */
export const generateCancelUrl = (trackingData: TicketTrackingData): string => {
  const baseUrl = window.location.origin;
  const params = new URLSearchParams({
    cancelled: 'true',
    source: trackingData.source,
    component: trackingData.component,
    page: trackingData.page,
  });
  
  return `${baseUrl}/ticket-checkout?${params.toString()}`;
};

/**
 * Track ticket purchase intent with enhanced data
 */
export const trackTicketIntent = (
  trackingData: TicketTrackingData,
  trackingFunctions: {
    trackTicketPurchaseIntent: (source: string, ticketType: string, price: number, membershipTier?: string) => void;
    trackTicketPurchaseSource: (source: string, component: string, page: string) => void;
    trackTicketPurchaseFunnel: (step: string, source: string, membershipTier?: string) => void;
  }
) => {
  const { source, component, page, ticketType, price, membershipTier } = trackingData;
  
  // Track the intent
  trackingFunctions.trackTicketPurchaseIntent(source, ticketType, price, membershipTier);
  
  // Track the source
  trackingFunctions.trackTicketPurchaseSource(source, component, page);
  
  // Track funnel step
  trackingFunctions.trackTicketPurchaseFunnel('intent', source, membershipTier);
};

/**
 * Predefined tracking sources for consistency
 */
export const TICKET_SOURCES = {
  HERO_SECTION: 'hero_cta',
  HOMECOMING_FIGHT: 'homecoming_fight_component',
  NAVBAR: 'navbar_tickets',
  HOME_CTA: 'home_page_cta',  
  TICKET_CHECKOUT: 'ticket_checkout_page',
  UPCOMING_FIGHTS: 'upcoming_fights_section',
  FOOTER: 'footer_tickets',
} as const;

/**
 * Predefined ticket types for consistency
 */
export const TICKET_TYPES = {
  VIP: 'vip',
  RINGSIDE: 'ringside', 
  FLOOR_A: 'floor_a',
  GENERAL: 'general',
  PREMIUM_MEMBER: 'premium_member_package',
  CHAMPION_EXPERIENCE: 'champion_experience',
  ULTIMATE_FAN: 'ultimate_fan_package',
} as const;

/**
 * Predefined component names for consistency
 */
export const COMPONENTS = {
  HERO_SECTION: 'HeroSection',
  ENHANCED_HERO: 'EnhancedHeroSection',
  HOMECOMING_FIGHT: 'HomecomingFight',
  HEADER: 'Header',
  HOME_PAGE: 'HomePage',
  TICKET_CHECKOUT: 'TicketCheckout',
  UPCOMING_FIGHTS: 'UpcomingFights',
  FOOTER: 'Footer',
} as const;

/**
 * Predefined page names for consistency
 */
export const PAGES = {
  HOME: 'home',
  TICKETS: 'tickets', 
  CHECKOUT: 'checkout',
  ABOUT: 'about',
  SPONSORS: 'sponsors',
  JOURNEY: 'journey',
} as const;