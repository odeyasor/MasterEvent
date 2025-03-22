import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";  // הוספנו את useParams
import guestService from "../../services/guestService.ts";
import groupService from "../../services/groupService.ts";
import { Gender, Group } from "../../types/types.ts";
import { useAuth } from "../../context/AuthContext.tsx";

const GuestForm: React.FC = () => {
  const { userId } = useAuth();
  const { groupName } = useParams<{ groupName: string }>(); // שליפת שם הקבוצה מה-URL
  console.log("userId:", userId);

  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [gender, setGender] = useState<Gender>(Gender.male);
  const [group, setGroup] = useState(""); // קטגוריה נבחרת
  const [categories, setCategories] = useState<Group[]>([]); // שמירת כל האובייקטים של הקבוצות
  const [loading, setLoading] = useState(true); // לבדיקה אם הטעינה הושלמה
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      if (!userId) {
        console.log("אין userId, לא ניתן לטעון קבוצות.");
        return;
      }
      setLoading(true);
      try {
        const groups: Group[] = await groupService.getGroupsByOrganizerId(userId);
        console.log("Groups fetched from API:", groups);

        if (groups.length === 0) {
          console.log("לא נמצאו קבוצות למשתמש הזה.");
        }

        setCategories(groups);

        // אם יש שם קבוצה ב-URL, נבחר את הקבוצה המתאימה
        if (groupName) {
          const selectedGroup = groups.find(g => g.name === groupName);
          if (selectedGroup) {
            setGroup(selectedGroup.name);
          }
        }

      } catch (error) {
        console.error("שגיאה בטעינת הקבוצות", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchCategories();
    }
  }, [userId, groupName]); // נוספה התלות ב-groupName

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!userId) {
        console.log("אין userId, לא ניתן להוסיף אורח.");
        return;
      }

      // מציאת ה-ID של הקבוצה שנבחרה
      const selectedGroup = categories.find(g => g.name === group);
      if (!selectedGroup) {
        console.log("לא נמצאה קבוצה עם שם זה");
        return;
      }

      // יצירת אורח חדש עם מזהה הקבוצה
      const newGuest = { name, mail, gender, groupId: selectedGroup.id };
      console.log("Sending guest data:", newGuest);

      await guestService.createGuest(newGuest);

      navigate("/organizer-groups");

    } catch (error) {
      console.error("שגיאה בהוספת אורח", error);
      alert("הייתה בעיה בהוספת האורח");
    }
  };

  return (
    <div className="guest-container">
      <h2>הוספת אורח חדש</h2>
      {loading && <p>טוען קטגוריות...</p>}
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
        <select value={gender} onChange={(e) => setGender(Number(e.target.value) as Gender)}>
          <option value={Gender.male}>זכר</option>
          <option value={Gender.female}>נקבה</option>
        </select>

        <label>קטגוריה:</label>
        <select
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          required
        >
          <option value="">בחר קטגוריה</option>
          {categories.length > 0 ? (
            categories.map((g) => (
              <option key={g.id} value={g.name}>{g.name}</option>
            ))
          ) : (
            <option disabled>לא נמצאו קטגוריות</option>
          )}
        </select>

        <button type="submit" disabled={categories.length === 0}>אישור</button>
      </form>
    </div>
  );
};

export default GuestForm;
