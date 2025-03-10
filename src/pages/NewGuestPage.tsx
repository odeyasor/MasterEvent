import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import guestService from "../services/guestService.ts";
import { Gender } from "../types/types.ts";


const NewGuest: React.FC = () => {
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [gender, setGender] = useState<Gender>(Gender.male);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newGuest = { name, mail, gender };
      await guestService.createGuest(newGuest);
      alert("האורח נוסף בהצלחה!");
      navigate("/groups");
    } catch (error) {
      console.error("שגיאה בהוספת אורח", error);
      alert("הייתה בעיה בהוספת האורח");
    }
  };

  return (
    <div className="guest-container">
      <h2>הוספת אורח חדש</h2>
      <form onSubmit={handleSubmit}>
        <label>שם:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>אימייל:</label>
        <input
          type="email"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          required
        />

        <label>מין:</label>
        <select value={gender} onChange={(e) => setGender(e.target.value as Gender)}>
          <option value={Gender.male}>זכר</option>
          <option value={Gender.female}>נקבה</option>
        </select>

        <button type="submit">אישור</button>
      </form>
    </div>
  );
};

export default NewGuest;
