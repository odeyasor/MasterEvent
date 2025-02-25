import axios from 'axios';


export const getUserEvents = async () => {
    try {
      const userName = localStorage.getItem("userName"); // קבלת שם המשתמש מ-localStorage
      if (!userName) {
        console.error("No user is logged in.");
        return [];
      }
  
      // הנחה: API_URL מחזיר את כל האירועים, ויש לשאול רק את אלה של המשתמש הספציפי
      const response = await getAllOrganizers();
      // מניחים שהאירועים הם אובייקטים שמכילים את מזהה המשתמש
      const userEvents = response.data.filter((event: any) => event.organizerName === userName);
      return userEvents;
    } catch (error) {
      console.error("Error fetching events:", error);
      return [];
    }
  };
  