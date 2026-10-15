import { ArrowDownRight, ArrowRight, ArrowUpRight, MessageCircle, Menu, ShoppingBag, Sparkles } from 'lucide-react';
import { LanguageSwitcher } from '@/components/language-switcher';

const permanent = [
  ['01', 'Брови', 'Пудровое напыление · Волоски + пудра'], ['02', 'Губы', 'Акварельная техника · Помадный прокрас'],
  ['03', 'Глаза', 'Стрелка с растушёвкой · Межресничка'], ['04', 'Ремувер', 'Удаление или обновление перманента'],
  ['05', 'Камуфляж', 'Деликатная коррекция шрамов'], ['06', 'Трихопигментация', 'Визуальная коррекция густоты волос'],
];
const shopItems = [['Парфюмерия для дома', 'Диффузоры'], ['Ароматы для авто', 'Car perfume'], ['Уход и атмосфера', 'Aromatic 89']];

export default function Home() {
  return <main>
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="NUANCE — на главную">NUANCE<span>Permanent · Lashes · Brows</span></a>
      <nav className="desktop-nav" aria-label="Основная навигация"><a href="#services">Услуги</a><a href="#about">О мастере</a><a href="#academy">Обучение</a><a href="#shop">Магазин</a></nav>
      <div className="header-actions"><a className="bag-link" href="#shop" aria-label="Корзина"><ShoppingBag size={18} strokeWidth={1.5}/><span>0</span></a><LanguageSwitcher/><details className="mobile-menu"><summary aria-label="Открыть меню"><Menu size={22}/></summary><nav><a href="#services">Услуги</a><a href="#about">О мастере</a><a href="#academy">Обучение</a><a href="#shop">Магазин</a></nav></details></div>
    </header>

    <section className="hero" id="top">
      <div className="hero-copy"><p className="eyebrow">Студия естественной красоты</p><h1>Искусство замечать<em>тонкости.</em></h1><p className="hero-intro">Перманентный макияж, наращивание ресниц и оформление бровей — деликатно, точно и всегда про вашу индивидуальность.</p><div className="hero-actions"><a className="primary-button" href="#services">Выбрать процедуру <ArrowUpRight size={18}/></a><a className="text-link" href="#shop">Магазин Aromatic 89 <ArrowDownRight size={17}/></a></div></div>
      <div className="hero-visual" aria-label="Эстетика NUANCE"><div className="hero-image" role="img" aria-label="Крупный план естественного макияжа глаз и ресниц"/><p className="image-note">01 / Естественный результат</p></div>
      <div className="hero-side-note"><span>Nuance</span><p>Тонкий оттенок.<br/>Едва заметная деталь.<br/>Точное различие.</p></div>
    </section>
    <section className="intro-strip" aria-label="Философия бренда"><p>Не изменить до неузнаваемости</p><span>✦</span><p>Подчеркнуть индивидуальность</p><span>✦</span><p>Создать гармонию в деталях</p></section>

    <section className="services section-pad" id="services">
      <div className="section-heading"><p className="eyebrow">01 / Услуги</p><h2>Красота, в которой<br/><em>вы остаётесь собой</em></h2><p>Каждая процедура начинается с разговора, точного подбора формы и оттенка — и заканчивается естественным результатом.</p></div>
      <div className="service-layout"><article className="feature-card permanent-card"><div><span className="card-index">01</span><h3>Перманентный<br/>макияж</h3></div><Sparkles size={30} strokeWidth={1}/><a href="#booking">Подобрать процедуру <ArrowUpRight size={17}/></a></article><div className="procedure-list">{permanent.map(([n,title,desc]) => <a href="#booking" className="procedure-row" key={title}><span>{n}</span><div><h3>{title}</h3><p>{desc}</p></div><ArrowUpRight size={18}/></a>)}</div></div>
      <div className="service-cards"><article className="slim-card sage-card"><span>02</span><div><p>Взгляд без лишнего</p><h3>Наращивание<br/>ресниц</h3></div><ul><li>Классика</li><li>Объём 3D+</li><li>LED: классика и объём</li></ul><a href="#booking">Подробнее <ArrowRight size={16}/></a></article><article className="slim-card cream-card"><span>03</span><div><p>Точная форма</p><h3>Оформление<br/>бровей хной</h3></div><p className="card-copy">Архитектура и оттенок, которые поддерживают черты лица.</p><a href="#booking">Подробнее <ArrowRight size={16}/></a></article></div>
    </section>

    <section className="about" id="about"><div className="about-art"><span>N</span><p>NUANCE</p></div><div className="about-copy"><p className="eyebrow">02 / Философия мастера</p><h2>Тонкая работа.<br/><em>Никаких случайностей.</em></h2><p>NUANCE — это искусство замечать детали, которые на первый взгляд кажутся небольшими, но именно они меняют всё: изгиб ресниц, оттенок пигмента, форма бровей.</p><blockquote>«Красота выглядит естественно, когда сделана с уважением к вашей индивидуальности»</blockquote><a className="text-link" href="#booking">Познакомиться с мастером <ArrowRight size={16}/></a></div></section>

    <section className="academy section-pad" id="academy"><div className="academy-copy"><p className="eyebrow light">03 / NUANCE Academy</p><h2>Учиться видеть<br/><em>детали</em></h2><p>Полный курс по наращиванию ресниц и оформлению бровей: от уверенной техники до красивого портфолио и работы с клиентом.</p><a className="light-button" href="#booking">Узнать о курсе <ArrowUpRight size={18}/></a></div><div className="academy-meta"><div><span>01</span><p>Теория без воды</p></div><div><span>02</span><p>Практика на модели</p></div><div><span>03</span><p>Поддержка после курса</p></div></div></section>

    <section className="shop section-pad" id="shop"><div className="shop-top"><div><p className="eyebrow">04 / Магазин</p><h2>Ароматы для<br/><em>вашего пространства</em></h2></div><div><span className="aromatic">AROMATIC 89</span><p>Детали, которые создают настроение дома, в машине и в каждом дне.</p><a className="text-link" href="#catalog">Смотреть все товары <ArrowRight size={16}/></a></div></div><div className="products" id="catalog">{shopItems.map(([name,type],i) => <article className={`product product-${i+1}`} key={name}><div className="product-stage"><div className="bottle"><i/><b>A89</b></div><span>0{i+1}</span></div><p>{type}</p><h3>{name}</h3><a href="#booking">Смотреть коллекцию <ArrowUpRight size={16}/></a></article>)}</div></section>

    <section className="booking" id="booking"><div><p className="eyebrow light">Запись в NUANCE</p><h2>Ваши детали.<br/><em>Ваш NUANCE.</em></h2></div><div className="booking-copy"><p>Поможем выбрать процедуру, ответим на вопросы и найдём удобное время.</p><div className="booking-actions"><a className="light-button" href="https://instagram.com" target="_blank" rel="noreferrer"><MessageCircle size={18}/> Написать в Instagram</a><a className="ghost-button" href="tel:+3720000000">Позвонить</a></div><small>Контакты и адрес будут добавлены перед запуском</small></div></section>
    <footer><a className="wordmark footer-logo" href="#top">NUANCE<span>Permanent · Lashes · Brows</span></a><p>© 2026 NUANCE. Эстетика в каждой детали.</p><div><a href="#services">Услуги</a><a href="#academy">Обучение</a><a href="#shop">Магазин</a></div></footer>
  </main>;
}
