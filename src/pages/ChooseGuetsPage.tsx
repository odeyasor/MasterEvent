import { useEffect, useState } from "react";
import groupService from "../services/groupService.ts";
import guestService from "../services/guestService.ts";
import guestInEventService from "../services/guestInEventService.ts";
import { Group, Guest, GuestInEvent } from "../types/types.ts";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { UploadGuestsForm, uploadGuestsFile } from "../components/UploadGuestsForm.tsx";
import { downloadExcelTemplate } from "../utils/fileUtils.ts";

const ChooseGuestsPage = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [selectedGuests, setSelectedGuests] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { eventId } = useParams(); // קריאה ל-useParams כאן

  useEffect(() => {
    const storedUser = localStorage.getItem("userId");
    
    const fetchGroupsAndGuests = async () => {
      try {
        console.log("Starting to fetch groups...");
        if (!storedUser) {
          setError("No organizer ID found");
          setLoading(false);
          return;
        }
  
        const groupData = await groupService.getGroupsByOrganizerId(storedUser);
        console.log("Groups fetched:", groupData);
        setGroups(groupData);
  
        // Fetch all guests and store them
        const guestData: Guest[] = [];
        for (const group of groupData) {
          console.log(`Fetching guests for group: ${group.id}`);
          const guestsInGroup = await guestService.getGuestsByGroup(group.id);
          console.log(`Guests for group ${group.id}:`, guestsInGroup);
          guestData.push(...guestsInGroup);
        }
  
        setGuests(guestData);
        console.log("All guests fetched:", guestData);
      } catch (err) {
        console.error("Error fetching groups or guests:", err);
        setError("Failed to fetch groups or guests");
      } finally {
        setLoading(false);
        console.log("Fetching process finished");
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

    console.log("Event ID:", eventId);
    const selected = Object.keys(selectedGuests).filter(guestId => selectedGuests[guestId]);

    try {
        for (const guestId of selected) {
            try {
                const guest = await guestService.getGuest(guestId); // מחכה לתשובה
                console.log("Fetched guest:", guest);

                const guestInEvent = {
                    guestId,
                    eventId,
                    ok: false,
                    groupId:guest.groupId
                };
                console.log("Adding guest to event:", guestInEvent);

                await guestInEventService.createGuestInEvent(guestInEvent);
                alert("Guests confirmed successfully!");
                navigate(`/event-details/${eventId}`)

            } catch (error) {
                console.error(`Error processing guest ${guestId}:`, error);
                alert(`Error adding guest ${guestId}: ${error}`);
            }
        }

    } catch (error) {
        console.error("Error confirming guests:", error);
        alert("An error occurred while confirming guests.");
    }
};

  return (
    <div>
      <h2>האורחים שלי</h2>
      {guests.length === 0 ? (
        <p>אין לך אורחים עדיין</p>
      ) : (
        <ul>
          {guests.map((guest) => (
            <li key={guest.id}>
              <input
                type="checkbox"
                checked={!!selectedGuests[guest.id]}
                onChange={() => toggleGuestSelection(guest.id)}
              />
              {guest.name || "No guest found"}
            </li>
          ))}
        </ul>
      )}
<UploadGuestsForm onFileUpload={uploadGuestsFile} />
<button onClick={downloadExcelTemplate}>הורד תבנית אקסל</button>

      <button onClick={confirmGuests}>הזמן</button>
      <button onClick={() => navigate("/add-guest")}>אורח חדש</button>
    </div>
  );
};

export default ChooseGuestsPage;
