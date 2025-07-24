/**
 * Contact Service
 * Handles contact form submissions and database operations
 * Uses Neon Postgres database for persistence
 */

import type {
  ContactFormData,
  ContactMessage,
  ContactStatus,
  InquiryType,
  ContactMessageFilters
} from '../types/contact';
import type {
  ContactSubmissionRequest,
  ContactSubmissionResponse,
  ContactMessageResponse,
  ContactMessagesResponse,
  ContactAnalyticsResponse
} from '../types/api';

// Database configuration (will be moved to environment variables)
const DATABASE_CONFIG = {
  // This will be configured with actual Neon database credentials
  connectionString: process.env.REACT_APP_NEON_DATABASE_URL || '',
  ssl: true
};

/**
 * Contact Service Class
 * Handles all contact-related database operations
 */
class ContactService {
  private baseUrl: string;

  constructor() {
    // In a real implementation, this would be your API base URL
    this.baseUrl = process.env.REACT_APP_API_URL || '/api';
  }

  /**
   * Submit a new contact form
   */
  async submitContactForm(formData: ContactFormData): Promise<ContactSubmissionResponse> {
    try {
      // Prepare submission data
      const submissionData: ContactSubmissionRequest = {
        ...formData,
        ipAddress: await this.getClientIP(),
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      };

      // In a real implementation, this would make an actual API call
      // For now, we'll simulate the database operation
      const response = await this.simulateAPICall('/contact/submit', 'POST', submissionData);
      
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to submit contact form');
      }

      return response as ContactSubmissionResponse;
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  }

