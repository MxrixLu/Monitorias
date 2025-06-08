import { listEvents, createEvent, deleteEvent } from '../../../services/googleCalendarService';

export async function GET(request) {
  try {
    // Obtener el token de acceso de las cookies
    const cookieHeader = request.headers.get('cookie');
    console.log('Cookie header:', cookieHeader); // Para debugging

    if (!cookieHeader) {
      return new Response(JSON.stringify({ error: 'No cookies found' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const cookies = Object.fromEntries(
      cookieHeader.split(';').map(cookie => {
        const [key, value] = cookie.trim().split('=');
        return [key, value];
      })
    );

    console.log('Parsed cookies:', cookies); // Para debugging

    const accessToken = cookies.calendar_access_token;

    if (!accessToken) {
      return new Response(JSON.stringify({ error: 'No access token found in cookies' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Obtener la fecha actual y la fecha de una semana después
    const now = new Date();
    const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Obtener los eventos
    const events = await listEvents(
      accessToken,
      now.toISOString(),
      oneWeekLater.toISOString()
    );

    return new Response(JSON.stringify(events), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return new Response(JSON.stringify({ error: 'Error fetching events', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request) {
  try {
    const accessToken = request.headers.get('authorization')?.split(' ')[1];
    const event = await request.json();

    if (!accessToken) {
      return Response.json({ error: 'Access token required' }, { status: 401 });
    }

    const createdEvent = await createEvent(accessToken, event);
    return Response.json(createdEvent);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const accessToken = request.headers.get('authorization')?.split(' ')[1];
    const eventId = searchParams.get('eventId');

    if (!accessToken || !eventId) {
      return Response.json({ error: 'Access token and event ID required' }, { status: 401 });
    }

    await deleteEvent(accessToken, eventId);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
} 