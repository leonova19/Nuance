import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getStoreProduct } from '@/lib/shop/catalog';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { hasSameOrigin } from '@/lib/admin/request';
import { signMontonioToken } from '@/lib/montonio';

export const runtime = 'nodejs';

const sandbox = process.env.MONTONIO_SANDBOX === 'true' || (process.env.NODE_ENV !== 'production' && process.env.MONTONIO_SANDBOX !== 'false');
const montonioApi = sandbox ? 'https://sandbox-stargate.montonio.com/api/orders' : 'https://stargate.montonio.com/api/orders';
const carriers: Record<string, string> = { omniva: 'Omniva', smartpost: 'Smartpost', unisend: 'Unisend', dpd: 'DPD' };

type IncomingItem = { id?: unknown; quantity?: unknown };
type IncomingBody = {
  items?: unknown;
  customer?: { firstName?: unknown; lastName?: unknown; email?: unknown; phone?: unknown; city?: unknown; address?: unknown; postalCode?: unknown };
  delivery?: { type?: unknown; carrierCode?: unknown; pickupPoint?: { id?: unknown; name?: unknown; streetAddress?: unknown; locality?: unknown; postalCode?: unknown; carrierCode?: unknown } };
};

function clean(value: unknown, max = 160) {
  return typeof value === 'string' ? value.trim().replace(/\p{Cc}/gu, '').slice(0, max) : '';
}

function publicBaseUrl(request: NextRequest) {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '');
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const protocol = request.headers.get('x-forwarded-proto') || 'https';
  const hostUrl = host ? `${protocol}://${host}`.replace(/\/$/, '') : request.nextUrl.origin;
  if (hostUrl.includes('localhost') || hostUrl.includes('127.0.0.1')) return configuredUrl?.startsWith('https://') ? configuredUrl : null;
  return hostUrl.startsWith('https://') ? hostUrl : null;
}

function getShippingCost(productTotal: number, isSelfPickup: boolean) {
  if (isSelfPickup || productTotal >= 80) return 0;
  return 3;
}

