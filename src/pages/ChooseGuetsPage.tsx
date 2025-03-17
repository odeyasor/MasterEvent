import { useEffect, useState } from "react";
import groupService from "../services/groupService.ts";
import guestService from "../services/guestService.ts";
import guestInEventService from "../services/guestInEventService.ts";
import { Group, Guest, GuestInEvent } from "../types/types.ts";
import React from "react";
import { useNavigate } from "react-router-dom";

const ChooseGuestsPage = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [guestDetails, setGuestDetails] = useState<{ [key: string]: Guest }>({});
  const [selectedGuests, setSelectedGuests] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  /*useEffect(() => {
    const storedUser = localStorage.getItem("userId");
    const fetchGroups = async () => {
      try {
        if (!storedUser) {
          setError("No organizer ID found");
          setLoading(false);
          return;
        }
        const data = await groupService.getAllGroups();
        setGroups(data);
        
       /const guestData: { [key: string]: Guest } = {};
        for (const group of data) {
          if (group.guestId) {
            guestData[group.guestId] = await guestService.getGuest(group.guestId);
          }
        }
        setGuestDetails(guestData);
      } catch (err) {
        setError("Failed to fetch groups");
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const toggleGuestSelection = (guestId: string) => {
    setSelectedGuests((prev) => ({ ...prev, [guestId]: !prev[guestId] }));
  };

  const confirmGuests = async () => {
    const eventId = "someEventId"; // יש להביא את ה-ID של האירוע באופן דינמי
    const selected = Object.keys(selectedGuests).filter(guestId => selectedGuests[guestId]);
    for (const guestId of selected) {
      const guestInEvent = {
        guestId,
        eventId,
        ok: true,
        group: groups.find(g => g.guestId === guestId)?.name || "Unknown"
      };
      await guestInEventService.createGuestInEvent(guestInEvent);
    }
    alert("Guests confirmed successfully!");
  };

  if (loading) return <p>Loading groups...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Your Guests</h2>
      {groups.length === 0 ? (
        <p>No guests found.</p>
      ) : (
        <ul>
          {groups.map((group) => (
            <li key={group.id}>
              <input
                type="checkbox"
                checked={!!selectedGuests[group.guestId]}
                onChange={() => toggleGuestSelection(group.guestId)}
              />
              {guestDetails[group.guestId]?.name || "No guest found"}
            </li>
          ))}
        </ul>
      )}
      <button onClick={confirmGuests}>Confirm Selected Guests</button>
      <button onClick={() => navigate("/new-guests")}>Add New Guest</button>
    </div>
  );*/
};

export default ChooseGuestsPage;
