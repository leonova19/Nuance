import { createSupabaseAdminClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { defaultServices, serviceRowsToGroups, type ServiceItem } from './catalog';

type ServiceRow = Omit<ServiceItem, 'sortOrder' | 'isPublished'> & { sort_order: number; is_published: boolean; updated_at: string };

async function readRows() {
  if (!isSupabaseConfigured()) return null;
  const supabase = createSupabaseAdminClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from('services').select('id, category, name, subtitle, duration, price, sort_order, is_published, updated_at').order('sort_order', { ascending: true }).order('id', { ascending: true });
  if (error) throw new Error(`Не удалось прочитать услуги: ${error.message}`);
  return (data ?? []).map((row) => {
    const item = row as ServiceRow;
    const legacyDurations: Record<string, string> = {
      '~1 ч 40 мин': '1 час 40 минут',
      '45–60 мин': '~60 минут',
      '1–1 ч 20 мин': '~1 час 20 минут',
      '1–1,5 ч': '~1 час 30 минут',
      '1 ч 30–45 мин': '~1 час 45 минут',
      '1 ч–1 ч 20 мин': '~1 час 20 минут',
      '1 ч 20–45 мин': '~1 час 45 минут',
      '30–45 мин': '~45 минут',
      '45 мин': '~45 минут',
      '1–1 ч 30 мин': '~1 час 30 минут',
    };
    return { id: item.id, category: item.category, name: item.name.replaceAll('—', '-'), subtitle: item.subtitle, duration: legacyDurations[item.duration] ?? item.duration, price: item.price, sortOrder: item.sort_order, isPublished: item.is_published } as ServiceItem;
  });
}

export async function getServiceItems() {
  let rows: ServiceItem[] | null = null;
  try { rows = await readRows(); } catch { rows = null; }
  return rows && rows.length > 0 ? rows : defaultServices;
}

export async function getServiceGroups() {
  return serviceRowsToGroups(await getServiceItems());
}

export async function getAdminServiceItems() {
  const rows = await readRows();
  if (!rows) throw new Error('Supabase database не настроена');
  return rows;
}

export { defaultServices };
