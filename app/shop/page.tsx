import { ShopCatalog } from './catalog-client';
import { getStoreProducts } from '@/lib/shop/catalog';

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const products = await getStoreProducts();
  return <ShopCatalog products={products} />;
}
