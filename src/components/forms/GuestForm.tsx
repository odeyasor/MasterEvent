import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import guestService from "../../services/guestService.ts";
import groupService from "../../services/groupService.ts";
import { Gender, Group } from "../../types/types.ts";
import { useAuth } from "../../context/AuthContext.tsx";
import "../../styles/form.css";

const GuestForm: React.FC = () => {
  const { userId } = useAuth();
  const { guestId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [gender, setGender] = useState<Gender | undefined>(undefined);
  const [group, setGroup] = useState("");
  const [categories, setCategories] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const groups: Group[] = await groupService.getGroupsByOrganizerId(userId);
        setCategories(groups);
      } catch (error) {
        setErrorMessage("שגיאה בטעינת הקבוצות.");
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchCategories();
  }, [userId]);

  useEffect(() => {
    const fetchGuest = async () => {
      if (!guestId) return;
      setLoading(true);
      try {
        const guest = await guestService.getGuest(Number(guestId));
        setName(guest.name);
        setMail(guest.mail);
        setGender(guest.gender);
        const selectedGroup = categories.find(g => g.id === guest.groupId);
        if (selectedGroup) setGroup(selectedGroup.name);
      } catch (error) {
        setErrorMessage("שגיאה בטעינת פרטי האורח.");
      } finally {
        setLoading(false);
      }
    };
    if (guestId) fetchGuest();
  }, [guestId, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
  
    try {
      const selectedGroup = categories.find(g => g.name === group);
      if (!selectedGroup) {
        setErrorMessage("שגיאה: נא לבחור קטגוריה תקפה.");
        return;
      }
  
      const guestData = { name, mail, gender, groupId: selectedGroup.id };
  
      if (guestId) {
        await guestService.updateGuest(Number(guestId), guestData);
      } else {
        await guestService.createGuest(guestData);
      }
  
      navigate("/groups");
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data); // מציג את השגיאה שהשרת החזיר
      } else {
        setErrorMessage("שגיאה לא צפויה, נסי שוב.");
      }
    }
  };
  
  

  return (
    <div className="form-container">
      <h2>{guestId ? "עריכת אורח" : "הוספת אורח חדש"}</h2>
      {loading && <p>טוען נתונים...</p>}


      <form onSubmit={handleSubmit} className="neon-form">
        <label>שם:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

        <label>אימייל:</label>
        <input type="email" value={mail} onChange={(e) => setMail(e.target.value)} required />

        <label>מגדר:</label>
        <select value={gender} onChange={(e) => setGender(Number(e.target.value) as Gender)} required>
          <option value="">בחר מגדר</option>
          <option value={Gender.male}>גבר</option>
          <option value={Gender.female}>אישה</option>
        </select>

        <label>קטגוריה:</label>
        <select value={group} onChange={(e) => setGroup(e.target.value)} required>
          <option value="">בחר קטגוריה</option>
          {categories.map(g => (
            <option key={g.id} value={g.name}>{g.name}</option>
          ))}
        </select>
        {errorMessage && <p className="error-message">{errorMessage}</p>} {/* הצגת הודעת שגיאה */}

        <button type="submit" disabled={loading || categories.length === 0}>
          {guestId ? "עדכן" : "אישור"}
        </button>
      </form>
    </div>
  );
};

export default GuestForm;