export async function POST(request: NextRequest) {
  if (!hasSameOrigin(request)) return NextResponse.json({ error: 'Запрос отклонён.' }, { status: 403 });

  const accessKey = process.env.MONTONIO_ACCESS_KEY;
  const secretKey = process.env.MONTONIO_SECRET_KEY;
  if (!accessKey || !secretKey) return NextResponse.json({ error: 'Оплата Montonio ещё не настроена.' }, { status: 503 });

  const supabase = createSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ error: 'Не настроено сохранение заказов.' }, { status: 503 });

  try {
    const body = await request.json() as IncomingBody;
    if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > 50) {
      return NextResponse.json({ error: 'Корзина пуста или содержит слишком много позиций.' }, { status: 400 });
    }

    const customer = {
      firstName: clean(body.customer?.firstName, 100),
      lastName: clean(body.customer?.lastName, 100),
      email: clean(body.customer?.email, 254).toLowerCase(),
      phone: clean(body.customer?.phone, 40),
      city: clean(body.customer?.city, 100),
      address: clean(body.customer?.address, 160),
      postalCode: clean(body.customer?.postalCode, 30),
    };
    if (!customer.firstName || !customer.lastName || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(customer.email) || !/^\+?\d{5,20}$/.test(customer.phone) || !customer.city || !customer.address || !/^\d{5}$/.test(customer.postalCode)) {
      return NextResponse.json({ error: 'Проверьте контактные данные.' }, { status: 400 });
    }

    const deliveryType = clean(body.delivery?.type, 20);
    const isSelfPickup = deliveryType === 'pickup';
    const carrierCode = clean(body.delivery?.carrierCode, 20).toLowerCase();
    const point = body.delivery?.pickupPoint;
    const pickupPoint = {
      id: clean(point?.id, 100),
      name: clean(point?.name, 160),
      streetAddress: clean(point?.streetAddress, 160),
      locality: clean(point?.locality, 100),
      postalCode: clean(point?.postalCode, 30),
      carrierCode: clean(point?.carrierCode, 20).toLowerCase(),
    };
    if (!isSelfPickup && (deliveryType !== 'parcel' || !carriers[carrierCode] || !pickupPoint.id || !pickupPoint.name || pickupPoint.carrierCode !== carrierCode)) {
      return NextResponse.json({ error: 'Выберите способ доставки и пункт выдачи.' }, { status: 400 });
    }

    const lineItems: Array<{ name: string; quantity: number; finalPrice: number; currency: string }> = [];
    const cartLines: Array<{ id: string; aroma: string; quantity: number; name: string; price: number; image: string }> = [];
    const requestedQuantity = new Map<string, number>();

    for (const rawItem of body.items as IncomingItem[]) {
      const rawId = clean(rawItem.id, 240);
      const [id, ...aromaParts] = rawId.split('::');
      const aroma = clean(aromaParts.join('::'), 80);
      const quantity = Number(rawItem.quantity);
      if (!id || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
        return NextResponse.json({ error: 'В корзине есть некорректный товар или количество.' }, { status: 400 });
      }

      const product = await getStoreProduct(id);
      if (!product || product.price === null || !Number.isFinite(product.price) || product.price < 0) {
        return NextResponse.json({ error: 'Один из товаров больше нельзя заказать. Обновите корзину.' }, { status: 409 });
      }
      requestedQuantity.set(id, (requestedQuantity.get(id) ?? 0) + quantity);
      if (requestedQuantity.get(id)! > 99) return NextResponse.json({ error: 'Превышено максимальное количество товара.' }, { status: 400 });

      const name = aroma ? `${product.name} · ${aroma}` : product.name;
      lineItems.push({ name, quantity, finalPrice: product.price, currency: 'EUR' });
      cartLines.push({ id, aroma, quantity, name, price: product.price, image: product.image });
    }

    const productTotal = Number(lineItems.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0).toFixed(2));
    const shippingCost = getShippingCost(productTotal, isSelfPickup);
    if (!isSelfPickup) lineItems.push({ name: `Доставка: ${carriers[carrierCode]} · ${pickupPoint.name}`, quantity: 1, finalPrice: shippingCost, currency: 'EUR' });
    const grandTotal = Number((productTotal + shippingCost).toFixed(2));
    const merchantReference = `NU-${Date.now()}-${randomUUID().slice(0, 8)}`;
    const delivery = isSelfPickup ? { type: 'pickup' } : { type: 'parcel', carrierCode, pickupPoint };
    const baseUrl = publicBaseUrl(request);
    if (!baseUrl) return NextResponse.json({ error: 'Для Montonio требуется публичный HTTPS-адрес сайта.' }, { status: 503 });

    const { error: saveError } = await supabase.from('store_orders').insert({
      merchant_reference: merchantReference,
      customer,
      delivery,
      line_items: cartLines,
      grand_total: grandTotal,
      currency: 'EUR',
      payment_status: 'PENDING',
    });
    if (saveError) {
      console.error('Could not save Nuance order', saveError.message);
      return NextResponse.json({ error: 'Не удалось сохранить заказ. Попробуйте позже.' }, { status: 503 });
    }

    const customerAddress = {
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phoneNumber: customer.phone,
      phoneCountry: customer.phone.replace(/\D/g, '').startsWith('372') ? '372' : undefined,
      addressLine1: customer.address,
      locality: customer.city,
      postalCode: customer.postalCode,
      country: 'EE',
    };
    const shippingAddress = isSelfPickup
      ? { ...customerAddress, addressLine1: 'Tartu põik 2a', locality: 'Jõhvi', postalCode: '' }
      : { ...customerAddress, addressLine1: pickupPoint.streetAddress || pickupPoint.name, locality: pickupPoint.locality, postalCode: pickupPoint.postalCode };
    const payload = {
      accessKey,
      merchantReference,
      returnUrl: `${baseUrl}/order/success?ref=${encodeURIComponent(merchantReference)}`,
      notificationUrl: `${baseUrl}/api/montonio/webhook`,
      grandTotal,
      currency: 'EUR',
      locale: 'ru',
      billingAddress: customerAddress,
      shippingAddress,
      lineItems,
      payment: { method: 'paymentInitiation', currency: 'EUR', amount: grandTotal },
    };

    try {
      const providerResponse = await fetch(montonioApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: signMontonioToken(payload, secretKey, 600) }),
      });
      if (!providerResponse.ok) {
        console.error('Montonio order request failed with status', providerResponse.status);
        await supabase.from('store_orders').update({ payment_status: 'FAILED' }).eq('merchant_reference', merchantReference);
        return NextResponse.json({ error: 'Не удалось создать платёж. Попробуйте позже.' }, { status: 502 });
      }
      const providerData = await providerResponse.json() as { paymentUrl?: unknown };
      if (typeof providerData.paymentUrl !== 'string' || !providerData.paymentUrl.startsWith('https://')) {
        await supabase.from('store_orders').update({ payment_status: 'FAILED' }).eq('merchant_reference', merchantReference);
        return NextResponse.json({ error: 'Платёжный сервис вернул некорректную ссылку.' }, { status: 502 });
      }
      return NextResponse.json({ paymentUrl: providerData.paymentUrl });
    } catch (error) {
      console.error('Montonio request failed', error);
      await supabase.from('store_orders').update({ payment_status: 'FAILED' }).eq('merchant_reference', merchantReference);
      return NextResponse.json({ error: 'Не удалось связаться с платёжным сервисом.' }, { status: 502 });
    }
  } catch (error) {
    console.error('Nuance checkout order failed', error);
    return NextResponse.json({ error: 'Не удалось оформить заказ.' }, { status: 500 });
  }
}
