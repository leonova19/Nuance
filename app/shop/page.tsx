'use client';

import { ArrowRight, Check, ChevronDown, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { getCartLineKey, notifyCartAdded, readShopCart, SHOP_CART_EVENT, SHOP_CART_STORAGE_KEY, writeShopCart } from './cart';
import { CartToast } from './cart-toast';
import { formatPrice, products, type Product } from './products';

type Category = 'all' | 'home' | 'car' | 'fragrance' | 'gifts' | 'care';

const categories: { id: Category; label: string }[] = [
  { id: 'all', label: 'Все товары' },
  { id: 'home', label: 'Для дома' },
  { id: 'car', label: 'Для автомобиля' },
  { id: 'fragrance', label: 'Ароматы' },
  { id: 'care', label: 'Уход' },
  { id: 'gifts', label: 'Подарочные наборы' },
];


export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [priceSort, setPriceSort] = useState<'default' | 'asc' | 'desc'>('default');
  const [sortOpen, setSortOpen] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartReady, setCartReady] = useState(false);

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
    [activeCategory],
  );
  const sortedProducts = useMemo(
    () => priceSort === 'default'
      ? visibleProducts
      : [...visibleProducts].sort((a, b) => priceSort === 'asc' ? (a.price ?? 0) - (b.price ?? 0) : (b.price ?? 0) - (a.price ?? 0)),
    [visibleProducts, priceSort],
  );
  const chooseSort = (value: 'asc' | 'desc') => {
    setPriceSort(value);
    setSortOpen(false);
  };
  const addToCart = (product: Product) => {
    if (product.price === null) return;
    const key = getCartLineKey(product.id);
    const next = { ...cart, [key]: (cart[key] ?? 0) + 1 };
    setCart(next);
    writeShopCart(next);
    notifyCartAdded();
  };
  return <main className="shop-page-root">
    <SiteHeader />
    <section className="shop-catalog" id="catalog">
      <div className="shop-catalog-heading"><div><p className="shop-page-eyebrow">Магазин NUANCE · 89 AROMATIC</p><h2>Ароматы для<br /><em>вашего пространства</em></h2></div></div>
      <div className="shop-catalog-controls">
        <div className="shop-filter-row" role="tablist" aria-label="Категории магазина">
          {categories.map((category) => <button type="button" role="tab" aria-selected={activeCategory === category.id} className={activeCategory === category.id ? 'is-active' : ''} key={category.id} onClick={() => setActiveCategory(category.id)}>{category.label}</button>)}
        </div>
        <div className="shop-sort-control" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setSortOpen(false); }} onKeyDown={(event) => { if (event.key === 'Escape') setSortOpen(false); }}>
          <div className="shop-sort-select">
            <button type="button" className="shop-sort-trigger" aria-haspopup="listbox" aria-expanded={sortOpen} onClick={() => setSortOpen((open) => !open)}>{priceSort === 'default' ? 'Сортировка' : priceSort === 'asc' ? 'Сначала дешевле' : 'Сначала дороже'}<ChevronDown size={14} aria-hidden="true" /></button>
            {priceSort !== 'default' && <button type="button" className="shop-sort-reset" aria-label="Сбросить сортировку" title="Вернуть исходный порядок" onClick={() => { setPriceSort('default'); setSortOpen(false); }}><X size={13} aria-hidden="true" /></button>}
            {sortOpen && <div className="shop-sort-options" role="listbox" aria-label="Сортировать товары по цене">
              {([{ value: 'asc', label: 'Сначала дешевле' }, { value: 'desc', label: 'Сначала дороже' }] as const).map((option) => <button type="button" role="option" aria-selected={priceSort === option.value} className="shop-sort-option" key={option.value} onClick={() => chooseSort(option.value)}>{priceSort === option.value ? <Check size={14} aria-hidden="true" /> : <span className="shop-sort-option-spacer" />}<span>{option.label}</span></button>)}
            </div>}
          </div>
        </div>
      </div>
      <div className="shop-catalog-meta"><span>{visibleProducts.length} позиций</span></div>
      <div className="shop-product-grid">
        {sortedProducts.map((product, index) => <article className="shop-product-card" key={product.id}>
          <div className="shop-product-visual"><Link href={`/shop/${product.id}`} className={`shop-product-image-trigger ${product.imageClass?.includes('shop-product-image--blend-background') ? 'shop-product-image-trigger--blend-background' : ''}`} aria-label={`Открыть товар: ${product.name}`}><img className={product.imageClass ?? ''} src={product.image} alt="" loading={index < 4 ? 'eager' : 'lazy'} /></Link>{product.aromaCount && <span className="shop-aroma-count">+{product.aromaCount} ароматов</span>}</div>
          <div className="shop-product-info"><p className="shop-product-label">{product.label}</p><Link className="shop-product-name" href={`/shop/${product.id}`}><h3>{product.name}</h3></Link><div className="shop-product-bottom"><strong>{formatPrice(product.price)}</strong>{product.price === null ? <a className="shop-product-action shop-product-action--link" href={`mailto:nuancesupport@gmail.com?subject=${encodeURIComponent(`Уточнить товар: ${product.name}`)}`}>Уточнить <ArrowRight size={14} /></a> : <button type="button" className="shop-product-action" onClick={() => addToCart(product)}><Plus size={15} /> Добавить</button>}</div></div>
        </article>)}
      </div>
    </section>

    <CartToast />
    <SiteFooter />
  </main>;
}
