import React, { useEffect, useState } from 'react';
import eventService from '../services/eventService.ts';
import { Event } from '../types/types';
import EventItem from '../components/EventItem.tsx';
import { useNavigate } from 'react-router-dom';

const OrganizerEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [organizerId, setOrganizerId] = useState<string | null>(null);

  // בדיקה אם ה-organizerId נטען כראוי
  useEffect(() => {
    const id = localStorage.getItem('userId');
    console.log("Organizer ID loaded from localStorage:", id);  // לוודא שה- ID נטען כראוי
    setOrganizerId(id);
  }, []);

  // קריאה לשרת להוריד את האירועים אחרי שה-organizerId נטען
  useEffect(() => {
    if (!organizerId) return;

    console.log("🔄 useEffect הופעל");
    setLoading(true);

    const fetchEvents = async () => {
      console.log("📡 מבצע קריאה לשרת לקבלת אירועים");
      try {
        const data = await eventService.getEventsByOrganizerId(organizerId);
        console.log("Events fetched:", data);  // לדאוג שהנתונים נטענים כראוי
        if (Array.isArray(data)) {
          console.log(`Number of events fetched: ${data.length}`);
        } else {
          console.error('הנתונים לא במבנה נכון:', data);
        }
        setEvents(data);
      } catch (err) {
        console.error('שגיאה בלקיחת האירועים:', err);  // הצגת השגיאה
        setError('Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [organizerId]);

  // בדוק את הסטייט של ה-events אחרי העדכון
  useEffect(() => {
    console.log("Updated events:", events);  // כעת תוכל לראות את הערכים אחרי שהסטייט עודכן
  }, [events]);

  const handleDelete = async (id: number) => {
    try {
      console.log("🗑️ מחיקת אירוע עם id:", id);
      await eventService.deleteEvent(id);
      setEvents(events.filter(event => event.id !== id));  // עדכון הסטייט אחרי מחיקה
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleUpdate = (id: number) => {
    navigate(`/update-event/${id}`);
  };

  // הצגת הודעת טעינה או שגיאה
  if (loading) return <p>טוען אירועים...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>האירועים שלי</h2>
      {events.length > 0 ? (
        <ul className="event-list">
          {events.map(event => (
            <EventItem key={event.id} event={event} onDelete={handleDelete} onUpdate={handleUpdate} />
          ))}
        </ul>
      ) : (
        <p>לא נמצאו אירועים.</p>
      )}
    </div>
  );
};

export default OrganizerEvents;
