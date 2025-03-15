import React, { useEffect, useState } from 'react';
import { Group } from '../types/types.ts'; 
import groupService from '../services/groupService.ts'; 
import { useAuth } from "../context/AuthContext.tsx"

const OrganizerGroupsPage: React.FC = () => {
  const { userId } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        if (!userId) {
            console.error("User ID is null or undefined!");
            return; // או לבצע פעולת fallback אחרת
          }
          
          const id = userId; 
     const groupsData = await groupService.getAllGroups();
        setGroups(groupsData);
      } catch (error) {
        console.error('Error fetching groups:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGroups();
  }, []);

  const handleAddGroup = () => {
    // כאן תוכל להוסיף את הפונקציה להוספת קבוצה חדשה
    console.log('Add new group');
  };

  const handleViewGuests = async (groupId: string) => {
    const group = await groupService.getGroup(groupId);
    // כאן תוכל להציג את האורחים, לדוגמה בחלון פופ-אפ או על ידי שינוי מצב נוסף
    return group.guest.name;
  };

  return (
    <div className="organizer-groups-page">
      <h1>קבוצות האורחים של המארגן</h1>
      
      {loading ? (
        <p>טוען קבוצות...</p>
      ) : (
        <div className="groups-container">
          {groups.map((group) => (
            <div key={group.id} className="group-card">
              <h2>{group.name}</h2>
              <p>מספר אורחים: {}</p>
              <button onClick={() => handleViewGuests(group.guest.name)}>הצג אורחים</button>
            </div>
          ))}
        </div>
      )}
      
      <button className="add-group-btn" onClick={handleAddGroup}>הוסף קבוצה חדשה</button>
    </div>
  );
};

export default OrganizerGroupsPage;
