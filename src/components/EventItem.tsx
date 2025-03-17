import React, { useState } from 'react';
import { Event, Guest } from '../types/types';
import eventService from '../services/eventService.ts';
import UpdateEvent from './UpdateEvent.tsx';
import '../styles/events.css';
import guestService from '../services/guestService.ts';

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleUpdateClick = () => {
    setIsUpdateModalVisible(true);
  };

  const handleUpdate = async (updatedEvent: Event) => {
    try {
      // בעדכון, שליחה של כל השדות הנדרשים בלבד
      const updatedEventData = await eventService.updateEvent(event.id.toString(), {
        ...updatedEvent,
        // מסננים את event_ מהאורחים
        guests: updatedEvent.guests.map((guest: GuestInEvent) => {
          // הסרת event_ מהאורח אם קיים
          const { event_, ...guestWithoutEvent } = guest; 
          return {
            ...guestWithoutEvent,
            eventId: updatedEvent.id, // שלח רק את eventId, לא את כל האירוע
          };
        }),
      });
    
      setEventData(updatedEventData); // עדכון האירוע המקומי עם הנתונים החדשים
      onUpdate(updatedEventData.id); // עדכון הרשימה אם נדרש
      setIsUpdateModalVisible(false); // סוגר את המודאל אחרי הצלחה
    } catch (error) {
      console.error('שגיאה בעדכון האירוע:', error);
    }
  };
  
  
  

  const handleShowGuestsClick = async () => {
    if (!showGuests) {
      setLoadingGuests(true);
      setErrorMessage(null); // איפוס הודעת שגיאה במקרה של ניסיון נוסף
      try {
        const fetchedGuests = await guestService.GetGuestsByEvent(event.id);
        setGuests(fetchedGuests);
      } catch (error) {
        console.error('שגיאה בהצגת אורחים:', error);
        setErrorMessage("אירעה שגיאה בטעינת האורחים. אנא נסה שוב מאוחר יותר.");
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
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {loadingGuests && <p>טוען אורחים...</p>}

      {showGuests && (
        <table>
          <thead>
            <tr>
              <th>שם האורח</th>
              <th>דוא"ל</th>
            </tr>
          </thead>
          <tbody>
            {guests.length > 0 ? (
              guests.map((guest) => (
                <tr key={guest.id}>
                  <td>{guest.name}</td>
                  <td>{guest.mail}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2}>אין אורחים לאירוע זה</td>
              </tr>
            )}
          </tbody>
        </table>
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
