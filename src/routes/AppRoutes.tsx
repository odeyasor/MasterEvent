import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage.tsx';
import RegisterPage from '../pages/RegisterPage';
import Home from '../pages/Home';
import AddEvent from '../pages/AddEventPage';
import Add_guest from '../pages/Add_guest';
import ProtectedRoute from './ProtectedRoute.tsx';
import { AuthProvider } from '../context/AuthContext.tsx';

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/add-event" element={<AddEvent />} />
          <Route path="/add-guest/:eventId" element={<Add_guest eventId="" />} />
        </Route>
        
        {/* Fallback route - redirect to login */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </AuthProvider>
  );
};

export default AppRoutes;