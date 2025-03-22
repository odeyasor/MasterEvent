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
      if (!userId) {
        setError("שגיאה: משתמש לא מחובר.");
        return;
      }

      try {
        const userEvents = await eventService.getEventsByOrganizerId(userId);
        if (userEvents.length === 0) {
          setError("אין לך אירועים כרגע");
        } else {
          setEvents(userEvents);
        }
      } catch (err) {
        setError("אירעה שגיאה בטעינת האירועים.");
      }
    };

    fetchEvents();
  }, [userId]);

  // פונקציה למחיקת אירוע
  const deleteEvent = async (eventId: number) => {
    if (!window.confirm("האם אתה בטוח שברצונך למחוק את האירוע?")) return;

    try {
      await eventService.deleteEvent(eventId);
      setEvents(events.filter(event => event.id !== eventId)); // מעדכן את הרשימה אחרי מחיקה
    } catch (error) {
      console.error("שגיאה במחיקת האירוע:", error);
      alert("אירעה שגיאה בעת מחיקת האירוע.");
    }
  };

  return (
    <div className="events-container">
      <h1>האירועים שלי</h1>
      {error && <p className="error-message">{error}</p>}
      <button className="dashboard-button" onClick={() => navigate('/event-form')}>
          ➕ צור אירוע חדש
        </button>
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
                onClick={() => navigate(`/event-details/${event.id}`)}
              >
                🔍 פרטים
              </button>
              <button
                className="edit-btn"
                onClick={() => navigate(`/edit-event/${event.id}`)}
              >
                ✏️ עריכה
              </button>
              <button
                className="delete-btn"
                onClick={() => deleteEvent(event.id)}
              >
                🗑 מחק
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
