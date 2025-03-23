const API_URL = 'https://localhost:7112/api/Event'; // כתובת ה-API של האירועים

// הוספת אירוע חדש
export const addEvent = async (event) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to add event: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding event:', error);
    throw error; // זרוק את השגיאה כדי לטפל בה בצד הלקוח
  }
};

// עדכון אירוע
export const updateEvent = async (id, event) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update event: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

// מחיקת אירוע
export const deleteEvent = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`Failed to delete event: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

// קבלת אירועים
export const getAllEvents = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

// חיפוש אירועים לפי מארגן
export const getEventsByOrganizerId = async (organizerId) => {
  try {
    const response = await fetch(`${API_URL}/organizer/${organizerId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch events by organizer: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching events by organizer:', error);
    throw error;
  }
};

// חיפוש אירועים לפי טווח תאריכים
export const getEventsByDateRange = async (startDate, endDate) => {
  try {
    const response = await fetch(`${API_URL}/date?startDate=${startDate}&endDate=${endDate}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch events by date range: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching events by date range:', error);
    throw error;
  }
};
