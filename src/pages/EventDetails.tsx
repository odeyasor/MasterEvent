import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import eventService from "../services/eventService.ts"; // שירות לשלוף את פרטי האירוע

const EditEventPage = () => {
  const navigate = useNavigate();
  const { eventId } = useParams(); // קבלת מזהה האירוע מה-URL
  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) {
        console.error("אין מזהה אירוע");
        return;
      }

      try {
        const fetchedEvent = await eventService.getEvent(eventId);
        setEvent(fetchedEvent);
      } catch (err) {
        console.error("שגיאה בטעינת האירוע", err);
      }
    };

    fetchEvent();
  }, [eventId]);

  return (
    <div className="edit-event-container">
      {event ? (
        <>
          <h1>ערוך את האירוע: {event.eventName}</h1>

     

          <div>
            <button onClick={() => navigate(`/choose-guests/${eventId}`)}>הזמן אורחים</button>
            <button onClick={() => navigate(`/send-invitations/${eventId}`)}>שלח הזמנות</button>
            <button onClick={() => navigate(`/edit-event/${eventId}`)}>שינוי פרטי האירוע</button>
            <button onClick={() => navigate(`/guests-event/${eventId}`)}>רשימת אורחים שאישרו הגעה</button>
            <button onClick={() => navigate("")}>סידור שולחנות</button>
          </div>

               {/* הצגת תמונת ההזמנה אם קיימת */}
               {event.invitation && (
            <img
              src={event.invitation}
              alt="הזמנה לאירוע"
              className="event-invitation-image"
              style={{ maxWidth: "300px", height: "auto", borderRadius: "10px", margin: "10px auto", display: "block" }}

            />)}
        </>
      ) : (
        <p>טוען את פרטי האירוע...</p>
      )}
    </div>
  );
};

export default EditEventPage;
