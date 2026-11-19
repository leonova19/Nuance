'use client';

import { ChevronDown, ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { formatPrice, type Product } from './products';
import { getCartLineKey, notifyCartAdded, readShopCart, writeShopCart } from './cart';
import { CartToast } from './cart-toast';
import { aromaOptions, getProductAromaNames } from './aromas';

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
  const [activeAromaIndex, setActiveAromaIndex] = useState(0);
  const availableAromaOptions = aromaOptions.filter((aroma) => getProductAromaNames(product.id, product.aromas).includes(aroma.name));
  const variantProduct = availableAromaOptions.length > 0;
  const mainQuantity = quantities.main ?? 1;
  const activeAroma = availableAromaOptions[activeAromaIndex];

  const changeQuantity = (key: string, amount: number) => {
    setQuantities((current) => ({ ...current, [key]: Math.max(1, (current[key] ?? 1) + amount) }));
  };

  return <>
    {variantProduct && <section className={`shop-aroma-options${product.id === 'car-gift-set' || product.id === 'diffuser-candle-set' ? ' shop-aroma-options--single' : ''}`} aria-labelledby="shop-aroma-options-title">
      <div className="shop-aroma-options-heading"><p className="shop-detail-section-label" id="shop-aroma-options-title">Выберите свой аромат ({availableAromaOptions.length})</p></div>
      <div className="shop-aroma-carousel">
        {activeAroma && (() => {
          const aroma = activeAroma;
          const quantity = quantities[aroma.name] ?? 1;
          return <article className={`shop-aroma-option${product.id === 'car-gift-set' || product.id === 'diffuser-candle-set' ? ' shop-aroma-option--single' : ''}`} key={aroma.name}>
            <div className="shop-aroma-option-title"><h3>{aroma.name}</h3></div>
            {aroma.notes.length > 0 && <div className="shop-aroma-note-grid" aria-label={`Ноты аромата ${aroma.name}`}>
              {aroma.notes.map((note) => <div className="shop-aroma-note-tile" key={`${aroma.name}-${note.name}`}><span>{note.name}</span>{'image' in note && note.image ? <img src={note.image} alt={note.name} loading="lazy" /> : <span className="shop-aroma-note-placeholder" aria-hidden="true" />}</div>)}
            </div>}
            {aroma.description && <details className="shop-aroma-description-details"><summary><span>Описание аромата</span><ChevronDown size={15} aria-hidden="true" /></summary><p>{aroma.description}</p></details>}
            <div className="shop-aroma-option-footer"><strong className="site-price">{formatPrice(product.price)}</strong><div className="shop-aroma-option-actions"><div className="shop-detail-quantity" aria-label={`Количество: ${aroma.name}`}><button type="button" aria-label={`Уменьшить количество ${aroma.name}`} onClick={() => changeQuantity(aroma.name, -1)}><Minus size={12} /></button><span>{quantity}</span><button type="button" aria-label={`Увеличить количество ${aroma.name}`} onClick={() => changeQuantity(aroma.name, 1)}><Plus size={12} /></button></div><AddToCartButton product={product} aroma={aroma.name} quantity={quantity} /></div></div>
          </article>;
        })()}
        {availableAromaOptions.length > 1 && <div className="shop-aroma-carousel-controls">
          <button type="button" aria-label="Предыдущий аромат" disabled={activeAromaIndex === 0} onClick={() => setActiveAromaIndex((index) => Math.max(0, index - 1))}><ChevronLeft size={18} /></button>
          <span>{activeAromaIndex + 1} / {availableAromaOptions.length}</span>
          <button type="button" aria-label="Следующий аромат" disabled={activeAromaIndex === availableAromaOptions.length - 1} onClick={() => setActiveAromaIndex((index) => Math.min(availableAromaOptions.length - 1, index + 1))}><ChevronRight size={18} /></button>
        </div>}
      </div>
    </section>}

    {!variantProduct && <div className="shop-product-detail-buy">
      <div className="shop-detail-main-price"><span>Цена</span><strong className="site-price">{formatPrice(product.price)}</strong></div>
      <div className="shop-aroma-option-actions"><div className="shop-detail-quantity" aria-label="Количество основного товара"><button type="button" aria-label="Уменьшить количество товара" onClick={() => changeQuantity('main', -1)}><Minus size={12} /></button><span>{mainQuantity}</span><button type="button" aria-label="Увеличить количество товара" onClick={() => changeQuantity('main', 1)}><Plus size={12} /></button></div><AddToCartButton product={product} aroma={product.aroma} quantity={mainQuantity} /></div>
    </div>}
    <CartToast />
  </>;
}
