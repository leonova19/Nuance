import type { Metadata } from 'next';
import { ArrowRight, MapPin, Phone } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

export const metadata: Metadata = {
  title: 'Обо мне — NUANCE',
  description: 'Jelena Trapeznikova — сертифицированный мастер красоты и основательница студии Nuance.',
};

export default function AboutPage() {
  return <main className="about-page-root">
    <SiteHeader />

    <section className="about-page-hero">
      <div className="about-page-hero-copy">
        <div className="about-page-author">
          <span>Сертифицированный мастер красоты</span>
          <p>Jelena Trapeznikova</p>
        </div>
        <p className="about-page-lead">Красота начинается с деталей, а истинная элегантность заключается в гармонии и индивидуальности</p>
        <p className="about-page-hero-story">Именно эту философию я воплощаю в своей студии Nuance, пространстве, где профессионализм встречается с заботой, а каждая процедура становится особенным моментом для себя.</p>
        <p className="about-page-hero-bio">Я сертифицированный мастер красоты с многолетним опытом работы и искренней любовью к своему делу. Для меня красота не просто результат процедуры, а искусство подчеркнуть то, что делает каждую женщину уникальной.</p>
        <a className="about-page-hero-link" href="/services">Посмотреть процедуры</a>
      </div>
      <div className="about-page-hero-image">
        <img src="/about-jelena.png" alt="Jelena Trapeznikova, основательница студии NUANCE" />
      </div>
    </section>

    <section className="about-page-approach">
      <div className="about-page-approach-heading">
        <p className="about-page-eyebrow">Моя философия</p>
        <h2>Красота <em>в нюансах</em></h2>
      </div>
      <div className="about-page-values">
        <article><h3>Индивидуальность</h3><p>Совершенный образ начинается с деталей. Я учитываю ваши особенности и пожелания, чтобы деликатно подчеркнуть естественную красоту, а не изменить её.</p></article>
        <article><h3>Опыт и развитие</h3><p>За каждым результатом стоят знания, внимание и стремление к совершенству. Я постоянно развиваю навыки, чтобы предлагать профессиональный подход и высокий уровень сервиса.</p></article>
        <article><h3>Время для себя</h3><p>Хочу, чтобы в студии Nuance уход за собой становился приятным ритуалом, временем спокойствия, заботы и гармонии.</p></article>
      </div>
    </section>

    <section className="about-page-connect">
      <div className="about-page-trust">
        <p className="about-page-eyebrow">Ваша красота — моя забота</p>
        <blockquote>Nuance объединяет заботу о красоте с философией естественности, элегантности и внимания к себе.</blockquote>
        <p className="about-page-trust-note">Буду рада познакомить вас с атмосферой Nuance и помочь найти тот самый нюанс, который подчеркнёт вашу индивидуальность.</p>
        <p className="about-page-signoff"><small>Основательница студии Nuance</small></p>
      </div>

      <div className="about-page-contacts" aria-labelledby="about-contacts-title">
        <div className="about-page-contacts-heading">
          <p className="about-page-eyebrow">Буду рада встрече</p>
          <h2 id="about-contacts-title">Контакты</h2>
        </div>
        <div className="about-page-contact-list">
        <a className="about-page-contact" href="https://maps.google.com/?q=J%C3%B5hvi%2C+Tartu+p%C3%B5ik+2a" target="_blank" rel="noreferrer">
          <MapPin size={18} strokeWidth={1.4} />
          <span><small>Адрес</small>Jõhvi, Tartu põik 2a, 2 korrus</span>
          <ArrowRight size={15} />
        </a>
        <a className="about-page-contact" href="tel:+37253540826">
          <Phone size={18} strokeWidth={1.4} />
          <span><small>Телефон</small>53540826</span>
          <ArrowRight size={15} />
        </a>
        <a className="about-page-contact" href="https://www.instagram.com/jelena.trapeznikova?exln=NGZ4bW51emN1dHZ6" target="_blank" rel="noreferrer">
          <span className="about-page-social-mark" aria-hidden="true">ig</span>
          <span><small>Instagram</small>@jelena.trapeznikova</span>
          <ArrowRight size={15} />
        </a>
        <a className="about-page-contact" href="https://www.facebook.com/share/1MVrkeVuvJ/?mibextid=wwXIfr" target="_blank" rel="noreferrer">
          <span className="about-page-social-mark" aria-hidden="true">f</span>
          <span><small>Facebook</small>Jelena Trapeznikova Permanent</span>
          <ArrowRight size={15} />
        </a>
        </div>
      </div>
    </section>

    <SiteFooter />
  </main>;
}
