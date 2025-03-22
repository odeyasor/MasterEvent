import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import eventService from "../services/eventService.ts"; // שירות לשלוף את פרטי האירוע

const EditEventPage = () => {
  const navigate = useNavigate();
  const { eventId } = useParams(); // קבלת מזהה האירוע מה-URL
  const [event, setEvent] = useState<any>(null);
  const [showInvitation, setShowInvitation] = useState<boolean>(true); // התמונה תוצג ברגע שהעמוד יטען

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

  const handleButtonClick = (path: string) => {
    if (path !== "/edit-event/{eventId}/arrange-tables") {
      setShowInvitation(false); // אם לוחצים על כפתור אחר, התמונה מוסתרת
    }
    navigate(path);
  };

  return (
    <div className="edit-event-container">
      {event ? (
        <>
          <h1>ערוך את האירוע: {event.eventName}</h1>

          {/* כפתורים */}
          <div>
            <button onClick={() => handleButtonClick(`/edit-event/${eventId}/choose-guests`)}>הזמן אורחים</button>
            <button onClick={() => handleButtonClick(`/edit-event/${eventId}/send-invitations`)}>שלח הזמנות</button>
            <button onClick={() => handleButtonClick(`/edit-event/${eventId}/edit-details`)}>שינוי פרטי האירוע</button>
            <button onClick={() => handleButtonClick(`/edit-event/${eventId}/guests-list`)}>רשימת אורחים שאישרו הגעה</button>
            <button onClick={() => handleButtonClick(`/edit-event/${eventId}/arrange-tables`)}>סידור שולחנות</button>
          </div>

          {/* הצגת תמונת ההזמנה אם showInvitation הוא true */}
          {showInvitation && event.invitation && (
            <div className="event-invitation">
              <img
                src={event.invitation}
                alt="הזמנה לאירוע"
                className="event-invitation-image"
                style={{ maxWidth: "300px", height: "auto", borderRadius: "10px", margin: "10px auto", display: "block" }}
              />
            </div>
          )}
        </>
      ) : (
        <p>טוען את פרטי האירוע...</p>
      )}

      {/* כאן יוצג התוכן של כל דף בהתאם לנווט */}
      <div className="event-content">
        <Outlet />
      </div>
    </div>
  );
};

export default EditEventPage;
