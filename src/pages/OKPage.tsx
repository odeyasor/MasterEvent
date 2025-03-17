import React, { useState } from "react";
import { Gender, SubGuest } from "../types/types.ts";
import apiClient from "../api/apiClient.ts"; 
import "../styles/NewEvent.css";

const RSVP: React.FC = () => {
  const [name, setName] = useState("");
  const [participants, setParticipants] = useState<Omit<SubGuest, "id">[]>([]); // בלי id

  const handleAddParticipant = () => {
    setParticipants([
      ...participants,
      { guestId: "1", name: "", gender: Gender.male }, // אין id
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

  const handleSubmit = async () => {
    try {
      const rsvpData = { name, guests: participants.length + 1, participants };

      console.log("🔵 Submitting RSVP:", rsvpData); // בדיקה: מה נשלח

      for (const participant of participants) {
        console.log("📤 Sending participant:", participant); // בדיקה: משתתף לפני שליחה
        const response = await apiClient.post('/SubGuest', participant);
        console.log("✅ Response from server:", response.data); // בדיקה: תגובת השרת
      }

      alert("האישור נקלט בהצלחה!");
    } catch (error: any) {
      if (error.response) {
        console.error("❌ Server Error:", error.response.data);
        alert(`שגיאת שרת: ${error.response.data.message || "שגיאה כללית"}`);
      } else if (error.request) {
        console.error("❌ Request Error:", error.request);
        alert("אין תגובה מהשרת, בדוק את החיבור");
      } else {
        console.error("❌ Unknown Error:", error.message);
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
