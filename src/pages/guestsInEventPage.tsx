import { useEffect, useState } from "react";
import { GuestInEvent, SubGuest, Gender, Guest } from "../types/types.ts";
import guestInEventService from "../services/guestInEventService.ts";
import subGuestService from "../services/subGuestService.ts";
import guestService from "../services/guestService.ts";
import React from "react";

const ConfirmedGuestsList = ({ eventId }: { eventId: string }) => {
  const [guests, setGuests] = useState<GuestInEvent[]>([]);
  const [guestDetails, setGuestDetails] = useState<{ [key: string]: Guest }>({});
  const [subGuests, setSubGuests] = useState<{ [key: string]: SubGuest[] }>({});
  const [filterGroup, setFilterGroup] = useState<string | null>(null);
  const [filterGender, setFilterGender] = useState<Gender | null>(null);

  useEffect(() => {
    const fetchGuests = async () => {
      const confirmedGuests = await guestInEventService.getConfirmedGuests(eventId);
      setGuests(confirmedGuests);
      
      const guestDetailsData: { [key: string]: Guest } = {};
      const subGuestsData: { [key: string]: SubGuest[] } = {};
      
      for (const guest of confirmedGuests) {
        guestDetailsData[guest.guestId] = await guestService.getGuest(guest.guestId);
        subGuestsData[guest.id] = await subGuestService.getSubGuestsByGuestId(guest.id);
      }
      setGuestDetails(guestDetailsData);
      setSubGuests(subGuestsData);
    };
    
    fetchGuests();
  }, [eventId]);

  const filteredGuests = guests.filter(guest => {
    const groupMatch = filterGroup ? guest.group === filterGroup : true;
    const genderMatch = filterGender ? subGuests[guest.id]?.some(sub => sub.gender === filterGender) : true;
    return groupMatch && genderMatch;
  });

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-4">
        <select onChange={(e) => setFilterGroup(e.target.value)}>
          <option value="">בחר קבוצה</option>
          <option value="Family">משפחה</option>
          <option value="Friends">חברים</option>
          <option value="Work">עבודה</option>
        </select>
        
        <select onChange={(e) => setFilterGender(e.target.value ? parseInt(e.target.value) as Gender : null)}>
          <option value="">בחר מגדר</option>
          <option value="0">זכר</option>
          <option value="1">נקבה</option>
        </select>
      </div>

      <div className="grid gap-4">
        {filteredGuests.map(guest => (
          <div key={guest.id} className="border p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">{guestDetails[guest.guestId]?.name || "לא ידוע"} ({guest.group})</h3>
            <p>תתי אורחים:</p>
            <ul>
              {subGuests[guest.id]?.map(sub => (
                <li key={sub.id}>{sub.name} - {sub.gender}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConfirmedGuestsList;
