import { useEffect, useState } from "react";
import groupService from "../services/groupService.ts";
import guestService from "../services/guestService.ts";
import guestInEventService from "../services/guestInEventService.ts";
import { Group, Guest } from "../types/types.ts";
import React from "react";
import { UploadGuestsForm, uploadGuestsFile } from "../components/UploadGuestsForm.tsx";
import { downloadExcelTemplate } from "../utils/fileUtils.ts";
import { useNavigate, useParams } from "react-router-dom";

const ChooseGuestsPage = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [guestsByGroup, setGuestsByGroup] = useState<{ [key: string]: Guest[] }>({});
  const [selectedGuests, setSelectedGuests] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { eventId } = useParams();

  useEffect(() => {
    const storedUser = localStorage.getItem("userId");

    const fetchGroupsAndGuests = async () => {
      try {
        if (!storedUser) {
          setError("No organizer ID found");
          setLoading(false);
          return;
        }

        const groupData = await groupService.getGroupsByOrganizerId(storedUser);
        setGroups(groupData);

        const guestsData: { [key: string]: Guest[] } = {};

        for (const group of groupData) {
          const guestsInGroup = await guestService.getGuestsByGroup(group.id);
          guestsData[group.id] = guestsInGroup;
        }

        setGuestsByGroup(guestsData);
      } catch (err) {
        setError("Failed to fetch groups or guests");
      } finally {
        setLoading(false);
      }
    };

    fetchGroupsAndGuests();
  }, []);

  const toggleGuestSelection = (guestId: string) => {
    setSelectedGuests((prev) => ({ ...prev, [guestId]: !prev[guestId] }));
  };

  const confirmGuests = async () => {
    if (!eventId) {
      alert("Event ID is required");
      return;
    }

    const selected = Object.keys(selectedGuests).filter(guestId => selectedGuests[guestId]);

    try {
      for (const guestId of selected) {
        const guest = await guestService.getGuest(Number(guestId));
        const guestInEvent = {
          guestId,
          eventId,
          ok: false,
          groupId: guest.groupId
        };
        await guestInEventService.createGuestInEvent(guestInEvent);
      }

      navigate(`/event-details/${eventId}`);
    } catch (error) {
      alert("An error occurred while confirming guests.");
    }
  };

  return (
    <div>
{/* <<<<<<< HEAD
      <h2>האורחים שלי</h2>
      {guests.length === 0 ? (
        <p>אין לך אורחים עדיין</p>
======= */}
      <h2>בחירת אורחים</h2>
      {loading ? (
        <p>טוען...</p>
      ) : error ? (
        <p>{error}</p>
// >>>>>>> c9df9e9d6978a5b5676c0e8ea657fe33dcd53cf1
      ) : (
        groups.map((group) => (
          <div key={group.id} style={{ marginBottom: "20px" }}>
            <h3>{group.name}</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {guestsByGroup[group.id]?.length ? (
                guestsByGroup[group.id].map((guest) => (
                  <li key={guest.id} style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="checkbox"
                      checked={!!selectedGuests[guest.id]}
                      onChange={() => toggleGuestSelection(String(guest.id))}
                    />
                    <span>{guest.name}</span>
                  </li>
                ))
              ) : (
                <p>אין אורחים בקבוצה זו</p>
              )}
            </ul>
          </div>
        ))
      )}
<UploadGuestsForm onFileUpload={uploadGuestsFile} />
<button onClick={downloadExcelTemplate}>הורד תבנית אקסל</button>

      <button onClick={confirmGuests}>הזמן</button>
      <button onClick={() => navigate("/add-guest")}>אורח חדש</button>
    </div>
  );
};

export default ChooseGuestsPage;
