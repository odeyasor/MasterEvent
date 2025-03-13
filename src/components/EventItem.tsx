import React, { useState } from 'react';
import { Event, Guest } from '../types/types';
import eventService from '../services/eventService.ts';
import UpdateEvent from './UpdateEvent.tsx';
import '../styles/events.css';

interface EventItemProps {
  event: Event;
  onDelete: (id: number) => void;
  onUpdate: (id: number) => void;
}

const EventItem: React.FC<EventItemProps> = ({ event, onDelete, onUpdate }) => {
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [eventData, setEventData] = useState<Event>(event);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [showGuests, setShowGuests] = useState(false); // סטייט להצגת האורחים
  const [loadingGuests, setLoadingGuests] = useState(false); // סטייט לטעינת האורחים

  const handleUpdateClick = () => {
    setIsUpdateModalVisible(true);
  };

  const handleUpdate = async (updatedEvent: Event) => {
    try {
      const updatedEventData = await eventService.updateEvent(event.id.toString(), updatedEvent);
      setEventData(updatedEventData); // מעדכן את האירוע המקומי עם הנתונים החדשים
      onUpdate(updatedEventData.id); // עדכון הרשימה אם נדרש
      setIsUpdateModalVisible(false); // סוגר את המודאל אחרי הצלחה
    } catch (error) {
      console.error('שגיאה בעדכון האירוע:', error);
    }
  };

  const handleShowGuestsClick = async () => {
    if (!showGuests) {
      setLoadingGuests(true); // מציין שהנתונים נטענים
      try {
        const fetchedGuests = await eventService.GetGuestsByEventId(event.id);
        setGuests(fetchedGuests);
      } catch (error) {
        console.error('שגיאה בהצגת אורחים', error);
      } finally {
        setLoadingGuests(false);
      }
    }
    setShowGuests(!showGuests);
  };

  const isUpcoming = new Date(event.eventDate) > new Date();

  return (
    <li className="event-item">
      <h3>{eventData.eventName}</h3>
      <p>📅 {new Date(eventData.eventDate).toLocaleDateString()}</p>
      <p>📍 {eventData.address}</p>
      <p>ℹ️ {eventData.details}</p>
      
      <button onClick={handleShowGuestsClick}>
        {showGuests ? 'הסתר אורחים' : 'הצג אורחים'}
      </button>

      {loadingGuests && <p>טוען אורחים...</p>}

      {showGuests && (
        <ul>
          {guests.length > 0 ? (
            guests.map((guest) => <li key={guest.id}>{guest.name}</li>)
          ) : (
            <p>אין אורחים לאירוע זה</p>
          )}
        </ul>
      )}

      {isUpcoming && (
        <div className="event-actions">
          <button onClick={handleUpdateClick} className="update-btn">✏️ עדכון</button>
          <button onClick={() => onDelete(eventData.id)} className="delete-btn">🗑️ מחיקה</button>
        </div>
      )}

      {isUpdateModalVisible && (
        <UpdateEvent event={eventData} onUpdate={handleUpdate} />
      )}
    </li>
  );
};

export default EventItem;
