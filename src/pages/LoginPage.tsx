import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login-and-register.css';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext.tsx';
import apiClient from '../services/apiClient.ts';
import axios from 'axios';

const decodeToken = (token: string) => {
  try {
    const decoded = jwtDecode(token);
    console.log('Decoded Token:', decoded);
    return decoded;
  } catch (e) {
    console.error('Invalid token', e);
    return null;
  }
};

const LoginPage: React.FC = () => {
  const [mail, setMail] = useState<string>('');
  const [pass, setPass] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    try {
<<<<<<< HEAD
      const response = await apiClient.post('/Login', { mail, pass });

      // לוודא שהשרת מחזיר את הטוקן במפתח 'token'
      const token = response.data;
      if (!token) {
        throw new Error('התגובה לא כוללת טוקן');
      }

      const decoded = decodeToken(token);
      if (!decoded) {
        throw new Error('הטוקן אינו תקין');
      }

=======
      const response = await fetch('https://localhost:7112/api/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mail, pass }),
      });
  
      // אם התגובה אינה JSON (כמו במקרה של טוקן גולמי)
      const textResponse = await response.text();
      console.log('Server raw response:', textResponse);
  
      let data;
      let token;
  
      try {
        // ננסה לפרסר את התגובה כ-JSON
        data = JSON.parse(textResponse);
        token = data.token;
      } catch (err) {
        // אם זה לא JSON, אז כנראה שזה טוקן גולמי
        token = textResponse;
      }
  
      if (!token) {
        throw new Error('התגובה לא כוללת טוקן');
      }
  
      // פענוח הטוקן
      const decoded = jwtDecode<{ 
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string, 
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string 
      }>(token);
  
      console.log('Decoded token:', decoded);
  
>>>>>>> 79b2972 (15/03)
      // בדיקה שהערכים קיימים
      const userName = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
      const userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

      if (!userName || !userId) {
        throw new Error('הטוקן אינו מכיל את הנתונים הדרושים');
      }

      // שמירת הטוקן בלוקאל סטורג'
      localStorage.setItem('token', token);

      // עדכון הסטטוס ב-AuthContext
      login(token, userName, userId);

      console.log('Login successful, navigating to Home...');
      navigate('/Home');
  
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          setError(err.response.data?.message || 'שגיאה בהתחברות');
        } else if (err.request) {
          setError('לא התקבלה תשובה מהשרת');
        } else {
          setError('שגיאה בבקשה');
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('שגיאה בקישור לשרת');
      }

      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  
  const navigateToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>ברוכים הבאים</h1>
        <form onSubmit={handleSubmit}>
          <div className="textbox">
            <input
              type="text"
              placeholder="שם משתמש"
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              required
            />
          </div>
          <div className="textbox">
            <input
              type="password"
              placeholder="סיסמה"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'מתחבר...' : 'התחבר'}
          </button>
        </form>
        {error && <div className="error-message">{error}</div>}
        <div className="register-link">
          <p>אין לך חשבון? <span onClick={navigateToRegister}>הירשם כאן</span></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
