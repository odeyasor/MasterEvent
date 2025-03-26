import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import guestService from "../../services/guestService.ts";
import groupService from "../../services/groupService.ts";
import { Gender, Group } from "../../types/types.ts";
import { useAuth } from "../../context/AuthContext.tsx";
import "../../styles/form.css";
import { useLocation } from 'react-router-dom';

 
const GuestForm: React.FC = () => {
  const { userId } = useAuth();
  const {  groupId } = useParams(); // ← הוספתי קבלת groupId מהנתיב
 const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const guestId = queryParams.get('guestId');
  console.log("guestId from query:", guestId); // אם הוא מופיע כאן, זו יכולה להיות פתרון זמני


  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [gender, setGender] = useState<Gender | undefined>(undefined);
  const [group, setGroup] = useState(""); // ← נשמור את ה-id של הקבוצה, לא את ה-name!
  const [categories, setCategories] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      console.log(guestId); // הדפסה לצורך בדיקה

      if (!userId) return;
      setLoading(true);
      try {

        const groups: Group[] = await groupService.getGroupsByOrganizerId(userId);
        setCategories(groups);

        // אם זה אורח חדש ויש groupId בפרמס, נגדיר לו כברירת מחדל את הקבוצה
        if (!guestId && groupId) {
          const selectedGroup = groups.find(g => g.id === Number(groupId));
          if (selectedGroup) setGroup(String(selectedGroup.id));
        }
      } catch (error) {
        setErrorMessage("שגיאה בטעינת הקבוצות.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [userId, groupId, guestId]);

  useEffect(() => {
    const fetchGuest = async () => {
      if (!guestId) return;
      setLoading(true);
      try {
        const guest = await guestService.getGuest(Number(guestId));
        setName(guest.name);
        setMail(guest.mail);
        setGender(guest.gender);
        setGroup(String(guest.groupId)); // ← עכשיו שומר את ה-ID של הקבוצה
      } catch (error) {
        setErrorMessage("שגיאה בטעינת פרטי האורח.");
      } finally {
        setLoading(false);
      }
    };
    if (guestId) fetchGuest();
  }, [guestId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
  
    try {
      const selectedGroup = categories.find(g => g.id === Number(group));
      if (!selectedGroup) {
        setErrorMessage("שגיאה: נא לבחור קבוצה תקפה.");
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
        setErrorMessage(error.response.data);
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
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button type="submit" disabled={loading || categories.length === 0}>
          {guestId ? "עדכן" : "אישור"}
        </button>
      </form>
    </div>
  );
};

export default GuestForm;
