import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/NewEvent.css";

const NewEvent: React.FC = () => {
  const [eventName, setEventName] = useState("");
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");
  const [details, setDetails] = useState("");
  const [separation, setSeparation] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const eventData = {
      eventName,
      date,
      address,
      details,
      separation,
      image,
    };
    console.log("אירוע חדש נוצר:", eventData);
    alert("האירוע נוצר בהצלחה!");
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
          value={date}
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
      
      <button onClick={() => navigate("/choose-guests")}>הוסף אורחים</button>
    </div>
  );
};

export default NewEvent;
