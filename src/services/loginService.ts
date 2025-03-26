import apiClient from "../api/apiClient.ts"; // ראה שה-axios מותקן ויובא כראוי
import { AxiosResponse } from 'axios';

interface AuthResponse {
  token: string;
  message?: string;
}

const loginService = async (mail: string, pass: string) => {
    try {
      const response = await apiClient.post('/Login', { mail, pass });
      if (response.data && response.data.message) {
        throw new Error(response.data.message);
      }
      // במקרה שאין שגיאה, להחזיר את ה-token
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error; // נזרוק את השגיאה כדי לטפל בה מאוחר יותר
    }
  };
  

export default loginService;
