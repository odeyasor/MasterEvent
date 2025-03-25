import apiClient from '../api/apiClient.ts';
import { AxiosResponse } from 'axios';
import { EmailRequest } from '../types/types.ts';

const mailjetService = {
  // שליחת אימייל לכמה נמענים
  sendEmail: async (emailData: EmailRequest): Promise<void> => {
    try {
      const response: AxiosResponse<void> = await apiClient.post('/email/send', emailData);
      console.log('📧 Email sent successfully', response.status);
    } catch (error) {
      console.error('❌ Failed to send email', error);
      throw error;
    }
  },

  // שליחת אימייל לנמען יחיד
  sendSingleEmail: async (emailData: EmailRequest): Promise<void> => {
    try {
      const response: AxiosResponse<void> = await apiClient.post('/email/sendSingle', emailData);
      console.log('📧 Single email sent successfully', response.status);
    } catch (error) {
      console.error('❌ Failed to send single email', error);
      throw error;
    }
  }
};
export default mailjetService;
