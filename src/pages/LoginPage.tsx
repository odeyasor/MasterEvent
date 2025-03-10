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
      const response = await apiClient.post('/Login', { mail, pass });
      
      // Get the token from the response
      const token = response.data;
      
      if (token && token.length > 0) {
        const decoded = decodeToken(token);
        console.log('Decoded token:', decoded);
        
        if (decoded) {
          // Store the token in localStorage
          localStorage.setItem('token', token);
          
          // Update the auth context
          login(
            token, 
            decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'], 
            decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
          );
          
          console.log('Login successful, navigating to Home...');
          navigate('/Home');
        } else {
          setError('טוקן לא תקין');
        }
      } else {
        setError('התגובה לא כוללת טוקן');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          // Server responded with an error status
          setError(err.response.data?.message || 'שגיאה בהתחברות');
        } else if (err.request) {
          // Request was made but no response received
          setError('לא התקבלה תשובה מהשרת');
        } else {
          // Something else caused the error
          setError('שגיאה בבקשה');
        }
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