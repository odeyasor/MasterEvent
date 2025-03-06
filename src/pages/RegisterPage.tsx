import React, { useState } from "react";
import "../styles/RegisterPage.css"; // ודאי שהנתיב תקין
import { organizerApi } from "../api/organizerApi.ts"; // ודאי שהתיקייה API קיימת ושמות הקבצים תואמים

const RegisterPage = () => {
  const [organizer, setOrganizer] = useState({ name: "", mail: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrganizer({ ...organizer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const result = await organizerApi.addOrganizer({
        name: organizer.name,
        mail: organizer.mail,
        password: organizer.password
      });

      if (result) {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = "/dashboard"; // מעבר לדשבורד אחרי 2 שניות
        }, 2000);
      }
    } catch (err) {
      console.error("Error registering organizer:", err);
      setError("הרשמה נכשלה, נסה שוב.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="register-title">הרשמה</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">הרשמה בוצעה בהצלחה! מעביר לדף הראשי...</p>}
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
            name="email"
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
          <button type="submit" className="register-button">
            הרשמה
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
