import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import eventService from "../../services/eventService.ts";
import organizerService from "../../services/organizerService.ts";
import { useAuth } from "../../context/AuthContext.tsx";
import { Event } from "../../types/types.ts";
import "../../styles/NewEvent.css";

const EventForm: React.FC = () => {
  const { userId } = useAuth();
  const [event, setEvent] = useState<Partial<Event>>({
    eventDate: "",
    address: "",
    details: "",
    seperation: false,
    invitation: "",
    photos: [],
    guests: [],
  });
  const [image, setImage] = useState<File | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const { eventId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (eventId) {
      setIsEdit(true);
      const fetchEventData = async () => {
        try {
          const fetchedEvent = await eventService.getEvent(eventId);
          setEvent(fetchedEvent);
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
        eventName: event.eventName || "",
        eventDate: event.eventDate || "",
        address: event.address || "",
        details: event.details || "",
        seperation: event.seperation || false,
        invitation: "", // נכניס את הקובץ בהמשך אם צריך
        photos: [],
        guests: [],
      };
  
      if (image) {
        // המרת תמונה לנתון מתאים אם ה-API דורש
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = async () => {
          eventData.invitation = reader.result as string; // שמירת התמונה בפורמט base64
          if (isEdit && eventId) {
            await eventService.updateEvent(eventId, eventData);
            navigate(`/event-details/${eventId}`);
          } else {
            await eventService.createEvent(eventData);
            navigate("/events");
          }
        };
      } else {
        if (isEdit && eventId) {
          await eventService.updateEvent(eventId, eventData);
          navigate(`/event-details/${eventId}`);
        } else {
          await eventService.createEvent(eventData);
          navigate("/events");
        }
      }
    } catch (error) {
      console.log("אירוע לא נוצר או עודכן:", error);
      alert("הייתה שגיאה בשמירת האירוע. אנא נסה שוב.");
    }
  };
  
  return (
    <div className="event-container">
      <h2>{isEdit ? "עדכן אירוע" : "צור אירוע"}</h2>

      <form onSubmit={handleSubmit}>
        <label>שם האירוע:</label>
        <input
          type="text"
          value={event.eventName || ""}
          onChange={(e) => setEvent({ ...event, eventName: e.target.value })}
          required
        />

        <label>תאריך ושעה:</label>
        <input
          type="datetime-local"
          value={event.eventDate || ""}
          onChange={(e) => setEvent({ ...event, eventDate: e.target.value })}
          required
        />

        <label>כתובת:</label>
        <input
          type="text"
          value={event.address || ""}
          onChange={(e) => setEvent({ ...event, address: e.target.value })}
          required
        />

        <label>פרטים נוספים:</label>
        <textarea
          value={event.details || ""}
          onChange={(e) => setEvent({ ...event, details: e.target.value })}
          rows={3}
        ></textarea>

        <label>
          <input
            type="checkbox"
            checked={event.seperation || false}
            onChange={(e) => setEvent({ ...event, seperation: e.target.checked })}
          />
          האם יש הפרדה?
        </label>

        <label>העלאת תמונה (הזמנה):</label>
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />

        {image && <p>✔ תמונה נבחרה: {image.name}</p>}

        <button type="submit">{isEdit ? "עדכן אירוע" : "צור אירוע"}</button>
      </form>
    </div>
  );
};

export default EventForm;
