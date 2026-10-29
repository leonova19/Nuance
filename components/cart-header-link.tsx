'use client';

import { ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { readShopCart, SHOP_CART_EVENT } from '@/app/shop/cart';

export function CartHeaderLink() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sync = () => setCount(Object.values(readShopCart()).reduce((sum, quantity) => sum + quantity, 0));
    sync();
    window.addEventListener('storage', sync);
    window.addEventListener(SHOP_CART_EVENT, sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener(SHOP_CART_EVENT, sync);
    };
  }, []);

  return <a className="bag-link" href="/shop/cart" aria-label={`Корзина: ${count} товаров`}><ShoppingBag size={18} strokeWidth={1.5}/><span>{count}</span></a>;
}
