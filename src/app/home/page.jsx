"use client"
import React from "react";
import WelcomeBanner from "../components/Welcome";
import BoxSubject from "../components/BoxSubject";
import { getMaterias } from "../services/HomeService.service";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import routes from "../../routes";
import GoogleCalendarButton from "../components/GoogleCalendarButton";

export default function Home(){
    const [materias, setMaterias] = useState([]);
    const [userEmail, setUserEmail] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const router = useRouter();
    const searchParams = useSearchParams();

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
    }, [router, searchParams]);

    return (
        <main className="min-h-screen">
            <WelcomeBanner titulo={`Bienvenido/a ${userEmail}`}/>
            <div className="container mx-auto pt-4">
                {message.text && (
                    <div className={`p-4 mb-4 rounded-lg ${
                        message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                        {message.text}
                    </div>
                )}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-4xl font-bold text-[#FF7A7A]">
                        Tus materias este semestre
                    </h2>
                    <GoogleCalendarButton />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                    {materias.map((materia, index) => (
                        <BoxSubject key={index} codigo={materia.codigo} nombre={materia.nombre}></BoxSubject>
                    ))}
                </div>
            </div>
        </main>
    );
}