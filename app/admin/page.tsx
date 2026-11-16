'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState, type ComponentProps } from 'react';
import { ArrowLeft, Check, LoaderCircle, LogOut, PackagePlus, Pencil, Plus, Trash2, X } from 'lucide-react';
import type { Product } from '@/app/shop/products';
import type { AdminProduct } from '@/lib/shop/catalog';

type Draft = {
  id: string;
  category: Product['category'];
  label: string;
  name: string;
  price: string;
  image: string;
  description: string;
  fullDescription: string;
  volume: string;
  aroma: string;
  composition: string;
  usage: string;
};

type FormSubmitEvent = Parameters<NonNullable<ComponentProps<'form'>['onSubmit']>>[0];

const blankDraft: Draft = {
  id: '', category: 'home', label: 'Для дома', name: '', price: '', image: '',
  description: '', fullDescription: '', volume: '', aroma: '', composition: '', usage: '',
};

const categoryOptions: { value: Product['category']; label: string }[] = [
  { value: 'home', label: 'Для дома' },
  { value: 'car', label: 'Для автомобиля' },
  { value: 'fragrance', label: 'Парфюмерия' },
  { value: 'gifts', label: 'Подарочные наборы' },
  { value: 'care', label: 'Уход' },
];

const transliteration: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
};

function slugify(value: string) {
  return Array.from(value.toLowerCase()).map((character) => transliteration[character] ?? character).join('').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
}

function draftFromProduct(product: AdminProduct): Draft {
  return {
    id: product.id,
    category: product.category,
    label: product.label,
    name: product.name,
    price: product.price === null ? '' : String(product.price),
    image: product.image,
    description: product.description ?? '',
    fullDescription: product.fullDescription ?? '',
    volume: product.volume ?? '',
    aroma: product.aroma ?? '',
    composition: product.composition ?? '',
    usage: product.usage ?? '',
  };
}

