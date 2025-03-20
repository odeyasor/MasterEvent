import ProtectedRoute from './ProtectedRoute.tsx';
import { AuthProvider } from '../context/AuthContext.tsx';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import LoginPage from '../pages/LoginPage.tsx';
import RegisterPage from '../pages/RegisterPage.tsx';

import Home from '../pages/Home.tsx';
import ChooseGuestsPage from "../pages/ChooseGuetsPage.tsx"
import EditEventPage from "../pages/EventDetails.tsx"
import EventsPage from '../pages/EventsPage.tsx';
import ConfirmedGuestsList from "../pages/guestsInEventPage.tsx"
import EventDetails from '../pages/EventDetails.tsx';
import Navbar from '../components/Navbar.tsx';
import SendInvitationsPage from '../pages/SendInvitationsPage.tsx';
import GroupsPage from '../pages/GroupsPage.tsx';

import GroupForm from '../components/forms/GroupForm.tsx';
import GuestForm from "../components/forms/GuestForm.tsx";
import EventForm from '../components/forms/EventForm.tsx';


import OKPage from '../pages/OKPage.tsx';

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Navbar /> {/* הוספת הניווט לעמודים */}
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path='/ok' element={<OKPage />}/>

        
        {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
          <Route path="/Home" element={<Home />} />
          <Route path="/event-form" element={<EventForm />} /> 
          <Route path="/events" element={<EventsPage />} /> 
          <Route path="/event-details/:eventId" element={<EventDetails />} />
          <Route path="/edit-event/:eventId" element={<EventForm />} /> 
          <Route path='/groups' element={<GroupsPage />}/>
          /<Route path="/choose-guests/:eventId" element={<ChooseGuestsPage />} />  
          <Route path="/group-form" element={<GroupForm />} />    
          <Route path="/send-invitations/:eventId" element={<SendInvitationsPage />} />
          <Route path='/guests-event/:eventId' element={<ConfirmedGuestsList />} />
          <Route path='/add-guest/:groupName?' element={<GuestForm />} />


        </Route>
        {/* Fallback route - redirect to login */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </AuthProvider>
  );
};

export default AppRoutes;