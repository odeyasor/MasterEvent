import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import guestInEventService from "../services/guestInEventService.ts";
import eventService from "../services/eventService.ts";
import mailjetService from "../services/mailService.ts";
import { GuestInEvent } from "../types/types.ts";
import guestService from "../services/guestService.ts";
import "../styles/styles.css";

const SendInvitationsPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [eventName, setEventName] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [invitationImageBase64, setInvitationImageBase64] = useState("");
  const [guests, setGuests] = useState<GuestInEvent[]>([]);


  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventId) {
        console.error("❌ אין מזהה אירוע");
        return;
      }

      try {
        const event = await eventService.getEvent(Number(eventId));
        setEventName(event.eventName);
        setInvitationImageBase64(event.invitation);
        setSubject(`הזמנה לאירוע: ${event.eventName}`);

        setContent(
          `שלום,\n\nאתם מוזמנים לאירוע "${event.eventName}".\n\n<img src="data:image/jpeg;base64,${event.invitation}" alt="הזמנה לאירוע" style="max-width: 100%; height: auto;" />\n\nנא אשרו את השתתפותכם בקישור הבא: <a href="http://localhost:3000/ok">לחץ כאן לאישור</a>`
        );
      } catch (err) {
        console.error("❌ שגיאה בטעינת פרטי האירוע:", err);
      }
    };

    const fetchGuests = async () => {
      try {
        const guestsData = await guestInEventService.getGuestInEventsByEventId(String(eventId));
        console.log("📩 Raw guests data:", guestsData); // בדיקה אם זה אובייקט יחיד או מערך
        
        // ודא שהנתון הוא מערך
        const guestsArray = Array.isArray(guestsData) ? guestsData : [guestsData];
        console.log("✅ Processed guests array:", guestsArray); // הדפסת הנתונים המעודכנים
    
        setGuests(guestsArray);
      } catch (err) {
        console.error("❌ שגיאה בטעינת המוזמנים", err);
      }
    };
    


    fetchEventDetails();
    fetchGuests();
  }, [eventId]);

  const sendInvitationsToGuests = async (filteredGuests) => {
    if (!eventId) {
      console.error("אין מזהה אירוע");
      setStatus("אין מזהה אירוע");
      return;
    }

    try {
      setStatus("📨 שולח הזמנות...");
      if (filteredGuests.length > 0) {
        for (const guest of filteredGuests) {
          const guestDetail = await guestService.getGuest(guest.guestId);
          if (guestDetail.mail && isValidEmail(guestDetail.mail)) {
            console.log(`📧 Trying to send email to: ${guestDetail.mail}`);
  
            const guestConfirmationLink = `http://localhost:3000/ok?guestId=${guest.guestId}&eventId=${eventId}`;
            console.log("*****");
            console.log(guestConfirmationLink)
            const personalizedContent = `
            שלום,\n\n
            אתם מוזמנים לאירוע "${eventName}".\n\n
            <img src="data:image/jpeg;base64,${invitationImageBase64}" alt="הזמנה לאירוע" style="max-width: 100%; height: auto;" />\n\n
            נא אשרו את השתתפותכם בקישור הבא: <a href="${guestConfirmationLink}">לחץ כאן לאישור</a>
          `;
          
  
            try {
              const response = await mailjetService.sendSingleEmail({
                eventId,
                toEmail: guestDetail.mail,
                subject,
                body: personalizedContent,
              });
              console.log(`✅ Email sent to ${guestDetail.mail}, response:`, response);
            } catch (error) {
              console.error(`❌ Failed to send email to ${guestDetail.mail}:`, error);
            }
          } else {
            console.warn(`⚠️ Skipping invalid email: ${guestDetail.mail}`);

          }
        }
        setStatus("✅ ההזמנות נשלחו בהצלחה");
      } else {
        setStatus("⚠️ אין מוזמנים מתאימים לשליחה");
      }
    } catch (err) {

      console.error("שגיאה בשליחת ההזמנות", err);
      setStatus("❌ שגיאה בשליחת ההזמנות");
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

      <button onClick={() => sendInvitationsToGuests(guests)}>שלח לכל האורחים</button>
      <button onClick={() => sendInvitationsToGuests(guests.filter(g => g.ok !== true))}>
        שלח למי שלא אישר הגעה
      </button>
      <button onClick={() => sendInvitationsToGuests(guests.filter(g => g.ok === true))}>

        שלח למי שאישר הגעה
      </button>

      {status && <p>{status}</p>}
    </div>
  );
};

export default SendInvitationsPage;
