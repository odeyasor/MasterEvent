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
  const [gender, setGender] = useState<Gender>(Gender.male);
  const [group, setGroup] = useState("");
  const [categories, setCategories] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const groups: Group[] = await groupService.getGroupsByOrganizerId(userId);
        setCategories(groups);
        
      } catch (error) {
        console.error("שגיאה בטעינת הקבוצות", error);
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
        console.error("שגיאה בטעינת פרטי האורח", error);
      } finally {
        setLoading(false);
      }
    };
    if (guestId) fetchGuest();
  }, [guestId, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!userId) return;
      const selectedGroup = categories.find(g => g.name === group);
      if (!selectedGroup) return;

      const guestData = { name, mail, gender, groupId: selectedGroup.id };
      if (guestId) {
        await guestService.updateGuest(Number(guestId), guestData);
      } else {
        await guestService.createGuest(guestData);
      }
      navigate("/groups");
    } catch (error) {
      console.error("שגיאה בשמירת האורח", error);
      alert("הייתה בעיה בשמירת האורח");
    }
  };

  return (
    <div className="form-container">
      <h2>{guestId ? "עריכת אורח" : "הוספת אורח חדש"}</h2>
      {loading && <p>טוען נתונים...</p>}
      <form onSubmit={handleSubmit}>
        <label>שם:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

        <label>אימייל:</label>
        <input type="email" value={mail} onChange={(e) => setMail(e.target.value)} required />

        <label>מין:</label>
        <select value={gender} onChange={(e) => setGender(Number(e.target.value) as Gender)}>
          <option value={Gender.male}>זכר</option>
          <option value={Gender.female}>נקבה</option>
        </select>

        <label>קטגוריה:</label>
        <select value={group} onChange={(e) => setGroup(e.target.value)} required>
          <option value="">בחר קטגוריה</option>
          {categories.map(g => (
            <option key={g.id} value={g.name}>{g.name}</option>
          ))}
        </select>

        <button type="submit" disabled={loading || categories.length === 0}>{guestId ? "עדכן" : "אישור"}</button>
      </form>
    </div>
  );
};

export default GuestForm;