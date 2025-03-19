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

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>שלום, {userName}!</h1>
      </header>
      <main className="dashboard-content">
        <button className="dashboard-button" onClick={() => navigate('/new-event')}>
          ➕ צור אירוע חדש
        </button>

        <button className="dashboard-button" onClick={()=>navigate("/myEvent") }>📅 אירועים קודמים</button>
        <button className="dashboard-button" onClick={() => navigate("/group")}>📜 רשימת אורחים</button>

        <h2>האירועים שלך:</h2>
        {error && <p className="error-message">{error}</p>}
        {events.length > 0 ? (
          <ul className="event-list">
            {events.map((event, index) => (
              <li key={index} className="event-item">
                {event.name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-events-message">אין לך אירועים כרגע.</p>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
