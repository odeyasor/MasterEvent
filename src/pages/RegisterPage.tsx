import React from "react";
import { useState } from "react";
import { createOrganizer } from "../Routers/OrginazerRouters.tsx";
import "../styles/RegisterPage.css"; // ייבוא קובץ העיצוב

const RegisterPage = () => {
  const [organizer, setOrganizer] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrganizer({ ...organizer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const result = await createOrganizer(organizer);
    if (result) {
      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/dashboard"; // מעבר לדשבורד
      }, 2000); // מחכה 2 שניות כדי להציג את הודעת ההצלחה
    } else {
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
            value={organizer.email}
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
