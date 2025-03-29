import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import '../styles/navbar.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate(); // חייב להיות קודם כל
  const location = useLocation(); // מקבלים את המיקום הנוכחי של הדף
  
  // בודקים אם מדובר בנתיב של כניסה או הרשמה
  if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/ok') {
    return null; // אם זה עמוד כניסה או הרשמה, לא מציגים את הניווט
  }

  const userName = localStorage.getItem("userName"); // מקבלים את שם המשתמש
  const userId = localStorage.getItem("userId"); // מקבלים את מזהה המשתמש

  const handleLogout = () => {
    localStorage.removeItem("userId"); // מסיר את מזהה המשתמש
    localStorage.removeItem("userName"); // מסיר את שם המשתמש
    navigate("/login"); // מעביר לדף ההתחברות או לדף ראשי אחרי יציאה
  };

  const handleProfileClick = () => {
    if (userId) {
      navigate("/organizer-form", { state: { userId } }); // שולח את המזהה כ-state
    }
  };

  return (
    <nav className="navbar">
      <ul className="nav-links">
        {/* הצגת שם המשתמש אם קיים */}
        {userName && (
          <li className="user-name">
            <span>שלום, {userName}!</span>
          </li>
        )}

        <li>
          <Link to="/events">אירועים</Link>
        </li>
        <li>
          <Link to="/groups">קבוצות</Link>
        </li>
        <li>
          <Link to="/Home">בית</Link>
        </li>
      </ul>

      {/* אזור הכפתורים - הפרופיל שלי ויציאה */}
      <div className="nav-buttons">
        <button onClick={() => navigate(`/organizer-form/${userId}`)}>הפרופיל שלי</button>
        <button onClick={handleLogout}>יציאה</button>
      </div>
    </nav>
  );
};
export default Navbar;
