/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Auth from './pages/Auth';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import LegalPage from './pages/LegalPage';
import ContactPage from './pages/ContactPage';
import UserDashboard from './pages/UserDashboard';
import Offers from './pages/Offers';
import Surveys from './pages/Surveys';
import ProviderWall from './pages/ProviderWall';
import Withdrawals from './pages/Withdrawals';
import ProfileSurvey from './pages/ProfileSurvey';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import { useSettings } from './context/SettingsContext';
import { useUsers } from './context/UserContext';

const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, logout, isLoading: userLoading } = useUsers();
  const location = useLocation();
  
  React.useEffect(() => {
    if (currentUser && currentUser.status === 'Banned') {
      logout();
    }
  }, [currentUser, logout]);

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0F1A]">
        <div className="w-12 h-12 border-4 border-white/10 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (currentUser && currentUser.status === 'Banned') {
    return <Navigate to="/admin/login?banned=true" replace />;
  }

  return currentUser?.isAdmin ? <>{children}</> : <Navigate to={`/admin/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />;
};

const UserGuard = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, logout, isLoading: userLoading } = useUsers();
  const location = useLocation();
  
  React.useEffect(() => {
    if (currentUser && currentUser.status === 'Banned') {
      logout();
    }
  }, [currentUser, logout]);

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (currentUser && currentUser.status === 'Banned') {
    return <Navigate to="/login?banned=true" replace />;
  }

  return currentUser ? <>{children}</> : <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />;
};

export default function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Auth />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/forgot-password" element={<Auth />} />
        <Route path="/legal/:slug" element={<LegalPage />} />
        <Route path="/contact" element={<ContactPage />} />
        
        {/* Protected User Routes */}
        <Route path="/dashboard" element={<UserGuard><UserDashboard /></UserGuard>} />
        <Route path="/offers" element={<UserGuard><Offers /></UserGuard>} />
        <Route path="/offers/:providerId" element={<UserGuard><ProviderWall /></UserGuard>} />
        <Route path="/surveys" element={<UserGuard><Surveys /></UserGuard>} />
        <Route path="/surveys/:providerId" element={<UserGuard><ProviderWall /></UserGuard>} />
        <Route path="/withdrawals" element={<UserGuard><Withdrawals /></UserGuard>} />
        <Route path="/profile" element={<UserGuard><Profile /></UserGuard>} />
        <Route path="/profile-survey" element={<UserGuard><ProfileSurvey /></UserGuard>} />
        <Route path="/settings" element={<UserGuard><Settings /></UserGuard>} />
        
        {/* Public Admin Entry */}
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Protected Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
        <Route path="/admin/settings" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
        <Route path="/admin/users" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
        <Route path="/admin/users/:id" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
        <Route path="/admin/security" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
        <Route path="/admin/social" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
        <Route path="/admin/payments" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
        <Route path="/admin/providers" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
        <Route path="/admin/surveys" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
        <Route path="/admin/offerwalls" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
        <Route path="/admin/legal" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
        <Route path="/admin/transactions" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
        
        {/* Fallback route for unknown paths */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

