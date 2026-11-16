import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin/session';
import { hasSameOrigin } from '@/lib/admin/request';
import { parseProductMutation } from '@/lib/admin/product-input';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import type { Product } from '@/app/shop/products';

export const runtime = 'nodejs';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!hasSameOrigin(request)) return NextResponse.json({ error: 'Запрос отклонён.' }, { status: 403 });
  if (!await isAdminAuthenticated()) return NextResponse.json({ error: 'Требуется вход.' }, { status: 401 });

  try {
    const { id } = await params;
    const supabase = createSupabaseAdminClient();
    if (!supabase) return NextResponse.json({ error: 'База данных не настроена.' }, { status: 503 });

    const { data: existing, error: readError } = await supabase.from('store_products').select('product, is_available, sort_order').eq('id', id).maybeSingle();
    if (readError || !existing) return NextResponse.json({ error: 'Товар не найден.' }, { status: 404 });

    const body: unknown = await request.json();
    const mutation = parseProductMutation(body, existing.product as Product);
    const update = {
      product: { ...mutation.product, id },
      is_available: mutation.isAvailable ?? existing.is_available,
      sort_order: mutation.sortOrder ?? existing.sort_order,
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase.from('store_products').update(update).eq('id', id).select('id, product, is_available, sort_order, updated_at').single();
    if (error) return NextResponse.json({ error: 'Не удалось обновить товар.' }, { status: 500 });

    return NextResponse.json({ product: { ...data.product, id: data.id, isAvailable: data.is_available, sortOrder: data.sort_order } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Проверьте заполнение полей.' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!hasSameOrigin(request)) return NextResponse.json({ error: 'Запрос отклонён.' }, { status: 403 });
  if (!await isAdminAuthenticated()) return NextResponse.json({ error: 'Требуется вход.' }, { status: 401 });

  try {
    const { id } = await params;
    const supabase = createSupabaseAdminClient();
    if (!supabase) return NextResponse.json({ error: 'База данных не настроена.' }, { status: 503 });

    const { data, error } = await supabase.from('store_products').delete().eq('id', id).select('id').maybeSingle();
    if (error) return NextResponse.json({ error: 'Не удалось удалить товар.' }, { status: 500 });
    if (!data) return NextResponse.json({ error: 'Товар не найден.' }, { status: 404 });

    return NextResponse.json({ deleted: true });
  } catch {
    return NextResponse.json({ error: 'Не удалось удалить товар.' }, { status: 500 });
  }
}

