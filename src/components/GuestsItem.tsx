import React, { useEffect, useState } from 'react';
import { Group, Guest } from '../types/types.ts';
import guestService from '../services/guestService.ts';
import '../styles/guests.css';
import { useNavigate } from 'react-router-dom';
import groupService from '../services/groupService.ts';


interface GuestsListProps {
  groupId: number;
  onClose: () => void;
}

const GuestsList: React.FC<GuestsListProps> = ({ groupId, onClose }) => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [group, setGroup]= useState<Group>();
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const guestsData = await guestService.getGuestsByGroup(groupId);
        setGuests(guestsData);
        const groupData = await groupService.getGroup(groupId)
        setGroup(groupData);
      } catch (error) {
        console.error('Error fetching guests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuests();
  }, [groupId]);

  return (
    <div className="guests-list-modal">
      <div className="modal-content">
        <h2>רשימת אורחים</h2>
        {loading ? (
          <p>טוען אורחים...</p>
        ) : guests.length > 0 ? (
          <ul>
            {guests.map((guest) => (
              <li key={guest.id}>{guest.name}</li>
            ))}
          </ul>
        ) : (
          <p>אין אורחים בקבוצה זו.</p>
        )}
        <button onClick={onClose}>סגור</button>
        <button onClick={() => navigate(`/add-guest/${group?.name}`)}>הוסף אורח לקבוצה זו</button>

      </div>
    </div>
  );
};

export default GuestsList;
