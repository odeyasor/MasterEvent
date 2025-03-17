import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/NewEvent.css";
import eventService from "../services/eventService.ts"
import organizerService from "../services/organizerService.ts"
import { useAuth } from "../context/AuthContext.tsx"

const NewEvent: React.FC = () => {
  const { userId } = useAuth();
  const [eventName, setEventName] = useState("");
  const [eventDate, setDate] = useState("");
  const [address, setAddress] = useState("");
  const [details, setDetails] = useState("");
  const [separation, setSeparation] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      alert("שגיאה: המשתמש אינו מחובר.");
      return;
    }

    try {
      const organizer = await organizerService.getOrganizer(userId);
      
      if (!organizer) {
        alert("שגיאה: לא נמצא מארגן.");
        return;
      }

      const eventData = {
        organizerId: organizer.id, 
        eventName,
        eventDate,
        address,
        details,
        seperation: separation, // ודא שזה השם הנכון בטיפוס
        invitation: "", // ערך ברירת מחדל
        photos: [], // רשימת תמונות ריקה
        guests: [], // רשימת אורחים ריקה
      };

      await eventService.createEvent(eventData);
      navigate("/Home"); // ✅ הפניה לדף הבית במקום כפתור "הוסף אורחים"
      
    } catch (error) {
      console.log("אירוע חדש לא נוצר:", error);
      alert("הייתה שגיאה ביצירת האירוע. אנא נסה שוב.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="event-container">
      <h2>יצירת אירוע חדש</h2>
      <form onSubmit={handleSubmit}>
        <label>שם האירוע:</label>
        <input
          type="text"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          required
        />

        <label>תאריך:</label>
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <label>כתובת:</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        <label>פרטים נוספים:</label>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={3}
        ></textarea>

        <label>
          <input
            type="checkbox"
            checked={separation}
            onChange={(e) => setSeparation(e.target.checked)}
          />
          האם יש הפרדה?
        </label>

        <label>העלאת תמונה (הזמנה):</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />

        {image && <p>✔ תמונה נבחרה: {image.name}</p>}

        <button type="submit">צור אירוע</button>
      </form>
    </div>
  );
};

export default NewEvent;
