'use client';

import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { readShopCart, SHOP_CART_EVENT, writeShopCart } from '../cart';
import { formatPrice, products } from '../products';

export default function CartPage() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const syncCart = () => setCart(readShopCart());
    syncCart();
    setReady(true);
    window.addEventListener('storage', syncCart);
    window.addEventListener(SHOP_CART_EVENT, syncCart);
    return () => {
      window.removeEventListener('storage', syncCart);
      window.removeEventListener(SHOP_CART_EVENT, syncCart);
    };
  }, []);

  const items = useMemo(() => Object.entries(cart).flatMap(([key, quantity]) => {
    const [productId, aroma] = key.split('::');
    const product = products.find((entry) => entry.id === productId);
    return product ? [{ ...product, key, aroma, quantity }] : [];
  }), [cart]);
  const total = items.reduce((sum, item) => sum + (item.price ?? 0) * item.quantity, 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const orderBody = encodeURIComponent(items.map((item) => `${item.aroma ? `${item.name} — ${item.aroma}` : item.name}; ${item.quantity} шт. × ${formatPrice(item.price)}`).join('\n') + `\n\nИтого: ${formatPrice(total)}`);
  const orderHref = `mailto:nuancesupport@gmail.com?subject=${encodeURIComponent('Заказ из магазина NUANCE')}&body=${orderBody}`;

  const changeQuantity = (key: string, change: number) => {
    const next = { ...cart };
    const quantity = (next[key] ?? 0) + change;
    if (quantity < 1) delete next[key];
    else next[key] = quantity;
    setCart(next);
    writeShopCart(next);
  };

  const removeItem = (key: string) => {
    const next = { ...cart };
    delete next[key];
    setCart(next);
    writeShopCart(next);
  };

  return <main className="shop-page-root">
    <SiteHeader />
    <section className="shop-cart-page">
      <a className="shop-cart-back" href="/shop#catalog"><ArrowLeft size={15} /> Вернуться в магазин</a>
      <div className="shop-cart-page-heading">
        <div><h1>Ваша корзина</h1></div>
        {ready && count > 0 && <span>{count} {count === 1 ? 'товар' : count < 5 ? 'товара' : 'товаров'}</span>}
      </div>

      {!ready ? <div className="shop-cart-page-empty" aria-live="polite" /> : items.length === 0 ? <div className="shop-cart-page-empty">
        <ShoppingBag size={28} strokeWidth={1.2} />
        <h2>Корзина пока пуста</h2>
        <p>Добавьте любимые ароматы и товары, чтобы оформить заказ.</p>
        <a className="shop-cart-continue" href="/shop#catalog">Перейти к покупкам <ArrowRight size={15} /></a>
      </div> : <div className="shop-cart-page-layout">
        <div className="shop-cart-page-items">
          {items.map((item) => <article className="shop-cart-page-item" key={item.key}>
            <a href={`/shop/${item.id}`} className="shop-cart-page-image"><img src={item.image} alt={item.name} /></a>
            <div className="shop-cart-page-product">
              <p className="shop-page-eyebrow">{item.label}</p>
              <h2>{item.name}</h2>
              {item.aroma && <p className="shop-cart-page-aroma">Аромат: {item.aroma}</p>}
              <button type="button" className="shop-cart-page-remove" onClick={() => removeItem(item.key)}><Trash2 size={13} /> Удалить</button>
            </div>
            <div className="shop-cart-page-controls">
              <div className="shop-quantity" aria-label={`Количество: ${item.name}`}>
                <button type="button" onClick={() => changeQuantity(item.key, -1)} aria-label={`Уменьшить количество: ${item.name}`}><Minus size={13} /></button>
                <span>{item.quantity}</span>
                <button type="button" onClick={() => changeQuantity(item.key, 1)} aria-label={`Увеличить количество: ${item.name}`}><Plus size={13} /></button>
              </div>
            </div>
          </article>)}
          <button type="button" className="shop-cart-page-clear" onClick={() => { setCart({}); writeShopCart({}); }}>Очистить корзину</button>
        </div>
        <aside className="shop-cart-page-summary">
          <p className="shop-page-eyebrow">Ваш заказ</p>
          <h2>Итого</h2>
          <div className="shop-cart-page-summary-row"><span>Товары · {count} шт.</span><strong>{formatPrice(total)}</strong></div>
          <p>Доставка и наличие подтвердим при оформлении заказа.</p>
          <a href={orderHref} className="shop-cart-order">Написать для оформления <ArrowRight size={15} /></a>
          <a href="/shop#catalog" className="shop-cart-page-continue">Продолжить покупки</a>
        </aside>
      </div>}
    </section>
    <SiteFooter />
  </main>;
}
