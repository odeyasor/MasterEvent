import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import '../styles/navbar.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate(); // חייב להיות קודם כל
  const location = useLocation(); // מקבלים את המיקום הנוכחי של הדף
  
  // בודקים אם מדובר בנתיב של כניסה או הרשמה
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null; // אם זה עמוד כניסה או הרשמה, לא מציגים את הניווט
  }

  const userName = localStorage.getItem("userName"); // מקבלים את שם המשתמש

  const handleLogout = () => {
    localStorage.removeItem("userId"); // מסיר את מזהה המשתמש
    localStorage.removeItem("userName"); // מסיר את שם המשתמש
    navigate("/login"); // מעביר לדף ההתחברות או לדף ראשי אחרי יציאה
  };

  return (
    <nav className="navbar">
      <ul>
        <li>
          <button onClick={handleLogout}>יציאה</button>
        </li>
        <li>
          <Link to="/events">אירועים</Link>
        </li>
        <li>
          <Link to="/groups">קבוצות</Link>
        </li>
        <li>
          <Link to="/guests-event">אורחים</Link>
        </li>
        <li>
          <Link to="/images">תמונות</Link>
        </li>
        
        {/* מציגים את שם המשתמש רק אם יש */}
        {userName && (
          <li>
            <span>שלום, {userName}!</span>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
