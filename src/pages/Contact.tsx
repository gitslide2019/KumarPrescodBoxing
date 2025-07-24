import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Instagram, 
  Twitter, 
  Youtube, 
  Facebook,
  Send,
  Headphones,
  Users,
  Briefcase
} from 'lucide-react';

import ContactForm from '../components/forms/ContactForm';
import { useAnalytics } from '../contexts/AnalyticsContext';
import { KUMAR_CONTACT_INFO } from '../types/contact';
import { contactService } from '../services/contactService';
import type { ContactFormData } from '../types/contact';

const Contact: React.FC = () => {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    trackEvent('Page', 'View', 'Contact');
  }, [trackEvent]);

  const handleContactSubmit = async (data: ContactFormData) => {
    try {
      // Submit using contact service
      const response = await contactService.submitContactForm(data);
      
      // Track successful submission
      trackEvent('Contact Form', 'Submit Success', data.inquiryType);
      
      console.log('Contact form submitted successfully:', response);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      trackEvent('Contact Form', 'Submit Error', error instanceof Error ? error.message : 'Unknown error');
      throw error; // Re-throw to let the form handle the error
    }
  };

  const handleSocialClick = (platform: string, url: string) => {
    trackEvent('Social', 'Click', `Contact ${platform}`);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      value: KUMAR_CONTACT_INFO.email,
      description: 'Send us an email anytime',
      href: `mailto:${KUMAR_CONTACT_INFO.email}`,
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Phone,
      title: 'Phone',
      value: KUMAR_CONTACT_INFO.phone,
      description: 'Call us during business hours',
      href: `tel:${KUMAR_CONTACT_INFO.phone?.replace(/[^\d+]/g, '')}`,
      color: 'from-green-500 to-green-600'
    },
    {
      icon: MapPin,
      title: 'Location',
      value: `${KUMAR_CONTACT_INFO.address.city}, ${KUMAR_CONTACT_INFO.address.state}`,
      description: 'Based in the Bay Area',
      href: `https://maps.google.com/?q=${KUMAR_CONTACT_INFO.address.city},+${KUMAR_CONTACT_INFO.address.state}`,
      color: 'from-red-500 to-red-600'
    }
  ];

  const socialLinks = [
    {
      name: 'Instagram',
      icon: Instagram,
      href: KUMAR_CONTACT_INFO.socialMedia.instagram,
      color: 'from-pink-500 to-purple-600',
      description: 'Follow daily training updates'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      href: KUMAR_CONTACT_INFO.socialMedia.twitter,
      color: 'from-blue-400 to-blue-600',
      description: 'Latest news and thoughts'
    },
    {
      name: 'YouTube',
      icon: Youtube,
      href: KUMAR_CONTACT_INFO.socialMedia.youtube,
      color: 'from-red-500 to-red-700',
      description: 'Training videos and vlogs'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      href: KUMAR_CONTACT_INFO.socialMedia.facebook,
      color: 'from-blue-600 to-blue-800',
      description: 'Community updates and events'
    }
  ];

  const inquiryTypes = [
    {
      icon: Briefcase,
      title: 'Business & Sponsorship',
      description: 'Partnership opportunities, sponsorships, and business collaborations',
      types: ['sponsorship', 'partnership', 'collaboration']
    },
    {
      icon: MessageCircle,
      title: 'Media & Press',
      description: 'Interview requests, press inquiries, and media coverage',
      types: ['media', 'press']
    },
    {
      icon: Users,
      title: 'Training & Events',
      description: 'Training inquiries, event bookings, and appearances',
      types: ['training', 'booking']
    },
    {
      icon: Headphones,
      title: 'General Support',
      description: 'General questions, fan mail, and merchandise inquiries',
      types: ['general', 'fan_mail', 'merchandise']
    }
  ];

  return (
    <>
      <Helmet>
        <title>Contact Kumar Prescod - Professional Boxer | Get in Touch</title>
        <meta 
          name="description" 
          content="Get in touch with Kumar Prescod for sponsorship opportunities, media inquiries, training questions, or general support. We respond within 24-48 hours." 
        />
        <meta name="keywords" content="Kumar Prescod contact, boxing sponsorship, media inquiries, training, Oakland boxer" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="Contact Kumar Prescod - Professional Boxer" />
        <meta property="og:description" content="Get in touch with Kumar Prescod for sponsorship opportunities, media inquiries, and more." />
        <meta property="og:type" content="website" />
        
        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact Kumar Prescod",
            "description": "Contact page for professional boxer Kumar Prescod",
            "url": "https://kumarprescod.com/contact",
            "mainEntity": {
              "@type": "Person",
              "name": "Kumar Prescod",
              "jobTitle": "Professional Boxer",
              "email": KUMAR_CONTACT_INFO.email,
              "telephone": KUMAR_CONTACT_INFO.phone,
              "address": {
                "@type": "PostalAddress",
                "addressLocality": KUMAR_CONTACT_INFO.address.city,
                "addressRegion": KUMAR_CONTACT_INFO.address.state,
                "addressCountry": KUMAR_CONTACT_INFO.address.country
              },
              "sameAs": Object.values(KUMAR_CONTACT_INFO.socialMedia).filter(Boolean)
            }
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-800/20 to-gold-600/20"></div>
        
        <div className="relative z-10 container-max text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Get in <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">Touch</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed">
              Ready to connect with Kumar Prescod? Whether you're interested in sponsorship opportunities, 
              media inquiries, or just want to send some encouragement, we'd love to hear from you.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4 text-sm"
            >
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Clock className="w-4 h-4 mr-2 text-gold-400" />
                <span>24-48 hour response time</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Send className="w-4 h-4 mr-2 text-gold-400" />
                <span>Professional team support</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">
              <span className="gradient-text">Multiple Ways</span> to Connect
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Choose the method that works best for you. We're here to help and respond promptly.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method, index) => (
              <motion.a
                key={method.title}
                href={method.href}
                target={method.href.startsWith('http') ? '_blank' : undefined}
                rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={() => trackEvent('Contact Method', 'Click', method.title)}
                className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 text-center border border-gray-200 hover:border-primary-300"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${method.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <method.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-secondary-900 mb-2">{method.title}</h3>
                <p className="text-primary-600 font-semibold mb-2">{method.value}</p>
                <p className="text-gray-600 text-sm">{method.description}</p>
              </motion.a>
            ))}
          </div>

          {/* Business Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white text-center"
          >
            <Clock className="w-8 h-8 mx-auto mb-4 text-gold-300" />
            <h3 className="text-xl font-bold mb-4">Business Hours</h3>
            <div className="grid md:grid-cols-2 gap-4 max-w-md mx-auto">
              <div>
                <p className="font-semibold">Weekdays</p>
                <p className="text-primary-100">{KUMAR_CONTACT_INFO.businessHours?.weekdays}</p>
              </div>
              <div>
                <p className="font-semibold">Weekends</p>
                <p className="text-primary-100">{KUMAR_CONTACT_INFO.businessHours?.weekends}</p>
              </div>
            </div>
            {KUMAR_CONTACT_INFO.businessHours?.note && (
              <p className="text-primary-100 text-sm mt-4">
                {KUMAR_CONTACT_INFO.businessHours.note}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <ContactForm 
                onSubmit={handleContactSubmit}
                onSuccess={() => trackEvent('Contact Form', 'Success')}
                onError={(error) => trackEvent('Contact Form', 'Error', error)}
              />
            </motion.div>

            {/* Inquiry Types */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-secondary-900 mb-4">
                  What can we <span className="gradient-text">help you with?</span>
                </h3>
                <p className="text-gray-600 mb-6">
                  We handle various types of inquiries. Here are the most common ones:
                </p>
              </div>

              <div className="space-y-4">
                {inquiryTypes.map((type, index) => (
                  <motion.div
                    key={type.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <type.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-secondary-900 mb-1">{type.title}</h4>
                        <p className="text-gray-600 text-sm">{type.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Social Media */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-secondary-900 mb-4">
                  Follow Kumar on Social Media
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {socialLinks.map((social, index) => (
                    <motion.button
                      key={social.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSocialClick(social.name, social.href!)}
                      className={`bg-gradient-to-r ${social.color} text-white p-4 rounded-lg hover:shadow-lg transition-all duration-200 text-left`}
                    >
                      <div className="flex items-center mb-2">
                        <social.icon className="w-5 h-5 mr-2" />
                        <span className="font-semibold">{social.name}</span>
                      </div>
                      <p className="text-sm opacity-90">{social.description}</p>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Quick answers to common questions about contacting Kumar and his team.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                question: "How quickly do you respond to messages?",
                answer: "We typically respond within 24-48 hours during business days. Urgent media or business inquiries may receive faster responses."
              },
              {
                question: "What information should I include for sponsorship inquiries?",
                answer: "Please include your company name, proposed partnership details, budget range, and timeline. This helps us provide a more detailed response."
              },
              {
                question: "Can Kumar do appearances or training sessions?",
                answer: "Yes! Kumar is available for select appearances, training sessions, and community events. Please provide event details and dates in your message."
              },
              {
                question: "How can I get autographed merchandise?",
                answer: "Autographed items are available through our official shop or by special request. Please specify the items you're interested in when contacting us."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg p-6 shadow-md"
              >
                <h3 className="font-semibold text-secondary-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;