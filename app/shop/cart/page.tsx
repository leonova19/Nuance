'use client';

import { ArrowLeft, Minus, Package, Plus, Trash2, Truck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { CartToast } from '../cart-toast';
import { getCartLineKey, notifyCartAdded, readShopCart, SHOP_CART_EVENT, writeShopCart } from '../cart';
import { formatPrice, products } from '../products';

export default function CartPage() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const syncCart = () => setCart(readShopCart());
    const initialCart = readShopCart();
    setCart(initialCart);
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
  const recommendedProducts = useMemo(() => {
    const cartProductIds = new Set(Object.keys(cart).map((key) => key.split('::')[0]));
    return products.filter((product) => product.price !== null && !cartProductIds.has(product.id)).slice(0, 5);
  }, [cart]);

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

  const addRecommendedProduct = (productId: string) => {
    const product = products.find((entry) => entry.id === productId);
    if (!product || product.price === null) return;
    const key = getCartLineKey(product.id, product.aroma);
    const next = { ...cart, [key]: (cart[key] ?? 0) + 1 };
    setCart(next);
    writeShopCart(next);
    notifyCartAdded();
  };

  return <main className="shop-page-root">
    <SiteHeader />
    <section className="shop-cart-page">
      <a className="shop-cart-back" href="/shop#catalog"><ArrowLeft size={15} /> Вернуться в магазин</a>
      <div className="shop-cart-page-heading">
        <div><h1>Ваша корзина</h1></div>
      </div>

      {!ready ? <div className="shop-cart-page-empty" aria-live="polite" /> : items.length === 0 ? <div className="shop-cart-page-empty">
        <h2>Корзина пока пуста</h2>
        <p>Добавьте любимые ароматы и товары, чтобы оформить заказ</p>
        <a className="shop-cart-continue" href="/shop#catalog">Перейти к покупкам</a>
      </div> : <div className="shop-cart-page-layout">
        <div className="shop-cart-page-items">
          {items.map((item) => <article className="shop-cart-page-item" key={item.key}>
            <a href={`/shop/${item.id}`} className="shop-cart-page-image"><img src={item.image} alt={item.name} /></a>
            <div className="shop-cart-page-product">
              <p className="shop-page-eyebrow">{item.label}</p>
              <h2>{item.name}</h2>
              {item.aroma && <p className="shop-cart-page-aroma">Аромат: {item.aroma}</p>}
            </div>
            <button type="button" className="shop-cart-page-remove" onClick={() => removeItem(item.key)} aria-label={`Удалить ${item.name} из корзины`}><Trash2 size={16} /></button>
            <div className="shop-cart-page-actions">
              <div className="shop-quantity" aria-label={`Количество: ${item.name}`}>
                <button type="button" onClick={() => changeQuantity(item.key, -1)} aria-label={`Уменьшить количество: ${item.name}`}><Minus size={13} /></button>
                <span>{item.quantity}</span>
                <button type="button" onClick={() => changeQuantity(item.key, 1)} aria-label={`Увеличить количество: ${item.name}`}><Plus size={13} /></button>
              </div>
            </div>
            <strong className="shop-cart-page-line-total site-price">{formatPrice((item.price ?? 0) * item.quantity)}</strong>
          </article>)}
        </div>
        <aside className="shop-cart-page-summary">
          <div className="shop-cart-page-summary-heading"><p className="shop-page-eyebrow">Ваш заказ</p><span>{count} {count === 1 ? 'товар' : count < 5 ? 'товара' : 'товаров'}</span></div>
          <div className="shop-cart-page-summary-details">
            <div className="shop-cart-page-summary-row"><span><Package size={16} /> Товары</span><strong className="site-price">{formatPrice(total)}</strong></div>
            <div className="shop-cart-page-summary-row"><span><Truck size={16} /> Доставка</span><small>Рассчитывается при оформлении</small></div>
          </div>
          <a href="/checkout" className="shop-cart-order">Оформить заказ</a>
          <p className="shop-cart-free-shipping-note">Бесплатная доставка от 80 €</p>
        </aside>
      </div>}
      {ready && items.length > 0 && recommendedProducts.length > 0 && <section className="shop-cart-recommendations" aria-labelledby="shop-cart-recommendations-title">
        <div className="shop-cart-recommendations-heading"><p className="shop-page-eyebrow">Подборка NUANCE</p><h2 id="shop-cart-recommendations-title">Возможно, вам понравится</h2></div>
        <div className="shop-product-grid">
          {recommendedProducts.map((product) => <article className="shop-product-card" key={product.id}>
            <div className="shop-product-visual"><Link href={`/shop/${product.id}`} className={`shop-product-image-trigger ${product.imageClass?.includes('shop-product-image--blend-background') ? 'shop-product-image-trigger--blend-background' : ''}`} aria-label={`Открыть товар: ${product.name}`}><Image className={product.imageClass ?? ''} src={product.image} alt="" fill unoptimized sizes="(max-width: 760px) 45vw, 20vw" /></Link>{product.aromaCount && <span className="shop-aroma-count">+{product.aromaCount} ароматов</span>}</div>
            <div className="shop-product-info"><p className="shop-product-label">{product.label}</p><Link className="shop-product-name" href={`/shop/${product.id}`}><h3>{product.name}</h3></Link><div className="shop-product-bottom"><strong className="site-price">{formatPrice(product.price)}</strong><button type="button" className="shop-product-action" onClick={() => addRecommendedProduct(product.id)}><Plus size={15} /> Добавить</button></div></div>
          </article>)}
        </div>
      </section>}
    </section>
    <CartToast />
    <SiteFooter />
  </main>;
}
