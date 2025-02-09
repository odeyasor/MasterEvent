import { eventApi } from '../api/eventApi';

export const eventService = {
  createEvent: async (eventData: FormData) => {
    return await eventApi.create(eventData);
  },
};
