'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CalendarEvents from './components/CalendarEvents';

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [showEvents, setShowEvents] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verificar si hay un token de acceso
    const checkConnection = async () => {
      try {
        const response = await fetch('/api/calendar/check-connection');
        const data = await response.json();
        setIsConnected(data.isConnected);
      } catch (error) {
        console.error('Error checking connection:', error);
        setIsConnected(false);
      }
    };

    checkConnection();
  }, []);

  const handleConnect = () => {
    router.push('/api/calendar/auth');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">Bienvenido a tu Aplicación</h1>
        
        {!isConnected ? (
          <div className="text-center">
            <p className="mb-4">Conecta tu calendario de Google para comenzar</p>
            <button
              onClick={handleConnect}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Conectar con Google Calendar
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-4">¡Conectado con Google Calendar!</p>
            <button
              onClick={() => setShowEvents(!showEvents)}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              {showEvents ? 'Ocultar Eventos' : 'Ver Eventos'}
            </button>
            {showEvents && <CalendarEvents />}
          </div>
        )}
      </div>
    </main>
  );
}