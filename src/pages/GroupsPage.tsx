import React, { useEffect, useState } from 'react';
import { Group } from '../types/types.ts';
import groupService from '../services/groupService.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';
import GuestsList from './GuestsList.tsx';
import { FaEdit, FaTrashAlt, FaArrowDown, FaUserPlus, FaUserMinus, FaPlusCircle, FaPlus } from 'react-icons/fa'; // ייבוא סמלים
import '../styles/display.css'
import guestService from '../services/guestService.ts';

const GroupsPage: React.FC = () => {
  const { userId } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [guests, setGuests] = useState<any[]>([]); // משתנה לאחסון אורחים
  const navigate = useNavigate();

  // שליפת קבוצות מהשרת
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        if (!userId) {
          console.error('User ID is null or undefined!');
          return;
        }

        const groupsData = await groupService.getGroupsByOrganizerId(userId);
        setGroups(groupsData);
      } catch (error) {
        console.error('Error fetching groups:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [userId]);

  // פונקציה לשליפת אורחים של קבוצה
  const fetchGuests = async (groupId: number) => {
    try {
      const guestsData = await guestService.getGuestsByGroup(groupId);
      setGuests(guestsData);
    } catch (error) {
      console.error('Error fetching guests:', error);
    }
  };

  const handleDeleteGuest = async (guestId: number) => {
    try {
      await guestService.deleteGuest(guestId); // כאן תוקנה הטעות - שיניתי מ-gropId ל-groupId
      setGuests(guests.filter((guest) => guest.id !== guestId)); // עדכון רשימת האורחים
    } catch (error) {
      console.error('Error deleting guest:', error);
    }
  };
  

  // פונקציה למחוק קבוצה
  const handleDeleteGroup = async (groupId: number) => {

    try {
      await groupService.deleteGroup(groupId);
      setGroups(groups.filter((group) => group.id !== groupId)); // עדכון רשימת הקבוצות
      if (selectedGroupId === groupId) {
        setSelectedGroupId(null); // אם מחקנו את הקבוצה שנבחרה, נבטל את הבחירה
        setGuests([]); // ננקה את רשימת האורחים
      }
    } catch (error) {
      console.error('Error deleting group:', error);
    }
  };

  // פונקציה לניהול בחירת קבוצה
  const handleSelectGroup = (groupId: number) => {
    if (selectedGroupId === groupId) {
      setSelectedGroupId(null); // אם הקבוצה כבר נבחרה, נבטל את הבחירה
      setGuests([]); // ננקה את רשימת האורחים
    } else {
      setSelectedGroupId(groupId); // אם לא נבחרה קבוצה, נבחר את הקבוצה
      fetchGuests(groupId); // נשלוף את האורחים של הקבוצה
    }
  };

  return (
    <div className="organizer-groups-page">
      <h1>הקבוצות שלי</h1>
  
      <button onClick={() => navigate('/group-form')}>
        <FaPlus /> {/* סמל להוספת קבוצה חדשה */}
      </button>
  
      {loading ? (
        <p>טוען קבוצות...</p>
      ) : (
        <div className="groups-container">
          {groups.map((group) => (
            <div key={group.id} className="group-card">
              <div className="group-header">
                <h2>{group.name}</h2>
                <div className="group-actions">
                  <button onClick={() => handleSelectGroup(group.id)}>
                    <FaArrowDown />
                  </button>
                  <button onClick={() => navigate(`/group-form/${group.id}`)}>
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDeleteGroup(group.id)}>
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
  
              {/* הצגת רשימת האורחים רק אם הקבוצה נבחרה */}
              {selectedGroupId === group.id && (
                <div>
                  {guests.length === 0 ? (
                    <p>עדיין אין אורחים בקבוצה זו.</p>
                  ) : (
                    <GuestsList
                      groupId={group.id} // שליחה של groupId לקומפוננטת GuestsList
                      guests={guests} // שליחה של רשימת האורחים
                      onDeleteGuest={handleDeleteGuest} // אפשרות למחוק אורח
                    />
                  )}
                  {/* כפתור הוספת אורח */}
                  <button onClick={() => navigate("/guest-form")}>
                    <FaUserPlus /> הוסף אורח
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default GroupsPage
