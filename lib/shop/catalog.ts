import { createSupabaseAdminClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { products as localProducts, type Product } from '@/app/shop/products';

export type AdminProduct = Product & { isAvailable: boolean; sortOrder: number };

type ProductRow = {
  id: string;
  product: Product;
  is_available: boolean;
  sort_order: number;
  updated_at: string;
};

function normalizeCatalogProduct(product: Product): Product {
  if (product.id === 'car-cloth') {
    const updatedCloth = localProducts.find((item) => item.id === 'car-cloth');
    const specificationsWereStoredInDescription = product.fullDescriptionSections?.some((section) => section.heading === 'Размер' || section.heading === 'Материал');
    const productSpecificationsAreMissing = (product.productSpecifications?.length ?? 0) < 2;
    if (updatedCloth && (product.name !== updatedCloth.name || specificationsWereStoredInDescription || productSpecificationsAreMissing)) {
      return { ...product, ...updatedCloth };
    }
  }
  if (product.id !== 'home-diffuser-50' && product.id !== 'car-card') return product;
  const visibleProduct = { ...product };
  delete visibleProduct.description;
  return visibleProduct;
}

export function toAdminProduct(row: ProductRow): AdminProduct {
  return { ...normalizeCatalogProduct(row.product), id: row.id, isAvailable: row.is_available, sortOrder: row.sort_order };
}

async function readProductRows() {
  if (!isSupabaseConfigured()) return null;
  const supabase = createSupabaseAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('store_products')
    .select('id, product, is_available, sort_order, updated_at')
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true });

  if (error) throw new Error(`Could not read store catalog: ${error.message}`);
  return (data ?? []) as ProductRow[];
}

export async function getStoreProducts(): Promise<Product[]> {
  const rows = await readProductRows();
  if (!rows || rows.length === 0) return localProducts;
  return rows.filter((row) => row.is_available).map((row) => normalizeCatalogProduct(row.product));
}

export async function getStoreProduct(id: string): Promise<Product | null> {
  const rows = await readProductRows();
  if (!rows || rows.length === 0) return localProducts.find((product) => product.id === id) ?? null;
  const row = rows.find((item) => item.id === id && item.is_available);
  return row ? normalizeCatalogProduct(row.product) : null;
}

export async function getAdminProductRows(): Promise<AdminProduct[]> {
  const rows = await readProductRows();
  if (!rows) throw new Error('Supabase database is not configured');
  return rows.map(toAdminProduct);
}

