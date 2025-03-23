import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";

import Navbar from "../components/Navbar.tsx";

// עמודים
import LoginPage from "../pages/LoginPage.tsx";
import RegisterPage from "../pages/RegisterPage.tsx";
import Home from "../pages/Home.tsx";
import EventsPage from "../pages/EventsPage.tsx";
import EventDetails from "../pages/EventDetails.tsx";
import ChooseGuestsPage from "../pages/ChooseGuetsPage.tsx";
import SendInvitationsPage from "../pages/SendInvitationsPage.tsx";
import ConfirmedGuestsList from "../pages/GuestsInEventPage.tsx";
import GroupsPage from "../pages/GroupsPage.tsx";
import OKPage from "../pages/OKPage.tsx";
import AssignGuestsToTablesPage from "../pages/Tabels.tsx"

// טפסים
import EventForm from "../components/forms/EventForm.tsx";
import GroupForm from "../components/forms/GroupForm.tsx";
import GuestForm from "../components/forms/GuestForm.tsx";
import OrganizerForm from "../components/forms/OrganizerForm.tsx";

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        {/* הפניה לעמוד התחברות בהרצה הראשונה */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* עמודים ציבוריים */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/ok" element={<OKPage />} />

        {/* עמודים מוגנים */}
        <Route element={<ProtectedRoute />}>

          <Route path="/home" element={<Home />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/event-form" element={<EventForm />} />
          <Route path="/organizer-form/:organizerId" element={<OrganizerForm />} />
          <Route path="/event-details/:eventId" element={<EventDetails />} />
          <Route path="/edit-event/:eventId" element={<EventDetails />}>
            <Route path="choose-guests" element={<ChooseGuestsPage />} />
            <Route path="send-invitations" element={<SendInvitationsPage />} />
            <Route path="edit-details" element={<EventForm />} />
            <Route path="guests-list" element={<ConfirmedGuestsList />} />
            <Route path="arrange-tables/:eventId" element={<AssignGuestsToTablesPage/>} />
          </Route>
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/group-form" element={<GroupForm />} />
          <Route path="/add-guest/:groupName?" element={<GuestForm />} />
          <Route path="/guest-form" element={<GuestForm />} />
          <Route path="/guest-form/:guestId" element={<GuestForm />} />

        </Route>

        {/* ברירת מחדל - הפניה לעמוד ההתחברות */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </AuthProvider>
  );
};

export default AppRoutes;