async function readJson<T>(response: Response): Promise<T> {
  const body = await response.json() as T & { error?: string };
  if (!response.ok) throw new Error(body.error || 'Не удалось выполнить запрос.');
  return body;
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [saving, setSaving] = useState(false);
  const [busyProductId, setBusyProductId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [draft, setDraft] = useState<Draft | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [priceError, setPriceError] = useState('');

  const loadProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const result = await readJson<{ products: AdminProduct[] }>(await fetch('/api/admin/products', { cache: 'no-store' }));
      setProducts(result.products);
      setError('');
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Не удалось загрузить товары.');
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const session = await readJson<{ authenticated: boolean }>(await fetch('/api/admin/session', { cache: 'no-store' }));
        if (cancelled) return;
        setAuthenticated(session.authenticated);
        if (session.authenticated) await loadProducts();
      } catch {
        if (!cancelled) setError('Не удалось проверить подключение к панели.');
      } finally {
        if (!cancelled) setCheckingSession(false);
      }
    })();
    return () => { cancelled = true; };
  }, [loadProducts]);

  const logIn = async (event: FormSubmitEvent) => {
    event.preventDefault();
    setError('');
    setSaving(true);
    try {
      await readJson(await fetch('/api/admin/session', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }),
      }));
      setAuthenticated(true);
      setPassword('');
      await loadProducts();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Не удалось выполнить вход.');
    } finally {
      setSaving(false);
    }
  };

  const logOut = async () => {
    await fetch('/api/admin/session', { method: 'DELETE' });
    setAuthenticated(false);
    setProducts([]);
    setDraft(null);
  };

  const startNewProduct = () => {
    setEditingId(null);
    setDraft(blankDraft);
    setIsAvailable(true);
    setPriceError('');
    setError('');
  };

  const startEditProduct = (product: AdminProduct) => {
    setEditingId(product.id);
    setDraft(draftFromProduct(product));
    setIsAvailable(product.isAvailable);
    setPriceError('');
    setError('');
  };

  const saveProduct = async (event: FormSubmitEvent) => {
    event.preventDefault();
    if (!draft) return;
    setSaving(true);
    setError('');
    setMessage('');
    setPriceError('');

    const price = draft.price.trim() === '' ? null : Number(draft.price.replace(',', '.'));
    if (price !== null && (!Number.isFinite(price) || price < 0)) {
      setPriceError('Введите цену числом, например 16 или 16,50.');
      setSaving(false);
      return;
    }

    const product = {
      ...draft,
      id: editingId ?? slugify(draft.id || draft.name),
      price,
      imageClass: 'shop-product-image--tall shop-product-image--blend-background',
    };

    try {
      await readJson(await fetch(editingId ? `/api/admin/products/${encodeURIComponent(editingId)}` : '/api/admin/products', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, isAvailable }),
      }));
      setDraft(null);
      setMessage(editingId ? 'Изменения товара сохранены.' : 'Товар добавлен.');
      await loadProducts();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Не удалось сохранить товар.');
    } finally {
      setSaving(false);
    }
  };

  const toggleAvailability = async (product: AdminProduct) => {
    setBusyProductId(product.id);
    setError('');
    setMessage('');
    try {
      await readJson(await fetch(`/api/admin/products/${encodeURIComponent(product.id)}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isAvailable: !product.isAvailable }),
      }));
      await loadProducts();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Не удалось изменить наличие.');
    } finally {
      setBusyProductId(null);
    }
  };

  const deleteProduct = async (product: AdminProduct) => {
    const confirmed = window.confirm(`Удалить товар «${product.name}»? Он будет удалён из базы и магазина. Восстановить его автоматически нельзя.`);
    if (!confirmed) return;

    setBusyProductId(product.id);
    setError('');
    setMessage('');
    try {
      await readJson(await fetch(`/api/admin/products/${encodeURIComponent(product.id)}`, { method: 'DELETE' }));
      await loadProducts();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Не удалось удалить товар.');
    } finally {
      setBusyProductId(null);
    }
  };

  const seedCatalog = async () => {
    setSaving(true);
    setError('');
    try {
      const result = await readJson<{ imported: number }>(await fetch('/api/admin/seed', { method: 'POST' }));
      setMessage(`В базу импортировано товаров: ${result.imported}.`);
      await loadProducts();
    } catch (seedError) {
      setError(seedError instanceof Error ? seedError.message : 'Не удалось импортировать каталог.');
    } finally {
      setSaving(false);
    }
  };

  const updateDraft = (key: keyof Draft, value: string) => {
    setDraft((current) => {
      if (!current) return current;
      const next = { ...current, [key]: value };
      if (key === 'category' && value !== current.category) {
        next.label = categoryOptions.find((option) => option.value === value)?.label ?? value;
      }
      if (!editingId && key === 'name' && (!current.id.trim() || current.id === slugify(current.name))) next.id = slugify(value);
      return next;
    });
  };

  if (checkingSession) return <main className="admin-page"><div className="admin-loading"><LoaderCircle size={22} className="admin-spinner" /> Проверяем доступ…</div></main>;

  if (!authenticated) return <main className="admin-page">
    <section className="admin-login-card">
      <Link href="/shop" className="admin-back-link"><ArrowLeft size={15} /> Вернуться в магазин</Link>
      <h1>Панель управления</h1>
      <form className="admin-form" onSubmit={logIn}>
        <label>Пароль<input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        {error && <p className="admin-error" role="alert">{error}</p>}
        <button className="admin-primary-button" type="submit" disabled={saving}>{saving ? <LoaderCircle size={16} className="admin-spinner" /> : null} Войти</button>
      </form>
    </section>
  </main>;

  return <main className="admin-page">
    <div className="admin-shell">
      <header className="admin-header">
        <div><h1>Товары</h1></div>
        <div className="admin-header-actions"><Link href="/admin/services" className="admin-secondary-button">Услуги</Link><Link href="/shop" className="admin-secondary-button"><ArrowLeft size={15} /> В магазин</Link><button type="button" className="admin-secondary-button" onClick={logOut}><LogOut size={15} /> Выйти</button></div>
      </header>

      {error && <p className="admin-notice admin-notice--error" role="alert">{error}</p>}
      {message && <output className="admin-notice"><Check size={16} /> {message}</output>}

      {draft && <section className="admin-editor">
        <div className="admin-editor-heading"><div><p className="shop-page-eyebrow">{editingId ? 'Редактирование' : 'Новый товар'}</p><h2>{editingId ? draft.name : 'Добавить товар'}</h2></div><button type="button" className="admin-icon-button" aria-label="Закрыть форму" onClick={() => setDraft(null)}><X size={18} /></button></div>
        <form className="admin-form admin-product-form" onSubmit={saveProduct}>
          <label>Название<input required maxLength={160} value={draft.name} onChange={(event) => updateDraft('name', event.target.value)} /></label>
          <label>Адрес товара (slug)<input required pattern="[a-z0-9]+(-[a-z0-9]+)*" disabled={Boolean(editingId)} value={editingId ?? draft.id} onChange={(event) => updateDraft('id', event.target.value)} placeholder="novyy-tovar" /><small>Латинские буквы, цифры и дефисы; используется в адресе страницы.</small></label>
          <label>Раздел магазина<select value={draft.category} onChange={(event) => updateDraft('category', event.target.value as Product['category'])}>{categoryOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
          <label>Подпись над названием<input required maxLength={80} value={draft.label} onChange={(event) => updateDraft('label', event.target.value)} /></label>
          <label>Цена, €<input inputMode="decimal" value={draft.price} onChange={(event) => updateDraft('price', event.target.value)} placeholder="Например, 23" aria-invalid={Boolean(priceError)} />{priceError && <small className="admin-error">{priceError}</small>}</label>
          <label>Изображение: путь или HTTPS-ссылка<input required value={draft.image} onChange={(event) => updateDraft('image', event.target.value)} placeholder="/shop-product.png" /><small>Для файлов сайта укажите путь из public, например /shop-product.png.</small></label>
          <label className="admin-form-wide">Краткое описание<textarea rows={3} value={draft.description} onChange={(event) => updateDraft('description', event.target.value)} /></label>
          <label className="admin-form-wide">Полное описание<textarea rows={4} value={draft.fullDescription} onChange={(event) => updateDraft('fullDescription', event.target.value)} /></label>
          <label>Объём<input value={draft.volume} onChange={(event) => updateDraft('volume', event.target.value)} placeholder="Например, 100 мл" /></label>
          <label>Фиксированный аромат<input value={draft.aroma} onChange={(event) => updateDraft('aroma', event.target.value)} /></label>
          <label className="admin-form-wide">Состав<textarea rows={3} value={draft.composition} onChange={(event) => updateDraft('composition', event.target.value)} /></label>
          <label className="admin-form-wide">Как использовать<textarea rows={3} value={draft.usage} onChange={(event) => updateDraft('usage', event.target.value)} /></label>
          <label className="admin-checkbox admin-form-wide"><input type="checkbox" checked={isAvailable} onChange={(event) => setIsAvailable(event.target.checked)} /><span>Товар в наличии и показывается на сайте</span></label>
          <div className="admin-form-actions admin-form-wide"><button className="admin-primary-button" type="submit" disabled={saving}>{saving ? 'Сохраняем…' : 'Сохранить товар'}</button><button type="button" className="admin-secondary-button" onClick={() => setDraft(null)}>Отмена</button></div>
        </form>
      </section>}

      <div className="admin-list-heading"><div><p className="shop-page-eyebrow">Каталог</p><h2>{loadingProducts ? 'Загрузка…' : `${products.length} товаров`}</h2></div><button type="button" className="admin-primary-button" onClick={startNewProduct} disabled={loadingProducts || products.length === 0}><Plus size={16} /> Добавить товар</button></div>
      {!loadingProducts && products.length === 0 && <section className="admin-empty"><PackagePlus size={26} /><h2>Каталог ещё не импортирован</h2><p>Перенесите текущие товары из сайта в базу. Эта кнопка доступна только для пустой таблицы и не перезаписывает существующие данные.</p><button type="button" className="admin-primary-button" onClick={seedCatalog} disabled={saving}>{saving ? 'Импортируем…' : 'Импортировать текущий каталог'}</button></section>}

      {products.length > 0 && <div className="admin-product-list">
        {products.map((product) => <article className={`admin-product-row${product.isAvailable ? '' : ' is-unavailable'}`} key={product.id}>
          <div className="admin-product-thumbnail" style={{ backgroundImage: `url("${product.image.replaceAll('"', '')}")` }} />
          <div className="admin-product-copy"><p>{product.label}</p><h3>{product.name}</h3><span>{product.price === null ? 'Цена не указана' : `${product.price} €`}</span></div>
          <span className={`admin-stock-status${product.isAvailable ? ' is-in-stock' : ''}`}>{product.isAvailable ? 'В наличии' : 'Снят с сайта'}</span>
          <div className="admin-product-actions"><button type="button" className="admin-secondary-button" onClick={() => startEditProduct(product)}><Pencil size={14} /> Изменить</button><button type="button" className={`admin-stock-button${product.isAvailable ? '' : ' is-in-stock'}`} onClick={() => toggleAvailability(product)} disabled={busyProductId === product.id}>{busyProductId === product.id ? 'Сохраняем…' : product.isAvailable ? 'Нет в наличии' : 'В наличии'}</button><button type="button" className="admin-delete-button" onClick={() => deleteProduct(product)} disabled={busyProductId === product.id}><Trash2 size={14} /> Удалить</button></div>
        </article>)}
      </div>}
    </div>
  </main>;
}

