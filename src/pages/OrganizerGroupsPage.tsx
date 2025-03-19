import React, { useEffect, useState } from 'react';
import { Group } from '../types/types.ts';
import groupService from '../services/groupService.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';
import GuestsList from '../components/GuestsItem.tsx';

const OrganizerGroupsPage: React.FC = () => {
  const { userId } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const navigate = useNavigate();

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

  return (
    <div className="organizer-groups-page">
      <h1>הקבוצות שלי</h1>

      <button onClick={() => navigate('/add-group')}>הוסף קבוצה חדשה</button>

      {loading ? (
        <p>טוען קבוצות...</p>
      ) : (
        <div className="groups-container">
          {groups.map((group) => (
            <div key={group.id} className="group-card">
              <h2>{group.name}</h2>
              <button onClick={() => setSelectedGroupId(Number(group.id))}>
                הצג אורחים
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedGroupId !== null && (
        <GuestsList
          groupId={selectedGroupId} // שליחה של groupId לקומפוננטת GuestsList
          onClose={() => setSelectedGroupId(null)}
        />
      )}
    </div>
  );
};

export default OrganizerGroupsPage;
