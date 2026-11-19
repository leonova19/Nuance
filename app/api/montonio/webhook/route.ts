import { NextRequest, NextResponse } from 'next/server';
import { verifyMontonioToken } from '@/lib/montonio';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const secretKey = process.env.MONTONIO_SECRET_KEY;
  if (!secretKey) return NextResponse.json({ error: 'Montonio is not configured.' }, { status: 503 });

  let token = request.nextUrl.searchParams.get('order-token') ?? '';
  if (!token) {
    try {
      const body = await request.json() as { orderToken?: unknown };
      token = typeof body.orderToken === 'string' ? body.orderToken : '';
    } catch {
      return NextResponse.json({ error: 'Invalid notification.' }, { status: 400 });
    }
  }

  const payload = verifyMontonioToken(token, secretKey);
  if (!payload) return NextResponse.json({ error: 'Invalid notification signature.' }, { status: 401 });

  const reference = typeof payload.merchantReference === 'string' ? payload.merchantReference : '';
  const status = typeof payload.paymentStatus === 'string' ? payload.paymentStatus.toUpperCase() : '';
  if (!/^NU-[A-Za-z0-9-]{8,80}$/.test(reference) || !['PAID', 'FAILED', 'CANCELLED'].includes(status)) {
    return NextResponse.json({ error: 'Invalid order notification.' }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ error: 'Order storage is not configured.' }, { status: 503 });

  const { error } = await supabase
    .from('store_orders')
    .update({ payment_status: status, updated_at: new Date().toISOString() })
    .eq('merchant_reference', reference)
    .eq('payment_status', 'PENDING');

  if (error) {
    console.error('Could not update Nuance order from Montonio notification', error.message);
    return NextResponse.json({ error: 'Could not update order.' }, { status: 503 });
  }

  return NextResponse.json({ ok: true });
}
