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
  seats: { guestId: string; name: string }[];
}

const AssignGuestsToTablesPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [seatsPerTable, setSeatsPerTable] = useState<number>(0);
  const [seatings, setSeatings] = useState<SeatingData[]>([]);
  const [guests, setGuests] = useState<{ [key: string]: string }>({});


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

      const assignedTables = separation
        ? await guestInEventService.assignGuestsToTablesByGender(Number(eventId), seatsPerTable)
        : await guestInEventService.assignGuestsToTablesWithoutGenderSeparation(Number(eventId), seatsPerTable);
        
      console.log('תתי האורחים שהוקצו לשולחנות:', assignedTables);

      const seatingAssignments = Object.entries(assignedTables).map(([tableId, subGuests]) => ({
        tableId: parseInt(tableId),
        seats: subGuests.map(subGuest => ({
          guestId: subGuest.guestId, 
          name: subGuest.name ?? `אורח ${subGuest.guestId}` // מוודא שהשם לא יהיה undefined
        }))
      }));
      
      setSeatings(seatingAssignments);
    } catch (error) {
      console.error('שגיאה בהקצאת אורחים לשולחנות:', error);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchGuestsAndAssignTables();
    }
  }, [eventId, seatsPerTable]);

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
          String(seating.tableId),
          String(index + 1),
          guest.name || `Guest ID: ${guest.guestId}`,
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
                 כיסא {index + 1} - {guest.name} 
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
