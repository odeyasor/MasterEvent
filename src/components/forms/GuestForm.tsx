import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import guestService from "../../services/guestService.ts";
import groupService from "../../services/groupService.ts";
import { Gender, Group } from "../../types/types.ts";
import { useAuth } from "../../context/AuthContext.tsx"

const NewGuest: React.FC = () => {
  const { userId } = useAuth();
  console.log("userId:", userId); // הוספת הדפסה לשם בדיקה

  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [gender, setGender] = useState<Gender>(Gender.male);
  const [category, setCategory] = useState(""); // קטגוריה נבחרת
  const [categories, setCategories] = useState<string[]>([]); // רשימת קטגוריות
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      console.log("userId in effect:", userId); // הוספת הדפסה לשם בדיקה
      if (!userId) {
        console.log("אין userId, לא נטען קונטקסט המשתמש.");
        return;
      }
      try {
        const groups: Group[] = await groupService.getGroupsByOrganizerId(userId);
        const groupNames = groups.map(group => group.name); // שליפת שמות הקבוצות
        setCategories(groupNames);
      } catch (error) {
        console.error("שגיאה בטעינת הקבוצות", error);
      }
    };
  
    if (userId) {
      fetchCategories();
    }
  }, [userId]); // הוספת התלות ב userId

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!userId) {
        console.log("אין userId, לא נטען קונטקסט המשתמש.");
        return;
      }
      const newGuest = { name, mail, gender };
      console.log("Sending guest data:", newGuest);

      // יצירת אורח חדש
       await guestService.createGuest(newGuest);
      const idguest= await guestService.getGuestsByMail(mail);
      
    
      const newGroup = {
        name: category,           // שם הקבוצה הוא הקטגוריה
        organizerId: userId,      // מזהה המארגן
        guestId: idguest.toString()         // מזהה האורח שנמצא
      };
      
      
      // שליחת הבקשה ליצירת קבוצה חדשה
      await groupService.createGroup(newGroup);
      
      alert("האורח והקבוצה נוספו בהצלחה!");
      navigate("/organizer-groups");
    } catch (error) {
      console.error("שגיאה בהוספת אורח וקבוצה", error);
      alert("הייתה בעיה בהוספת האורח והקבוצה");
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
        <select value={gender} onChange={(e) => setGender(Number(e.target.value) as Gender)}>
          <option value={Gender.male}>זכר</option>
          <option value={Gender.female}>נקבה</option>
        </select>

        <label>קטגוריה:</label>
        <input
          type="text"
          list="category-options"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="בחר קטגוריה או הקלד חדשה"
        />
        <datalist id="category-options">
          {categories.map((cat, index) => (
            <option key={index} value={cat} />
          ))}
        </datalist>

        <button type="submit">אישור</button>
      </form>
    </div>
  );
};

export default NewGuest;
