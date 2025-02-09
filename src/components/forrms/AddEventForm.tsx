import React from 'react';
import AddEventForm from '../components/forms/AddEventForm';
import { useDispatch } from 'react-redux';
import { createEvent } from '../redux/eventSlice';

const AddEventPage: React.FC = () => {
  const dispatch = useDispatch();

  const handleEventSubmit = (formData: FormData) => {
    dispatch(createEvent(formData));
  };

  return (
    <div>
      <h1>הוספת אירוע</h1>
      <AddEventForm onSubmit={handleEventSubmit} />
    </div>
  );
};

export default AddEventPage;
