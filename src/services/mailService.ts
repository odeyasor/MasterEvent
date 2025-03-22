import apiClient from '../api/apiClient.ts';
import { AxiosResponse } from 'axios';
import { EmailRequest } from '../types/types.ts';


const mailjetService = {
  // שליחת אימייל
  sendEmail: async (emailData: EmailRequest): Promise<void> => {
    try {
      const response: AxiosResponse<void> = await apiClient.post('/email/send', emailData);
      console.log('📧 Email sent successfully', response.status);
    } catch (error) {
      console.error('❌ Failed to send email', error);
      throw error;
    }
  }
};

export default mailjetService;
