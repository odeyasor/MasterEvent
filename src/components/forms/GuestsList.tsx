import React, { useState, useEffect } from 'react';
import { Guest } from '../../types/types';
const GuestsList = () => {
  // סטייט למארגנים
  const [guests, setGuestS] = useState<Guest[]>([]);

  // פעולה לקרוא לאורחים מהשרת
  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const response = await fetch('https://localhost:7112/api/Guest');
        const data = await response.json();
        console.log(data); // זה יראה את מבנה הנתונים של האורחים
        setGuestS(data); // עדכון הסטייט
      } catch (error) {
        console.error('Error fetching guests:', error);
      }
    };

    fetchGuests();
  }, []); // ריק, כלומר יפעל רק פעם אחת כשדף נטען

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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GuestsList;
