import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginAndRegister.css';
import {jwtDecode} from 'jwt-decode';
import {useAuth} from '../context/AuthContext.tsx';

const decodeToken = (token: string) => {
  try {
    const decoded = jwtDecode(token); // פענוח הטוקן
    console.log('Decoded Token:', decoded); // הצגת המידע מתוך הטוקן
    return decoded; // החזרת המידע
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
      const response = await fetch('https://localhost:7112/api/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mail, pass }),
      });
  
      // הצגת התשובה הגולמית כדי לראות אם זו תגובה עם טוקן בלבד
      const textResponse = await response.text();
      console.log('Raw response:', textResponse);
  
      // אם התשובה מכילה טוקן JWT, ממשיכים
      if (textResponse && textResponse.length > 0) {
        const token = textResponse;  // הטוקן החזר ישירות
        const decoded = decodeToken(token); // פענוח הטוקן
        console.log('Decoded token:', decoded); // להציג את המידע המפוענח
  
        // עדכון הסטטוס ב-AuthContext
        login(token, decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'], decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']);
  
        console.log('Login successful, navigating to Home...');
        navigate('/Home');
      } else {
        setError('התגובה לא כוללת טוקן');
      }
    } catch (err) {
      setError('שגיאה בקישור לשרת');
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