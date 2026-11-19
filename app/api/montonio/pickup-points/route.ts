import { NextRequest, NextResponse } from 'next/server';
import { signMontonioToken } from '@/lib/montonio';

export const runtime = 'nodejs';

const carriers = new Set(['omniva', 'smartpost', 'unisend', 'dpd']);
const sandbox = process.env.MONTONIO_SANDBOX === 'true' || (process.env.NODE_ENV !== 'production' && process.env.MONTONIO_SANDBOX !== 'false');
const shippingApi = sandbox ? 'https://sandbox-shipping.montonio.com/api/v2' : 'https://shipping.montonio.com/api/v2';

type MontonioPickupPoint = {
  id: string;
  name: string;
  type: string;
  streetAddress?: string;
  locality?: string;
  postalCode?: string;
  carrierCode: string;
};

export async function GET(request: NextRequest) {
  const accessKey = process.env.MONTONIO_ACCESS_KEY;
  const secretKey = process.env.MONTONIO_SECRET_KEY;
  if (!accessKey || !secretKey) return NextResponse.json({ error: 'Настройки Montonio не заданы.' }, { status: 503 });

  const carrierCode = request.nextUrl.searchParams.get('carrierCode')?.trim().toLowerCase() ?? '';
  if (!carriers.has(carrierCode)) return NextResponse.json({ error: 'Неизвестный способ доставки.' }, { status: 400 });

  try {
    const url = new URL(`${shippingApi}/shipping-methods/pickup-points`);
    url.searchParams.set('carrierCode', carrierCode);
    url.searchParams.set('countryCode', 'EE');
    url.searchParams.set('type', 'parcelMachine');

    const response = await fetch(url, {
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${signMontonioToken({ accessKey }, secretKey, 3600)}`,
      },
      next: { revalidate: 3600 },
    });
    if (!response.ok) {
      console.error('Montonio pickup points returned', response.status);
      return NextResponse.json({ error: 'Не удалось загрузить пункты выдачи.' }, { status: 502 });
    }

    const data = await response.json() as { pickupPoints?: MontonioPickupPoint[] };
    const pickupPoints = (data.pickupPoints ?? [])
      .filter((point) => point.type === 'parcelMachine' && point.carrierCode.toLowerCase() === carrierCode)
      .map((point) => ({
        id: point.id,
        name: point.name,
        streetAddress: point.streetAddress ?? '',
        locality: point.locality ?? '',
        postalCode: point.postalCode ?? '',
        carrierCode,
      }))
      .sort((a, b) => a.name.localeCompare(b.name, 'et'));

    return NextResponse.json({ pickupPoints }, { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } });
  } catch (error) {
    console.error('Montonio pickup point request failed', error);
    return NextResponse.json({ error: 'Не удалось связаться с сервисом доставки.' }, { status: 502 });
  }
}
