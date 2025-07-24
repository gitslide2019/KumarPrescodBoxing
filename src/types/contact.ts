/**
 * Contact Form Types and Interfaces
 * Boxing-themed contact system for Kumar Prescod website
 */

import type { ID, Timestamp } from './index';

// Contact Message Types
export interface ContactMessage {
  id: ID;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  inquiryType: InquiryType;
  status: ContactStatus;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  ipAddress?: string;
  userAgent?: string;
  adminNotes?: string;
  responseDate?: Timestamp;
}

// Form Data Types
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  inquiryType: InquiryType;
}

export interface ContactFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  inquiryType?: string;
  general?: string;
}

// Inquiry Types
export type InquiryType = 
  | 'general'
  | 'sponsorship'
  | 'media'
  | 'training'
  | 'booking'
  | 'merchandise'
  | 'partnership'
  | 'fan_mail'
  | 'press'
  | 'collaboration';

export const INQUIRY_TYPES: Record<InquiryType, string> = {
  general: 'General Inquiry',
  sponsorship: 'Sponsorship Opportunity',
  media: 'Media & Press',
  training: 'Training Information',
  booking: 'Event Booking',
  merchandise: 'Merchandise & Shop',
  partnership: 'Business Partnership',
  fan_mail: 'Fan Mail',
  press: 'Press Interview',
  collaboration: 'Collaboration Request'
};

// Contact Status
export type ContactStatus = 
  | 'new'
  | 'read'
  | 'in_progress'
  | 'resolved'
  | 'spam'
  | 'archived';

export const CONTACT_STATUSES: Record<ContactStatus, string> = {
  new: 'New',
  read: 'Read',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  spam: 'Spam',
  archived: 'Archived'
};

// Form Validation Rules
export interface ContactFormValidation {
  name: {
    required: true;
    minLength: 2;
    maxLength: 100;
    pattern?: RegExp;
  };
  email: {
    required: true;
    pattern: RegExp;
    maxLength: 255;
  };
  phone: {
    required: false;
    pattern?: RegExp;
    maxLength: 20;
  };
  subject: {
    required: true;
    minLength: 5;
    maxLength: 200;
  };
  message: {
    required: true;
    minLength: 10;
    maxLength: 2000;
  };
  inquiryType: {
    required: true;
    validOptions: InquiryType[];
  };
}

// Contact Form State
export interface ContactFormState {
  data: ContactFormData;
  errors: ContactFormErrors;
  isSubmitting: boolean;
  isSubmitted: boolean;
  submitError?: string;
  submitSuccess?: boolean;
}

// Contact Information Display
export interface ContactInfo {
  email: string;
  phone?: string;
  address: {
    street?: string;
    city: string;
    state: string;
    zipCode?: string;
    country: string;
  };
  socialMedia: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
    facebook?: string;
  };
  businessHours?: {
    weekdays?: string;
    weekends?: string;
    note?: string;
  };
}

// Analytics & Tracking
export interface ContactAnalytics {
  submissionId: ID;
  timestamp: Timestamp;
  inquiryType: InquiryType;
  userAgent?: string;
  referrer?: string;
  sessionId?: string;
  responseTime?: number; // Time to fill form in milliseconds
}

// Admin Dashboard Types
export interface ContactMessageSummary {
  total: number;
  byStatus: Record<ContactStatus, number>;
  byInquiryType: Record<InquiryType, number>;
  recentMessages: ContactMessage[];
  averageResponseTime?: number;
}

export interface ContactMessageFilters {
  status?: ContactStatus[];
  inquiryType?: InquiryType[];
  dateRange?: {
    start: Timestamp;
    end: Timestamp;
  };
  search?: string;
}

// Form Component Props
export interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  initialData?: Partial<ContactFormData>;
  disabled?: boolean;
  className?: string;
}

// Validation Helpers
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^[\+]?[1-9][\d]{0,15}$/;
export const NAME_REGEX = /^[a-zA-Z\s\-\.\']+$/;

// Default form data
export const DEFAULT_CONTACT_FORM_DATA: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  inquiryType: 'general'
};

// Validation rules
export const CONTACT_VALIDATION_RULES: ContactFormValidation = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: NAME_REGEX
  },
  email: {
    required: true,
    pattern: EMAIL_REGEX,
    maxLength: 255
  },
  phone: {
    required: false,
    pattern: PHONE_REGEX,
    maxLength: 20
  },
  subject: {
    required: true,
    minLength: 5,
    maxLength: 200
  },
  message: {
    required: true,
    minLength: 10,
    maxLength: 2000
  },
  inquiryType: {
    required: true,
    validOptions: Object.keys(INQUIRY_TYPES) as InquiryType[]
  }
};

// Boxing-themed contact information
export const KUMAR_CONTACT_INFO: ContactInfo = {
  email: 'contact@kumarprescod.com',
  phone: '(510) 555-1234',
  address: {
    city: 'Oakland',
    state: 'California',
    country: 'United States'
  },
  socialMedia: {
    instagram: 'https://instagram.com/kumarprescod',
    twitter: 'https://twitter.com/kumarprescod',
    youtube: 'https://youtube.com/@kumarprescod',
    facebook: 'https://facebook.com/kumarprescod'
  },
  businessHours: {
    weekdays: '9:00 AM - 6:00 PM PST',
    weekends: 'By appointment only',
    note: 'Response time: 24-48 hours for general inquiries'
  }
};