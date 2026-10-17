import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

const serviceItems = [
  ['Перманентный макияж', '/service-perman-new.png'],
  ['Наращивание ресниц', '/service-lash-new.png'],
  ['Оформление бровей', '/service-brow-new.png'],
];
const shopItems = [
  ['Парфюмерия для дома', 'Диффузоры', '/shop-diffuser.png'],
  ['Ароматы для авто', 'Автомобильные ароматы', '/shop-car-fragrance.png'],
  ['Уход и парфюм', 'Косметические товары', '/shop-hand-care.png'],
];

export default function Home() {
  return <main>
    <SiteHeader/>

    <section className="hero" id="top">
      <div className="hero-copy"><p className="eyebrow">Время естественной красоты</p><h1>Искусство<em>тонких акцентов</em></h1><p className="hero-intro">Перманентный макияж, ресницы и брови,<br/>которые подчёркивают вашу естественную красоту</p><div className="hero-actions"><a className="primary-button" href="/services">Посмотреть услуги</a></div></div>
      <div className="hero-visual" aria-label="Эстетика NUANCE"><div className="hero-image" role="img" aria-label="Крупный план естественного макияжа глаз и ресниц"/><p className="image-note">01 / Естественный результат</p></div>
      <div className="hero-side-note"><span>Nuance</span><p>Тонкий оттенок<br/>Едва заметная деталь<br/>Точное различие</p></div>
    </section>

    <section className="services section-pad" id="services">
      <div className="nuance-statement">
        <span className="nuance-watermark" aria-hidden="true">NUANCE</span>
        <div className="nuance-statement-copy">
          <h2>NUANCE это не про изменение внешности<br/><em>Это про детали, которые подчёркивают вашу индивидуальность</em></h2>
        </div>
      </div>
      <div className="services-title"><h2><span>Услуги</span><em>тонкости и красоты</em></h2></div>
      <div className="service-gallery">
        {serviceItems.map(([title,image],index) => <article className="service-tile" key={title}>
          <img src={image} alt={title}/>
          <div className="service-tile-copy"><span>0{index+1}</span><h3>{title}</h3><a href="/services">Подробнее <ArrowUpRight size={15}/></a></div>
        </article>)}
      </div>
    </section>

    <section className="shop section-pad" id="shop"><div className="shop-top"><div><h2 className="shop-title"><span>Атмосфера начинается</span><em>с аромата</em></h2></div><div><span className="aromatic">89 AROMATIC</span><p>Детали, которые создают настроение дома, в машине и в каждом дне</p><a className="text-link" href="#catalog">Смотреть все товары <ArrowRight size={16}/></a></div></div><div className="products" id="catalog">{shopItems.map(([name,type,image],i) => <article className={`product product-${i+1}`} key={name}><div className="product-stage"><img src={image} alt={name}/><span>0{i+1}</span></div><p>{type}</p><h3>{name}</h3><a href="#booking">Смотреть коллекцию <ArrowUpRight size={16}/></a></article>)}</div></section>

    <section className="academy section-pad" id="academy"><div className="academy-copy"><h2>Знания, которые становятся<br/><em>мастерством</em></h2><p>Курс по наращиванию ресниц и оформлению бровей</p><a className="light-button" href="#booking">Узнать о курсе</a></div><div className="academy-image" role="img" aria-label="Работа мастера по наращиванию ресниц"/><div className="academy-meta"><div><p>Теория</p></div><div><p>Практика</p></div><div><p>Поддержка</p></div></div></section>

    <SiteFooter/>
  </main>;
}
