'use client';

import { ArrowLeft, ChevronDown, CreditCard, Package, Truck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { type SubmitEvent, useEffect, useMemo, useState } from 'react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { readShopCart, SHOP_CART_EVENT } from '@/app/shop/cart';
import { formatPrice, products } from '@/app/shop/products';

const carriers = [
  { code: 'omniva', name: 'Omniva' },
  { code: 'smartpost', name: 'Smartpost' },
  { code: 'unisend', name: 'Unisend' },
  { code: 'dpd', name: 'DPD' },
];
const estonianCities = [
  'Tallinn', 'Tartu', 'Narva', 'Pärnu', 'Kohtla-Järve', 'Viljandi', 'Rakvere', 'Maardu',
  'Kuressaare', 'Sillamäe', 'Võru', 'Valga', 'Haapsalu', 'Jõhvi', 'Keila', 'Paide',
  'Türi', 'Põlva', 'Rapla', 'Elva', 'Saue', 'Kärdla', 'Jõgeva', 'Põltsamaa', 'Kiviõli',
  'Tapa', 'Paldiski', 'Otepää', 'Tõrva', 'Loksa', 'Narva-Jõesuu', 'Kunda', 'Mustvee',
];

type CheckoutItem = (typeof products)[number] & { key: string; aroma: string; quantity: number };
type PickupPoint = { id: string; name: string; streetAddress: string; locality: string; postalCode: string; carrierCode: string };

export default function CheckoutPage() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [ready, setReady] = useState(false);
  const [customer, setCustomer] = useState({ firstName: '', lastName: '', email: '', phone: '', city: '', address: '', postalCode: '' });
  const [emailTouched, setEmailTouched] = useState(false);
  const [deliveryType, setDeliveryType] = useState<'parcel' | 'pickup'>('parcel');
  const [carrierCode, setCarrierCode] = useState(carriers[0].code);
  const [pickupPoints, setPickupPoints] = useState<PickupPoint[]>([]);
  const [pickupPointId, setPickupPointId] = useState('');
  const [pickupLoading, setPickupLoading] = useState(true);
  const [pickupError, setPickupError] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const sync = () => {
      setCart(readShopCart());
      setReady(true);
    };
    queueMicrotask(sync);
    window.addEventListener(SHOP_CART_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(SHOP_CART_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const items = useMemo<CheckoutItem[]>(() => Object.entries(cart).flatMap(([key, quantity]) => {
    const [id, ...aromaParts] = key.split('::');
    const product = products.find((entry) => entry.id === id);
    return product ? [{ ...product, key, aroma: aromaParts.join('::'), quantity }] : [];
  }), [cart]);
  const productsTotal = items.reduce((sum, item) => sum + (item.price ?? 0) * item.quantity, 0);
  const shippingCost = deliveryType === 'pickup' || productsTotal >= 80 ? 0 : 3;
  const total = productsTotal + shippingCost;
  const selectedPoint = pickupPoints.find((point) => point.id === pickupPointId) ?? null;
  const canOrder = items.length > 0 && items.every((item) => item.price !== null);
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(customer.email.trim());

  useEffect(() => {
    if (!ready || items.length === 0 || deliveryType !== 'parcel') return;
    const controller = new AbortController();
    fetch(`/api/montonio/pickup-points?carrierCode=${encodeURIComponent(carrierCode)}`, { signal: controller.signal })
      .then(async (response) => {
        const data = await response.json() as { pickupPoints?: PickupPoint[]; error?: string };
        if (!response.ok) throw new Error(data.error || 'Не удалось загрузить пункты выдачи.');
        setPickupPoints(data.pickupPoints ?? []);
        setPickupPointId(data.pickupPoints?.[0]?.id ?? '');
      })
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
        setPickupPoints([]);
        setPickupError(requestError instanceof Error ? requestError.message : 'Не удалось загрузить пункты выдачи.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setPickupLoading(false);
      });
    return () => controller.abort();
  }, [carrierCode, deliveryType, items.length, ready]);

  function updateCustomer(field: keyof typeof customer, value: string) {
    setCustomer((current) => ({ ...current, [field]: value }));
  }

  async function submitOrder(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (!acceptedTerms) return;
    if (deliveryType === 'parcel' && !selectedPoint) {
      setError('Выберите пункт выдачи.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/montonio/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({ id: item.key, quantity: item.quantity })),
          customer,
          delivery: deliveryType === 'pickup' ? { type: 'pickup' } : { type: 'parcel', carrierCode, pickupPoint: selectedPoint },
        }),
      });
      const data = await response.json() as { paymentUrl?: string; error?: string };
      if (!response.ok || !data.paymentUrl) throw new Error(data.error || 'Не удалось создать заказ. Попробуйте ещё раз.');
      window.location.assign(data.paymentUrl);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Ошибка соединения. Попробуйте ещё раз.');
      setSubmitting(false);
    }
  }

  return <main className="shop-page-root">
    <SiteHeader />
    <section className="shop-checkout-page">
      <Link className="shop-cart-back" href="/shop/cart"><ArrowLeft size={15} /> Вернуться в корзину</Link>
      <header className="shop-checkout-heading"><div><h1>Оформление заказа</h1></div></header>

      {!ready ? <div className="shop-checkout-loading" aria-live="polite" /> : items.length === 0 ? <div className="shop-cart-page-empty shop-checkout-empty">
        <Package size={28} strokeWidth={1.2} />
        <h2>Корзина пока пуста</h2>
        <p>Добавьте товары, чтобы перейти к оформлению.</p>
        <Link className="shop-cart-continue" href="/shop#catalog">Перейти в магазин</Link>
      </div> : <form className="shop-checkout-layout" onSubmit={submitOrder}>
        <div className="shop-checkout-sections">
          <section className="shop-checkout-card">
            <div className="shop-checkout-section-heading"><h2>Ваши данные</h2></div>
            <div className="shop-checkout-fields">
              <label>Имя<input required maxLength={100} value={customer.firstName} onChange={(event) => updateCustomer('firstName', event.target.value)} /></label>
              <label>Фамилия<input required maxLength={100} value={customer.lastName} onChange={(event) => updateCustomer('lastName', event.target.value)} /></label>
              <label>E-mail<input type="email" autoComplete="email" required pattern="[^\s@]+@[^\s@]+\.[^\s@]{2,}" title="Введите корректный адрес e-mail" aria-invalid={emailTouched && customer.email.length > 0 && !validEmail} maxLength={254} value={customer.email} onBlur={() => setEmailTouched(true)} onChange={(event) => { setEmailTouched(true); updateCustomer('email', event.target.value); }} />{emailTouched && customer.email.length > 0 && !validEmail && <small className="shop-checkout-inline-error">Введите корректный адрес e-mail</small>}</label>
              <label>Телефон<input type="tel" autoComplete="tel" inputMode="tel" required maxLength={21} pattern="\+?[0-9]{5,20}" title="Введите номер телефона цифрами, знак + можно поставить в начале" value={customer.phone} onChange={(event) => updateCustomer('phone', event.target.value.replace(/[^\d+]/g, '').replace(/(?!^)\+/g, '').slice(0, 21))} /></label>
              <label htmlFor="checkout-city">Город<input id="checkout-city" list="checkout-estonian-cities" autoComplete="address-level2" required maxLength={100} value={customer.city} onChange={(event) => updateCustomer('city', event.target.value)} /></label><datalist id="checkout-estonian-cities" aria-label="Варианты городов Эстонии">{estonianCities.map((city) => <option key={city} value={city}>{city}</option>)}</datalist>
              <label>Адрес<input autoComplete="street-address" required maxLength={160} value={customer.address} onChange={(event) => updateCustomer('address', event.target.value)} /></label>
              <label>Почтовый индекс<input type="text" inputMode="numeric" autoComplete="postal-code" required pattern="[0-9]{5}" title="Введите 5 цифр почтового индекса" maxLength={5} value={customer.postalCode} onChange={(event) => updateCustomer('postalCode', event.target.value.replace(/\D/g, '').slice(0, 5))} /></label>
            </div>
          </section>

          <section className="shop-checkout-card">
            <div className="shop-checkout-section-heading"><h2>Доставка</h2></div>
            <div className="shop-checkout-delivery-options">
              {carriers.map((carrier) => <label className={`shop-checkout-delivery-option${deliveryType === 'parcel' && carrierCode === carrier.code ? ' is-selected' : ''}`} key={carrier.code}>
                <input type="radio" name="delivery" checked={deliveryType === 'parcel' && carrierCode === carrier.code} onChange={() => { setPickupLoading(true); setPickupError(''); setPickupPointId(''); setDeliveryType('parcel'); setCarrierCode(carrier.code); }} />
                <span><Truck size={17} /><strong>Почтомат {carrier.name}</strong></span>
                <small className="site-price">{productsTotal >= 80 ? 'Бесплатно' : '3 €'}</small>
              </label>)}
              <label className={`shop-checkout-delivery-option${deliveryType === 'pickup' ? ' is-selected' : ''}`}>
                <input type="radio" name="delivery" checked={deliveryType === 'pickup'} onChange={() => { setPickupLoading(false); setDeliveryType('pickup'); }} />
                <span><Package size={17} /><strong>Самовывоз</strong></span>
                <small>Бесплатно</small>
              </label>
            </div>
            {deliveryType === 'parcel' && <div className="shop-checkout-pickup">
              <label htmlFor="checkout-pickup-point">Выбор почтомата<select id="checkout-pickup-point" value={pickupPointId} disabled={pickupLoading || pickupPoints.length === 0} onChange={(event) => setPickupPointId(event.target.value)}>
                {pickupLoading && <option value="">Загружаем почтоматы…</option>}
                {!pickupLoading && pickupPoints.length === 0 && <option value="">Нет доступных почтоматов</option>}
                {pickupPoints.map((point) => <option key={point.id} value={point.id}>{point.name}{point.locality ? ` · ${point.locality}` : ''}{point.streetAddress ? ` · ${point.streetAddress}` : ''}</option>)}
              </select><ChevronDown className="shop-checkout-select-chevron" size={15} aria-hidden="true" /></label>
              {pickupError && <p className="shop-checkout-inline-error">{pickupError}</p>}
            </div>}
            {deliveryType === 'pickup' && <p className="shop-checkout-pickup-note">Самовывоз: Jõhvi, Tartu põik 2a.</p>}
          </section>
        </div>

        <aside className="shop-checkout-summary">
          <h2>Проверка заказа</h2>
          <ul className="shop-checkout-items">{items.map((item) => <li key={item.key}>
            <Image src={item.image} alt="" width={52} height={58} unoptimized />
            <div><strong>{item.name}</strong>{item.aroma && <span>Аромат: {item.aroma}</span>}<small>Количество: {item.quantity}</small></div>
            <b className="site-price">{formatPrice(item.price === null ? null : item.price * item.quantity)}</b>
          </li>)}</ul>
          <div className="shop-checkout-total-row"><span><Truck size={16} strokeWidth={1.5} />Доставка</span><strong className="site-price">{shippingCost === 0 ? 'Бесплатно' : formatPrice(shippingCost)}</strong></div>
          <div className="shop-checkout-grand-total"><span>Итоговая сумма</span><strong className="site-price">{formatPrice(total)}</strong></div>
          <label className="shop-checkout-consent"><input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} required /><span>Я принимаю <Link href="/terms" target="_blank">условия продажи</Link> и <Link href="/privacy" target="_blank">политику конфиденциальности</Link>.</span></label>
          {error && <p className="shop-checkout-error" role="alert">{error}</p>}
          <button className="shop-checkout-submit" type="submit" disabled={submitting || !acceptedTerms || !canOrder || !validEmail || (deliveryType === 'parcel' && (!selectedPoint || pickupLoading))}>
            {submitting ? 'Переходим к оплате…' : <><CreditCard size={17} /> Перейти к оплате</>}
          </button>
        </aside>
      </form>}
    </section>
    <SiteFooter />
  </main>;
}
