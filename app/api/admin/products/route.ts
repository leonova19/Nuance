import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin/session';
import { hasSameOrigin } from '@/lib/admin/request';
import { parseProductMutation } from '@/lib/admin/product-input';
import { getAdminProductRows } from '@/lib/shop/catalog';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function GET() {
  if (!await isAdminAuthenticated()) return NextResponse.json({ error: 'Требуется вход.' }, { status: 401 });
  try {
    return NextResponse.json({ products: await getAdminProductRows() }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'Не удалось загрузить товары. Проверьте подключение и таблицу базы данных.' }, { status: 503 });
  }
}

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) return NextResponse.json({ error: 'Запрос отклонён.' }, { status: 403 });
  if (!await isAdminAuthenticated()) return NextResponse.json({ error: 'Требуется вход.' }, { status: 401 });

  try {
    const supabase = createSupabaseAdminClient();
    if (!supabase) return NextResponse.json({ error: 'База данных не настроена.' }, { status: 503 });
    const body: unknown = await request.json();
    const mutation = parseProductMutation(body);
    if (!mutation.product) return NextResponse.json({ error: 'Не заполнены данные товара.' }, { status: 400 });

    const { data, error } = await supabase.from('store_products').insert({
      id: mutation.product.id,
      product: mutation.product,
      is_available: mutation.isAvailable ?? true,
      sort_order: mutation.sortOrder ?? 100,
    }).select('id, product, is_available, sort_order, updated_at').single();

    if (error) return NextResponse.json({ error: error.code === '23505' ? 'Товар с таким адресом уже есть.' : 'Не удалось сохранить товар.' }, { status: error.code === '23505' ? 409 : 500 });
    return NextResponse.json({ product: { ...data.product, id: data.id, isAvailable: data.is_available, sortOrder: data.sort_order } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Проверьте заполнение полей.' }, { status: 400 });
  }
}

