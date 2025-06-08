"use client"
import React from "react";
import WelcomeBanner from "../components/Welcome";
import BoxSubject from "../components/BoxSubject";
import { getMaterias } from "../services/HomeService.service";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import routes from "../../routes";
import GoogleCalendarButton from "../components/GoogleCalendarButton";
import CalendarEvents from '../components/CalendarEvents';

export default function HomePage() {
    const [materias, setMaterias] = useState([]);
    const [userEmail, setUserEmail] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const email = localStorage.getItem('userEmail');
        setUserEmail(email);

        if (!isLoggedIn) {
            router.push(routes.LANDING);
            return;
        }

        getMaterias().then((materias) => {
            setMaterias(materias);
        });

        // Handle OAuth callback messages
        const error = searchParams.get('error');
        const success = searchParams.get('success');

        if (error) {
            switch (error) {
                case 'oauth_error':
                    setMessage({ type: 'error', text: 'Error en la autenticación de Google Calendar' });
                    break;
                case 'no_code':
                    setMessage({ type: 'error', text: 'No se recibió el código de autorización' });
                    break;
                case 'token_exchange_failed':
                    setMessage({ type: 'error', text: 'Error al obtener los tokens de acceso' });
                    break;
                default:
                    setMessage({ type: 'error', text: 'Error al conectar con Google Calendar' });
            }
        } else if (success === 'calendar_connected') {
            setMessage({ type: 'success', text: '¡Calendario conectado exitosamente!' });
        }

        // Verificar si hay un token de acceso
        const checkConnection = async () => {
            try {
                const response = await fetch('/api/calendar/check-connection');
                const data = await response.json();
                setIsConnected(data.isConnected);
                if (!data.isConnected) {
                    router.push('/');
                }
            } catch (error) {
                console.error('Error checking connection:', error);
                setIsConnected(false);
                router.push('/');
            }
        };

        checkConnection();
    }, [router, searchParams]);

    const handleDisconnect = async () => {
        try {
            await fetch('/api/calendar/disconnect', { method: 'POST' });
            router.push('/');
        } catch (error) {
            console.error('Error disconnecting:', error);
        }
    };

    if (!isConnected) {
        return null; // No renderizar nada mientras se verifica la conexión
    }

    return (
        <main className="min-h-screen p-8 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Mi Calendario</h1>
                    <button
                        onClick={handleDisconnect}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                        Desconectar
                    </button>
                </div>
                
                <CalendarEvents />
            </div>
        </main>
    );
}