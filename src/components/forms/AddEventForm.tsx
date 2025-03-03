import React from "react";
import { useState } from "react";

const GuestForm = ({ onSubmit }) => {
    const [guest, setGuest] = useState({
        id: "",
        name: "",
        mail: "",
        gender: "female" // Default value
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setGuest({ ...guest, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(guest);
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded-lg">
            <label className="block mb-2">ID:</label>
            <input 
                type="text" 
                name="id" 
                value={guest.id} 
                onChange={handleChange} 
                className="w-full p-2 border rounded mb-3"
                required
            />
            
            <label className="block mb-2">Name:</label>
            <input 
                type="text" 
                name="name" 
                value={guest.name} 
                onChange={handleChange} 
                className="w-full p-2 border rounded mb-3"
                required
            />
            
            <label className="block mb-2">Email:</label>
            <input 
                type="email" 
                name="mail" 
                value={guest.mail} 
                onChange={handleChange} 
                className="w-full p-2 border rounded mb-3"
                required
            />
            
            <label className="block mb-2">Gender:</label>
            <select 
                name="gender" 
                value={guest.gender} 
                onChange={handleChange} 
                className="w-full p-2 border rounded mb-3"
            >
                <option value="female">Female</option>
                <option value="male">Male</option>
            </select>
            
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Submit</button>
        </form>
    );
};

export default GuestForm;
