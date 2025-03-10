import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage.tsx';
import RegisterPage from '../pages/RegisterPage.tsx';
import Home from '../pages/Home.tsx';
import NewEvent from '../pages/NewEventPage.tsx';
import ChooseGuests from "../pages/ChooseGuetsPage.tsx"
import Newguest from '../pages/NewGuestPage.tsx';
import ProtectedRoute from './ProtectedRoute.tsx';
import { AuthProvider } from '../context/AuthContext.tsx';

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Routes>
      {/* דף הבית פתוח לכולם */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* דפים ציבוריים */}
      <Route path="/home" element={<Home />} />
     <Route path="/new-event" element={<NewEvent />} />
     <Route path="/choose-guests" element={<ChooseGuests />} /> 
     <Route path="/new-guests" element={<Newguest />} />

        
        {/* Fallback route - redirect to login */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </AuthProvider>
  );
};

export default AppRoutes;