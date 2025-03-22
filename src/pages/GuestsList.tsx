import React, { useEffect, useState } from "react";
import guestService from "../services/guestService.ts";
import { Guest } from "../types/types.ts";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface GuestsListProps {
  groupId: number;
  onClose: () => void;
}

const GuestsList: React.FC<GuestsListProps> = ({ groupId, onClose }) => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const fetchGuests = async () => {
    setLoading(true);
    try {
      const guestsList = await guestService.getGuestsByGroup(groupId);
      setGuests(guestsList);
    } catch (error) {
      console.error("Error fetching guests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, [groupId]);

  const handleDeleteGuest = async (guestId: number) => {
    if (!window.confirm("האם אתה בטוח שברצונך למחוק את האורח?")) return;
    try {
      await guestService.deleteGuest(guestId);
      setGuests(guests.filter((guest) => guest.id !== guestId));
    } catch (error) {
      console.error("Error deleting guest:", error);
    }
  };

  const handleEditGuest = (guestId: number) => {
    navigate(`/guest-form/${guestId}`);
  };

  return (
    <div>
      <h3>אורחים בקבוצה</h3>
      {loading ? (
        <p>טוען אורחים...</p>
      ) : guests.length === 0 ? (
        <p>אין אורחים בקבוצה זו</p>
      ) : (
        <div>
          <div style={{ display: "flex", fontWeight: "bold", gap: "20px" }}>
            <span>שם</span>
            <span>מייל</span>
            <span>מין</span>
            <span>פעולות</span>
          </div>
          {guests.map((guest) => (
            <div
              key={guest.id}
              style={{ display: "flex", alignItems: "center", gap: "20px", marginTop: "10px" }}
            >
              <span>{guest.name}</span>
              <span>{guest.mail}</span>
              <span>{guest.gender}</span>
              <span>
                <button onClick={() => handleEditGuest(guest.id)}>
                  <FaEdit />
                </button>
                <button onClick={() => handleDeleteGuest(guest.id)}>
                  <FaTrashAlt />
                </button>
              </span>
            </div>
          ))}
          <button onClick={() => navigate("/guest-form/new")} style={{ marginTop: "10px" }}>
            <FaPlus /> הוספת אורח
          </button>
        </div>
      )}
    </div>
  );
};

export default GuestsList;