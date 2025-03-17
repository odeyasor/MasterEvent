// Export all services from a single file for easy imports
import apiClient from '../api/apiClient.ts';
import eventService from './eventService';
import groupService from './groupService';
import guestService from './guestService';
import guestInEventService from './guestInEventService';
import organizerService from './organizerService';
import photosFromEventService from './photosFromEventService';
import seatingService from './seatingService';
import subGuestService from './subGuestService';

export {
  apiClient,
  eventService,
  groupService,
  guestService,
  guestInEventService,
  organizerService,
  photosFromEventService,
  seatingService,
  subGuestService
};

