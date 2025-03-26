import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import subGuestService from '../services/subGuestService.ts';
import { Guest, Gender, SubGuest } from '../types/types.ts';
import React from 'react';
import { useLocation } from 'react-router-dom';
import guestService from '../services/guestService.ts';
import guestInEventService from '../services/guestInEventService.ts';
import eventService from '../services/eventService.ts';

const RSVP: React.FC = () => {
  const location = useLocation();
  const [name, setName] = useState<string>("");
  const [event, setEvent] = useState<Event | undefined>(undefined);
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('guestId');
  const eventId = queryParams.get('eventId');
  const [participants, setParticipants] = useState<Omit<SubGuest, "id">[]>([]);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [invitationImageBase64, setInvitationImageBase64] = useState<string>("");
  const [imageStatus, setImageStatus] = useState<string>(""); // משתנה חדש למעקב אחרי מצב התמונה

  const getGuestById = async (id: Number) => {
    try {
      const guest = await guestService.getGuest(Number(id));
      if (guest) {
        setName(guest.name);
      }
    } catch (error) {
      console.error("❌ שגיאה בשליפת פרטי אורח:", error);
    }
  };

  useEffect(() => {
    if (id) {
      getGuestById(Number(id));
    }
  }, [id]);

  useEffect(() => {
    if (eventId) {
      fetchEventData(Number(eventId));
    }
  }, [eventId]);

  const handleAddParticipant = () => {
    setParticipants([
      ...participants,
      { guestId: "1", name: "", gender: Gender.male },
    ]);
  };

  const handleRemoveParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const handleParticipantChange = (index: number, field: keyof SubGuest, value: string) => {
    setParticipants(
      participants.map((participant, i) =>
        i === index ? { ...participant, [field]: field === "gender" ? Number(value) as Gender : value } : participant
      )
    );
  };

  const fetchEventData = async (eventId: number) => {
    try {
      setImageStatus("טוען..."); // מצב "טוען"
      const eventData = await eventService.getEvent(eventId);
      console.log(eventData.invitation); // הדפס את התמונה כדי לבדוק את הנתונים
      setEvent(eventData);
      const invitation = eventData.invitation || "";

      // וודא שה-Base64 לא מכיל כפילות ושהוא מתחיל ב-data:image/jpeg;base64,
      if (invitation.startsWith("data:image/jpeg;base64,")) {
        const base64Image = "data:image/jpeg;base64," + invitation.replace("data:image/jpeg;base64,", "");
        setInvitationImageBase64(base64Image);
    
        
        // בדוק אם יש מספיק נתונים לתמונה
        if (base64Image.length > 100) {
          setInvitationImageBase64(`data:image/jpeg;base64,${base64Image}`);
          setImageStatus("הזמנה: ");
        } else {
          setImageStatus("תמונה לא תקינה, יש בעיה בקידוד.");
        }
      } else {
        setImageStatus("תמונה לא נמצאה או לא בפורמט Base64 תקין");
      }
    } catch (error) {
      console.error("❌ שגיאה בשליפת נתוני האירוע:", error);
      setImageStatus("שגיאה בשליפת התמונה");
    }
  };



  const handleSubmit = async () => {
    try {
      const rsvpData = { name, guests: participants.length + 1, participants };

      for (const participant of participants) {
        const response = await subGuestService.createSubGuest(participant);
      }
      const guestEventData = await guestInEventService.GetGuestsByEventIdAndGuestId(Number(eventId), Number(id));
      const updatedGuestData = { ...guestEventData, ok: true };
      console.log(updatedGuestData);
      await guestInEventService.updateGuestInEvent(String(id), updatedGuestData);
      setSubmitted(true);
    } catch (error) {
      console.error("❌ Error:", error);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-lg">
      {submitted ? (
        <h2 className="text-xl font-bold mb-4">תודה על השתתפותך</h2>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-4">אישור הגעה לאירוע</h2>

          {imageStatus && (
            <p className="text-sm text-gray-500">{imageStatus}</p> // הצגת מצב התמונה
          )}

          {invitationImageBase64 && (
            <img
              src={event.invitation} // אם ה-Base64 מכיל את המידע המלא כולל התחום, זה בסדר.
              alt="הזמנה לאירוע"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          )}

          <label className="block mb-2">שם מלא:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
        </>
      )}
    </div>
  );
};

export default RSVP;
