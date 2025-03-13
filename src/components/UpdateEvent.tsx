import React, { useState, useEffect } from 'react';
import { Event } from '../types/types';
import eventService from '../services/eventService.ts';

interface UpdateEventProps {
  event: Event;
  onUpdate: (updatedEvent: Event) => void;
}

const UpdateEvent: React.FC<UpdateEventProps> = ({ event, onUpdate }) => {
  const [updatedEvent, setUpdatedEvent] = useState<Event>(event);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // אם ה-prop 'event' משתנה, עדכן את הסטייט
  useEffect(() => {
    setUpdatedEvent(event);
  }, [event]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdatedEvent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUpdatedEvent((prev) => ({
      ...prev,
      [name]: value === 'true',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return; // אם יש בקשה שרצה, לא לבצע שוב

    setLoading(true);
    setError(null);

    console.log("🔄 handleSubmit הופעל");
    console.log("📤 נתונים שנשלחים לעדכון:", JSON.stringify(updatedEvent, null, 2));

    try {
      const updatedEventData = await eventService.updateEvent(event.id.toString(), updatedEvent);
      console.log("✅ עדכון הצליח", updatedEventData);
    } catch (err) {
      console.error("❌ שגיאה בעדכון האירוע:", err);
      setError('שגיאה בעדכון האירוע');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <h2>עדכון אירוע</h2>
      <form onSubmit={handleSubmit}>
        <label>
          שם האירוע:
          <input
            type="text"
            name="eventName"
            value={updatedEvent.eventName}
            onChange={handleInputChange}
          />
        </label>

        <label>
          תאריך האירוע:
          <input
            type="date"
            name="eventDate"
            value={updatedEvent.eventDate}
            onChange={handleInputChange}
          />
        </label>

        <label>
          כתובת:
          <input
            type="text"
            name="address"
            value={updatedEvent.address}
            onChange={handleInputChange}
          />
        </label>

        <label>
          פרטי האירוע:
          <textarea
            name="details"
            value={updatedEvent.details}
            onChange={handleInputChange}
          />
        </label>

        <label>
          הפרדה:
          <select
            name="seperation"
            value={updatedEvent.seperation ? 'true' : 'false'}
            onChange={handleSelectChange}
          >
            <option value="true">כן</option>
            <option value="false">לא</option>
          </select>
        </label>

        <label>
          הזמנה:
          <input
            type="text"
            name="invitation"
            value={updatedEvent.invitation}
            onChange={handleInputChange}
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'שולח...' : 'שמור עדכון'}
        </button>

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default UpdateEvent;
