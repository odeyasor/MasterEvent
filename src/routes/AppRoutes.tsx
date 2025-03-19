import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage.tsx';
import RegisterPage from '../pages/RegisterPage.tsx';
import Home from '../pages/Home.tsx';
import ChooseGuestsPage from "../pages/ChooseGuetsPage.tsx"
import ProtectedRoute from './ProtectedRoute.tsx';
import { AuthProvider } from '../context/AuthContext.tsx';
import OKPage from '../pages/OKPage.tsx';
import EditEventPage from "../pages/EventDetails.tsx"
import NewGroupPage from '../pages/NewGroupPage.tsx';
import EventsPage from '../pages/EventsPage.tsx';
import EventForm from '../components/forms/EventForm.tsx';
import EventDetails from '../pages/EventDetails.tsx';
import Navbar from '../components/Navbar.tsx';
import SendInvitationsPage from '../pages/SendInvitationsPage.tsx';

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Navbar /> {/* הוספת הניווט לעמודים */}
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
          <Route path='/' element={<OKPage />}/>
          <Route path="/Home" element={<Home />} />
          <Route path="/new-event" element={<EventForm />} /> 
          <Route path="/edit-event/:eventId" element={<EventForm />} /> {/* נתיב לדף העריכה */}
          <Route path="/event-details/:eventId" element={<EventDetails />} /> {/* נתיב לדף העריכה */}
          {/* <Route path="/choose-guests" element={<ChooseGuestsPage />} />  */}
          <Route path="/events" element={<EventsPage />} /> 
          <Route path="/edit-event/:eventId" element={<EditEventPage />} />
          <Route path="/add-group" element={<NewGroupPage />} />    
          <Route path="/send-invitations/:eventId" element={<SendInvitationsPage />} />
     
        </Route>
        {/* Fallback route - redirect to login */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </AuthProvider>
  );
};

export default AppRoutes;