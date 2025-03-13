// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import  eventService from '../../services/eventService.ts';
// import { Event } from '../types/types.ts';
// const EventFormPage: React.FC = () => {
//   const navigate = useNavigate();
//   const [eventData, setEventData] = useState<Event>({
//     id:0 ,
//       organizerId: string;
//       organizer: Organizer;  
//       eventName: string;
//       eventDate: string;  
//       address: string;
//       details: string;
//       seperation: boolean;
//       invitation: string;
//       photos: PhotosFromEvent[];  
//       guests: GuestInEvent[];  
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
//     setEventData({
//       ...eventData,
//       [e.target.name]: value,
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await eventService.createEvent(eventData);
//       alert('Event created successfully!');
//       navigate('/events');
//     } catch (error) {
//       console.error('Error creating event:', error);
//       alert('Failed to create event. Please try again.');
//     }
//   };

//   return (
//     <div>
//       <h1>Create New Event</h1>
//       <form onSubmit={handleSubmit}>
//         <label>
//           Event Name:
//           <input name="name" type="text" value={eventData.name} onChange={handleChange} required />
//         </label>
//         <br />
//         <label>
//           Date:
//           <input name="date" type="datetime-local" value={eventData.date} onChange={handleChange} required />
//         </label>
//         <br />
//         <label>
//           Location:
//           <input name="location" type="text" value={eventData.location} onChange={handleChange} required />
//         </label>
//         <br />
//         <button type="submit">Create Event</button>
//         <button type="button" onClick={() => navigate('/events')}>Cancel</button>
//       </form>
//     </div>
//   );
// };

// export default EventFormPage;
