import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Guest, Gender, SubGuest } from '../types/types.ts'; // יש לוודא שהוגדר טיפוס מתאים לאורח
import React from 'react';
import { useLocation } from 'react-router-dom';
import guestService from '../services/guestService.ts';
import subGuestService from "../services/subGuestService.ts";
import guestInEventService from '../services/guestInEventService.ts';

const RSVP: React.FC = () => {
  const location = useLocation();
  const [guest, setGuest] = useState<Guest>(); 
  const [participants, setParticipants] = useState<Omit<SubGuest, "id">[]>([]);
  const queryParams = new URLSearchParams(location.search);
  const guestId = queryParams.get("guestId"); // שליפת ה-guestId מה-URL

  // השתמש ב-useEffect כדי לקרוא לפונקציה כשמזהה נמצא
  useEffect(() => {
    const fetchGuest = async () => {
      if (guestId) {
        try {
          console.log("Fetching guest for ID:", guestId); // בדיקה בקונסול
          const guest = await guestService.getGuest(Number(guestId));
          setGuest(guest); // עדכון השם של האורח
        } catch (error) {
          console.error("❌ שגיאה בשליפת פרטי אורח:", error);
        }
      }
    };
  
    fetchGuest();
  }, [guestId]);
  
  // פונקציה להוספת משתתף
const handleAddParticipant = () => {
  if (!guestId) {
    console.error("❌ guestId לא נמצא");
    return;
  }
  setParticipants((prevParticipants) => [
    ...prevParticipants,
    { guestId: guestId, name: "", gender: Gender.male }, // שימוש במזהה האמיתי של האורח
  ]);
};


  // פונקציה להסרת משתתף
  const handleRemoveParticipant = (index: number) => {
    setParticipants((prevParticipants) => prevParticipants.filter((_, i) => i !== index));
  };

  // פונקציה לעדכון משתתף
  const handleParticipantChange = (index: number, field: keyof SubGuest, value: string) => {
    setParticipants((prevParticipants) =>
      prevParticipants.map((participant, i) =>
        i === index ? { ...participant, [field]: field === "gender" ? Number(value) as Gender : value } : participant
      )
    );
  };

  // פונקציה לשליחה
  const handleSubmit = async () => {
    try {
      if (!guestId) {
        alert("❌ לא נמצא מזהה אורח");
        return;
      }
  
      // יצירת אובייקט האורח הראשי כתת-אורח
      const mainGuestAsSubGuest: Omit<SubGuest, "id"> = {
        guestId: guestId,
        name: String(guest?.name),
        gender: guest?.gender ?? Gender.male, // ברירת מחדל למקרה של undefined
      };
  
      // יצירת רשימה הכוללת את האורח הראשי וכל תתי האורחים
      const allParticipants = [mainGuestAsSubGuest, ...participants];
  
      // שליחת כל תתי האורחים
      for (const participant of allParticipants) {
        await subGuestService.createSubGuest(participant);
      }
  
      // שליפת האורח לפי ה-guestId
      const guestInEvent = await guestInEventService.getGuestInEventByGuestId(String(guestId));
  
      // עדכון האורח כך ש-ok יהיה true
      await guestInEventService.updateGuestInEvent(guestInEvent.id, { 
        ...guestInEvent, 
        ok: true 
      });
  
      alert("האישור נקלט בהצלחה!");
    } catch (error: any) {
      alert("שגיאה בלתי צפויה");
    }
  };
  
  

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">אישור הגעה לאירוע</h2>
      <label className="block mb-2">שם מלא:</label>
      <input
        type="text"
        value={guest?.name}
        className="w-full p-2 border rounded"
      />

      <div className="mt-4">
        <h3 className="font-semibold">משתתפים נוספים:</h3>
        {participants.map((participant, index) => (
          <div key={index} className="flex items-center gap-2 mt-2">
            <input
              type="text"
              placeholder="שם המשתתף"
              value={participant.name}
              onChange={(e) => handleParticipantChange(index, "name", e.target.value)}
              className="p-2 border rounded"
            />
            <select
              value={participant.gender}
              onChange={(e) => handleParticipantChange(index, "gender", e.target.value)}
              className="p-2 border rounded"
            >
              <option value={Gender.male}>זכר</option>
              <option value={Gender.female}>נקבה</option>
            </select>
            <button onClick={() => handleRemoveParticipant(index)} className="text-red-500">×</button>
          </div>
        ))}
        <button onClick={handleAddParticipant} className="mt-2 text-blue-500">➕ הוסף משתתף</button>
      </div>

      <button onClick={handleSubmit} className="mt-6 w-full bg-blue-500 text-white p-2 rounded">
        אישור הגעה
      </button>
    </div>
  );
};

export default RSVP;
