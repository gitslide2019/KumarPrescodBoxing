import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactGA from 'react-ga4';
import { Toaster } from 'react-hot-toast';
import { registerBoxingServiceWorker } from './utils/serviceWorker';

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Breadcrumbs from './components/navigation/Breadcrumbs';
import BackToTop from './components/navigation/BackToTop';
import AnalyticsProvider from './contexts/AnalyticsContext';
import FundingProvider from './contexts/FundingContext';
import CommunityProvider from './contexts/CommunityContext';
import AuthProvider from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
// Removed heavy monitoring components for better performance
import { BoxingLazy, LazyErrorBoundary } from './components/common/LazyWrapper';

// Lazy-loaded pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Fights = lazy(() => import('./pages/Fights'));
const Shop = lazy(() => import('./pages/Shop'));
const Podcast = lazy(() => import('./pages/Podcast'));
const Journey = lazy(() => import('./pages/Journey'));
const Sponsors = lazy(() => import('./pages/Sponsors'));
const Contact = lazy(() => import('./pages/Contact'));
const TicketCheckout = lazy(() => import('./pages/TicketCheckout'));
const ShopCheckout = lazy(() => import('./pages/ShopCheckout'));
const MemberDashboard = lazy(() => import('./pages/member/MemberDashboard'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

// Error pages
const NotFound = lazy(() => import('./pages/NotFound'));
const ServerError = lazy(() => import('./pages/ServerError'));
const Offline = lazy(() => import('./pages/Offline'));

function App() {
  const location = useLocation();

  useEffect(() => {
    // Track page views
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);

  useEffect(() => {
    // Register service worker for offline boxing content
    if (process.env.NODE_ENV === 'production') {
      registerBoxingServiceWorker({
        onSuccess: (registration) => {
          console.log('🥊 Boxing service worker registered successfully');
          
          // Request persistent storage for boxing content
          if ('storage' in navigator && 'persist' in navigator.storage) {
            navigator.storage.persist().then(persistent => {
              if (persistent) {
                console.log('🥊 Persistent storage granted for boxing content');
              }
            });
          }
        },
        onUpdate: (registration) => {
          console.log('🥊 New boxing app update available');
          
          // Show update notification
          if (window.confirm('New version of Kumar Prescod Boxing app is available. Update now?')) {
            if (registration.waiting) {
              registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            }
          }
        },
        onOffline: () => {
          console.log('🥊 Boxing app is offline - cached content available');
        },
        onOnline: () => {
          console.log('🥊 Boxing app is back online');
        }
      });
    }
  }, []);

  return (
    <AnalyticsProvider>
      <AuthProvider>
        <FundingProvider>
          <CommunityProvider>
              <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900 to-red-900">
        <Helmet>
          <title>Kumar Prescod - Professional Boxer | Oakland, CA</title>
          <meta name="description" content="Follow the journey of Kumar Prescod, 18-year-old professional boxer from Oakland, CA. Buy tickets, merchandise, and stay updated with latest fights and news." />
          
          {/* Enhanced SEO Meta Tags */}
          <meta name="keywords" content="Kumar Prescod, professional boxer, Oakland boxing, boxing matches, fight tickets, boxing merchandise, young boxer, California boxing" />
          <meta name="author" content="Kumar Prescod Boxing Team" />
          <meta name="robots" content="index, follow, max-image-preview:large" />
          <meta name="googlebot" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1" />
          
          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://kumarprescod.com/" />
          <meta property="og:title" content="Kumar Prescod - Professional Boxer | Oakland, CA" />
          <meta property="og:description" content="Follow the journey of Kumar Prescod, 18-year-old professional boxer from Oakland, CA. Buy tickets, merchandise, and stay updated with latest fights and news." />
          <meta property="og:image" content="https://kumarprescod.com/images/portraits/kumar-prescod-hero.jpg" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content="Kumar Prescod - Professional Boxer from Oakland, CA" />
          <meta property="og:site_name" content="Kumar Prescod Boxing" />
          <meta property="og:locale" content="en_US" />
          
          {/* Twitter Card */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:url" content="https://kumarprescod.com/" />
          <meta name="twitter:title" content="Kumar Prescod - Professional Boxer | Oakland, CA" />
          <meta name="twitter:description" content="Follow the journey of Kumar Prescod, 18-year-old professional boxer from Oakland, CA. Buy tickets, merchandise, and stay updated with latest fights and news." />
          <meta name="twitter:image" content="https://kumarprescod.com/images/portraits/kumar-prescod-hero.jpg" />
          <meta name="twitter:image:alt" content="Kumar Prescod - Professional Boxer from Oakland, CA" />
          <meta name="twitter:creator" content="@kumarprescod" />
          <meta name="twitter:site" content="@kumarprescod" />
          
          {/* Additional SEO Meta Tags */}
          <meta name="theme-color" content="#DC2626" />
          <meta name="msapplication-TileColor" content="#DC2626" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="apple-mobile-web-app-title" content="Kumar Prescod Boxing" />
          
          {/* Canonical URL */}
          <link rel="canonical" href="https://kumarprescod.com/" />
          
          {/* JSON-LD Structured Data */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Kumar Prescod",
              "jobTitle": "Professional Boxer",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Oakland",
                "addressRegion": "CA",
                "addressCountry": "US"
              },
              "birthDate": "2006",
              "nationality": "American",
              "sport": "Boxing",
              "url": "https://kumarprescod.com",
              "image": "https://kumarprescod.com/images/portraits/kumar-prescod-hero.jpg",
              "description": "18-year-old professional boxer from Oakland, CA",
              "sameAs": [
                "https://twitter.com/kumarprescod",
                "https://instagram.com/kumarprescod"
              ],
              "memberOf": {
                "@type": "SportsTeam",
                "name": "Kumar Prescod Boxing Team",
                "sport": "Boxing"
              }
            })}
          </script>
        </Helmet>
        
        <Header />
        <Breadcrumbs />
        
<<<<<<< HEAD
        <main id="main-content" role="main">
          <LazyErrorBoundary>
            <Routes>
              <Route path="/" element={
                <BoxingLazy.Page>
                  <Home />
                </BoxingLazy.Page>
              } />
              <Route path="/about" element={
                <BoxingLazy.Page>
                  <About />
                </BoxingLazy.Page>
              } />
              <Route path="/fights" element={
                <BoxingLazy.Page>
                  <Fights />
                </BoxingLazy.Page>
              } />
              <Route path="/shop" element={
                <BoxingLazy.Page>
                  <Shop />
                </BoxingLazy.Page>
              } />
              <Route path="/podcast" element={
                <BoxingLazy.Page>
                  <Podcast />
                </BoxingLazy.Page>
              } />
              <Route path="/journey" element={
                <BoxingLazy.Page>
                  <Journey />
                </BoxingLazy.Page>
              } />
              <Route path="/sponsors" element={
                <BoxingLazy.Page>
                  <Sponsors />
                </BoxingLazy.Page>
              } />
              <Route path="/tickets/checkout" element={
                <BoxingLazy.Page>
                  <TicketCheckout />
                </BoxingLazy.Page>
              } />
              <Route path="/shop/checkout" element={
                <BoxingLazy.Page>
                  <ShopCheckout />
                </BoxingLazy.Page>
              } />
              <Route path="/member" element={
                <ProtectedRoute requireMember={true}>
                  <BoxingLazy.Page>
                    <MemberDashboard />
                  </BoxingLazy.Page>
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin={true}>
                  <BoxingLazy.Page>
                    <AdminDashboard />
                  </BoxingLazy.Page>
                </ProtectedRoute>
              } />
              
              {/* Error pages */}
              <Route path="/offline" element={
                <BoxingLazy.Page>
                  <Offline />
                </BoxingLazy.Page>
              } />
              <Route path="/error" element={
                <BoxingLazy.Page>
                  <ServerError />
                </BoxingLazy.Page>
              } />
              
              {/* 404 - Must be last */}
              <Route path="*" element={
                <BoxingLazy.Page>
                  <NotFound />
                </BoxingLazy.Page>
              } />
            </Routes>
          </LazyErrorBoundary>
=======
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/fights" element={<Fights />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/podcast" element={<Podcast />} />
            <Route path="/journey" element={<Journey />} />
            <Route path="/sponsors" element={<Sponsors />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/tickets/checkout" element={<TicketCheckout />} />
            <Route path="/shop/checkout" element={<ShopCheckout />} />
            <Route path="/member" element={
              <ProtectedRoute requireMember={true}>
                <MemberDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
>>>>>>> 59989cf38b3b271b1aaa048010bd83a5039798b5
        </main>
        
        <Footer />
        <BackToTop threshold={400} smooth={true} />
        
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        
        {/* Simplified for better performance */}
            </div>
          </CommunityProvider>
        </FundingProvider>
      </AuthProvider>
    </AnalyticsProvider>
  );
}

export default App; 