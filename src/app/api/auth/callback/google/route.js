import { NextResponse } from 'next/server';
import { getAccessToken } from '../../../../services/googleCalendar';

export async function GET(request) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (!code) {
        return NextResponse.redirect('/home/calendar?error=no_code');
    }

    
    try {
        const tokens = await getAccessToken(code);
        // Guardar el token en localStorage o en una cookie segura
        const response = NextResponse.redirect(`${request.nextUrl.origin}/home/calendar`);
        response.cookies.set('google_calendar_token', tokens.access_token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3600 // 1 hora
        });
        return response;
    } catch (error) {
        console.error('Error al obtener el token:', error);
        return NextResponse.redirect(`${request.nextUrl.origin}/home/calendar?error=auth_failed`);
    }
} 