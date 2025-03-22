import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import guestService from "../services/guestService.ts";
import eventService from "../services/eventService.ts"; // שירות לשליפת פרטי האירוע
import mailjetService from '../services/mailService.ts'; // שירות לשליחת המייל
import '../styles/styles.css';

const SendInvitationsPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [eventName, setEventName] = useState(""); // שם האירוע
  const [status, setStatus] = useState<string | null>(null);
  const [invitationImageBase64, setInvitationImageBase64] = useState(""); // Base64 של התמונה

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventId) {
        console.error("אין מזהה אירוע");
        return;
      }

      try {
        const event = await eventService.getEvent(eventId);
        setEventName(event.eventName);
        // שים לב כאן אתה שולף את התמונה כ-Base64
        setInvitationImageBase64(event.invitation); 
        setSubject(`הזמנה לאירוע: ${event.eventName}`); // נושא ברירת מחדל
        setContent(`
          שלום,\n\n
          אתם מוזמנים לאירוע "${event.eventName}". \n\n
          נא אשרו את השתתפותכם בקישור הבא: <a href="http://localhost:3000/ok">לחץ כאן לאישור</a>\n\n
          <img src="data:image/jpeg;base64,${event.invitation}" alt="הזמנה לאירוע" style="max-width: 100%; height: auto;" />
        `); // הוספת התמונה בגוף המייל כ-Base64
      } catch (err) {
        console.error("שגיאה בטעינת פרטי האירוע", err);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleSendInvitations = async () => {
    if (!eventId) {
      console.error("אין מזהה אירוע");
      setStatus("אין מזהה אירוע");
      return;
    }

    try {
      setStatus("שולח הזמנות...");
      // שליחת ההזמנות לכל המוזמנים
      const guests = await guestService.getGuestsByEvent(Number(eventId));

      // אם יש מוזמנים, נבצע שליחה
      if (guests && guests.length > 0) {
        await mailjetService.sendEmail({
          eventId,
          subject,
          body: content, // שליחת התוכן עם התמונה
        });

        setStatus("ההזמנות נשלחו בהצלחה");
        navigate(`/event-details/${eventId}`);
      } else {
        setStatus("אין מוזמנים לאירוע");
      }
    } catch (err) {
      console.error("שגיאה בשליחת ההזמנות", err);
      setStatus("שגיאה בשליחת ההזמנות");
    }
  };

  return (
    <div className="send-invitations-container">
      <h1>שליחת הזמנות</h1>
      <label>
        נושא ההזמנה:
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </label>
      <label>
        תוכן ההזמנה:
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </label>

      <button onClick={handleSendInvitations}>אישור ושלח</button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default SendInvitationsPage;
