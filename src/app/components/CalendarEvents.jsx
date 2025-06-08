'use client';

import { useEffect, useState } from 'react';

export default function CalendarEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/calendar/events');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al obtener eventos');
        }
        const data = await response.json();
        console.log('Eventos recibidos:', data); // Para debugging
        setEvents(data);
      } catch (err) {
        console.error('Error completo:', err); // Para debugging
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div className="p-4">Cargando eventos...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2">Eventos del Calendario</h2>
      {events.length === 0 ? (
        <div className="p-4 bg-gray-50 rounded">
          <p>No hay eventos programados para los próximos 7 días.</p>
          <p className="text-sm text-gray-600 mt-2">
            Los eventos se obtienen de tu calendario principal de Google Calendar.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {events.map((event) => (
            <div key={event.id} className="border p-4 rounded shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-medium text-lg">{event.summary}</h3>
              <p className="text-sm text-gray-600">
                {new Date(event.start.dateTime || event.start.date).toLocaleString()}
              </p>
              {event.description && (
                <p className="mt-2 text-gray-700">{event.description}</p>
              )}
              {event.location && (
                <p className="mt-1 text-gray-600">
                  <span className="font-medium">Ubicación:</span> {event.location}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 