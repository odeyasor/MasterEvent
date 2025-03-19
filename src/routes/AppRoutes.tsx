import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage.tsx';
import RegisterPage from '../pages/RegisterPage.tsx';
import Home from '../pages/Home.tsx';
import NewEvent from '../components/forms/EventForm.tsx';
import ChooseGuestsPage from "../pages/ChooseGuetsPage.tsx"
import OrganizerGroupsPage from "../pages/OrganizerGroupsPage.tsx"
import Newguest from '../pages/NewGuestPage.tsx';
import ProtectedRoute from './ProtectedRoute.tsx';
import { AuthProvider } from '../context/AuthContext.tsx';
import NewEventPage from '../components/forms/EventForm.tsx';
import OKPage from '../pages/OKPage.tsx';
import EditEventPage from "../pages/EventDetails.tsx"
import NewGroupPage from '../pages/NewGroupPage.tsx';
import EventsPage from '../pages/EventsPage.tsx';
import EventForm from '../components/forms/EventForm.tsx';
import ConfirmedGuestsList from "../pages/guestsInEventPage.tsx"
import EventDetails from '../pages/EventDetails.tsx';


const AppRoutes = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
        <Route path='/' element={<OKPage />}/>
          {/*<Route path="/" element={<Home />} />*/}
          <Route path="/Home" element={<Home />} />
          <Route path="/new-event" element={<EventForm />} /> 
          <Route path="/edit-event/:eventId" element={<EventForm />} /> {/* נתיב לדף העריכה */}
          <Route path='/group' element={<OrganizerGroupsPage />}/>
          <Route path="/event-details/:eventId" element={<EventDetails />} /> {/* נתיב לדף העריכה */}
          <Route path="/choose-guests" element={<ChooseGuestsPage />} /> 
          <Route path="/myEvent" element={<EventsPage />} /> 
          <Route path="/edit-event/:eventId" element={<EditEventPage />} />
          <Route path="/add-group" element={<NewGroupPage />} />

          
        </Route>
  
        {/* Fallback route - redirect to login */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </AuthProvider>
  );
};

export default AppRoutes;