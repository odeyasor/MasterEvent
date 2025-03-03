import React, { useState } from "react";
import organizerService from "../../services/organizerService.ts"; // אין צורך בסיומת .tsx

const OrganizerForm = ({ onSubmit }) => {
    const [organizer, setOrganizer] = useState({
        id: '',
        name: '',
        mail: '',
        password: '',
        events: [],
        groups: []
    });

    const [error, setError] = useState(null); // הוספתי סטייט עבור שגיאות

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Organizer being sent:", organizer);

        try {
            const newOrganizer = await addOrganizer(organizer); // שימוש בפונקציה מהשירות
            console.log("Organizer added:", newOrganizer);
            if (onSubmit) onSubmit(newOrganizer); // אם יש פונקציה onSubmit, נקרא לה
        } catch (error) {
            console.error("Error:", error);
            setError("There was an error adding the organizer."); // הצגת הודעת שגיאה
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrganizer({ ...organizer, [name]: value });
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded-lg">
            {error && <p className="text-red-500 mb-3">{error}</p>} {/* הצגת שגיאה */}
            
            <label className="block mb-2">ID:</label>
            <input 
                type="text" 
                name="id" 
                value={organizer.id} 
                onChange={handleChange} 
                className="w-full p-2 border rounded mb-3"
                required
            />
            
            <label className="block mb-2">Name:</label>
            <input 
                type="text" 
                name="name" 
                value={organizer.name} 
                onChange={handleChange} 
                className="w-full p-2 border rounded mb-3"
                required
            />
            
            <label className="block mb-2">Email:</label>
            <input 
                type="email" 
                name="mail" 
                value={organizer.mail} 
                onChange={handleChange} 
                className="w-full p-2 border rounded mb-3"
                required
            />
            
            <label className="block mb-2">Password:</label>
            <input 
                type="password" 
                name="password" 
                value={organizer.password} 
                onChange={handleChange} 
                className="w-full p-2 border rounded mb-3"
                required
            />
            
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Submit</button>
        </form>
    );
};

export default OrganizerForm;
