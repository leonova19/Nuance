import { ArrowRight, ArrowUpRight, MessageCircle, Sparkles } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

const permanent = [
  ['01', 'Брови', 'Пудровое напыление · Волоски + пудра'], ['02', 'Губы', 'Акварельная техника · Помадный прокрас'],
  ['03', 'Глаза', 'Стрелка с растушёвкой · Межресничка'], ['04', 'Ремувер', 'Удаление или обновление перманента'],
  ['05', 'Камуфляж', 'Деликатная коррекция шрамов'], ['06', 'Трихопигментация', 'Визуальная коррекция густоты волос'],
];
const shopItems = [['Парфюмерия для дома', 'Диффузоры'], ['Ароматы для авто', 'Car perfume'], ['Уход и атмосфера', 'Aromatic 89']];

export default function Home() {
  return <main>
    <SiteHeader/>

    <section className="hero" id="top">
      <div className="hero-copy"><p className="eyebrow">Время естественной красоты</p><h1>Искусство<em>тонких акцентов</em></h1><p className="hero-intro">Перманентный макияж, ресницы и брови,<br/>которые подчёркивают вашу естественную красоту</p><div className="hero-actions"><a className="primary-button" href="/services">Посмотреть услуги</a></div></div>
      <div className="hero-visual" aria-label="Эстетика NUANCE"><div className="hero-image" role="img" aria-label="Крупный план естественного макияжа глаз и ресниц"/><p className="image-note">01 / Естественный результат</p></div>
      <div className="hero-side-note"><span>Nuance</span><p>Тонкий оттенок.<br/>Едва заметная деталь.<br/>Точное различие.</p></div>
    </section>

    <section className="services section-pad" id="services">
      <div className="section-heading"><p className="eyebrow">01 / Услуги</p><h2>Красота, в которой<br/><em>вы остаётесь собой</em></h2><p>Каждая процедура начинается с разговора, точного подбора формы и оттенка — и заканчивается естественным результатом.</p></div>
      <div className="service-layout"><article className="feature-card permanent-card"><div><span className="card-index">01</span><h3>Перманентный<br/>макияж</h3></div><Sparkles size={30} strokeWidth={1}/><a href="#booking">Подобрать процедуру <ArrowUpRight size={17}/></a></article><div className="procedure-list">{permanent.map(([n,title,desc]) => <a href="#booking" className="procedure-row" key={title}><span>{n}</span><div><h3>{title}</h3><p>{desc}</p></div><ArrowUpRight size={18}/></a>)}</div></div>
      <div className="service-cards"><article className="slim-card sage-card"><span>02</span><div><p>Взгляд без лишнего</p><h3>Наращивание<br/>ресниц</h3></div><ul><li>Классика</li><li>Объём 3D+</li><li>LED: классика и объём</li></ul><a href="#booking">Подробнее <ArrowRight size={16}/></a></article><article className="slim-card cream-card"><span>03</span><div><p>Точная форма</p><h3>Оформление<br/>бровей хной</h3></div><p className="card-copy">Архитектура и оттенок, которые поддерживают черты лица.</p><a href="#booking">Подробнее <ArrowRight size={16}/></a></article></div>
    </section>

    <section className="about" id="about"><div className="about-art"><span>N</span><p>NUANCE</p></div><div className="about-copy"><p className="eyebrow">02 / Философия мастера</p><h2>Тонкая работа.<br/><em>Никаких случайностей.</em></h2><p>NUANCE — это искусство замечать детали, которые на первый взгляд кажутся небольшими, но именно они меняют всё: изгиб ресниц, оттенок пигмента, форма бровей.</p><blockquote>«Красота выглядит естественно, когда сделана с уважением к вашей индивидуальности»</blockquote><a className="text-link" href="#booking">Познакомиться с мастером <ArrowRight size={16}/></a></div></section>

    <section className="academy section-pad" id="academy"><div className="academy-copy"><p className="eyebrow light">03 / NUANCE Academy</p><h2>Учиться видеть<br/><em>детали</em></h2><p>Полный курс по наращиванию ресниц и оформлению бровей: от уверенной техники до красивого портфолио и работы с клиентом.</p><a className="light-button" href="#booking">Узнать о курсе <ArrowUpRight size={18}/></a></div><div className="academy-meta"><div><span>01</span><p>Теория без воды</p></div><div><span>02</span><p>Практика на модели</p></div><div><span>03</span><p>Поддержка после курса</p></div></div></section>

    <section className="shop section-pad" id="shop"><div className="shop-top"><div><p className="eyebrow">04 / Магазин</p><h2>Ароматы для<br/><em>вашего пространства</em></h2></div><div><span className="aromatic">AROMATIC 89</span><p>Детали, которые создают настроение дома, в машине и в каждом дне.</p><a className="text-link" href="#catalog">Смотреть все товары <ArrowRight size={16}/></a></div></div><div className="products" id="catalog">{shopItems.map(([name,type],i) => <article className={`product product-${i+1}`} key={name}><div className="product-stage"><div className="bottle"><i/><b>A89</b></div><span>0{i+1}</span></div><p>{type}</p><h3>{name}</h3><a href="#booking">Смотреть коллекцию <ArrowUpRight size={16}/></a></article>)}</div></section>

    <section className="booking" id="booking"><div><p className="eyebrow light">Запись в NUANCE</p><h2>Ваши детали.<br/><em>Ваш NUANCE.</em></h2></div><div className="booking-copy"><p>Поможем выбрать процедуру, ответим на вопросы и найдём удобное время.</p><div className="booking-actions"><a className="light-button" href="https://instagram.com" target="_blank" rel="noreferrer"><MessageCircle size={18}/> Написать в Instagram</a><a className="ghost-button" href="tel:+3720000000">Позвонить</a></div><small>Контакты и адрес будут добавлены перед запуском</small></div></section>
    <SiteFooter/>
  </main>;
}