  /**
   * Get contact messages (admin only)
   */
  async getContactMessages(filters?: ContactMessageFilters): Promise<ContactMessagesResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters?.status) {
        filters.status.forEach(status => queryParams.append('status', status));
      }
      
      if (filters?.inquiryType) {
        filters.inquiryType.forEach(type => queryParams.append('inquiryType', type));
      }
      
      if (filters?.search) {
        queryParams.set('search', filters.search);
      }
      
      if (filters?.dateRange) {
        queryParams.set('startDate', filters.dateRange.start);
        queryParams.set('endDate', filters.dateRange.end);
      }

      const response = await this.simulateAPICall(
        `/contact/messages?${queryParams.toString()}`,
        'GET'
      );

      return response as ContactMessagesResponse;
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      throw error;
    }
  }

  /**
   * Get a single contact message by ID
   */
  async getContactMessage(id: string): Promise<ContactMessageResponse> {
    try {
      const response = await this.simulateAPICall(`/contact/messages/${id}`, 'GET');
      return response as ContactMessageResponse;
    } catch (error) {
      console.error('Error fetching contact message:', error);
      throw error;
    }
  }

  /**
   * Update contact message status
   */
  async updateContactMessageStatus(
    id: string, 
    status: ContactStatus, 
    adminNotes?: string
  ): Promise<ContactMessageResponse> {
    try {
      const updateData = {
        status,
        adminNotes,
        responseDate: status === 'resolved' ? new Date().toISOString() : undefined
      };

      const response = await this.simulateAPICall(
        `/contact/messages/${id}`,
        'PUT',
        updateData
      );

      return response as ContactMessageResponse;
    } catch (error) {
      console.error('Error updating contact message:', error);
      throw error;
    }
  }

  /**
   * Get contact analytics
   */
  async getContactAnalytics(days: number = 30): Promise<ContactAnalyticsResponse> {
    try {
      const response = await this.simulateAPICall(
        `/contact/analytics?days=${days}`,
        'GET'
      );

      return response as ContactAnalyticsResponse;
    } catch (error) {
      console.error('Error fetching contact analytics:', error);
      throw error;
    }
  }

  /**
   * Validate contact form data
   */
  validateContactForm(data: ContactFormData): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    // Name validation
    if (!data.name?.trim()) {
      errors.name = 'Name is required';
    } else if (data.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    } else if (data.name.length > 100) {
      errors.name = 'Name must be less than 100 characters';
    }

    // Email validation
    if (!data.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Phone validation (optional)
    if (data.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(data.phone.replace(/[^\d+]/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }

    // Subject validation
    if (!data.subject?.trim()) {
      errors.subject = 'Subject is required';
    } else if (data.subject.length < 5) {
      errors.subject = 'Subject must be at least 5 characters';
    } else if (data.subject.length > 200) {
      errors.subject = 'Subject must be less than 200 characters';
    }

    // Message validation
    if (!data.message?.trim()) {
      errors.message = 'Message is required';
    } else if (data.message.length < 10) {
      errors.message = 'Message must be at least 10 characters';
    } else if (data.message.length > 2000) {
      errors.message = 'Message must be less than 2000 characters';
    }

    // Inquiry type validation
    const validInquiryTypes: InquiryType[] = [
      'general', 'sponsorship', 'media', 'training', 'booking',
      'merchandise', 'partnership', 'fan_mail', 'press', 'collaboration'
    ];
    if (!validInquiryTypes.includes(data.inquiryType)) {
      errors.inquiryType = 'Please select a valid inquiry type';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Get client IP address (for logging purposes)
   */
  private async getClientIP(): Promise<string> {
    try {
      // In a real implementation, this might call a service to get the IP
      // For now, return a placeholder
      return 'unknown';
    } catch {
      return 'unknown';
    }
  }

  /**
   * Simulate API call (replace with actual API calls when backend is ready)
   */
  private async simulateAPICall(
    endpoint: string,
    method: string,
    data?: any
  ): Promise<any> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Simulate different responses based on endpoint
    if (endpoint.includes('/contact/submit')) {
      // Simulate successful contact form submission
      const mockMessage: ContactMessage = {
        id: `msg_${Date.now()}`,
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
        inquiryType: data.inquiryType,
        status: 'new' as ContactStatus,
        createdAt: new Date().toISOString(),
        ipAddress: data.ipAddress,
        userAgent: data.userAgent
      };

      return {
        success: true,
        data: {
          message: mockMessage,
          confirmationId: `conf_${Date.now()}`,
          estimatedResponseTime: '24-48 hours'
        },
        timestamp: new Date().toISOString()
      };
    }

    if (endpoint.includes('/contact/analytics')) {
      // Simulate analytics data
      return {
        success: true,
        data: {
          totalMessages: 45,
          messagesThisWeek: 12,
          messagesThisMonth: 23,
          averageResponseTime: 18.5,
          messagesByStatus: {
            new: 8,
            read: 12,
            in_progress: 5,
            resolved: 20
          },
          messagesByInquiryType: {
            general: 15,
            sponsorship: 8,
            media: 7,
            training: 6,
            merchandise: 4,
            partnership: 3,
            fan_mail: 2
          },
          responseTimesByInquiryType: {
            sponsorship: 12.5,
            media: 6.2,
            general: 24.1,
            training: 18.8
          },
          topInquiryTypes: [
            { type: 'general' as InquiryType, count: 15, percentage: 33.3 },
            { type: 'sponsorship' as InquiryType, count: 8, percentage: 17.8 },
            { type: 'media' as InquiryType, count: 7, percentage: 15.6 }
          ]
        },
        timestamp: new Date().toISOString()
      };
    }

    // Default response
    return {
      success: true,
      data: null,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Generate confirmation email content (for future implementation)
   */
  generateConfirmationEmail(contactData: ContactFormData): string {
    return `
      <h2>Thank you for contacting Kumar Prescod!</h2>
      <p>We've received your message and will get back to you within 24-48 hours.</p>
      
      <h3>Your Message Details:</h3>
      <ul>
        <li><strong>Name:</strong> ${contactData.name}</li>
        <li><strong>Email:</strong> ${contactData.email}</li>
        <li><strong>Inquiry Type:</strong> ${contactData.inquiryType}</li>
        <li><strong>Subject:</strong> ${contactData.subject}</li>
      </ul>
      
      <p>If you need immediate assistance, please call us at (510) 555-1234.</p>
      
      <p>Best regards,<br>Kumar Prescod Team</p>
    `;
  }
}

// Export singleton instance
export const contactService = new ContactService();
export default contactService;