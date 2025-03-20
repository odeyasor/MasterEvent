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
     
      <main className="dashboard-content">
        <button className="dashboard-button" onClick={() => navigate('/event-form')}>
          ➕ צור אירוע חדש
        </button>

        <button className="dashboard-button" onClick={()=>navigate("/events") }>📅 אירועים קודמים</button>
        <button className="dashboard-button" onClick={()=>navigate("/groups") }>📜 רשימת אורחים</button>

      </main>
    </div>
  );
};

export default DashboardPage;
