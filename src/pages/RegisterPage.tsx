import React, { useState } from "react";
import "../styles/RegisterPage.css";
import organizerService from "../services/organizerService.ts";
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [organizer, setOrganizer] = useState({ name: "", mail: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [emailExists, setEmailExists] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrganizer({ ...organizer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setEmailExists(false);

    try {
      await organizerService.createOrganizer({
        name: organizer.name,
        mail: organizer.mail,
        password: organizer.password
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/Home');
      }, 2000);
    } catch (err) {
      console.error("Error registering organizer:", err);
      if (err instanceof Error) {
        if (err.message === "EMAIL_EXISTS") {
          setEmailExists(true);
          setError("האימייל שהוזן כבר קיים. להתחברות לחץ ");
        } else {
          setError(err.message);
        }
      } else {
        setError("שגיאה לא ידועה.");
      }
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
          <button type="submit" className="register-button">
            הרשמה
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
