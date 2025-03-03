import React, { useState, useEffect } from 'react';
import { Organizer } from '../../types/types.ts';
import organizerService from '../../services/organizerService.ts';// ייבוא השירות

const OrganizersList = () => {
  // סטייט למארגנים
  const [organizers, setOrganizers] = useState<Organizer[]>([]);

  // פעולה לקרוא את המארגנים מהשרת
  useEffect(() => {
    const fetchOrganizers = async () => {
      try {
        const data = await organizerService.getAllOrganizers(); // שימוש בפונקציה מהשירות
        console.log("Fetched organizers:", data); // הצגת הנתונים בקונסול
        setOrganizers(data); // עדכון הסטייט
      } catch (error) {
        console.error('Error fetching organizers:', error);
      }
    };

    fetchOrganizers();
  }, []); // ריק, כלומר יפעל רק פעם אחת כשהקומפוננטה נטענת

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
