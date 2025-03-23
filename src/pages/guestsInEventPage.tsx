import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import guestInEventService from "../services/guestInEventService.ts";
import guestService from "../services/guestService.ts";
import groupService from "../services/groupService.ts";
import { GuestInEvent, Guest } from "../types/types";
import React from "react";
import { useAuth } from "../context/AuthContext.tsx";
import organizerService from "../services/organizerService.ts";

const ConfirmedGuestsList = () => {
  const { eventId } = useParams<{ eventId: string }>(); // מזהה האירוע
  const { userId } = useAuth();
  const [guests, setGuests] = useState<GuestInEvent[]>([]);
  const [guestDetails, setGuestDetails] = useState<{ [key: string]: Guest }>({});
  const [groups, setGroups] = useState<{ [key: string]: string }>({});
  const [genderFilter, setGenderFilter] = useState<string>("");
  const [groupFilter, setGroupFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    if (!eventId) return;

    const fetchGuests = async () => {
      try {
        const confirmedGuests = await guestInEventService.getConfirmedGuests(eventId);
        setGuests(confirmedGuests);

        const guestDetailsData: { [key: string]: Guest } = {};
        for (const guest of confirmedGuests) {
          const guestData = await guestService.getGuest(Number(guest.guestId));
          guestDetailsData[guest.guestId] = guestData;
        }
        setGuestDetails(guestDetailsData);
      } catch (error) {
        console.error("שגיאה בשליפת האורחים:", error);
      }
    };

    const fetchGroups = async () => {
      if (!userId) {
        alert("שגיאה: המשתמש אינו מחובר.");
        return;
      }

      try {
        const organizer = await organizerService.getOrganizer(userId);
        if (!organizer) {
          alert("שגיאה: לא נמצא מארגן.");
          return;
        }

        const groupData = await groupService.getGroupsByOrganizerId(userId);
        const groupMap: { [key: string]: string } = {};
        groupData.forEach(group => {
          groupMap[group.id] = group.name;
        });
        setGroups(groupMap);
      } catch (error) {
        console.error("שגיאה בשליפת הקבוצות:", error);
      }
    };

    fetchGuests();
    fetchGroups();
  }, [eventId, userId]);

  // פונקציה לאיפוס הסינונים
  const resetFilters = () => {
    setGenderFilter("");
    setGroupFilter("");
    setSearchTerm("");
  };

  // סינון רשימת האורחים
  const filteredGuests = guests.filter((guest) => {
    const guestInfo = guestDetails[guest.guestId];

    if (!guestInfo) return false;

    if (genderFilter && String(guestInfo.gender) !== genderFilter) return false;

    if (groupFilter && String(guest.groupId) !== groupFilter) return false;

    if (searchTerm && !guestInfo.name.includes(searchTerm)) return false;

    return true;
  });

  return (
    <div className="p-4 space-y-4">
      {/* שדות סינון */}
      <div className="flex space-x-4">
        <input 
          type="text" 
          placeholder="חפש לפי שם..." 
          className="border p-2 rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select 
          className="border p-2 rounded-lg"
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
        >
          <option value="">בחר מין</option>
          <option value="0">זכר</option>
          <option value="1">נקבה</option>
        </select>

        <select 
          className="border p-2 rounded-lg"
          value={groupFilter}
          onChange={(e) => setGroupFilter(e.target.value)}
        >
          <option value="">בחר קבוצה</option>
          {Object.entries(groups).map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>

        {/* כפתור הצג הכל */}
        <button 
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          onClick={resetFilters}
        >
          הצג הכל
        </button>
      </div>

      {/* הצגת רשימת האורחים */}
      <div className="grid gap-4">
        {filteredGuests.map((guest) => (
          <div key={guest.id} className="border p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">
              {guestDetails[guest.guestId]?.name || "לא ידוע"}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConfirmedGuestsList;
