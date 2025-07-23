import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Youtube, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import { useAnalytics } from '../../contexts/AnalyticsContext';

const Footer: React.FC = () => {
  const { trackEvent } = useAnalytics();

  const navigation = {
    main: [
      { name: 'About', href: '/about' },
      { name: 'Fights', href: '/fights' },
      { name: 'Shop', href: '/shop' },
      { name: 'Podcast', href: '/podcast' },
      { name: 'Journey', href: '/journey' },
      { name: 'Sponsors', href: '/sponsors' },
      { name: 'Contact', href: '/contact' },
    ],
    social: [
      {
        name: 'Instagram',
        href: 'https://instagram.com/kumarprescod',
        icon: Instagram,
      },
      {
        name: 'Twitter',
        href: 'https://twitter.com/kumarprescod',
        icon: Twitter,
      },
      {
        name: 'YouTube',
        href: 'https://youtube.com/@kumarprescod',
        icon: Youtube,
      },
      {
        name: 'Facebook',
        href: 'https://facebook.com/kumarprescod',
        icon: Facebook,
      },
    ],
  };

  const handleLinkClick = (linkName: string) => {
    trackEvent('Footer', 'Click', linkName);
  };

  const handleSocialClick = (platform: string) => {
    trackEvent('Social', 'Click', `Footer ${platform}`);
  };

  return (
    <footer className="bg-secondary-900 text-white">
      <div className="container-max">
        <div className="py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            {/* Brand Section */}
            <div className="space-y-8 xl:col-span-1">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-gold-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">KP</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold gradient-text">Kumar Prescod</h3>
                  <p className="text-secondary-300 text-sm">Professional Boxer</p>
                </div>
              </div>
              
              <p className="text-secondary-300 text-base">
                Follow the journey of Kumar Prescod, the 18-year-old boxing prodigy from Oakland, CA. 
                From the streets to the ring, every punch tells a story.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-secondary-300">
                  <MapPin className="w-5 h-5 text-primary-400" />
                  <span>Oakland, California</span>
                </div>
                <div className="flex items-center space-x-3 text-secondary-300">
                  <Mail className="w-5 h-5 text-primary-400" />
                  <a 
                    href="mailto:contact@kumarprescod.com"
                    className="hover:text-white transition-colors duration-200"
                    onClick={() => handleLinkClick('Email')}
                  >
                    contact@kumarprescod.com
                  </a>
                </div>
                <div className="flex items-center space-x-3 text-secondary-300">
                  <Phone className="w-5 h-5 text-primary-400" />
                  <a 
                    href="tel:+15105551234"
                    className="hover:text-white transition-colors duration-200"
                    onClick={() => handleLinkClick('Phone')}
                  >
                    (510) 555-1234
                  </a>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-secondary-300 tracking-wider uppercase">
                    Quick Links
                  </h3>
                  <ul className="mt-4 space-y-4">
                    {navigation.main.slice(0, 4).map((item) => (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          className="text-base text-secondary-300 hover:text-white transition-colors duration-200"
                          onClick={() => handleLinkClick(item.name)}
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-secondary-300 tracking-wider uppercase">
                    More
                  </h3>
                  <ul className="mt-4 space-y-4">
                    {navigation.main.slice(4).map((item) => (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          className="text-base text-secondary-300 hover:text-white transition-colors duration-200"
                          onClick={() => handleLinkClick(item.name)}
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="mt-12 border-t border-secondary-700 pt-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex space-x-6 md:order-2">
                {navigation.social.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary-400 hover:text-white transition-colors duration-200"
                    onClick={() => handleSocialClick(item.name)}
                  >
                    <span className="sr-only">{item.name}</span>
                    <item.icon className="h-6 w-6" />
                  </a>
                ))}
              </div>
              <p className="mt-8 text-base text-secondary-400 md:mt-0 md:order-1">
                &copy; {new Date().getFullYear()} Kumar Prescod. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 