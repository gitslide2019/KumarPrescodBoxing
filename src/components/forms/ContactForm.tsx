import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  Tag, 
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

import type { 
  ContactFormData, 
  ContactFormErrors, 
  ContactFormState,
  InquiryType 
} from '../../types/contact';
import { 
  DEFAULT_CONTACT_FORM_DATA,
  INQUIRY_TYPES,
  CONTACT_VALIDATION_RULES,
  EMAIL_REGEX,
  PHONE_REGEX,
  NAME_REGEX
} from '../../types/contact';
import { useAnalytics } from '../../contexts/AnalyticsContext';
import { contactService } from '../../services/contactService';

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  initialData?: Partial<ContactFormData>;
  disabled?: boolean;
  className?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({
  onSubmit,
  onSuccess,
  onError,
  initialData = {},
  disabled = false,
  className = ''
}) => {
  const { trackEvent } = useAnalytics();
  
  const [formState, setFormState] = useState<ContactFormState>({
    data: { ...DEFAULT_CONTACT_FORM_DATA, ...initialData },
    errors: {},
    isSubmitting: false,
    isSubmitted: false
  });

  // Validation function
  const validateField = useCallback((field: keyof ContactFormData, value: string): string | undefined => {
    const rules = CONTACT_VALIDATION_RULES[field];
    
    if (rules.required && !value.trim()) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }

    if (!value.trim()) return undefined;

    if ('minLength' in rules && value.length < rules.minLength) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least ${rules.minLength} characters`;
    }

    if ('maxLength' in rules && value.length > rules.maxLength) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} must be no more than ${rules.maxLength} characters`;
    }

    if ('pattern' in rules && rules.pattern && !rules.pattern.test(value)) {
      switch (field) {
        case 'email':
          return 'Please enter a valid email address';
        case 'phone':
          return 'Please enter a valid phone number';
        case 'name':
          return 'Name can only contain letters, spaces, hyphens, periods, and apostrophes';
        default:
          return `Invalid ${field} format`;
      }
    }

    if (field === 'inquiryType' && !Object.keys(INQUIRY_TYPES).includes(value)) {
      return 'Please select a valid inquiry type';
    }

    return undefined;
  }, []);

  // Validate entire form
  const validateForm = useCallback((): ContactFormErrors => {
    const errors: ContactFormErrors = {};

    Object.keys(formState.data).forEach((key) => {
      const field = key as keyof ContactFormData;
      const value = formState.data[field] as string;
      const error = validateField(field, value);
      if (error) {
        errors[field] = error;
      }
    });

    return errors;
  }, [formState.data, validateField]);

  // Handle input changes
  const handleInputChange = useCallback((field: keyof ContactFormData, value: string) => {
    setFormState(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [field]: value
      },
      errors: {
        ...prev.errors,
        [field]: undefined // Clear error on change
      },
      submitError: undefined,
      submitSuccess: false
    }));
  }, []);

  // Handle input blur for real-time validation
  const handleInputBlur = useCallback((field: keyof ContactFormData) => {
    const value = formState.data[field] as string;
    const error = validateField(field, value);
    
    if (error) {
      setFormState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          [field]: error
        }
      }));
    }
  }, [formState.data, validateField]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (disabled) return;

    // Track form submission attempt
    trackEvent('Contact Form', 'Submit Attempt', formState.data.inquiryType);

    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormState(prev => ({
        ...prev,
        errors
      }));
      
      // Focus first error field
      const firstErrorField = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;
      element?.focus();

      toast.error('Please fix the errors above');
      trackEvent('Contact Form', 'Validation Error', firstErrorField);
      return;
    }

    setFormState(prev => ({ ...prev, isSubmitting: true, submitError: undefined }));

    try {
      if (onSubmit) {
        await onSubmit(formState.data);
      } else {
        // Use contact service for default submission
        await contactService.submitContactForm(formState.data);
      }

      setFormState(prev => ({ 
        ...prev, 
        isSubmitted: true,
        submitSuccess: true,
        isSubmitting: false 
      }));

      toast.success('Message sent successfully! We\'ll get back to you within 24-48 hours.');
      trackEvent('Contact Form', 'Submit Success', formState.data.inquiryType);
      
      if (onSuccess) {
        onSuccess();
      }

      // Reset form after successful submission
      setTimeout(() => {
        setFormState({
          data: DEFAULT_CONTACT_FORM_DATA,
          errors: {},
          isSubmitting: false,
          isSubmitted: false,
          submitSuccess: false
        });
      }, 3000);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while sending your message';
      
      setFormState(prev => ({ 
        ...prev, 
        isSubmitting: false,
        submitError: errorMessage
      }));

      toast.error(errorMessage);
      trackEvent('Contact Form', 'Submit Error', errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
    }
  }, [formState.data, disabled, validateForm, onSubmit, onSuccess, onError, trackEvent]);

  const inputClasses = "w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 text-gray-800 placeholder-gray-500 bg-white";
  const errorInputClasses = "border-red-500 focus:border-red-500 focus:ring-red-500/20";
  const labelClasses = "block text-sm font-semibold text-gray-700 mb-2";
  const errorClasses = "mt-1 text-sm text-red-600 flex items-center";

  if (formState.isSubmitted && formState.submitSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-8 text-center ${className}`}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircle className="w-8 h-8 text-white" />
        </motion.div>
        <h3 className="text-2xl font-bold text-green-800 mb-2">Message Sent Successfully!</h3>
        <p className="text-green-700 mb-4">
          Thank you for reaching out. We've received your message and will get back to you within 24-48 hours.
        </p>
        <div className="text-sm text-green-600">
          <strong>Confirmation:</strong> Your message has been logged and assigned to our team.
        </div>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 lg:p-8 ${className}`}
    >
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Get in <span className="bg-gradient-to-r from-primary-600 to-gold-500 bg-clip-text text-transparent">Touch</span>
        </h3>
        <p className="text-gray-600">
          Send us a message and we'll get back to you as soon as possible.
        </p>
      </div>

      {formState.submitError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700"
        >
          <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
          <span>{formState.submitError}</span>
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className={labelClasses}>
            <User className="w-4 h-4 inline mr-2" />
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formState.data.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            onBlur={() => handleInputBlur('name')}
            disabled={disabled || formState.isSubmitting}
            placeholder="Enter your full name"
            className={`${inputClasses} ${formState.errors.name ? errorInputClasses : ''}`}
            maxLength={100}
          />
          {formState.errors.name && (
            <div className={errorClasses}>
              <AlertCircle className="w-4 h-4 mr-1" />
              {formState.errors.name}
            </div>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className={labelClasses}>
            <Mail className="w-4 h-4 inline mr-2" />
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formState.data.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            onBlur={() => handleInputBlur('email')}
            disabled={disabled || formState.isSubmitting}
            placeholder="your.email@example.com"
            className={`${inputClasses} ${formState.errors.email ? errorInputClasses : ''}`}
            maxLength={255}
          />
          {formState.errors.email && (
            <div className={errorClasses}>
              <AlertCircle className="w-4 h-4 mr-1" />
              {formState.errors.email}
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Phone Field */}
        <div>
          <label htmlFor="phone" className={labelClasses}>
            <Phone className="w-4 h-4 inline mr-2" />
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formState.data.phone || ''}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            onBlur={() => handleInputBlur('phone')}
            disabled={disabled || formState.isSubmitting}
            placeholder="(555) 123-4567"
            className={`${inputClasses} ${formState.errors.phone ? errorInputClasses : ''}`}
            maxLength={20}
          />
          {formState.errors.phone && (
            <div className={errorClasses}>
              <AlertCircle className="w-4 h-4 mr-1" />
              {formState.errors.phone}
            </div>
          )}
        </div>

        {/* Inquiry Type Field */}
        <div>
          <label htmlFor="inquiryType" className={labelClasses}>
            <Tag className="w-4 h-4 inline mr-2" />
            Inquiry Type *
          </label>
          <select
            id="inquiryType"
            name="inquiryType"
            value={formState.data.inquiryType}
            onChange={(e) => handleInputChange('inquiryType', e.target.value as InquiryType)}
            onBlur={() => handleInputBlur('inquiryType')}
            disabled={disabled || formState.isSubmitting}
            className={`${inputClasses} ${formState.errors.inquiryType ? errorInputClasses : ''}`}
          >
            {Object.entries(INQUIRY_TYPES).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {formState.errors.inquiryType && (
            <div className={errorClasses}>
              <AlertCircle className="w-4 h-4 mr-1" />
              {formState.errors.inquiryType}
            </div>
          )}
        </div>
      </div>

      {/* Subject Field */}
      <div className="mb-6">
        <label htmlFor="subject" className={labelClasses}>
          <MessageSquare className="w-4 h-4 inline mr-2" />
          Subject *
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formState.data.subject}
          onChange={(e) => handleInputChange('subject', e.target.value)}
          onBlur={() => handleInputBlur('subject')}
          disabled={disabled || formState.isSubmitting}
          placeholder="Brief description of your inquiry"
          className={`${inputClasses} ${formState.errors.subject ? errorInputClasses : ''}`}
          maxLength={200}
        />
        {formState.errors.subject && (
          <div className={errorClasses}>
            <AlertCircle className="w-4 h-4 mr-1" />
            {formState.errors.subject}
          </div>
        )}
      </div>

      {/* Message Field */}
      <div className="mb-8">
        <label htmlFor="message" className={labelClasses}>
          <MessageSquare className="w-4 h-4 inline mr-2" />
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          value={formState.data.message}
          onChange={(e) => handleInputChange('message', e.target.value)}
          onBlur={() => handleInputBlur('message')}
          disabled={disabled || formState.isSubmitting}
          placeholder="Please provide details about your inquiry..."
          className={`${inputClasses} resize-none ${formState.errors.message ? errorInputClasses : ''}`}
          maxLength={2000}
        />
        <div className="flex justify-between items-center mt-1">
          {formState.errors.message ? (
            <div className={errorClasses}>
              <AlertCircle className="w-4 h-4 mr-1" />
              {formState.errors.message}
            </div>
          ) : (
            <div></div>
          )}
          <div className="text-sm text-gray-500">
            {formState.data.message.length}/2000
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={disabled || formState.isSubmitting}
        whileHover={!disabled && !formState.isSubmitting ? { scale: 1.02 } : {}}
        whileTap={!disabled && !formState.isSubmitting ? { scale: 0.98 } : {}}
        className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
      >
        {formState.isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Sending Message...
          </>
        ) : (
          <>
            <Send className="w-5 h-5 mr-2" />
            Send Message
          </>
        )}
      </motion.button>

      <div className="mt-4 text-center text-sm text-gray-600">
        <p>We typically respond within 24-48 hours during business days.</p>
      </div>
    </motion.form>
  );
};

export default ContactForm;