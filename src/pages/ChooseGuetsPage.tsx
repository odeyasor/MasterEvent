import { useEffect, useState } from "react";
import groupService from "../services/groupService.ts";
import guestService from "../services/guestService.ts";
import guestInEventService from "../services/guestInEventService.ts";
import { Group, Guest } from "../types/types.ts";
import React from "react";
import { UploadGuestsForm, uploadGuestsFile } from "../components/UploadGuestsForm.tsx";
import { downloadExcelTemplate } from "../utils/fileUtils.ts";
import { useNavigate, useParams } from "react-router-dom";
import '../styles/choose-guest.css';

const ChooseGuestsPage = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [guestsByGroup, setGuestsByGroup] = useState<{ [key: string]: Guest[] }>({});
  const [selectedGuests, setSelectedGuests] = useState<{ [key: string]: boolean }>({});
  const [groupSelections, setGroupSelections] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { eventId } = useParams();

  useEffect(() => {
    const storedUser = localStorage.getItem("userId");

    const fetchGroupsAndGuests = async () => {
      try {
        console.log("Fetching groups and guests...");

        if (!storedUser) {
          console.error("No organizer ID found");
          setError("No organizer ID found");
          setLoading(false);
          return;
        }

        console.log("Fetching groups for organizer", storedUser);
        const groupData = await groupService.getGroupsByOrganizerId(storedUser);
        console.log("Groups fetched:", groupData);
        setGroups(groupData);

        const guestsData: { [key: string]: Guest[] } = {};
        console.log("Fetching guests for each group...");

        const allGuestsInEvent = await guestInEventService.getGuestInEventsByEventId(Number(eventId)); // קבלת אורחים שכבר הוזמנו לאירוע
        console.log("Guests already in event:", allGuestsInEvent);

        // יצירת מערך של מזהי אורחים שהוזמנו
        const invitedGuestIds = allGuestsInEvent.map((guestInEvent) => guestInEvent.guestId);
        console.log("Invited guest IDs:", invitedGuestIds);

        for (const group of groupData) {
          console.log(`Fetching guests for group ${group.id}`);
          const guestsInGroup = await guestService.getGuestsByGroup(group.id);
          console.log(`Guests in group ${group.id}:`, guestsInGroup);

          // סינון האורחים שכבר הוזמנו לאירוע
          const filteredGuests = guestsInGroup.filter(guest => !invitedGuestIds.includes(guest.id));
          console.log(`Filtered guests for group ${group.id}:`, filteredGuests);

          guestsData[group.id] = filteredGuests;
        }

        setGuestsByGroup(guestsData);
      } catch (err) {
        console.error("Error fetching groups or guests:", err);
        setError("Failed to fetch groups or guests");
      } finally {
        setLoading(false);
      }
    };

    fetchGroupsAndGuests();
  }, [eventId]);

  const toggleGuestSelection = (guestId: string) => {
    setSelectedGuests((prev) => ({ ...prev, [guestId]: !prev[guestId] }));
  };

  const toggleGroupSelection = (groupId: string) => {
    const newSelection = !groupSelections[groupId];
    setGroupSelections((prev) => ({
      ...prev,
      [groupId]: newSelection,
    }));

    const guestsInGroup = guestsByGroup[groupId] || [];
    const updatedSelectedGuests = guestsInGroup.reduce((acc, guest) => {
      acc[guest.id] = newSelection;
      return acc;
    }, {} as { [key: string]: boolean });

    setSelectedGuests((prev) => ({ ...prev, ...updatedSelectedGuests }));
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
      <h2>בחירת אורחים</h2>
      {loading ? (
        <p>טוען...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        groups.map((group) => (
          <div key={group.id} className="group-container">
            <h3 className="group-title">
              <input
                type="checkbox"
                checked={!!groupSelections[group.id]}
                onChange={() => toggleGroupSelection(String(group.id))}
              />
              {group.name}
            </h3>
            <ul className="guest-list">
              {guestsByGroup[group.id]?.length ? (
                guestsByGroup[group.id].map((guest) => (
                  <li key={guest.id} className="guest-item">
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
      <button onClick={confirmGuests}>הוספה לאירוע</button>
    </div>
  );
};

export default ChooseGuestsPage;
