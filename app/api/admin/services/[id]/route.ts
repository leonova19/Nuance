import { NextResponse } from 'next/server';
import { hasSameOrigin } from '@/lib/admin/request';
import { isAdminAuthenticated } from '@/lib/admin/session';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!hasSameOrigin(request)) return NextResponse.json({ error: 'Запрос отклонён.' }, { status: 403 });
  if (!await isAdminAuthenticated()) return NextResponse.json({ error: 'Требуется вход.' }, { status: 401 });
  const supabase = createSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ error: 'База данных не настроена.' }, { status: 503 });
  const id = (await context.params).id;
  const value = await request.json() as Record<string, unknown>;
  const update = { category: value.category, name: value.name, subtitle: value.subtitle ?? '', duration: value.duration ?? '', price: value.price ?? '', sort_order: value.sortOrder ?? 0, is_published: value.isPublished !== false, updated_at: new Date().toISOString() };
  const { data, error } = await supabase.from('services').update(update).eq('id', id).select('id, category, name, subtitle, duration, price, sort_order, is_published').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ service: { ...data, sortOrder: data.sort_order, isPublished: data.is_published } });
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!hasSameOrigin(request)) return NextResponse.json({ error: 'Запрос отклонён.' }, { status: 403 });
  if (!await isAdminAuthenticated()) return NextResponse.json({ error: 'Требуется вход.' }, { status: 401 });
  const supabase = createSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ error: 'База данных не настроена.' }, { status: 503 });
  const { error } = await supabase.from('services').delete().eq('id', (await context.params).id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ deleted: true });
}
