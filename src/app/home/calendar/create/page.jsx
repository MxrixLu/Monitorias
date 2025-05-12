'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createEvent } from '../../../../services/googleCalendar';

export default function CreateEventPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        summary: '',
        description: '',
        start: {
            dateTime: '',
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
            dateTime: '',
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createEvent(formData);
            router.push('/home/calendar');
        } catch (error) {
            console.error('Error al crear el evento:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'start' || name === 'end') {
            setFormData(prev => ({
                ...prev,
                [name]: {
                    ...prev[name],
                    dateTime: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Crear Nuevo Evento</h1>
            
            <form onSubmit={handleSubmit} className="max-w-lg">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Título
                    </label>
                    <input
                        type="text"
                        name="summary"
                        value={formData.summary}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Descripción
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        rows="4"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Fecha y Hora de Inicio
                    </label>
                    <input
                        type="datetime-local"
                        name="start"
                        value={formData.start.dateTime}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Fecha y Hora de Fin
                    </label>
                    <input
                        type="datetime-local"
                        name="end"
                        value={formData.end.dateTime}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Crear Evento
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/home/calendar')}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
} 