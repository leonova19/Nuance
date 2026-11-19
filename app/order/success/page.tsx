import Link from 'next/link';
import { Check, Clock3, X } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { ClearCartAfterPayment } from './clear-cart';

export const dynamic = 'force-dynamic';

type PaymentStatus = 'PAID' | 'FAILED' | 'CANCELLED' | 'PENDING' | 'UNKNOWN';

export default async function OrderSuccessPage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const { ref = '' } = await searchParams;
  let status: PaymentStatus = 'UNKNOWN';
  if (/^NU-[A-Za-z0-9-]{8,80}$/.test(ref)) {
    const supabase = createSupabaseAdminClient();
    if (supabase) {
      const { data, error } = await supabase.from('store_orders').select('payment_status').eq('merchant_reference', ref).maybeSingle();
      if (!error && data?.payment_status && ['PAID', 'FAILED', 'CANCELLED', 'PENDING'].includes(data.payment_status)) status = data.payment_status as PaymentStatus;
    }
  }

  const paid = status === 'PAID';
  const failed = status === 'FAILED' || status === 'CANCELLED';
  const Icon = paid ? Check : failed ? X : Clock3;
  const title = paid ? 'Оплата прошла успешно' : failed ? 'Оплата не завершена' : 'Проверяем оплату';
  const description = paid
    ? 'Спасибо за заказ. Мы получили оплату и скоро начнём его собирать.'
    : failed
      ? 'Платёж не был завершён. Вы можете вернуться в корзину и попробовать ещё раз.'
      : 'Платёжный сервис ещё подтверждает статус. Если вы уже оплатили заказ, не оплачивайте его повторно.';

  return <main className="shop-page-root">
    <SiteHeader />
    <section className="shop-order-result">
      <ClearCartAfterPayment paid={paid} />
      <div className={`shop-order-result-card${paid ? ' is-paid' : ''}${failed ? ' is-failed' : ''}`}>
        <span className="shop-order-result-icon"><Icon size={24} strokeWidth={1.5} /></span>
        <p className="shop-page-eyebrow">NUANCE · Заказ {ref ? `№ ${ref}` : ''}</p>
        <h1>{title}</h1>
        <p>{description}</p>
        <div><Link href={failed ? '/shop/cart' : '/shop#catalog'}>{failed ? 'Вернуться в корзину' : 'Перейти в магазин'}</Link></div>
      </div>
    </section>
    <SiteFooter />
  </main>;
}
