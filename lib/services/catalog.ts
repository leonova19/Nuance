export type ServiceCategory = 'permanent' | 'lashes' | 'brows' | 'correction';

export type ServiceItem = {
  id: string;
  category: ServiceCategory;
  name: string;
  subtitle: string;
  duration: string;
  price: string;
  sortOrder: number;
  isPublished: boolean;
};

export type ServiceGroup = {
  id: ServiceCategory;
  tab: string;
  title: string;
  intro: string;
  image: string;
  gallery: string[];
};

export const serviceGroups: ServiceGroup[] = [
  { id: 'permanent', tab: 'Перманентный макияж', title: 'Перманентный макияж', intro: 'Мягкие оттенки и деликатные линии, которые подчёркивают ваши естественные черты.', image: '/service-perman-new.png', gallery: ['/gallery-permanent-client-01.png','/gallery-permanent-client-02.png','/gallery-permanent-client-03.png','/gallery-permanent-client-04.png','/gallery-permanent-client-05.png','/gallery-permanent-client-06.jpg','/gallery-permanent-client-07.jpg','/gallery-permanent-client-08.jpg','/gallery-permanent-client-09.jpg','/gallery-permanent-client-10.jpg','/gallery-permanent-client-11.jpg','/gallery-permanent-client-12.jpg','/gallery-permanent-client-13.jpg','/gallery-permanent-client-14.jpg','/gallery-permanent-client-15.jpg','/gallery-permanent-client-16.jpg','/gallery-permanent-client-17.jpg','/gallery-permanent-client-18.jpg','/gallery-permanent-client-19.jpg','/gallery-permanent-client-20.jpg','/gallery-permanent-client-21.jpg','/gallery-permanent-client-22.jpg','/gallery-permanent-client-23.jpg','/gallery-permanent-client-24.jpg'] },
  { id: 'lashes', tab: 'Ресницы', title: 'Наращивание ресниц', intro: 'От лёгкой классики до выразительного объёма - с вниманием к форме глаз и вашим пожеланиям.', image: '/gallery-lashes-02.png', gallery: ['/gallery-lashes-02.png','/gallery-lashes-03.png','/gallery-lashes-04.png','/gallery-lashes-05.png','/gallery-lashes-06.png','/gallery-lashes-07.png','/gallery-lashes-08.png','/gallery-lashes-09.png','/gallery-lashes-10.png','/gallery-lashes-11.png','/gallery-lashes-12.png','/gallery-lashes-13.png','/gallery-lashes-14.png','/gallery-lashes-15.png'] },
  { id: 'brows', tab: 'Брови', title: 'Оформление бровей', intro: 'Гармоничная форма и оттенок, которые подчёркивают характер лица.', image: '/gallery-brows-07.png', gallery: ['/gallery-brows-07.png','/gallery-brows-08.png','/gallery-brows-09.png','/gallery-brows-10.png'] },
  { id: 'correction', tab: 'Коррекция и восстановление', title: 'Коррекция и восстановление', intro: 'Процедуры для обновления, коррекции и восстановления кожи и перманента.', image: '/gallery-correction-01.png', gallery: ['/gallery-correction-01.png','/gallery-correction-02.png','/gallery-correction-04.png','/gallery-correction-05.png','/gallery-correction-06.png','/gallery-correction-07.png','/gallery-correction-08.png','/gallery-correction-09.png','/gallery-correction-10.png'] },
];

const rawServices: Array<[ServiceCategory, string, string, string, string]> = [
  ['permanent','Пудровое напыление бровей','Эскиз и согласование с клиентом','1 час 40 минут','125 €'],
  ['permanent','Комбинированная техника бровей','Волоски + пудра. Эскиз и согласование','1 час 40 минут','125 €'],
  ['permanent','Губы - акварельная техника','Эскиз и согласование с клиентом','1 час 40 минут','125 €'],
  ['permanent','Губы - помадный прокрас','Эскиз и согласование с клиентом','1 час 40 минут','125 €'],
  ['permanent','Стрелка с растушёвкой','Эскиз и согласование с клиентом','1 час 40 минут','125 €'],
  ['permanent','Межресничка','Деликатная выразительность взгляда','~60 минут','85 €'],
  ['permanent','Коррекция','Для всех процедур перманента','~1 час 20 минут','75 €'],
  ['lashes','Традиционное - классика','Естественный эффект','~1 час 30 минут','40 €'],
  ['lashes','Традиционное - объём 3D+','Выразительный объём','~1 час 45 минут','45 €'],
  ['lashes','LED-наращивание - классика','Классический эффект с LED-технологией','~1 час 20 минут','45 €'],
  ['lashes','LED-наращивание - объём','Объёмный эффект с LED-технологией','~1 час 45 минут','50 €'],
  ['brows','Архитектура и оформление бровей хной','Подбор формы, оформление и окрашивание','~45 минут','30 €'],
  ['correction','Ремувер','Удаление или обновление перманента','~60 минут','40 €'],
  ['correction','Камуфляж шрамов','Зависит от объёма работы','45 минут','от 35 €'],
  ['correction','Трихопигментация','Стоимость за час, зависит от объёма','45 минут','45 €/ч'],
  ['correction','Рефреш','Обновление спустя год-полтора','~1 час 30 минут','100 €'],
];

function toServiceId(category: string, name: string) {
  const transliteration: Record<string, string> = { а:'a', б:'b', в:'v', г:'g', д:'d', е:'e', ё:'e', ж:'zh', з:'z', и:'i', й:'y', к:'k', л:'l', м:'m', н:'n', о:'o', п:'p', р:'r', с:'s', т:'t', у:'u', ф:'f', х:'h', ц:'ts', ч:'ch', ш:'sh', щ:'shch', ъ:'', ы:'y', ь:'', э:'e', ю:'yu', я:'ya' };
  return `${category}-${Array.from(name.toLowerCase()).map((char) => transliteration[char] ?? char).join('').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
}

export const defaultServices: ServiceItem[] = rawServices.map(([category, name, subtitle, duration, price], sortOrder) => ({
  id: toServiceId(category, name), category, name, subtitle, duration, price, sortOrder, isPublished: true,
}));

export function serviceRowsToGroups(rows: ServiceItem[]) {
  return serviceGroups.map((group) => ({
    ...group,
    items: rows.filter((row) => row.category === group.id && row.isPublished).sort((a, b) => a.sortOrder - b.sortOrder),
  }));
}
