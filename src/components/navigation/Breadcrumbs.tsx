import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { designTokens } from '../../styles/design-tokens';

interface BreadcrumbItem {
  label: string;
  path: string;
  isCurrentPage?: boolean;
}

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  
  // Generate breadcrumbs based on current path
  const generateBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
    const pathSegments = pathname.split('/').filter(segment => segment !== '');
    
    // Always start with home
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', path: '/' }
    ];
    
    // Route mapping for better labels
    const routeLabels: Record<string, string> = {
      'about': 'About Kumar',
      'fights': 'Fight Schedule',
      'journey': 'Boxing Journey',
      'sponsors': 'Sponsors',
      'shop': 'Merchandise',
      'podcast': 'Podcast',
      'tickets': 'Tickets',
      'checkout': 'Checkout',
      'member': 'Member Area',
      'admin': 'Admin Dashboard',
      'training': 'Training',
      'gallery': 'Photo Gallery',
      'news': 'News & Updates',
      'contact': 'Contact'
    };
    
    // Build breadcrumb path
    let currentPath = '';
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLastSegment = index === pathSegments.length - 1;
      
      // Handle dynamic routes (e.g., /fights/2025-08-16-oakland)
      let label = routeLabels[segment] || segment;
      
      // Special handling for fight pages
      if (pathSegments[0] === 'fights' && index === 1) {
        label = `${segment.split('-').slice(0, 3).join('-')} Fight`;
      }
      
      // Special handling for shop checkout
      if (pathSegments[0] === 'shop' && segment === 'checkout') {
        label = 'Checkout - Merchandise';
      }
      
      // Special handling for ticket checkout
      if (pathSegments[0] === 'tickets' && segment === 'checkout') {
        label = 'Checkout - Fight Tickets';
      }
      
      // Capitalize and clean up label
      label = label.charAt(0).toUpperCase() + label.slice(1).replace(/-/g, ' ');
      
      breadcrumbs.push({
        label,
        path: currentPath,
        isCurrentPage: isLastSegment
      });
    });
    
    return breadcrumbs;
  };
  
  const breadcrumbs = generateBreadcrumbs(location.pathname);
  
  // Don't show breadcrumbs on homepage
  if (location.pathname === '/') {
    return null;
  }
  
  return (
    <nav 
      aria-label="Breadcrumb navigation"
      className="bg-black/20 backdrop-blur-sm border-b border-gray-800/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center space-x-2 py-3 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.path} className="flex items-center">
              {index > 0 && (
                <ChevronRight 
                  className="w-4 h-4 mx-2 text-gray-500" 
                  aria-hidden="true"
                />
              )}
              
              {crumb.isCurrentPage ? (
                <span 
                  className="font-medium flex items-center"
                  style={{ color: designTokens.colors.primary.championship_gold }}
                  aria-current="page"
                >
                  {index === 0 && <Home className="w-4 h-4 mr-1" />}
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.path}
                  className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                >
                  {index === 0 && (
                    <Home 
                      className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform duration-200" 
                      style={{ color: designTokens.colors.primary.boxing_red }}
                    />
                  )}
                  <span className="hover:underline">{crumb.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;