import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import groupService from "../../services/groupService.ts";
import { useAuth } from "../../context/AuthContext.tsx";
import { Group } from "../../types/types.ts"; // ייבוא הממשק
import "../../styles/form.css";

const AddGroupPage: React.FC = () => {
  const [groupName, setGroupName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [existingGroup, setExistingGroup] = useState<Group | null>(null);
  const navigate = useNavigate();
  const { userId } = useAuth();
  const { groupId } = useParams(); // שליפת מזהה הקבוצה מה-URL

  useEffect(() => {
    const checkExistingGroup = async () => {
      if (groupId) {
        try {
          const Id = Number(groupId); // המרת ה-id ל-Number
          const group: Group = await groupService.getGroup(Id); // שליפת פרטי הקבוצה
          setGroupName(group.name); // הצגת שם הקבוצה בטופס
          setExistingGroup(group); // שמירה של הקבוצה שנמצאה
        } catch (error) {
          console.error("Error fetching group:", error);
        }
      }
    };

    if (groupId) {
      checkExistingGroup(); // אם יש מזהה קבוצה, נבדוק אותה
    } else {
      setExistingGroup(null); // אם אין מזהה קבוצה, נוודא שאין קבוצה קיימת
    }
  }, [groupId]); // הוספתי את ה-id כתלות, כדי להתעדכן אם המזהה משתנה

  const handleAddOrUpdateGroup = async () => {
    if (!groupName.trim()) {
      return;
    }

    try {
      setLoading(true);
      if (existingGroup) {
        // עדכון קבוצה קיימת
        await groupService.updateGroup(existingGroup.id.toString(), {
          name: groupName,
          organizerId: Number(userId)

        }
      );
      navigate("/groups")
      } else {
        // יצירת קבוצה חדשה
        const newGroup: Group = { name: groupName, organizerId: Number(userId), id: 0 }; // נניח שה-ID ייווצר אוטומטית בשרת
        await groupService.createGroup(newGroup);
        navigate("/groups")
      }
    } catch (error) {
      console.error("Error adding/updating group:", error);
      alert("שגיאה בהוספת או עדכון הקבוצה");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1>{existingGroup ? "עדכון קבוצה" : "הוספת קבוצה חדשה"}</h1>

      <form className="neon-form">
        <label>שם הקבוצה:</label>
        <input
          type="text"
          placeholder="שם הקבוצה"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />

        <button onClick={handleAddOrUpdateGroup} disabled={loading}>
          {loading ? "שומר..." : existingGroup ? "עדכן קבוצה" : "הוסף קבוצה"}
        </button>
        {/* <button onClick={() => navigate("/groups")}>ביטול</button> */}
      </form>
    </div>
  );

};

export default AddGroupPage;
