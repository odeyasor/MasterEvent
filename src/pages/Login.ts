import React, {useState } from "react";
import { useNavigate } from 'react-router-dom';
import loginService from "../services/loginService.ts";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginService(username,password)
      const data = await response.json();
      
      if (response.ok) {
        // Store the token and user info in localStorage
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userName', data.name || username);
        localStorage.setItem('userId', data.id || '');
        
        // Navigate to home page
        navigate('/home');
      } else {
        setError(data.message || 'שם משתמש או סיסמה לא נכונים');
      }
    } catch (err) {
      setError('שגיאה בקישור לשרת');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>ברוכים הבאים</h1>
        <form onSubmit={handleSubmit}>
          <div className="textbox">
            <input
              type="text"
              placeholder="מייל"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="textbox">
            <input
              type="password"
              placeholder="סיסמה"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'מתחבר...' : 'התחבר'}
          </button>
        </form>
        {error && <div className="error-message">{error}</div>}
        <div className="register-link">
          <p>אין לך חשבון? <span onClick={()=>navigate("/register")}>הירשם כאן</span></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;