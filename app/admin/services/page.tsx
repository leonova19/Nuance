'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { ArrowLeft, Check, LoaderCircle, LogOut, Pencil, Plus, Trash2, X } from 'lucide-react';
import { defaultServices, serviceGroups, type ServiceCategory, type ServiceItem } from '@/lib/services/catalog';

type Draft = Omit<ServiceItem, 'sortOrder' | 'isPublished'> & { sortOrder: string; isPublished: boolean };
const emptyDraft: Draft = { id: '', category: 'permanent', name: '', subtitle: '', duration: '', price: '', sortOrder: '0', isPublished: true };

async function readJson<T>(response: Response): Promise<T> {
  const body = await response.json() as T & { error?: string };
  if (!response.ok) throw new Error(body.error || 'Не удалось выполнить запрос.');
  return body;
}

function slugify(value: string) {
  const transliteration: Record<string, string> = { а:'a', б:'b', в:'v', г:'g', д:'d', е:'e', ё:'e', ж:'zh', з:'z', и:'i', й:'y', к:'k', л:'l', м:'m', н:'n', о:'o', п:'p', р:'r', с:'s', т:'t', у:'u', ф:'f', х:'h', ц:'ts', ч:'ch', ш:'sh', щ:'shch', ъ:'', ы:'y', ь:'', э:'e', ю:'yu', я:'ya' };
  return Array.from(value.toLowerCase()).map((char) => transliteration[char] ?? char).join('').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function AdminServicesPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState('');
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadServices = useCallback(async () => {
    try { setServices((await readJson<{ services: ServiceItem[] }>(await fetch('/api/admin/services', { cache: 'no-store' }))).services); setError(''); }
    catch (loadError) { setError(loadError instanceof Error ? loadError.message : 'Не удалось загрузить услуги.'); }
  }, []);

  useEffect(() => { void (async () => { try { const result = await readJson<{ authenticated: boolean }>(await fetch('/api/admin/session', { cache: 'no-store' })); setAuthenticated(result.authenticated); if (result.authenticated) await loadServices(); } catch { setError('Не удалось проверить подключение к панели.'); } finally { setChecking(false); } })(); }, [loadServices]);

  const login = async (event: FormEvent) => { event.preventDefault(); setBusy(true); setError(''); try { await readJson(await fetch('/api/admin/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })); setAuthenticated(true); setPassword(''); await loadServices(); } catch (loginError) { setError(loginError instanceof Error ? loginError.message : 'Не удалось войти.'); } finally { setBusy(false); } };
  const logout = async () => { await fetch('/api/admin/session', { method: 'DELETE' }); setAuthenticated(false); setServices([]); };
  const startNew = (category: ServiceCategory) => { setEditingId(null); setDraft({ ...emptyDraft, category, sortOrder: String(services.filter((item) => item.category === category).length) }); setMessage(''); setError(''); };
  const startEdit = (service: ServiceItem) => { setEditingId(service.id); setDraft({ ...service, sortOrder: String(service.sortOrder) }); setMessage(''); setError(''); };
  const update = (key: keyof Draft, value: string | boolean) => setDraft((current) => { if (!current) return current; const next = { ...current, [key]: value }; if (key === 'name' && !editingId && (!current.id || current.id === slugify(current.name))) next.id = slugify(value as string); return next; });
  const save = async (event: FormEvent) => { event.preventDefault(); if (!draft) return; setBusy(true); setError(''); setMessage(''); const payload = { ...draft, sortOrder: Number(draft.sortOrder) }; try { await readJson(await fetch(editingId ? `/api/admin/services/${encodeURIComponent(editingId)}` : '/api/admin/services', { method: editingId ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })); setDraft(null); setMessage(editingId ? 'Услуга сохранена.' : 'Услуга добавлена.'); await loadServices(); } catch (saveError) { setError(saveError instanceof Error ? saveError.message : 'Не удалось сохранить услугу.'); } finally { setBusy(false); } };
  const remove = async (service: ServiceItem) => { if (!window.confirm(`Удалить услугу «${service.name}»?`)) return; setBusy(true); setError(''); try { await readJson(await fetch(`/api/admin/services/${encodeURIComponent(service.id)}`, { method: 'DELETE' })); await loadServices(); } catch (removeError) { setError(removeError instanceof Error ? removeError.message : 'Не удалось удалить услугу.'); } finally { setBusy(false); } };
  const seed = async () => { setBusy(true); setError(''); try { const result = await readJson<{ imported: number }>(await fetch('/api/admin/services', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ services: defaultServices }) })); setMessage(`Добавлено услуг: ${result.imported}.`); await loadServices(); } catch (seedError) { setError(seedError instanceof Error ? seedError.message : 'Не удалось добавить услуги.'); } finally { setBusy(false); } };

  if (checking) return <main className="admin-page"><div className="admin-loading"><LoaderCircle size={22} className="admin-spinner" /> Проверяем доступ…</div></main>;
  if (!authenticated) return <main className="admin-page"><section className="admin-login-card"><Link href="/admin" className="admin-back-link"><ArrowLeft size={15} /> Назад в админку</Link><h1>Услуги</h1><form className="admin-form" onSubmit={login}><label>Пароль<input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>{error && <p className="admin-error">{error}</p>}<button className="admin-primary-button" type="submit" disabled={busy}>{busy ? 'Входим…' : 'Войти'}</button></form></section></main>;

  return <main className="admin-page"><div className="admin-shell admin-services-shell"><header className="admin-header"><div><p className="shop-page-eyebrow">Каталог процедур</p><h1>Услуги</h1><p className="admin-muted">Добавляйте и редактируйте процедуры, которые отображаются на странице услуг.</p></div><div className="admin-header-actions"><Link href="/admin" className="admin-secondary-button"><ArrowLeft size={15} /> Товары</Link><button type="button" className="admin-secondary-button" onClick={logout}><LogOut size={15} /> Выйти</button></div></header>{error && <p className="admin-notice admin-notice--error" role="alert">{error}</p>}{message && <output className="admin-notice"><Check size={16} /> {message}</output>}
    {draft && <section className="admin-editor"><div className="admin-editor-heading"><div><p className="shop-page-eyebrow">{editingId ? 'Редактирование' : 'Новая процедура'}</p><h2>{editingId ? draft.name : 'Добавить процедуру'}</h2></div><button type="button" className="admin-icon-button" onClick={() => setDraft(null)} aria-label="Закрыть форму"><X size={18} /></button></div><form className="admin-form admin-product-form" onSubmit={save}><label className="admin-form-wide">Название процедуры<input required value={draft.name} onChange={(event) => update('name', event.target.value)} /></label><label className="admin-form-wide">Раздел<select value={draft.category} onChange={(event) => update('category', event.target.value as ServiceCategory)}>{serviceGroups.map((group) => <option key={group.id} value={group.id}>{group.tab}</option>)}</select></label><label className="admin-form-wide">Подзаголовок<input value={draft.subtitle} onChange={(event) => update('subtitle', event.target.value)} /></label><label>Время<input value={draft.duration} onChange={(event) => update('duration', event.target.value)} placeholder="Например, 1 ч 40 мин" /></label><label>Цена<input value={draft.price} onChange={(event) => update('price', event.target.value)} placeholder="Например, 125 €" /></label><label className="admin-checkbox admin-form-wide"><input type="checkbox" checked={draft.isPublished} onChange={(event) => update('isPublished', event.target.checked)} /><span>Показывать процедуру на сайте</span></label><div className="admin-form-actions admin-form-wide"><button className="admin-primary-button" type="submit" disabled={busy}>{busy ? 'Сохраняем…' : 'Сохранить процедуру'}</button><button className="admin-secondary-button" type="button" onClick={() => setDraft(null)}>Отмена</button></div></form></section>}
    {services.length === 0 ? <section className="admin-empty"><h2>Услуги ещё не добавлены</h2><p>Добавьте в базу все процедуры, которые уже есть на сайте.</p><button type="button" className="admin-primary-button" onClick={seed} disabled={busy}>{busy ? 'Добавляем…' : 'Добавить текущие процедуры'}</button></section> : serviceGroups.map((group) => { const items = services.filter((service) => service.category === group.id).sort((a, b) => a.sortOrder - b.sortOrder); return <section className="admin-service-section" key={group.id}><div className="admin-list-heading"><div><p className="shop-page-eyebrow">Раздел</p><h2>{group.tab}</h2></div><button type="button" className="admin-primary-button" onClick={() => startNew(group.id)}><Plus size={16} /> Добавить процедуру</button></div>{items.length === 0 ? <p className="admin-muted">В этом разделе пока нет процедур.</p> : <div className="admin-service-list">{items.map((service) => <article className={`admin-service-row${service.isPublished ? '' : ' is-unavailable'}`} key={service.id}><div className="admin-service-copy"><p>{service.subtitle || 'Без подзаголовка'}</p><h3>{service.name}</h3><span>{service.duration || 'Время не указано'} · {service.price || 'Цена не указана'} · порядок {service.sortOrder}</span></div><span className="admin-stock-status">{service.isPublished ? 'Опубликована' : 'Скрыта'}</span><div className="admin-product-actions"><button type="button" className="admin-secondary-button" onClick={() => startEdit(service)}><Pencil size={14} /> Изменить</button><button type="button" className="admin-delete-button" onClick={() => remove(service)} disabled={busy}><Trash2 size={14} /> Удалить</button></div></article>)}</div>}</section>; })}</div></main>;
}
