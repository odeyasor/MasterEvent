import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import eventService from "../services/eventService.ts";
import "../styles/NewEvent.css"; // נשתמש ב-CSS מותאם

const EventsPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const userId = localStorage.getItem("userId"); // מזהה המארגן

  useEffect(() => {
    const fetchEvents = async () => {
      console.log("Fetching events..."); // קונסולה להתחלת הפונקציה
      if (!userId) {
        setError("שגיאה: משתמש לא מחובר.");
        console.error("No userId found"); // קונסולה אם אין מזהה משתמש
        return;
      }

      try {
        console.log("User ID: ", userId); // קונסולה להצגת מזהה המשתמש
        const userEvents = await eventService.getEventsByOrganizerId(userId);
        console.log("Fetched events: ", userEvents); // קונסולה להצגת האירועים שהתקבלו
        if (userEvents.length === 0) {
          setError("אין לך אירועים כרגע.");
        } else {
          setEvents(userEvents);
        }
      } catch (err) {
        console.error("Error fetching events: ", err); // קונסולה לשגיאה בצד השרת
        setError("אירעה שגיאה בטעינת האירועים.");
      }
    };

    fetchEvents();
  }, [userId]);

  return (
    <div className="events-container">
      <h1>האירועים שלי</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="events-grid">
        {events.map((event) => (
          <div key={event.id} className="event-card">
            <h3>{event.eventName}</h3>
            <p>📅 {new Date(event.eventDate).toLocaleDateString()}</p>
            <p>⏰ {new Date(event.eventDate).toLocaleTimeString()}</p>
            <p>📍 {event.address}</p>
            <p>{event.seperation}</p>
            <p>{event.details}</p>
            <div className="event-actions">
              <button
                className="update-btn"
                onClick={() => navigate(`/edit-event/${event.id}`)}
              >
                🔍 פרטים
              </button>
              <button
                className="delete-btn"
                onClick={() => navigate(`/edit-event/${event.id}`)}
              >
                ✏️ עריכה
              </button>
              </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
