import React, { useState } from "react";
import "../styles/login-and-register.css";
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient.ts';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext.tsx';

const RegisterPage = () => {
  const [organizer, setOrganizer] = useState({ name: "", mail: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [emailExists, setEmailExists] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrganizer({ ...organizer, [e.target.name]: e.target.value });
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setEmailExists(false);
    setLoading(true);

    try {
      const response = await apiClient.post('/Organizer', {
        name: organizer.name,
        mail: organizer.mail,
        password: organizer.password
      });
      
      // If registration is successful, attempt auto-login
      const loginResponse = await apiClient.post('/Login', { 
        mail: organizer.mail, 
        pass: organizer.password 
      });
      
      if (loginResponse.data) {
        const token = loginResponse.data;
        const decoded = decodeToken(token);
        
        if (decoded) {
          // Store the token in localStorage
          localStorage.setItem('token', token);
          
          // Update the auth context
          login(
            token, 
            decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'], 
            decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
          );
        }
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/Home');
      }, 2000);
    } catch (err) {
      console.error("Error registering organizer:", err);
      
      if (axios.isAxiosError(err) && err.response) {
        console.log("Response error data:", err.response.data);
        
        if (err.response.status === 400 && typeof err.response.data === 'string' && 
            err.response.data.includes("Email already exists")) {
          setEmailExists(true);
          setError("האימייל שהוזן כבר קיים. להתחברות לחץ ");
        } else {
          setError(err.response.data?.message || typeof err.response.data === 'string' 
            ? err.response.data 
            : "שגיאה ביצירת משתמש. נסה שוב.");
        }
      } else {
        setError("שגיאת רשת או שהשרת אינו מגיב.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="register-title">הרשמה</h2>
        {success && <div className="success-message">הרשמה בוצעה בהצלחה! מעביר לדף הראשי...</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="שם"
            value={organizer.name}
            onChange={handleChange}
            className="register-input"
            required
          />
          <input
            type="email"
            name="mail"
            placeholder="אימייל"
            value={organizer.mail}
            onChange={handleChange}
            className="register-input"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="סיסמה"
            value={organizer.password}
            onChange={handleChange}
            className="register-input"
            required
          />
          {error && (
            <div className="error-message">
              {error} {emailExists && (
                <span className="login-link" onClick={() => navigate('/LoginPage')}>
                  כאן
                </span>
              )}
            </div>
          )}
          <button type="submit" className="register-button" disabled={loading}>
            {loading ? 'נרשם...' : 'הרשמה'}
          </button>
          <div className="register-link">
          <p>יש לך חשבון? <span onClick={() => navigate('/LoginPage')}>היכנס כאן</span></p>
        </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;