'use client';

import { useEffect, useRef, useState } from 'react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import type { ServiceCategory, ServiceGroup, ServiceItem } from '@/lib/services/catalog';

type GroupWithItems = ServiceGroup & { items: ServiceItem[] };

export function ServicesClient({ groups }: { groups: GroupWithItems[] }) {
  const [active, setActive] = useState<ServiceCategory>(groups[0]?.id ?? 'permanent');
  const group = groups.find((item) => item.id === active) ?? groups[0];
  const carouselRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const category = new URLSearchParams(window.location.search).get('category') as ServiceCategory | null;
    if (category && groups.some((item) => item.id === category)) setActive(category);
  }, [groups]);
  useEffect(() => { carouselRef.current?.scrollTo({ left: 0, behavior: 'auto' }); }, [active]);
  if (!group) return null;
  const sections = active === 'permanent' ? [
    { title: 'Брови', items: group.items.slice(0, 2) },
    { title: 'Губы', items: group.items.slice(2, 4) },
    { title: 'Глаза', items: group.items.slice(4, 6) },
    { title: null, items: group.items.slice(6) },
  ] : [{ title: null, items: group.items }];
  const moveGallery = (direction: number) => carouselRef.current?.scrollBy({ left: direction * carouselRef.current.clientWidth, behavior: 'smooth' });
  return <main className="treatments-page"><SiteHeader />
    <section className="services-tabs" aria-label="Направления услуг"><h1 className="services-heading">Процедуры</h1><p className="services-lead">Каждая процедура начинается с консультации и подбора формы и оттенка под вас</p><div className="services-tab-list">{groups.map((item) => <button key={item.id} className={item.id === active ? 'is-active' : ''} onClick={() => { setActive(item.id); window.history.replaceState(null, '', `/services?category=${item.id}`); }}><b>{item.tab}</b><i>↗</i></button>)}</div><div className="services-panel"><div className="services-panel-details"><h2>{group.title}</h2>{sections.map((section) => <div className="services-subgroup" key={section.title || 'all'}>{section.title && <h3 className="services-subgroup-title">{section.title}</h3>}<div className="services-price-head"><span>Процедура</span><span>Время</span><span>Цена</span></div>{section.items.map((item) => <article className="services-price-row" key={item.id}><div><h3>{item.name}</h3><p>{item.subtitle}</p></div><span>{item.duration}</span><strong>{item.price}</strong></article>)}</div>)}</div></div></section>
    <section className="services-carousel"><p className="treatments-kicker">Портфолио</p><h2>Работы мастера</h2><div className="services-carousel-viewport"><div className="services-carousel-track" ref={carouselRef}>{group.gallery.map((src, index) => <img key={src} src={src} alt={`Работа NUANCE ${index + 1}`} />)}</div></div><div className="services-carousel-controls"><button onClick={() => moveGallery(-1)} aria-label="Предыдущие работы">←</button><button onClick={() => moveGallery(1)} aria-label="Следующие работы">→</button></div></section><SiteFooter /></main>;
}
