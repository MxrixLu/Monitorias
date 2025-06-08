'use client';

import { useEffect, useState } from 'react';
import CalendarEvents from './components/CalendarEvents';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar si existe el token de acceso
    const checkAuth = () => {
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {});
      
      setIsAuthenticated(!!cookies.calendar_access_token);
    };

    checkAuth();
  }, []);

  const handleAuth = () => {
    window.location.href = '/api/calendar/auth';
  };

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Mi Calendario</h1>
      
      {!isAuthenticated ? (
        <div className="text-center">
          <p className="mb-4">Necesitas autenticarte para ver tus eventos del calendario</p>
          <button
            onClick={handleAuth}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Conectar con Google Calendar
          </button>
        </div>
      ) : (
        <CalendarEvents />
      )}
    </main>
  );
}