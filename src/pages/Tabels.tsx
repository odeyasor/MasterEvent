import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import guestInEventService from '../services/guestInEventService.ts'; // הוספתי את הסיומת .ts
import seatingService from '../services/seatingService.ts'; // הוספתי את הסיומת .ts
import guestService from '../services/guestService.ts'; // הוספתי את הסיומת .ts
import { GuestInEvent } from '../types/types';
import eventService from '../services/eventService.ts';

interface SeatingData {
  tableId: number;
  seats: GuestInEvent[];
}

interface SeatingCreate {
  eventId: string;
  subGuestId: string;
  table: number;
  seat: number;
}

const AssignGuestsToTablesPage = () => {
  const { eventId } = useParams<{ eventId: string }>(); // קבלת מזהה האירוע מהפרמטר ב-URL
  const [seatsPerTable, setSeatsPerTable] = useState<number>(0); // שמירת כמות כיסאות בשולחן
  const [seatings, setSeatings] = useState<SeatingData[]>([]);
  const [guests, setGuests] = useState<{ [key: string]: string }>({}); // שמירה של שמות האורחים לפי מזהה

  // פונקציה להקצאת אורחים לשולחנות
  const fetchGuestsAndAssignTables = async () => {
    if (!eventId) {
      console.error('מזהה האירוע חסר');
      return;
    }
  
    try {
      const eventDetails = await eventService.getEvent(eventId);
      const separation = eventDetails.seperation;
      console.log('סוג ההפרדה באירוע:', separation);
  
      if (seatsPerTable <= 0) {
        console.log('כמות הכיסאות בשולחן אינה תקינה:', seatsPerTable);
        return;
      }
  
      // קביעת הפונקציה המתאימה לפי סוג ההפרדה
      const assignedTables = separation
        ? await guestInEventService.assignGuestsToTablesByGender(Number(eventId), seatsPerTable)
        : await guestInEventService.assignGuestsToTablesWithoutGenderSeparation(Number(eventId), seatsPerTable);
  
      console.log('האורחים שהוקצו לשולחנות:', assignedTables);
  
      // סידור הנתונים
      const seatingAssignments = Object.entries(assignedTables).map(([tableId, guests]) => ({
        tableId: parseInt(tableId),
        seats: guests,
      }));
  
      setSeatings(seatingAssignments);
  
      const seatingData: SeatingCreate[] = seatingAssignments.flatMap((tableData) =>
        tableData.seats.map((guest, index) => ({
          eventId: String(eventId),
          subGuestId: String(guest.guestId),
          table: tableData.tableId,
          seat: index + 1,
        }))
      );
  
      if (seatingData.length > 0) {
        for (const seating of seatingData) {
          try {
            console.log('שולחים מקום ישיבה:', seating);
            await seatingService.createSeating(seating);
          } catch (error) {
            console.error('שגיאה בשליחת מקום ישיבה:', seating, error);
          }
        }
      }
  
      // עדכון שמות האורחים
      const guestNames: { [key: string]: string } = {};
      for (const tableData of seatingAssignments) {
        for (const guest of tableData.seats) {
          try {
            const guestInfo = await guestService.getGuest(Number(guest.guestId));
            guestNames[guest.id] = guestInfo.name;
          } catch (error) {
            console.error(`שגיאה בהבאת פרטי האורח עם מזהה ${guest.id}:`, error);
          }
        }
      }
  
      setGuests(guestNames);
    } catch (error) {
      console.error('שגיאה בהקצאת אורחים לשולחנות:', error);
    }
  };
  

  // שימוש ב- useEffect כדי להפעיל את הפונקציה ברגע שהמזהה אירוע או כמות הכיסאות משתנים
  useEffect(() => {
    console.log('הפעלת useEffect עם eventId:', eventId, 'וכמות כיסאות בשולחן:', seatsPerTable);
    fetchGuestsAndAssignTables();
  }, [eventId, seatsPerTable]); // תעדכן רק אם משתנים מזהה האירוע או כמות הכיסאות

  // פונקציה לעדכון כמות הכיסאות לפי תיבת הטקסט
  const handleSeatsPerTableChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSeatsPerTable(Number(event.target.value));
  };

  return (
    <div>
      <h1>סידור אורחים לשולחנות</h1>
      <div>
        <label>
          כמות כיסאות בשולחן:
          <input
            type="number"
            value={seatsPerTable}
            onChange={handleSeatsPerTableChange}
            min="1"
          />
        </label>
      </div>
      <button onClick={fetchGuestsAndAssignTables}>הקצה אורחים לשולחנות</button>
      {seatings.length === 0 ? (
        <p>אין אורחים שהוקצו לשולחנות.</p> // אם לא הוקצו אורחים, הצג הודעה
      ) : (
        <ul>
          {seatings.map((seating) => (
            <li key={seating.tableId}>
              שולחן {seating.tableId}:
              <ul>
                {seating.seats.map((guest, index) => (
                  <li key={index}>
                    {guests[guest.id] || guest.id} - כיסא {index + 1} {/* אם לא נמצא שם, הצג את ה-guestId */}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AssignGuestsToTablesPage;
