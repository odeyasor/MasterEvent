import React, { useState, useEffect } from 'react';
import { Organizer } from '../types/types.ts';
const OrganizersList = () => {
  // סטייט למארגנים
  const [organizers, setOrganizers] = useState<Organizer[]>([]);

  // פעולה לקרוא את המארגנים מהשרת
  useEffect(() => {
    const fetchOrganizers = async () => {
      try {
        const response = await fetch('https://localhost:7112/api/Organizer');
        const data = await response.json();
        console.log(data); // זה יראה את מבנה הנתונים של המארגנים
        setOrganizers(data); // עדכון הסטייט
      } catch (error) {
        console.error('Error fetching organizers:', error);
      }
    };

    fetchOrganizers();
  }, []); // ריק, כלומר יפעל רק פעם אחת כשדף נטען

  return (
    <div>
      <h1>רשימת המארגנים</h1>
      {organizers.length === 0 ? (
        <p>אין מארגנים זמינים כרגע</p>
      ) : (
        <ul>
          {organizers.map((organizer) => (
            <li key={organizer.id}>
              <strong>{organizer.name}</strong><br />
              <em>{organizer.mail}</em><br />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrganizersList;
