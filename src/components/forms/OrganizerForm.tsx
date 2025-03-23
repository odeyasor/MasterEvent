import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from '../../api/apiClient.ts';
import "../../styles/form.css";

const OrganizerForm = () => {
  const [organizer, setOrganizer] = useState({ name: "", mail: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();
  const { organizerId } = useParams();  // קבלת המזהה מהכתובת

  useEffect(() => {
    if (organizerId) {
      // אם יש מזהה, נטען את פרטי המארגן
      const fetchOrganizer = async () => {
        try {
          setLoading(true);
          const response = await apiClient.get(`/Organizer/${organizerId}`);
          setOrganizer(response.data);  // ממלא את הטופס בפרטי המארגן
        } catch (err) {
          console.error("שגיאה בטעינת פרטי המארגן", err);
          setError("לא ניתן לטעון את פרטי המארגן.");
        } finally {
          setLoading(false);
        }
      };
      fetchOrganizer();
    }
  }, [organizerId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrganizer({ ...organizer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      // אם יש מזהה (עדכון), נשלח בקשה PUT
      const response = organizerId
        ? await apiClient.put(`/Organizer/${organizerId}`, {  // עדכון במקרה של ID קיים
            name: organizer.name,
            mail: organizer.mail,
            password: organizer.password
          })
        : null;  // לא נדרש במקרה של יצירת מארגן חדש (לא רלוונטי כאן)

      setSuccess(true);
      setTimeout(() => {
        navigate('/Home');  // אחרי העדכון, נעבור לדף הבית
      }, 2000);
    } catch (err) {
      console.error("שגיאה בעדכון המארגן:", err);
      setError("שגיאה בעדכון המארגן, נסה שוב.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="register-box">
        <h2 className="register-title">{organizerId ? "עריכת מארגן" : "הרשמה"}</h2>
        {success && <div className="success-message">העדכון בוצע בהצלחה! מעביר לדף הבית...</div>}
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
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="register-button" disabled={loading}>
            {loading ? 'מעודכן...' : 'עדכן'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrganizerForm;
