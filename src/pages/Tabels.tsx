import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import guestInEventService from '../services/guestInEventService.ts';
import seatingService from '../services/seatingService.ts';
import guestService from '../services/guestService.ts';
import { GuestInEvent } from '../types/types';
import eventService from '../services/eventService.ts';
import '../styles/form.css';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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
  const { eventId } = useParams<{ eventId: string }>();
  const [seatsPerTable, setSeatsPerTable] = useState<number>(0);
  const [seatings, setSeatings] = useState<SeatingData[]>([]);
  const [guests, setGuests] = useState<{ [key: string]: string }>({});

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

  // שימוש ב- useEffect רק עבור עדכון כמות הכיסאות או eventId
  useEffect(() => {
    console.log('הפעלת useEffect עם eventId:', eventId, 'וכמות כיסאות בשולחן:', seatsPerTable);
  }, [eventId, seatsPerTable]); // לא מקראים את הפונקציה כאן

  // פונקציה לעדכון כמות הכיסאות לפי תיבת הטקסט
  const handleSeatsPerTableChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSeatsPerTable(Number(event.target.value));
  };

  const downloadSeatingExcel = () => {
    if (seatings.length === 0) {
      alert("אין נתוני ישיבה להורדה.");
      return;
    }

    // הכנת הנתונים לטבלת אקסל
    const seatingDataArray = [["Table ID", "Seat Number", "Guest Name"]];
    seatings.forEach((seating) => {
      seating.seats.forEach((guest, index) => {
        seatingDataArray.push([
          seating.tableId,
          index + 1,
          guests[guest.id] || `Guest ID: ${guest.id}`, // אם לא נמצא שם, הצג מזהה
        ]);
      });
    });

    // יצירת גיליון וורקבוק
    const ws = XLSX.utils.aoa_to_sheet(seatingDataArray);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Seating Arrangement");

    // יצירת קובץ להורדה
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(file, "seating_arrangement.xlsx");
  };

  return (
    <div className='form-container'>
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

      {seatings.length > 0 && (
        <button onClick={downloadSeatingExcel}>📥 הורד קובץ סידור ישיבה</button>
      )}

      {seatings.length === 0 ? (
        <p>אין אורחים שהוקצו לשולחנות.</p>
      ) : (
        <ul>
          {seatings.map((seating) => (
            <li key={seating.tableId}>
              שולחן {seating.tableId}:
              <ul>
                {seating.seats.map((guest, index) => (
                  <li key={index}>
                    {guests[guest.id] || guest.id} - כיסא {index + 1}
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
