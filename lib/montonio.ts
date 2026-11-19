import { createHmac, timingSafeEqual } from 'node:crypto';

type JwtPayload = Record<string, unknown>;

function encode(value: string) {
  return Buffer.from(value).toString('base64url');
}

export function signMontonioToken(payload: JwtPayload, secret: string, expiresInSeconds: number) {
  const now = Math.floor(Date.now() / 1000);
  const header = encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = encode(JSON.stringify({ ...payload, iat: now, exp: now + expiresInSeconds }));
  const signature = createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

export function verifyMontonioToken(token: string, secret: string): JwtPayload | null {
  const [header, body, signature, ...extra] = token.split('.');
  if (!header || !body || !signature || extra.length > 0) return null;

  const expected = createHmac('sha256', secret).update(`${header}.${body}`).digest();
  let received: Buffer;
  try {
    received = Buffer.from(signature, 'base64url');
  } catch {
    return null;
  }
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) return null;

  try {
    const decodedHeader = JSON.parse(Buffer.from(header, 'base64url').toString('utf8')) as { alg?: string };
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as JwtPayload;
    if (decodedHeader.alg !== 'HS256' || typeof payload.exp !== 'number' || payload.exp <= Date.now() / 1000) return null;
    return payload;
  } catch {
    return null;
  }
}
