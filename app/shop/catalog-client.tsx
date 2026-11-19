'use client';

import { ArrowRight, Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { getCartLineKey, notifyCartAdded, readShopCart, SHOP_CART_EVENT, SHOP_CART_STORAGE_KEY, writeShopCart } from './cart';
import { CartToast } from './cart-toast';
import { formatPrice, type Product } from './products';

type Category = 'all' | Product['category'];

const categories: { id: Category; label: string }[] = [
  { id: 'all', label: 'Все товары' },
  { id: 'home', label: 'Для дома' },
  { id: 'car', label: 'Для автомобиля' },
  { id: 'fragrance', label: 'Парфюмерия' },
  { id: 'care', label: 'Уход' },
  { id: 'gifts', label: 'Подарочные наборы' },
];

export function ShopCatalog({ products }: { products: Product[] }) {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartReady, setCartReady] = useState(false);

  useEffect(() => {
    const category = new URLSearchParams(window.location.search).get('category') as Category | null;
    if (category && categories.some((item) => item.id === category)) setActiveCategory(category);
  }, []);

  useEffect(() => {
    const syncCart = () => setCart(readShopCart());
    syncCart();
    setCartReady(true);
    window.addEventListener('storage', syncCart);
    window.addEventListener(SHOP_CART_EVENT, syncCart);
    return () => {
      window.removeEventListener('storage', syncCart);
      window.removeEventListener(SHOP_CART_EVENT, syncCart);
    };
  }, []);

  useEffect(() => {
    if (cartReady) localStorage.setItem(SHOP_CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart, cartReady]);

  const visibleProducts = useMemo(
    () => activeCategory === 'all' ? products : products.filter((product) => product.category === activeCategory),
    [activeCategory, products],
  );
  const addToCart = (product: Product) => {
    if (product.price === null) return;
    const key = getCartLineKey(product.id, product.aroma);
    const next = { ...cart, [key]: (cart[key] ?? 0) + 1 };
    setCart(next);
    writeShopCart(next);
    notifyCartAdded();
  };

  return <main className="shop-page-root">
    <SiteHeader />
    <section className="shop-catalog" id="catalog">
      <div className="shop-catalog-heading"><div><p className="shop-page-eyebrow">Магазин NUANCE · 89 AROMATIC</p><h2>Ароматы для вашего пространства</h2></div></div>
      <div className="shop-catalog-controls">
        <div className="shop-filter-row" role="tablist" aria-label="Категории магазина">
          {categories.map((category) => <button type="button" role="tab" aria-selected={activeCategory === category.id} className={activeCategory === category.id ? 'is-active' : ''} key={category.id} onClick={() => { setActiveCategory(category.id); const url = new URL(window.location.href); if (category.id === 'all') url.searchParams.delete('category'); else url.searchParams.set('category', category.id); window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`); }}>{category.label}</button>)}
        </div>
      </div>
      <div className="shop-catalog-meta"><span>{visibleProducts.length} позиций</span></div>
      {visibleProducts.length === 0
        ? <p className="shop-empty-state">В этой категории пока нет товаров.</p>
        : <div className="shop-product-grid">
          {visibleProducts.map((product, index) => <article className="shop-product-card" key={product.id}>
            <div className="shop-product-visual"><Link href={`/shop/${product.id}`} className={`shop-product-image-trigger ${product.imageClass?.includes('shop-product-image--blend-background') ? 'shop-product-image-trigger--blend-background' : ''}`} aria-label={`Открыть товар: ${product.name}`}><img className={product.imageClass ?? ''} src={product.image} alt="" loading={index < 4 ? 'eager' : 'lazy'} /></Link>{product.aromaCount && <span className="shop-aroma-count">+{product.aromaCount} ароматов</span>}</div>
            <div className="shop-product-info"><p className="shop-product-label">{product.label}</p><Link className="shop-product-name" href={`/shop/${product.id}`}><h3>{product.name}</h3></Link><div className="shop-product-bottom"><strong className="site-price">{formatPrice(product.price)}</strong>{product.price === null ? <a className="shop-product-action shop-product-action--link" href={`mailto:nuancesupport@gmail.com?subject=${encodeURIComponent(`Уточнить товар: ${product.name}`)}`}>Уточнить <ArrowRight size={14} /></a> : product.aromaCount ? <Link className="shop-product-action shop-product-action--link" href={`/shop/${product.id}`}>Выбрать аромат</Link> : <button type="button" className="shop-product-action" onClick={() => addToCart(product)}><Plus size={15} /> Добавить</button>}</div></div>
          </article>)}
        </div>}
    </section>
    <CartToast />
    <SiteFooter />
  </main>;
}

