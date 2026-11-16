-- Процедуры NUANCE: структура и текущие услуги.
-- Выполните один раз в Supabase SQL Editor.
create table if not exists public.services (
  id text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  category text not null check (category in ('permanent', 'lashes', 'brows', 'correction')),
  name text not null,
  subtitle text not null default '',
  duration text not null default '',
  price text not null default '',
  sort_order integer not null default 0 check (sort_order >= 0),
  is_published boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.services enable row level security;
revoke all on table public.services from anon, authenticated;
grant all on table public.services to service_role;

insert into public.services (id, category, name, subtitle, duration, price, sort_order, is_published)
values
  ('permanent-pudrovoe-napylenie-brovej', 'permanent', 'Пудровое напыление бровей', 'Эскиз и согласование с клиентом', '~1 ч 40 мин', '125 €', 0, true),
  ('permanent-kombinirovannaya-tehnika-brovej', 'permanent', 'Комбинированная техника бровей', 'Волоски + пудра. Эскиз и согласование', '~1 ч 40 мин', '125 €', 1, true),
  ('permanent-guby-akvarelnaya-tehnika', 'permanent', 'Губы — акварельная техника', 'Эскиз и согласование с клиентом', '~1 ч 40 мин', '125 €', 2, true),
  ('permanent-guby-pomadnyj-prokras', 'permanent', 'Губы — помадный прокрас', 'Эскиз и согласование с клиентом', '~1 ч 40 мин', '125 €', 3, true),
  ('permanent-strelka-s-rastushevkoj', 'permanent', 'Стрелка с растушёвкой', 'Эскиз и согласование с клиентом', '~1 ч 40 мин', '125 €', 4, true),
  ('permanent-mezhresnichka', 'permanent', 'Межресничка', 'Деликатная выразительность взгляда', '45–60 мин', '85 €', 5, true),
  ('permanent-korrekciya', 'permanent', 'Коррекция', 'Для всех процедур перманента', '1–1 ч 20 мин', '75 €', 6, true),
  ('lashes-tradicionnoe-klassika', 'lashes', 'Традиционное — классика', 'Естественный эффект', '1–1,5 ч', '40 €', 7, true),
  ('lashes-tradicionnoe-obem-3d', 'lashes', 'Традиционное — объём 3D+', 'Выразительный объём', '1 ч 30–45 мин', '45 €', 8, true),
  ('lashes-led-narashivanie-klassika', 'lashes', 'LED-наращивание — классика', 'Классический эффект с LED-технологией', '1 ч–1 ч 20 мин', '45 €', 9, true),
  ('lashes-led-narashivanie-obem', 'lashes', 'LED-наращивание — объём', 'Объёмный эффект с LED-технологией', '1 ч 20–45 мин', '50 €', 10, true),
  ('brows-arhitektura-i-oformlenie-brovej-hnoj', 'brows', 'Архитектура и оформление бровей хной', 'Подбор формы, оформление и окрашивание', '30–45 мин', '30 €', 11, true),
  ('correction-remuver', 'correction', 'Ремувер', 'Удаление или обновление перманента', '45–60 мин', '40 €', 12, true),
  ('correction-kamuflyazh-shramov', 'correction', 'Камуфляж шрамов', 'Зависит от объёма работы', 'от 45 мин', 'от 35 €', 13, true),
  ('correction-trihopigmentaciya', 'correction', 'Трихопигментация', 'Стоимость за час, зависит от объёма', 'от 45 мин', '45 €/ч', 14, true),
  ('correction-refresh', 'correction', 'Рефреш', 'Обновление спустя год-полтора', '1–1 ч 30 мин', '100 €', 15, true)
on conflict (id) do update set category = excluded.category, name = excluded.name, subtitle = excluded.subtitle, duration = excluded.duration, price = excluded.price, sort_order = excluded.sort_order, is_published = excluded.is_published, updated_at = now();
