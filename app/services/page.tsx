'use client';

import { useEffect, useRef, useState } from 'react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

const groups = [
  { id:'permanent', tab:'Перманентный макияж', title:'Перманентный макияж', intro:'Мягкие оттенки и деликатные линии, которые подчёркивают ваши естественные черты.', image:'/service-perman-new.png', gallery:['/service-perman-new.png','/service-permanent.png'], items:[
    ['Пудровое напыление бровей','Эскиз и согласование с клиентом','~1 ч 40 мин','125 €'], ['Комбинированная техника бровей','Волоски + пудра. Эскиз и согласование','~1 ч 40 мин','125 €'], ['Губы - акварельная техника','Эскиз и согласование с клиентом','~1 ч 40 мин','125 €'], ['Губы - помадный прокрас','Эскиз и согласование с клиентом','~1 ч 40 мин','125 €'], ['Стрелка с растушёвкой','Эскиз и согласование с клиентом','~1 ч 40 мин','125 €'], ['Межресничка','Деликатная выразительность взгляда','45-60 мин','85 €'], ['Коррекция','Для всех процедур перманента','1-1 ч 20 мин','75 €'],
  ]},
  { id:'lashes', tab:'Ресницы', title:'Наращивание ресниц', intro:'От лёгкой классики до выразительного объёма - с вниманием к форме глаз и вашим пожеланиям.', image:'/gallery-lashes-02.png', gallery:['/gallery-lashes-02.png','/gallery-lashes-03.png','/gallery-lashes-04.png'], items:[
    ['Традиционное - классика','Естественный эффект','1-1,5 ч','40 €'], ['Традиционное - объём 3D+','Выразительный объём','1 ч 30-45 мин','45 €'], ['LED-наращивание - классика','Классический эффект с LED-технологией','1 ч-1 ч 20 мин','45 €'], ['LED-наращивание - объём','Объёмный эффект с LED-технологией','1 ч 20-45 мин','50 €'],
  ]},
  { id:'brows', tab:'Брови', title:'Оформление бровей', intro:'Гармоничная форма и оттенок, которые подчёркивают характер лица.', image:'/gallery-brows-07.png', gallery:['/gallery-brows-07.png','/gallery-brows-08.png','/gallery-brows-09.png','/gallery-brows-10.png'], items:[['Архитектура и оформление бровей хной','Подбор формы, оформление и окрашивание','30-45 мин','30 €']]},
  { id:'correction', tab:'Коррекция и восстановление', title:'Коррекция и восстановление', intro:'Процедуры для обновления, коррекции и восстановления кожи и перманента.', image:'/gallery-correction-01.png', gallery:['/gallery-correction-01.png','/gallery-correction-02.png','/gallery-correction-03.png','/gallery-correction-04.png','/gallery-correction-05.png','/gallery-correction-06.png','/gallery-correction-07.png','/gallery-correction-08.png','/gallery-correction-09.png','/gallery-correction-10.png'], items:[['Ремувер','Удаление или обновление перманента','45-60 мин','40 €'],['Камуфляж шрамов','Зависит от объёма работы','от 45 мин','от 35 €'],['Трихопигментация','Стоимость за час, зависит от объёма','от 45 мин','45 €/ч'],['Рефреш','Обновление спустя год-полтора','1-1 ч 30 мин','100 €']]},
];

export default function ServicesPage(){
  const [active, setActive] = useState(0); const group = groups[active];
  const carouselRef = useRef<HTMLDivElement>(null);
  const gallery = group.gallery;
  const moveGallery = (direction:number) => carouselRef.current?.scrollBy({left: direction * carouselRef.current.clientWidth, behavior:'smooth'});
  useEffect(() => { carouselRef.current?.scrollTo({left:0, behavior:'auto'}); }, [active]);
  const sections = active === 0 ? [
    {title:'Брови', items:group.items.slice(0,2)},
    {title:'Губы', items:group.items.slice(2,4)},
    {title:'Глаза', items:group.items.slice(4,6)},
    {title:null, items:group.items.slice(6)},
  ] : [{title:null, items:group.items}];
  return <main className="treatments-page"><SiteHeader/>
    <section className="services-tabs" aria-label="Направления услуг"><h1 className="services-heading">Процедуры</h1><p className="services-lead">Каждая процедура начинается с консультации и подбора формы и оттенка под вас</p><div className="services-tab-list">{groups.map((item,index)=><button key={item.id} className={index===active?'is-active':''} onClick={()=>setActive(index)}><span>0{index+1}</span><b>{item.tab}</b><i>↗</i></button>)}</div><div className="services-panel"><div className="services-panel-details"><h2>{group.title}</h2>{sections.map(section=><div className="services-subgroup" key={section.title || 'all'}>{section.title && <h3 className="services-subgroup-title">{section.title}</h3>}<div className="services-price-head"><span>Процедура</span><span>Время</span><span>Цена</span></div>{section.items.map(([name,description,time,price])=><article className="services-price-row" key={name}><div><h3>{name}</h3><p>{description}</p></div><span>{time}</span><strong>{price}</strong></article>)}</div>)}</div></div></section>
    <section className="services-carousel"><p className="treatments-kicker">Портфолио</p><h2>Работы мастера</h2><div className="services-carousel-viewport"><div className="services-carousel-track" ref={carouselRef}>{gallery.map((src,i)=><img key={src} src={src} alt={`Работа NUANCE ${i+1}`}/>)}</div></div><div className="services-carousel-controls"><button onClick={()=>moveGallery(-1)} aria-label="Предыдущие работы">←</button><button onClick={()=>moveGallery(1)} aria-label="Следующие работы">→</button></div></section><SiteFooter/></main>;
}
