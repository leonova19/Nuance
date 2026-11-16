import { NextResponse } from 'next/server';
import { hasSameOrigin } from '@/lib/admin/request';
import { isAdminAuthenticated } from '@/lib/admin/session';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

function toRow(value: Record<string, unknown>) {
  const id = String(value.id ?? '').trim();
  const category = String(value.category ?? '').trim();
  const name = String(value.name ?? '').trim();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) throw new Error('Идентификатор услуги должен содержать латинские буквы, цифры и дефисы.');
  if (!['permanent', 'lashes', 'brows', 'correction'].includes(category)) throw new Error('Выберите корректный раздел услуги.');
  if (!name) throw new Error('Введите название услуги.');
  const sortOrder = Number(value.sortOrder ?? 0);
  if (!Number.isInteger(sortOrder) || sortOrder < 0) throw new Error('Порядок должен быть целым неотрицательным числом.');
  return { id, category, name, subtitle: String(value.subtitle ?? ''), duration: String(value.duration ?? ''), price: String(value.price ?? ''), sort_order: sortOrder, is_published: value.isPublished !== false };
}

export async function GET() {
  if (!await isAdminAuthenticated()) return NextResponse.json({ error: 'Требуется вход.' }, { status: 401 });
  const supabase = createSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ error: 'База данных не настроена.' }, { status: 503 });
  const { data, error } = await supabase.from('services').select('id, category, name, subtitle, duration, price, sort_order, is_published').order('category').order('sort_order').order('id');
  if (error) return NextResponse.json({ error: 'Не удалось загрузить услуги. Сначала выполните SQL-схему.' }, { status: 503 });
  return NextResponse.json({ services: (data ?? []).map((row) => ({ id: row.id, category: row.category, name: row.name, subtitle: row.subtitle, duration: row.duration, price: row.price, sortOrder: row.sort_order, isPublished: row.is_published })) });
}

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) return NextResponse.json({ error: 'Запрос отклонён.' }, { status: 403 });
  if (!await isAdminAuthenticated()) return NextResponse.json({ error: 'Требуется вход.' }, { status: 401 });
  const supabase = createSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ error: 'База данных не настроена.' }, { status: 503 });
  try {
    const row = toRow(await request.json() as Record<string, unknown>);
    const { data, error } = await supabase.from('services').insert(row).select('id, category, name, subtitle, duration, price, sort_order, is_published').single();
    if (error) return NextResponse.json({ error: error.code === '23505' ? 'Услуга с таким идентификатором уже существует.' : error.message }, { status: 400 });
    return NextResponse.json({ service: { ...data, sortOrder: data.sort_order, isPublished: data.is_published } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Некорректные данные.' }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  if (!hasSameOrigin(request)) return NextResponse.json({ error: 'Запрос отклонён.' }, { status: 403 });
  if (!await isAdminAuthenticated()) return NextResponse.json({ error: 'Требуется вход.' }, { status: 401 });
  const supabase = createSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ error: 'База данных не настроена.' }, { status: 503 });
  try {
    const rows = (await request.json() as { services?: Record<string, unknown>[] }).services ?? [];
    if (!rows.length) return NextResponse.json({ error: 'Нет услуг для импорта.' }, { status: 400 });
    const { error } = await supabase.from('services').upsert(rows.map(toRow), { onConflict: 'id' });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ imported: rows.length });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Не удалось импортировать услуги.' }, { status: 400 });
  }
}
