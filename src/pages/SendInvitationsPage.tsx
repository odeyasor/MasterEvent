import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import guestService from "../services/guestService.ts"; 
import eventService from "../services/eventService.ts"; // שירות לשליפת פרטי האירוע

const SendInvitationsPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [eventName, setEventName] = useState(""); // שם האירוע

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventId) {
        console.error("אין מזהה אירוע");
        return;
      }

      try {
        const event = await eventService.getEvent(eventId);
        setEventName(event.eventName); 
        setSubject(`הזמנה לאירוע: ${event.eventName}`); // נושא ברירת מחדל
        setContent(`שלום,\n\nאתם מוזמנים לאירוע "${event.eventName}". \n\nנא אשרו את השתתפותכם בקישור הבא: [קישור לאישור]`);
      } catch (err) {
        console.error("שגיאה בטעינת פרטי האירוע", err);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleSendInvitations = async () => {
    if (!eventId) {
      console.error("אין מזהה אירוע");
      return;
    }

    try {
      await guestService.sendEmails(Number(eventId), subject, content);
      console.log("ההזמנות נשלחו בהצלחה");

      // חזרה לעמוד פרטי האירוע
      navigate(`/event-details/${eventId}`);
    } catch (err) {
      console.error("שגיאה בשליחת ההזמנות", err);
    }
  };

  return (
    <div className="send-invitations-container">
      <h1>שליחת הזמנות</h1>
      <label>
        נושא ההזמנה:
        <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} />
      </label>
      <label>
        תוכן ההזמנה:
        <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      </label>
      <button onClick={handleSendInvitations}>אישור ושלח</button>
    </div>
  );
};

export default SendInvitationsPage;
