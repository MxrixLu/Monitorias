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
    const [userName, setUserName] = useState('');
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

        // Obtener materias
        getMaterias().then((materias) => {
            setMaterias(materias);
        });

        // Obtener nombre del usuario desde Firestore
        const fetchUserName = async () => {
            try {
                const response = await fetch(`/api/user/profile?email=${email}`);
                const data = await response.json();
                if (data.name) {
                    setUserName(data.name);
                }
            } catch (error) {
                console.error('Error fetching user name:', error);
            }
        };
        fetchUserName();

        // Verificar conexión con Google Calendar
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
    }, [router]);

    const handleDisconnect = async () => {
        try {
            await fetch('/api/calendar/disconnect', { method: 'POST' });
            setIsConnected(false);
        } catch (error) {
            console.error('Error disconnecting:', error);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Sección de Bienvenida */}
            <div className="bg-gradient-to-b from-indigo-500 to-indigo-700 text-white py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-2">Hola, {userName || 'Usuario'}</h1>
                    <p className="text-lg opacity-90">Bienvenido a tu espacio personal</p>
                </div>
            </div>

            {/* Contenedor Principal */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Sección del Calendario */}
                <section className="mb-12">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Mi Calendario</h2>
                            {isConnected && (
                                <button
                                    onClick={handleDisconnect}
                                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                                >
                                    Desconectar
                                </button>
                            )}
                        </div>
                        <CalendarEvents />
                    </div>
                </section>

                {/* Sección de Materias */}
                <section>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold mb-6">Materias Disponibles</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {materias.map((materia) => (
                                <BoxSubject
                                    key={materia.codigo}
                                    codigo={materia.codigo}
                                    nombre={materia.nombre}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}