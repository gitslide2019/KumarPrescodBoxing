import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactGA from 'react-ga4';
import { Toaster } from 'react-hot-toast';

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AnalyticsProvider from './contexts/AnalyticsContext';
import FundingProvider from './contexts/FundingContext';
import CommunityProvider from './contexts/CommunityContext';
import AuthProvider from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Fights from './pages/Fights';
import Shop from './pages/Shop';
import Podcast from './pages/Podcast';
import Journey from './pages/Journey';
import Sponsors from './pages/Sponsors';
import TicketCheckout from './pages/TicketCheckout';
import ShopCheckout from './pages/ShopCheckout';
import MemberDashboard from './pages/member/MemberDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  const location = useLocation();

  useEffect(() => {
    // Track page views
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);

  return (
    <AnalyticsProvider>
      <AuthProvider>
        <FundingProvider>
          <CommunityProvider>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900 to-red-900">
        <Helmet>
          <title>Kumar Prescod - Professional Boxer | Oakland, CA</title>
          <meta name="description" content="Follow the journey of Kumar Prescod, 18-year-old professional boxer from Oakland, CA. Buy tickets, merchandise, and stay updated with latest fights and news." />
        </Helmet>
        
        <Header />
        
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/fights" element={<Fights />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/podcast" element={<Podcast />} />
            <Route path="/journey" element={<Journey />} />
            <Route path="/sponsors" element={<Sponsors />} />
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
        </main>
        
        <Footer />
        
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
            </div>
          </CommunityProvider>
        </FundingProvider>
      </AuthProvider>
    </AnalyticsProvider>
  );
}

export default App; 