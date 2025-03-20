import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import apiClient from '../api/apiClient.ts'; // יש לייבא את ה-client
import { Guest ,Gender,SubGuest} from '../types/types.ts'; // יש לוודא שהוגדר טיפוס מתאים לאורח
import React from 'react';
import { useLocation } from 'react-router-dom';

const RSVP: React.FC = () => {
  const location = useLocation();
  const [name, setName] = useState<string>(""); // שמור את השם של האורח
  // שלוף את המייל מה-URL
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email');
  const [participants, setParticipants] = useState<Omit<SubGuest, "id">[]>([]);

  // פונקציה שמביאה את פרטי האורח לפי המייל
  const getGuestByEmail = async (mail: string) => {
    console.log("🔍 Trying to get guest by email:", mail); // קונסול לצורך בדיקה
    try {
      const guestId = await apiClient.get('/Guest/mail', { params: { mail } });
      console.log("📤 Guest fetched:", guestId); // קונסול לתוצאה שהוחזרה
      if (guestId) {
        // כאן ניתן לשלוף גם את שם האורח אם יש API נוסף או לעדכן את השם בהתאם
        setName("שם האורח שהוחזר מהשרת"); // לדוגמה להכניס את שם האורח
        console.log("✅ Name set to:", "שם האורח שהוחזר מהשרת"); // קונסול שהשם השתנה
      }
    } catch (error) {
      console.error("❌ שגיאה בשליפת פרטי אורח:", error); // קונסול בשגיאה
    }
  };

  // השתמש ב-useEffect כדי לקרוא לפונקציה כשמייל נמצא
  useEffect(() => {
    if (email) {
      console.log("📧 Email found in URL:", email); // קונסול לאימייל שנמצא ב-URL
      getGuestByEmail(email);
    } else {
      console.log("❌ No email found in URL"); // קונסול אם לא נמצא מייל
    }
  }, [email]);

  const handleAddParticipant = () => {
    console.log("➕ Adding new participant"); // קונסול בהוספת משתתף
    setParticipants([
      ...participants,
      { guestId: "1", name: "", gender: Gender.male }, // אין id
    ]);
    console.log("📋 Updated participants:", participants); // קונסול אחרי עדכון
  };

  const handleRemoveParticipant = (index: number) => {
    console.log("❌ Removing participant at index:", index); // קונסול בהסרת משתתף
    setParticipants(participants.filter((_, i) => i !== index));
    console.log("📋 Updated participants after removal:", participants); // קונסול אחרי הסרה
  };

  const handleParticipantChange = (index: number, field: keyof SubGuest, value: string) => {
    console.log(`✏️ Updating participant at index ${index}, field: ${field}, new value: ${value}`); // קונסול בהזנה
    setParticipants(
      participants.map((participant, i) =>
        i === index ? { ...participant, [field]: field === "gender" ? Number(value) as Gender : value } : participant
      )
    );
    console.log("📋 Updated participants after change:", participants); // קונסול אחרי עדכון
  };

  const handleSubmit = async () => {
    console.log("🔵 Submitting RSVP with data:", { name, guests: participants.length + 1, participants }); // קונסול לפני שליחה
    try {
      const rsvpData = { name, guests: participants.length + 1, participants };

      for (const participant of participants) {
        console.log("📤 Sending participant:", participant); // קונסול לפני שליחה של כל משתתף
        const response = await apiClient.post('/SubGuest', participant);
        console.log("✅ Response from server:", response.data); // קונסול אחרי קבלת תגובה
      }

      alert("האישור נקלט בהצלחה!");
    } catch (error: any) {
      if (error.response) {
        console.error("❌ Server Error:", error.response.data); // קונסול בשגיאה בשרת
        alert(`שגיאת שרת: ${error.response.data.message || "שגיאה כללית"}`);
      } else if (error.request) {
        console.error("❌ Request Error:", error.request); // קונסול בשגיאה בבקשה
        alert("אין תגובה מהשרת, בדוק את החיבור");
      } else {
        console.error("❌ Unknown Error:", error.message); // קונסול בשגיאה לא צפויה
        alert("שגיאה בלתי צפויה");
      }
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">אישור הגעה לאירוע</h2>
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
    </div>
  );
};

export default RSVP;
