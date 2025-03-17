import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import groupService from "../services/groupService.ts";
import { useAuth } from "../context/AuthContext.tsx";

const AddGroupPage: React.FC = () => {
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { userId } = useAuth();

  const handleAddGroup = async () => {
    if (!groupName.trim()) {
      alert("יש להזין שם קבוצה!");
      return;
    }

    try {
        setLoading(true);
        const newGroup = { name: groupName, organizerId: userId };
              await groupService.createGroup(newGroup);
      alert("הקבוצה נוספה בהצלחה!");
      navigate("/"); // חזרה לעמוד הקבוצות
    } catch (error) {
      console.error("Error adding group:", error);
      alert("שגיאה בהוספת הקבוצה");
    } finally {
      setLoading(false);
    }
};

  return (
    <div className="add-group-page">
      <h1>הוספת קבוצה חדשה</h1>
      <input
        type="text"
        placeholder="שם הקבוצה"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      <button onClick={handleAddGroup} disabled={loading}>
        {loading ? "מוסיף..." : "הוסף קבוצה"}
      </button>
      <button onClick={() => navigate("/")}>ביטול</button>
    </div>
  );
};

export default AddGroupPage;
