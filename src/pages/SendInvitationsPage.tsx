import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import guestService from "../services/guestService.ts";
import eventService from "../services/eventService.ts";
import mailjetService from '../services/mailService.ts';
import '../styles/form.css';

const SendInvitationsPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);

  const handleSendInvitations = async (type: "invitation" | "seating") => {
    if (!eventId) {
      console.error("אין מזהה אירוע");
      setStatus("אין מזהה אירוע");
      return;
    }

    try {
      setStatus("שולח...");
      const guests = await guestService.getGuestsByEvent(Number(eventId));

      if (guests && guests.length > 0) {
        if (type === "invitation") {
          await mailjetService.sendEmail({ eventId });
        } else {
          await mailjetService.sendSeatingsEmail({eventId});
        }
        setStatus("ההודעות נשלחו בהצלחה");
        navigate(`/event-details/${eventId}`);
      } else {
        setStatus("אין מוזמנים לאירוע");
      }
    } catch (err) {
      console.error("שגיאה בשליחה", err);
      setStatus("שגיאה בשליחה");
    }
  };

  return (
    <div className="form-container">
      <h1>שליחת הודעות</h1>
      <button onClick={() => setShowOptions(true)}>אישור ושלח</button>
      {showOptions && (
        <div className="options">
          <button onClick={() => handleSendInvitations("invitation")}>שלח הזמנה</button>
          <button onClick={() => handleSendInvitations("seating")}>שלח מקומות ישיבה</button>
        </div>
      )}
      {status && <p>{status}</p>}
    </div>
  );
};

export default SendInvitationsPage;
