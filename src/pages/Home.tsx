import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DashboardPage.css";
import eventService from "../services/eventService.ts";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userName");
    setUserName(storedUser || "אורח");

    const fetchEvents = async () => {
      const userEvents = await eventService.getAllEvents();
      if (userEvents.length === 0) {
        setError("אין לך אירועים כרגע.");
      }
      setEvents(userEvents);
    };

    fetchEvents();
  }, []);

 

  const handleCreateEventClick = () => {
    navigate("/new-event"); // שינוי לנתיב הנכון
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>שלום, {userName}!</h1>
      </header>
      <main className="dashboard-content">
        <button className="dashboard-button" onClick={() => navigate('/NewEventPage')}>
          ➕ צור אירוע חדש
        </button>
        <button className="dashboard-button" onClick={() => navigate('/OrganizerEvents')}>📅 אירועים קודמים</button>
        <button className="dashboard-button" onClick={()=>navigate("/organizer-groups") }>📜 הקבוצות שלי</button>

      </main>
    </div>
  );
};

export default DashboardPage;
