import React, { useEffect, useState } from 'react';
import { Guest } from '../types/types.ts';
import guestService from '../services/guestService.ts';
import '../styles/guests.css';

interface GuestsListProps {
  groupId: number;
  onClose: () => void;
}

const GuestsList: React.FC<GuestsListProps> = ({ groupId, onClose }) => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const guestsData = await guestService.GetGuestsByGroup(groupId);
        setGuests(guestsData);
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
      </div>
    </div>
  );
};

export default GuestsList;
