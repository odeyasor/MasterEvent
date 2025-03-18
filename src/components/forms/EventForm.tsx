import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import eventService from "../../services/eventService.ts";
import organizerService from "../../services/organizerService.ts";
import { useAuth } from "../../context/AuthContext.tsx";
import "../../styles/NewEvent.css";

const NewEvent: React.FC = () => {
  const { userId } = useAuth();
  const [eventName, setEventName] = useState("");
  const [eventDate, setDate] = useState("");
  const [address, setAddress] = useState("");
  const [details, setDetails] = useState("");
  const [separation, setSeparation] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [isEdit, setIsEdit] = useState(false); // מצב אם אנחנו בעריכה
  const { eventId } = useParams(); // מזהה האירוע מה-URL
  const navigate = useNavigate();

  // אם אנחנו בעמוד עריכת אירוע, נטען את פרטי האירוע
  useEffect(() => {
    if (eventId) {
      setIsEdit(true); // אם יש eventId, אנחנו בעורך
      const fetchEventData = async () => {
        try {
          const event = await eventService.getEvent(eventId); // יש להוסיף פונקציה כזו בשירות
          setEventName(event.eventName);
          setDate(event.eventDate);
          setAddress(event.address);
          setDetails(event.details);
          setSeparation(event.seperation);
        } catch (error) {
          console.log("לא ניתן לטעון את פרטי האירוע:", error);
        }
      };
      fetchEventData();
    }
  }, [eventId]);

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
        seperation: separation,
        invitation: "",
        photos: image ? [image] : [],
        guests: [],
      };

      if (isEdit && eventId) {
        await eventService.updateEvent(eventId, eventData); // עדכון אירוע קיים
        navigate(`/event-details/${eventId}`); // הפניה לדף פרטי האירוע
      } else {
        await eventService.createEvent(eventData); // יצירת אירוע חדש
        navigate("/Home"); // הפניה לדף הבית
      }
    } catch (error) {
      console.log("אירוע לא נוצר או עודכן:", error);
      alert("הייתה שגיאה בשמירת האירוע. אנא נסה שוב.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="event-container">
              <h2>{isEdit ? "עדכן אירוע" : "צור אירוע"}</h2>

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

        <button type="submit">{isEdit ? "עדכן אירוע" : "צור אירוע"}</button>
      </form>
    </div>
  );
};

export default NewEvent;
