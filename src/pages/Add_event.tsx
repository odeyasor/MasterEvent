import React, { useState } from 'react';
import './../styles/Add.css';

const Add_event = () => {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [address, setAddress] = useState('');
  const [details, setDetails] = useState('');
  const [seperation, setSeperation] = useState(false);
  const [invitation, setInvitation] = useState<File | null>(null); // עדכון סוג ה-state
  const [photos, setPhotos] = useState<FileList | null>(null);
  const [guests, setGuests] = useState<string[]>([]);
  const [guest, setGuest] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const eventData = {
      eventName,
      eventDate,
      address,
      details,
      seperation,
      invitation,
      photos,
      guests,
    };

    try {
      const formData = new FormData();
      formData.append('eventName', eventData.eventName);
      formData.append('eventDate', eventData.eventDate);
      formData.append('address', eventData.address);
      formData.append('details', eventData.details);
      formData.append('seperation', String(eventData.seperation));
      if (invitation) {
        formData.append('invitation', invitation); // עדכון ל-invitation
      }
      if (photos) {
        Array.from(photos).forEach((file, index) => {
          formData.append('photos', file);
        });
      }
      eventData.guests.forEach((guest, index) => {
        formData.append('guests', guest);
      });

      const response = await fetch('https://your-api-url.com/api/events', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        alert('האירוע נוסף בהצלחה!');
      } else {
        alert('שגיאה בהוספת האירוע: ' + result.message);
      }
    } catch (err) {
      console.error(err);
      alert('שגיאה בשרת');
    }
  };

  const handleAddGuest = () => {
    if (guest) {
      setGuests([...guests, guest]);
      setGuest('');
    }
  };

  return (
    <div className="event-form-container">
      <h1>הוסף אירוע</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>שם האירוע</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>תאריך האירוע</label>
          <input
            type="datetime-local"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>כתובת</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div>
          <label>פרטים נוספים</label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            required
          />
        </div>
        <div>
          <label>האם יש הפרדה</label>
          <input
            type="checkbox"
            checked={seperation}
            onChange={() => setSeperation(!seperation)}
          />
        </div>
        <div>
          <label>הזמנה</label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setInvitation(e.target.files ? e.target.files[0] : null)} // עדכון פה ל-setInvitation
            required
          />
        </div>
        <div>
          <label>אורחים</label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setInvitation(e.target.files ? e.target.files[0] : null)} // גם פה נדרש עדכון אם מדובר בשדה אחר
          />
        </div>
        <button type="submit">שלח</button>
      </form>
    </div>
  );
};

export default Add_event;
