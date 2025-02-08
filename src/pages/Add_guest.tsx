import React, { useState } from 'react';
import './../styles/Add.css';

interface AddGuestFormProps {
  eventId: string; // ID של האירוע
  onGuestAdded?: (guest: Guest) => void; // פונקציה שתתעדכן כשאורח נוסף
}

interface Guest {
  name: string;
  mail: string;
  gender: 'female' | 'male';
}

const Add_guest: React.FC<AddGuestFormProps> = ({ eventId, onGuestAdded }) => {
  const [guestName, setGuestName] = useState('');
  const [guestMail, setGuestMail] = useState('');
  const [guestGender, setGuestGender] = useState<'female' | 'male'>('female');
  const [guestList, setGuestList] = useState<Guest[]>([]);

  const handleAddGuest = () => {
    if (guestName.trim() !== '' && guestMail.trim() !== '') {
      const newGuest = { name: guestName, mail: guestMail, gender: guestGender };
      setGuestList((prevGuestList) => [...prevGuestList, newGuest]);
      setGuestName('');
      setGuestMail('');
      if (onGuestAdded) {
        onGuestAdded(newGuest); // עדכון כאשר אורח נוסף
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`https://your-api-url.com/api/events/${eventId}/guests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ guests: guestList }),
      });

      const result = await response.json();
      if (response.ok) {
        alert('האורחים נוספו בהצלחה!');
        setGuestList([]); // ריקון הרשימה אחרי שליחה
      } else {
        alert('שגיאה בהוספת האורחים: ' + result.message);
      }
    } catch (err) {
      console.error(err);
      alert('שגיאה בשרת');
    }
  };

  return (
    <div className="guest-form-container">
      <h1>הוסף אורח לאירוע</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>שם האורח</label>
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>דואר אלקטרוני</label>
          <input
            type="email"
            value={guestMail}
            onChange={(e) => setGuestMail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>מגדר</label>
          <select value={guestGender} onChange={(e) => setGuestGender(e.target.value as 'female' | 'male')} required>
            <option value="female">נקבה</option>
            <option value="male">זכר</option>
          </select>
        </div>
        <button type="button" onClick={handleAddGuest}>הוסף אורח</button>

        <ul>
          {guestList.map((guest, index) => (
            <li key={index}>
              {guest.name} ({guest.mail}) - {guest.gender === 'female' ? 'נקבה' : 'זכר'}
            </li>
          ))}
        </ul>

        <button type="submit">שמור את האורחים</button>
      </form>
    </div>
  );
};

export default Add_guest;
