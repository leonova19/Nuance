import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

export const ADMIN_SESSION_COOKIE = 'nuance-admin-session';
const SESSION_TTL_SECONDS = 60 * 60 * 8;
const SESSION_DOMAIN = 'nuance-admin-session-v1';

function adminPassword() {
  return process.env.ADMIN_PASSWORD?.trim() ?? '';
}

function sign(payload: string, password: string) {
  return createHmac('sha256', password).update(`${SESSION_DOMAIN}:${payload}`).digest('base64url');
}

export function isAdminPasswordConfigured() {
  return adminPassword().length >= 10;
}

export function verifyAdminPassword(password: string) {
  const expectedPassword = adminPassword();
  if (!expectedPassword) return false;

  const expected = Buffer.from(expectedPassword);
  const received = Buffer.from(password);
  return expected.length === received.length && timingSafeEqual(expected, received);
}

export function createAdminSessionValue() {
  const password = adminPassword();
  if (!password) throw new Error('ADMIN_PASSWORD is not configured');

  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = String(expiresAt);
  return `${payload}.${sign(payload, password)}`;
}

export async function isAdminAuthenticated() {
  const password = adminPassword();
  if (!password) return false;
  const value = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!value) return false;

  const [expiryValue, signature, extra] = value.split('.');
  if (!expiryValue || !signature || extra) return false;

  const expiresAt = Number(expiryValue);
  if (!Number.isInteger(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000)) return false;

  const payload = String(expiresAt);
  const expected = Buffer.from(sign(payload, password));
  const actual = Buffer.from(signature);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function adminSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  };
}

export function adminEnvironmentReady() {
  return Boolean(
    isAdminPasswordConfigured() &&
    process.env.SUPABASE_URL &&
    (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY),
  );
}

