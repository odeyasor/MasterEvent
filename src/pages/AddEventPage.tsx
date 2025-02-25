// Components/AddEvent.tsx
import { createEvent } from '../api/eventApi.ts';
import { getGroupByOrginazer } from "../Services/EventService.tsx";
import React, { useState, useEffect } from 'react';
import './../styles/Add.css';

const AddEvent = () => {
  // הגדרת משתנים למעקב אחרי מצב השדות
  const [eventName, setEventName] = useState(''); // שם האירוע
  const [eventDate, setEventDate] = useState(''); // תאריך האירוע
  const [address, setAddress] = useState(''); // כתובת האירוע
  const [details, setDetails] = useState(''); // פרטים נוספים על האירוע
  const [seperation, setSeperation] = useState(false); // האם יש הפרדה בין מגדרים (אם רלוונטי)
  const [invitation, setInvitation] = useState<File | null>(null); // קובץ הזמנה
  const [allGuests, setAllGuests] = useState<any[]>([]); // רשימת כל האורחים
  const [selectedGuests, setSelectedGuests] = useState<string[]>([]); // רשימת האורחים שנבחרו

  // שימוש ב- useEffect כדי להוריד את רשימת האורחים בזמן טעינת הרכיב
  useEffect(() => {
    const fetchGuests = async () => {
      const storedOrganizerId = 'המזהה של המארגן הנוכחי'; // המזהה של המארגן שיכול להיות מה-localStorage
      const filteredGuests = await getGroupByOrginazer(storedOrganizerId); // הנחה שמבצע חיפוש או סינון אורחים
      setAllGuests(filteredGuests); // שמירת רשימת האורחים
    };

    fetchGuests(); // קריאה לפונקציה להורדת האורחים
  }, []);

  // פונקציה לטיפול בשינוי של בחירת אורח
  const handleGuestChange = (event: React.ChangeEvent<HTMLInputElement>, guestId: string) => {
    if (event.target.checked) {
      setSelectedGuests([...selectedGuests, guestId]); // אם האורח נבחר, מוסיפים אותו לרשימה
    } else {
      setSelectedGuests(selectedGuests.filter(id => id !== guestId)); // אם האורח לא נבחר, מסננים אותו
    }
  };

  // טיפול בהגשת הטופס
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // מניעת רענון הדף בעת הגשה

    // הכנת המידע שנשלח לשרת
    const eventData = {
      eventName,
      eventDate,
      address,
      details,
      seperation,
      invitation,
      guests: selectedGuests,
    };

    try {
      const formData = new FormData(); // יצירת FormData למשלוח קבצים יחד עם הנתונים
      formData.append('eventName', eventData.eventName);
      formData.append('eventDate', eventData.eventDate);
      formData.append('address', eventData.address);
      formData.append('details', eventData.details);
      formData.append('seperation', String(eventData.seperation)); // המרת Boolean ל-String
      if (invitation) {
        formData.append('invitation', invitation); // הוספת קובץ הזמנה אם קיים
      }
      eventData.guests.forEach((guest) => {
        formData.append('guests', guest); // הוספת כל האורחים שנבחרו
      });

      const response = await createEvent(formData); // קריאה לפונקציה שיצרה את האירוע

      // טיפול בתגובה מהשרת
      const result = await response.json(); // המרת התגובה לפורמט JSON
      if (response.ok) {
        alert('האירוע נוסף בהצלחה!'); // הצגת הודעת הצלחה
      } else {
        alert('שגיאה בהוספת האירוע: ' + result.message); // הצגת הודעת שגיאה אם משהו לא בסדר
      }
    } catch (err) {
      console.error(err); // רישום שגיאות בקונסול
      alert('שגיאה בשרת'); // הצגת הודעת שגיאה כללית
    }
  };

  return (
    <div className="event-form-container">
      <h1>הוסף אירוע</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>שם האירוע</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>תאריך האירוע</label>
          <input
            type="datetime-local"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>כתובת</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div>
          <label>פרטים נוספים</label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            required
          />
        </div>
        <div>
          <label>האם יש הפרדה</label>
          <input
            type="checkbox"
            checked={seperation}
            onChange={() => setSeperation(!seperation)}
          />
        </div>
        <div>
          <label>הזמנה</label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setInvitation(e.target.files ? e.target.files[0] : null)}
          />
        </div>

        {/* הצגת האורחים שניתן לבחור */}
        <div className="guest-list-container">
          <label>בחר אורחים</label>
          <div className="guest-list">
            {allGuests.map((guest) => (
              <div className="guest-item" key={guest.id}>
                <input
                  type="checkbox"
                  id={`guest-${guest.id}`}
                  checked={selectedGuests.includes(guest.id)}
                  onChange={(e) => handleGuestChange(e, guest.id)}
                />
                <label htmlFor={`guest-${guest.id}`}>{guest.name}</label>
              </div>
            ))}
          </div>
        </div>

        <button type="submit">שלח</button>
      </form>
    </div>
  );
};

export default AddEvent;
