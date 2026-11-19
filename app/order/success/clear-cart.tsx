'use client';

import { useEffect } from 'react';
import { SHOP_CART_STORAGE_KEY, writeShopCart } from '@/app/shop/cart';

export function ClearCartAfterPayment({ paid }: { paid: boolean }) {
  useEffect(() => {
    if (!paid) return;
    localStorage.removeItem(SHOP_CART_STORAGE_KEY);
    writeShopCart({});
  }, [paid]);
  return null;
}
