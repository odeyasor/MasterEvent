import {getAllGroups} from "../Routers/GroupRouters.tsx"
// פונקציה להחזרת האורחים המותאמים למארגן הנוכחי
export const getGroupByOrginazer = async (organizerId: string) => {
    try {
      const response = await getAllGroups();
      // סינון האורחים לפי מזהה המארגן
      const filteredGuests = response.data.filter((guest: any) => guest.organizerId === organizerId);
      return filteredGuests;
    } catch (error) {
      console.error('Error fetching guests:', error);
      return [];
    }
}