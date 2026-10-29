'use client';

import { ChevronDown, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { formatPrice, type Product } from './products';
import { getCartLineKey, notifyCartAdded, readShopCart, writeShopCart } from './cart';
import { CartToast } from './cart-toast';

const aromaOptions = [
  {
    name: 'Dore',
    description: 'Тёплый гурманский аромат: карамельная сладость, нежная роза и яркий апельсин.',
    notes: [
      { name: 'Карамель', image: '/note-caramel.png' },
      { name: 'Роза', image: '/note-rose.png' },
      { name: 'Апельсин', image: '/note-orange.png' },
    ],
  },
  {
    name: 'Ohena',
    description: 'Аромат с нотами шафрана, жасмина и апельсина.',
    notes: [
      { name: 'Шафран', image: '/note-saffron.png' },
      { name: 'Жасмин', image: '/note-jasmine.png' },
      { name: 'Апельсин', image: '/note-orange.png' },
    ],
  },
  {
    name: 'Blue Nightingale',
    description: 'Аромат с нотами малины, ванили и кашмерана.',
    notes: [
      { name: 'Малина', image: '/note-raspberry.png' },
      { name: 'Ваниль', image: '/note-vanilla.png' },
      { name: 'Кашмеран', image: '/note-cashmeran.png' },
    ],
  },
  {
    name: 'Diamond',
    description: 'Лучезарный и сладкий аромат, излучающий элегантность. Свежесть лимона и цветка апельсина сочетается со сладостью клубники и персика. Мягкость жасмина, туберозы и цикламена наполняет воздух роскошью, а сандал и ваниль придают тепло и утончённость.\n\nВерхние ноты · лимон, оттенки морской соли, нероли, персик и клубника\nНоты сердца · жасмин, иланг-иланг, тубероза, цикламен и шалфей мускатный\nБазовые ноты · кожа, сандал, амбра, пачули, замша и ваниль',
    notes: [
      { name: 'Лимон', image: '/note-lemon.png' },
      { name: 'Жасмин', image: '/note-jasmine.png' },
      { name: 'Амбра', image: '/note-amber.png' },
    ],
  },
  {
    name: 'Inoop',
    description: 'Нежный и чувственный аромат, дышащий восточным теплом. Сочные ноты сливы и освежающего бергамота переплетаются с тёплыми аккордами корицы и пряной гвоздики. Мягкость герани, мускусная ваниль и богатый кедр сливаются в тепле амбры, создавая элегантную атмосферу.\n\nВерхние ноты · слива, бергамот\nНоты сердца · яблоко, корица, гвоздика, гвоздика-трава\nБазовые ноты · герань, мускус с ванилью, кедр, амбра',
    notes: [
      { name: 'Кедр', image: '/note-cedar.png' },
      { name: 'Корица', image: '/note-cinnamon.png' },
      { name: 'Слива', image: '/note-plum.png' },
    ],
  },
  {
    name: 'Instinct',
    description: 'Смелый и мощный аромат, который пробуждает природные инстинкты. Свежесть апельсина и грейпфрута сочетается с резкостью эвкалипта. Тёплые ноты лаванды, розмарина и тимьяна вдохновляют на уверенность, а мускус и кедр придают аромату силу и стойкость.\n\nВерхние ноты · апельсин, петитгрейн, эвкалипт и грейпфрут\nНоты сердца · пряные перечные ноты, лаванда, розмарин, масло тимьяна\nБазовые ноты · амбровые мускусы, кедр и пачули',
    notes: [
      { name: 'Грейпфрут', image: '/note-orange.png' },
      { name: 'Кедр', image: '/note-cedar.png' },
      { name: 'Перец', image: '/note-pepper.png' },
    ],
  },
  {
    name: 'Staying Alive',
    description: 'Аромат с нотами лимона, сандала и амбры.',
    notes: [
      { name: 'Лимон', image: '/note-lemon.png' },
      { name: 'Сандал', image: '/note-sandalwood.png' },
      { name: 'Амбра', image: '/note-amber.png' },
    ],
  },
  {
    name: 'Pomegranate',
    description: 'Аромат с нотами граната, нектарина и цветов.',
    notes: [
      { name: 'Гранат', image: '/note-pomegranate.png' },
      { name: 'Нектарин', image: '/note-nectarine.png' },
      { name: 'Цветы', image: '/note-flowers.png' },
    ],
  },
  {
    name: 'Gold Mist',
    description: 'Аромат с нотами лаванды, амбры и тонка.',
    notes: [
      { name: 'Лаванда', image: '/note-lavender.png' },
      { name: 'Амбра', image: '/note-amber.png' },
      { name: 'Тонка', image: '/note-tonka.png' },
    ],
  },
  {
    name: 'Satin Touch',
    description: 'Аромат с нотами розы, уда и ванили.',
    notes: [
      { name: 'Роза', image: '/note-rose.png' },
      { name: 'Уд', image: '/note-oud.png' },
      { name: 'Ваниль', image: '/note-vanilla.png' },
    ],
  },
  {
    name: 'By Design',
    description: 'Сочная фруктовая композиция с искристым бергамотом, розой и чёрной смородиной.',
    notes: [
      { name: 'Бергамот', image: '/note-bergamot.png' },
      { name: 'Роза', image: '/note-rose.png' },
      { name: 'Смородина', image: '/note-currant.png' },
    ],
  },
  {
    name: 'Fantasy',
    description: 'Мягкий фруктово-цветочный аромат, в котором персик встречается с жасмином и ванилью.',
    notes: [
      { name: 'Персик', image: '/note-peach.png' },
      { name: 'Жасмин', image: '/note-jasmine.png' },
      { name: 'Ваниль', image: '/note-vanilla.png' },
    ],
  },
];

function AddToCartButton({ product, aroma, quantity }: { product: Product; aroma?: string; quantity: number }) {
  const add = () => {
    if (product.price === null) return;
    const cart = readShopCart();
    const key = getCartLineKey(product.id, aroma);
    writeShopCart({ ...cart, [key]: (cart[key] ?? 0) + quantity });
    notifyCartAdded();
  };

  return <button type="button" className="shop-detail-add" onClick={add}><Plus size={15} /> Добавить</button>;
}

export function ProductDetailActions({ product }: { product: Product }) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const variantProduct = product.id === 'home-diffuser-50' || product.id === 'home-diffuser-250' || product.id === 'car-gift-set' || product.id === 'home-palm-wax-candle';
  const availableAromaOptions = product.id === 'car-gift-set'
    ? aromaOptions.filter((aroma) => aroma.name === 'Dore')
    : product.id === 'home-palm-wax-candle'
      ? aromaOptions.filter((aroma) => ['Diamond', 'Inoop', 'Instinct'].includes(aroma.name))
    : product.id === 'home-diffuser-50'
      ? aromaOptions.filter((aroma) => ['Dore', 'Ohena', 'Blue Nightingale', 'Diamond', 'Staying Alive', 'Pomegranate', 'Gold Mist', 'Satin Touch'].includes(aroma.name))
      : aromaOptions.filter((aroma) => aroma.name !== 'Ohena');
  const mainQuantity = quantities.main ?? 1;

  const changeQuantity = (key: string, amount: number) => {
    setQuantities((current) => ({ ...current, [key]: Math.max(1, (current[key] ?? 1) + amount) }));
  };

  return <>
    {variantProduct && <section className={`shop-aroma-options${product.id === 'car-gift-set' ? ' shop-aroma-options--single' : ''}`} aria-labelledby="shop-aroma-options-title">
      <div className="shop-aroma-options-heading"><p className="shop-detail-section-label" id="shop-aroma-options-title">Выберите свой аромат ({availableAromaOptions.length})</p></div>
      <div className={`shop-aroma-option-list${product.id === 'car-gift-set' ? ' shop-aroma-option-list--single' : ''}`}>
        {availableAromaOptions.map((aroma) => {
          const quantity = quantities[aroma.name] ?? 1;
          return <article className={`shop-aroma-option${product.id === 'car-gift-set' ? ' shop-aroma-option--single' : ''}`} key={aroma.name}>
            <div className={`shop-aroma-option-title${aroma.name === 'Staying Alive' ? ' shop-aroma-option-title--single-line' : ''}`}><h3>{aroma.name}</h3></div>
            <div className="shop-aroma-note-grid" aria-label={`Ноты аромата ${aroma.name}`}>
              {aroma.notes.map((note) => <div className="shop-aroma-note-tile" key={`${aroma.name}-${note.name}`}><span>{note.name}</span>{'image' in note && note.image ? <img src={note.image} alt={note.name} loading="lazy" /> : <span className="shop-aroma-note-placeholder" aria-hidden="true" />}</div>)}
            </div>
            <details className="shop-aroma-description-details"><summary><span>Описание аромата</span><ChevronDown size={15} aria-hidden="true" /></summary><p>{aroma.description}</p></details>
            <div className="shop-aroma-option-footer"><strong>{formatPrice(product.price)}</strong><div className="shop-aroma-option-actions"><div className="shop-detail-quantity" aria-label={`Количество: ${aroma.name}`}><button type="button" aria-label={`Уменьшить количество ${aroma.name}`} onClick={() => changeQuantity(aroma.name, -1)}><Minus size={12} /></button><span>{quantity}</span><button type="button" aria-label={`Увеличить количество ${aroma.name}`} onClick={() => changeQuantity(aroma.name, 1)}><Plus size={12} /></button></div><AddToCartButton product={product} aroma={aroma.name} quantity={quantity} /></div></div>
          </article>;
        })}
      </div>
    </section>}

    {!variantProduct && <div className="shop-product-detail-buy">
      <div className="shop-detail-main-price"><span>Цена</span><strong>{formatPrice(product.price)}</strong></div>
      <div className="shop-aroma-option-actions"><div className="shop-detail-quantity" aria-label="Количество основного товара"><button type="button" aria-label="Уменьшить количество товара" onClick={() => changeQuantity('main', -1)}><Minus size={12} /></button><span>{mainQuantity}</span><button type="button" aria-label="Увеличить количество товара" onClick={() => changeQuantity('main', 1)}><Plus size={12} /></button></div><AddToCartButton product={product} aroma={product.aroma} quantity={mainQuantity} /></div>
    </div>}
    <CartToast />
  </>;
}
