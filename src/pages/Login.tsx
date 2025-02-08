import React, { useState } from 'react';
import './../styles/Add.css'

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const loginData = {
      username,
      password,
    };

    try {
      const response = await fetch('https://your-api-url.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      
      if (response.ok) {
        // בהצלחה – ניתן להחסיק את טוקן הגישה ולהעביר לדף הבא
        localStorage.setItem('authToken', data.token);
        // ניתן להוסיף מעבר לדף הבית או דף אחר כאן
      } else {
        // אם לא הצליח
        setError(data.message || 'שם משתמש או סיסמה לא נכונים');
      }
    } catch (err) {
      setError('שגיאה בקישור לשרת');
    }
  };

  return (
    <div>
      <h1>ברוכים הבאים</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="שם משתמש"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="סיסמה"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">התחבר</button>
      </form>
      {error && <div>{error}</div>}
    </div>
  );
};

export default LoginPage;
