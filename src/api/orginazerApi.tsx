// src/API/organizerAPI.tsx
const API_URL = 'https://localhost:7112/api/Organizer'; // כתובת ה-API שלך

// פונקציה לקבלת כל המארגנים
export const getAllOrganizers = async (): Promise<any[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error('Failed to fetch organizers');
    }
    return await response.json();
};

// פונקציה לקבלת מארגן לפי ID
export const getOrganizerById = async (id: string): Promise<any> => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch organizer');
    }
    return await response.json();
};

// פונקציה להוספת מארגן חדש
export const addOrganizer = async (organizer: any): Promise<any> => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(organizer)
    });
    if (!response.ok) {
        throw new Error('Failed to add organizer');
    }
    return await response.json();
};

// פונקציה לעדכון מארגן
export const updateOrganizer = async (id: string, organizer: any): Promise<any> => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(organizer)
    });
    if (!response.ok) {
        throw new Error('Failed to update organizer');
    }
    return await response.json();
};

// פונקציה למחיקת מארגן
export const deleteOrganizer = async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error('Failed to delete organizer');
    }
};
