import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

const modules = [
  {
    number: '01',
    title: 'Классическое наращивание ресниц',
    text: 'Основа профессионального мастерства. Ты изучишь правила подбора ресниц, правильную изоляцию нижнего века, постановку искусственной ресницы и создание естественного, гармоничного эффекта. Научишься понимать особенности натуральных ресниц и выполнять процедуру с соблюдением техники безопасности.',
  },
  {
    number: '02',
    title: 'Объёмное наращивание ресниц',
    text: 'Освой искусство создания выразительного взгляда. Изучим принципы формирования пучков, техники 2D и 3D, подбор объёма, длины и изгиба, а также создание эффектов с учётом индивидуальных особенностей клиента.',
  },
  {
    number: '03',
    title: 'LED-наращивание ресниц',
    text: 'Познакомься с современной технологией наращивания с использованием специальной LED-системы. Изучим особенности оборудования, работу с материалами, последовательность процедуры и требования безопасности при использовании технологии.',
  },
  {
    number: '04',
    title: 'Архитектура и окрашивание бровей хной',
    text: 'Научись подчёркивать естественную красоту лица. Ты освоишь моделирование формы бровей, подбор оттенка, подготовку к процедуре и технику окрашивания хной для создания аккуратного и гармоничного образа.',
  },
];

const courseFacts = [
  ['01', '5 дней', 'интенсивного обучения'],
  ['02', '4 направления', 'в одной программе'],
  ['03', '690 €', 'полный курс'],
];

export default function CoursesPage() {
  return (
    <main className="course-page">
      <SiteHeader />

      <section className="course-hero">
        <div className="course-hero-copy">
          <p className="course-subtitle">Полный курс</p>
          <h1>Обучение наращиванию ресниц и оформлению бровей хной</h1>
          <p className="course-lead">
            Открой для себя мир beauty-индустрии и освой востребованные техники
            <br className="course-lead-break" />
            наращивания ресниц и оформления бровей под руководством опытного мастера. Новые возможности для твоего будущего.
          </p>
        </div>

        <div className="course-hero-facts" aria-label="Факты о курсе">
          {courseFacts.map(([, value, label]) => (
            <div className="course-hero-fact" key={value}>
              <div className="course-hero-fact-copy">
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="course-introduction">
        <div className="course-introduction-copy">
          <div>
            <p>
              Наш авторский курс создан для тех, кто хочет не просто познакомиться с
              профессией, а
              <br className="course-introduction-break" />
              получить системные знания, освоить современные техники и заложить прочную основу для
              <br className="course-introduction-break" />
              успешной работы в индустрии красоты.
            </p>
            <p>
              Мы объединили в одной программе классическое и объёмное наращивание ресниц,
              <br className="course-introduction-break" />
              современную LED-технологию и оформление бровей хной.
            </p>
          </div>
        </div>
      </section>

      <section className="course-program" id="program">
        <div className="course-program-heading">
          <div className="course-section-label">Программа обучения</div>
          <h2>
            Четыре направления, которые
            <br className="course-program-title-break" />
            открывают новые возможности
          </h2>
        </div>

        <div className="course-module-list">
          {modules.map((module) => (
            <article className="course-module" key={module.number}>
              <span className="course-module-number" aria-hidden="true">{module.number}</span>
              <div>
                <h3>{module.title}</h3>
                <p>{module.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="course-practice">
        <div className="course-practice-copy">
          <div className="course-practice-heading">
            <div className="course-section-label">Теория + практика</div>
            <h2>
              5 дней, которые могут стать
              <br className="course-practice-title-break" />
              началом твоей новой карьеры
            </h2>
          </div>
          <div className="course-practice-details">
            <p>
              Программа сочетает теорию и практику, чтобы ты могла не только понять
              принципы работы, но и применить полученные знания на практике.
            </p>
            <p>
              Мы уделяем внимание деталям, правильной технике и качеству выполнения
              каждой процедуры.
            </p>
            <p>
              Курс подходит как новичкам, которые начинают с нуля, так и действующим
              beauty-мастерам, желающим расширить спектр своих услуг.
            </p>
          </div>
        </div>
      </section>

      <section className="course-result">
        <div className="course-result-copy">
          <div className="course-section-label">После обучения</div>
          <h2>Ты получишь знания и практические навыки по четырём направлениям:</h2>
          <ul className="course-result-list">
            <li>Классическое наращивание ресниц</li>
            <li>Объёмное наращивание ресниц</li>
            <li>LED-наращивание ресниц</li>
            <li>Архитектура и окрашивание бровей хной</li>
          </ul>
        </div>
        <div className="course-result-note">
          <div className="course-section-label">Инвестируй в себя и свое будущее</div>
          <strong>690 €</strong>
          <p>
            Профессия в beauty-индустрии — это возможность творчески
            реализовываться, развивать собственный стиль и строить карьеру в сфере
            красоты.
            <br />
            <span className="course-result-accent">Начни свой путь к профессии beauty-мастера уже сегодня!</span>
          </p>
          <a className="course-result-button" href="mailto:nuancesupport@gmail.com?subject=Запись на курс NUANCE">
            Записаться на обучение
          </a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
