export type ShopCart = Record<string, number>;

export const SHOP_CART_STORAGE_KEY = 'nuance-shop-cart';
export const SHOP_CART_EVENT = 'nuance-shop-cart-updated';
export const SHOP_CART_TOAST_EVENT = 'nuance-shop-cart-toast';

export function notifyCartAdded() {
  window.dispatchEvent(new Event(SHOP_CART_TOAST_EVENT));
}

export function getCartLineKey(productId: string, aroma?: string) {
  return aroma ? `${productId}::${aroma}` : productId;
}

export function readShopCart(): ShopCart {
  try {
    const stored = localStorage.getItem(SHOP_CART_STORAGE_KEY);
    const parsed: unknown = stored ? JSON.parse(stored) : {};
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return Object.fromEntries(Object.entries(parsed).filter(([, value]) => Number.isInteger(value) && Number(value) > 0)) as ShopCart;
  } catch {
    return {};
  }
}

export function writeShopCart(cart: ShopCart) {
  localStorage.setItem(SHOP_CART_STORAGE_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event(SHOP_CART_EVENT));
}
