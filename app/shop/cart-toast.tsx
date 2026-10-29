'use client';

import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SHOP_CART_TOAST_EVENT } from './cart';

export function CartToast() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timeout: number | undefined;
    const showToast = () => {
      setVisible(true);
      if (timeout) window.clearTimeout(timeout);
      timeout = window.setTimeout(() => setVisible(false), 3000);
    };

    window.addEventListener(SHOP_CART_TOAST_EVENT, showToast);
    return () => {
      window.removeEventListener(SHOP_CART_TOAST_EVENT, showToast);
      if (timeout) window.clearTimeout(timeout);
    };
  }, []);

  if (!visible) return null;
  return <div className="shop-cart-toast" role="status" aria-live="polite"><Check size={15} aria-hidden="true" />Товар добавлен в корзину</div>;
}
