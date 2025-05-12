import { NextResponse } from 'next/server';
import { google } from 'googleapis';

// Configuración de las credenciales de OAuth 2.0
const oauth2Client = new google.auth.OAuth2(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI
);

// Configuración del cliente de Google Calendar
const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

export async function GET(request) {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
        return NextResponse.json({ error: 'Token no proporcionado' }, { status: 401 });
    }

    try {
        oauth2Client.setCredentials({ access_token: token });
        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin: new Date().toISOString(),
            singleEvents: true,
            orderBy: 'startTime',
        });
        return NextResponse.json(response.data.items);
    } catch (error) {
        console.error('Error al listar eventos:', error);
        return NextResponse.json({ error: 'Error al obtener eventos' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { token, event } = await request.json();
        
        if (!token || !event) {
            return NextResponse.json({ error: 'Token o evento no proporcionado' }, { status: 400 });
        }

        oauth2Client.setCredentials({ access_token: token });
        const response = await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
        });
        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Error al crear evento:', error);
        return NextResponse.json({ error: 'Error al crear evento' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { token, eventId } = await request.json();
        
        if (!token || !eventId) {
            return NextResponse.json({ error: 'Token o ID de evento no proporcionado' }, { status: 400 });
        }

        oauth2Client.setCredentials({ access_token: token });
        await calendar.events.delete({
            calendarId: 'primary',
            eventId: eventId,
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error al eliminar evento:', error);
        return NextResponse.json({ error: 'Error al eliminar evento' }, { status: 500 });
    }
} 