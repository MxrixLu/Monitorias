'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CalendarPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Verificar si el usuario está autenticado
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (!isLoggedIn) {
            router.push('/auth/login');
            return;
        }

        // Verificar si hay un token de Google Calendar
        const token = localStorage.getItem('google_calendar_token');
        if (!token) {
            // Si no hay token, redirigir a la autenticación de Google
            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}&response_type=code&scope=https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events&access_type=offline`;
            window.location.href = authUrl;
            return;
        }

        setIsAuthenticated(true);
        fetchEvents(token);
    }, [router]);

    const fetchEvents = async (token) => {
        try {
            const response = await fetch(`/api/calendar?token=${token}`);
            if (!response.ok) {
                throw new Error('Error al obtener eventos');
            }
            const data = await response.json();
            setEvents(data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error al cargar eventos:', error);
            setError('Error al cargar los eventos. Por favor, intenta de nuevo.');
            setLoading(false);
        }
    };

    const handleCreateEvent = async (eventData) => {
        try {
            const currentToken = localStorage.getItem('google_calendar_token');
            const response = await fetch('/api/calendar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: currentToken, event: eventData }),
            });

            if (!response.ok) {
                throw new Error('Error al crear evento');
            }

            fetchEvents(currentToken);
        } catch (error) {
            setError('Error al crear el evento');
        }
    };

    const handleDeleteEvent = async (eventId) => {
        try {
            const currentToken = localStorage.getItem('google_calendar_token');
            const response = await fetch('/api/calendar', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: currentToken, eventId }),
            });

            if (!response.ok) {
                throw new Error('Error al eliminar evento');
            }

            fetchEvents(currentToken);
        } catch (error) {
            setError('Error al eliminar el evento');
        }
    };

    if (!isAuthenticated) {
        return <div className="container mx-auto p-4">Autenticando con Google Calendar...</div>;
    }

    if (loading) return <div className="container mx-auto p-4">Cargando eventos...</div>;
    if (error) return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Calendario de Eventos</h1>
            
            {events.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No hay eventos programados</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {events.map((event) => (
                        <div key={event.id} className="border p-4 rounded-lg shadow">
                            <h2 className="text-xl font-semibold">{event.summary}</h2>
                            <p className="text-gray-600">
                                {new Date(event.start.dateTime).toLocaleString()} - 
                                {new Date(event.end.dateTime).toLocaleString()}
                            </p>
                            <p className="mt-2">{event.description}</p>
                            <button
                                onClick={() => handleDeleteEvent(event.id)}
                                className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Eliminar
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Botón para crear nuevo evento */}
            <button
                onClick={() => router.push('/home/calendar/create')}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Crear Nuevo Evento
            </button>
        </div>
    );
} 