import { google } from 'googleapis';

// Configuración de las credenciales de OAuth 2.0
const oauth2Client = new google.auth.OAuth2(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI
);

// Configuración del cliente de Google Calendar
const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

// Función para obtener la URL de autorización
export const getAuthUrl = () => {
    const scopes = [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events'
    ];

    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
    });
};

// Función para obtener el token de acceso
export const getAccessToken = async (code) => {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    return tokens;
};

// Función para listar eventos
export const listEvents = async (timeMin, timeMax) => {
    try {
        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin: timeMin || new Date().toISOString(),
            timeMax: timeMax,
            singleEvents: true,
            orderBy: 'startTime',
        });
        return response.data.items;
    } catch (error) {
        console.error('Error al listar eventos:', error);
        throw error;
    }
};

// Función para crear un evento
export const createEvent = async (event) => {
    try {
        const response = await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
        });
        return response.data;
    } catch (error) {
        console.error('Error al crear evento:', error);
        throw error;
    }
};

// Función para actualizar un evento
export const updateEvent = async (eventId, event) => {
    try {
        const response = await calendar.events.update({
            calendarId: 'primary',
            eventId: eventId,
            resource: event,
        });
        return response.data;
    } catch (error) {
        console.error('Error al actualizar evento:', error);
        throw error;
    }
};

// Función para eliminar un evento
export const deleteEvent = async (eventId) => {
    try {
        await calendar.events.delete({
            calendarId: 'primary',
            eventId: eventId,
        });
        return true;
    } catch (error) {
        console.error('Error al eliminar evento:', error);
        throw error;
    }
}; 