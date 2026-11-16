import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin/session';
import { hasSameOrigin } from '@/lib/admin/request';
import { products } from '@/app/shop/products';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) return NextResponse.json({ error: 'Запрос отклонён.' }, { status: 403 });
  if (!await isAdminAuthenticated()) return NextResponse.json({ error: 'Требуется вход.' }, { status: 401 });

  const supabase = createSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ error: 'База данных не настроена.' }, { status: 503 });

  const { data: existing, error: readError } = await supabase.from('store_products').select('id').limit(1);
  if (readError) return NextResponse.json({ error: 'Не удалось прочитать каталог. Проверьте SQL-схему.' }, { status: 503 });
  if (existing?.length) return NextResponse.json({ error: 'В базе уже есть товары. Импорт доступен только в пустой каталог.' }, { status: 409 });

  const rows = products.map((product, index) => ({ id: product.id, product, is_available: true, sort_order: index }));
  const { error } = await supabase.from('store_products').insert(rows);
  if (error) return NextResponse.json({ error: 'Не удалось импортировать исходный каталог.' }, { status: 500 });
  return NextResponse.json({ imported: rows.length });
}

