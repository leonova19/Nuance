import { NextResponse } from 'next/server';
import { adminEnvironmentReady, adminSessionCookieOptions, createAdminSessionValue, isAdminAuthenticated, isAdminPasswordConfigured, verifyAdminPassword, ADMIN_SESSION_COOKIE } from '@/lib/admin/session';
import { hasSameOrigin } from '@/lib/admin/request';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({ authenticated: await isAdminAuthenticated() }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) return NextResponse.json({ error: 'Запрос отклонён.' }, { status: 403 });
  if (!isAdminPasswordConfigured()) return NextResponse.json({ error: 'Задайте ADMIN_PASSWORD минимум из 10 символов в настройках окружения.' }, { status: 503 });

  try {
    const body = await request.json() as { password?: unknown };
    if (typeof body.password !== 'string' || !body.password) {
      return NextResponse.json({ error: 'Введите пароль.' }, { status: 400 });
    }

    if (!verifyAdminPassword(body.password)) return NextResponse.json({ error: 'Неверный пароль.' }, { status: 401 });
    if (!adminEnvironmentReady()) return NextResponse.json({ error: 'Не настроено подключение к базе данных.' }, { status: 503 });

    const response = NextResponse.json({ authenticated: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, createAdminSessionValue(), adminSessionCookieOptions());
    return response;
  } catch {
    return NextResponse.json({ error: 'Не удалось выполнить вход.' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  if (!hasSameOrigin(request)) return NextResponse.json({ error: 'Запрос отклонён.' }, { status: 403 });
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(ADMIN_SESSION_COOKIE, '', { ...adminSessionCookieOptions(), maxAge: 0 });
  return response;
}

