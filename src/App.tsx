
import React from "react"
import AppRoutes from "./routes/AppRoutes.tsx"
import { AuthProvider } from './context/AuthContext.tsx';
// import './styles/styles.css';  // ייבוא קובץ ה-CSS

export default function App() {
    return (
        <AuthProvider> {/* עוטף את כל האפליקציה בקונטקסט */}
          <AppRoutes />
        </AuthProvider>
      );
} 