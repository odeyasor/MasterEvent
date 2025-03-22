import React, { useState, useEffect } from 'react';
import guestService from '../../services/guestService.ts';
import { Guest } from '../../types/types.ts';

const GuestsList = () => {
  // סטייט לאורחים
  const [guests, setGuests] = useState<Guest[]>([]);

  // פעולה לקרוא לאורחים מהשרת
  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const data = await guestService.getAllGuests();
        console.log(data); // זה יראה את מבנה הנתונים של האורחים
        setGuests(data); // עדכון הסטייט
      } catch (error) {
        console.error('Error fetching guests:', error);
      }
    };

    fetchGuests();
  }, []); // ריק, כלומר יפעל רק פעם אחת כשדף נטען

  // פונקציה למחוק אורח
  const handleDeleteGuest = async (guestId: string) => {
    try {
      await guestService.deleteGuest(guestId);
      // לאחר מחיקה, נעדכן את הסטייט ונסיר את האורח מהרשימה
      setGuests(guests.filter((guest) => guest.id !== guestId));
    } catch (error) {
      console.error('Error deleting guest:', error);
    }
  };

  // פונקציה לעדכון אורח
  const handleEditGuest = (guestId: string) => {
    // פה נוכל לנווט לדף עדכון פרטי האורח, לפי מזהה האורח
    // לדוגמה:
    window.location.href = `/edit-guest/${guestId}`; // אם יש דף כזה בנתיב זה
  };

  return (
    <div>
      <h1>רשימת האורחים</h1>
      {guests.length === 0 ? (
        <p>אין אורחים זמינים כרגע</p>
      ) : (
        <ul>
          {guests.map((guest) => (
            <li key={guest.id}>
              <strong>{guest.name}</strong><br />
              <em>{guest.mail}</em><br />
              <em>{guest.gender}</em><br />
              {/* כפתור עידכון */}
              <button onClick={() => handleEditGuest(guest.id)}>עדכון אורח</button>
              {/* כפתור מחיקה */}
              <button onClick={() => handleDeleteGuest(guest.id)}>מחק אורח</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GuestsList;
