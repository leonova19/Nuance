'use client';

import { ChevronDown, ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { formatPrice, type Product } from './products';
import { getCartLineKey, notifyCartAdded, readShopCart, writeShopCart } from './cart';
import { CartToast } from './cart-toast';

const aromaOptions = [
  { name: 'Black Grapes', description: 'Сладкий и сочный аромат, напоминающий спелый на солнце чёрный виноград. Этот фруктовый аромат наполнен естественной сладостью и свежестью, как будто вы гуляете по виноградникам, залитым солнцем, где воздух пропитан запахом сочных ягод.', notes: [{ name: 'Виноград', image: '/note-grapes.png' }] },
  {
    name: 'Dore',
    description: 'Тёплый гурманский аромат: карамельная сладость, нежная роза и яркий апельсин.',
    notes: [
      { name: 'Карамель', image: '/note-caramel.png' },
      { name: 'Роза', image: '/note-rose.png' },
      { name: 'Апельсин', image: '/note-orange.png' },
    ],
  },
  {
    name: 'Ohena',
    description: 'Аромат с нотами шафрана, жасмина и апельсина.',
    notes: [
      { name: 'Шафран', image: '/note-saffron.png' },
      { name: 'Жасмин', image: '/note-jasmine.png' },
      { name: 'Апельсин', image: '/note-orange.png' },
    ],
  },
  {
    name: 'Blue Nightingale',
    description: 'Аромат с нотами малины, ванили и кашмерана.',
    notes: [
      { name: 'Малина', image: '/note-raspberry.png' },
      { name: 'Ваниль', image: '/note-vanilla.png' },
      { name: 'Кашмеран', image: '/note-cashmeran.png' },
    ],
  },
  {
    name: 'Diamond',
    description: 'Сияющий и сладкий аромат, источающий элегантность. Свежесть лимона и цветка апельсина переплетается со сладостью клубники и персика. Нежность жасмина, туберозы и цикламена наполняет воздух роскошью, а сандал и ваниль добавляют тепла и изысканности.\n\nВерхние ноты: лимон, оттенки морской соли, нероли, персик и клубника.\nСредние ноты: жасмин, иланг-иланг, тубероза, цикламен и мускатный шалфей.\nБазовые ноты: кожа, сандал, амбра, пачули, замша и ваниль.',
    notes: [
      { name: 'Лимон', image: '/note-lemon.png' },
      { name: 'Жасмин', image: '/note-jasmine.png' },
      { name: 'Амбра', image: '/note-amber.png' },
    ],
  },
  {
    name: 'Inoop',
    description: 'Нежный и чувственный аромат, дышащий восточным теплом. Сочные ноты сливы и освежающего бергамота переплетаются с тёплыми аккордами корицы и пряной гвоздики. Мягкость герани, мускусная ваниль и богатый кедр сливаются в тепле амбры, создавая элегантную атмосферу.\n\nВерхние ноты · слива, бергамот\nНоты сердца · яблоко, корица, гвоздика, гвоздика-трава\nБазовые ноты · герань, мускус с ванилью, кедр, амбра',
    notes: [
      { name: 'Кедр', image: '/note-cedar.png' },
      { name: 'Корица', image: '/note-cinnamon.png' },
      { name: 'Слива', image: '/note-plum.png' },
    ],
  },
  {
    name: 'Instinct',
    description: 'Смелый и мощный аромат, который пробуждает природные инстинкты. Свежесть апельсина и грейпфрута сочетается с резкостью эвкалипта. Тёплые ноты лаванды, розмарина и тимьяна вдохновляют на уверенность, а мускус и кедр придают аромату силу и стойкость.\n\nВерхние ноты · апельсин, петитгрейн, эвкалипт и грейпфрут\nНоты сердца · пряные перечные ноты, лаванда, розмарин, масло тимьяна\nБазовые ноты · амбровые мускусы, кедр и пачули',
    notes: [
      { name: 'Грейпфрут', image: '/note-orange.png' },
      { name: 'Кедр', image: '/note-cedar.png' },
      { name: 'Перец', image: '/note-pepper.png' },
    ],
  },
  {
    name: 'Old Million',
    description: 'Энергичный и смелый аромат, полный согревающих пряных нот. Яркие аккорды грейпфрута, лимона и апельсина сочетаются со свежей мятой, создавая бодрящее впечатление. Богатство мускатного ореха, гвоздики и корицы добавляет тепла, а амбра, пачули и мускус придают аромату глубину и индивидуальность.\n\nВерхние ноты · грейпфрут, лимон, апельсин, мята\nНоты сердца · мускатный орех, жасмин, гвоздика и корица\nБазовые ноты · амбра, пачули и анималистический мускус',
    notes: [
      { name: 'Грейпфрут', image: '/note-orange.png' },
      { name: 'Корица', image: '/note-cinnamon.png' },
      { name: 'Амбра', image: '/note-amber.png' },
    ],
  },
  {
    name: 'Amber Dust',
    description: 'Тёплый и уютный аромат, в котором тонкая теплота амбры сочетается со свежими цитрусами и согревающими специями. Ноты кедра и сандала привносят элегантность и спокойствие, а нежный шёпот амбры наполняет пространство комфортом и утончённой роскошью.\n\nВерхние ноты • цитрус, специи\nСредние ноты • древесина, иланг-иланг\nБазовые ноты • амбра, кедр, сандал',
    notes: [
      { name: 'Амбра', image: '/note-amber.png' },
      { name: 'Сандал', image: '/note-sandalwood.png' },
      { name: 'Кедр', image: '/note-cedar.png' },
    ],
  },
  {
    name: 'Staying Alive',
    description: 'Яркий и вдохновляющий аромат, который излучает энергию и решительность. Сочные ноты лимона, яблока и мандарина моментально бодрят, в то время как нежность жасмина уравновешивает этот поток энергии. Сила ветивера и кедра, дополненная теплом амбры, создаёт выразительный аромат, побуждающий двигаться вперёд с уверенностью.\n\nВерхние ноты · лимон, яблоко, мандарин\nНоты сердца · жасмин, сандаловое дерево\nБазовые ноты · ветивер, кедр, амбра, ваниль',
    notes: [
      { name: 'Лимон', image: '/note-lemon.png' },
      { name: 'Сандал', image: '/note-sandalwood.png' },
      { name: 'Амбра', image: '/note-amber.png' },
    ],
  },
  {
    name: 'Pomegranate',
    description: 'Аромат с нотами граната, нектарина и цветов.',
    notes: [
      { name: 'Гранат', image: '/note-pomegranate.png' },
      { name: 'Нектарин', image: '/note-nectarine.png' },
      { name: 'Цветы', image: '/note-flowers.png' },
    ],
  },
  {
    name: 'Gold Mist',
    description: 'Аромат с нотами лаванды, амбры и тонка.',
    notes: [
      { name: 'Лаванда', image: '/note-lavender.png' },
      { name: 'Амбра', image: '/note-amber.png' },
      { name: 'Тонка', image: '/note-tonka.png' },
    ],
  },
  {
    name: 'Satin Touch',
    description: 'Аромат с нотами розы, уда и ванили.',
    notes: [
      { name: 'Роза', image: '/note-rose.png' },
      { name: 'Уд', image: '/note-oud.png' },
      { name: 'Ваниль', image: '/note-vanilla.png' },
    ],
  },
  {
    name: 'Morocó',
    description: 'Богатый и тёплый аромат, пропитанный экзотическими восточными нотами. Изобилие сладкой сливы сочетается с согревающей корицей, гвоздикой и дымным ладаном. Этот аромат напоминает узкие улочки Марракеша, где воздух насыщен смесью специй и фруктов, вызывая ассоциации с глинтвейном. Глубокие ноты табака, кедра и бобов тонка добавляют глубину и уют, наполняя пространство загадочной роскошью.\n\nВерхние ноты · корица, слива, ладан\nНоты сердца · гвоздика, табак, пачули\nБазовые ноты · кедр, ваниль, бобы тонка, мускус',
    notes: [
      { name: 'Слива', image: '/note-plum.png' },
      { name: 'Корица', image: '/note-cinnamon.png' },
      { name: 'Тонка', image: '/note-tonka.png' },
    ],
  },
  {
    name: 'Safine',
    description: 'Нежный и игривый аромат, передающий атмосферу залитых солнцем садов. Сладкие ягоды малины, экзотическая маракуйя и спелые персики гармонично сочетаются с лёгкой пряностью корицы. Ландыш и жасмин придают свежесть, а сандал, ваниль и мускус окутывают мягким теплом, напоминая о тёплом летнем вечере.\n\nВерхние ноты · малина, маракуйя, персики и кассия\nНоты сердца · ландыш, гелиотроп, жасмин\nБазовые ноты · сандаловое дерево, ваниль, пачули, мускус',
    notes: [
      { name: 'Малина', image: '/note-raspberry.png' },
      { name: 'Жасмин', image: '/note-jasmine.png' },
      { name: 'Сандал', image: '/note-sandalwood.png' },
    ],
  },
  {
    name: 'Conegõn',
    description: 'Нежный и фруктовый аромат, который дарит лёгкость летних дней. Ноты апельсина, персика и арбуза, дополненные пикантностью розового перца, сочетаются с теплотой жасмина и розы. Мягкость мускуса и ванили окутывает пространство уютом и спокойствием.\n\nВерхние ноты • апельсин, персик, розовый перец, арбуз\nСредние ноты • лаванда, жасмин, пачули, роза\nБазовые ноты • ромашка, мускус, тонка, ваниль',
    notes: [
      { name: 'Персик', image: '/note-peach.png' },
      { name: 'Роза', image: '/note-rose.png' },
      { name: 'Ваниль', image: '/note-vanilla.png' },
    ],
  },
  {
    name: 'Majesty',
    description: 'Тёплый и сияющий аромат, излучающий роскошь и мягкость. Сладкое сочетание мандарина и кумквата придаёт фруктовую свежесть, дополненную лёгкостью листьев чёрной смородины. Аккорды жасмина и сочного абрикоса придают нежность, а тёплое сандаловое дерево и амбра окутывают приятным теплом.\n\nВерхние ноты · мандарин, апельсин, кумкват\nНоты сердца · лист чёрной смородины, ландыш, жасмин, абрикос\nБазовые ноты · сандаловое дерево, амбра, ваниль, белый мускус',
    notes: [
      { name: 'Мандарин', image: '/note-mandarin.png' },
      { name: 'Жасмин', image: '/note-jasmine.png' },
      { name: 'Сандал', image: '/note-sandalwood.png' },
    ],
  },
  {
    name: 'Amira',
    description: 'Сладкий и тёплый аромат, в котором экзотические фрукты сочетаются с восточной роскошью. Нежность жасмина и магнолии согревают корица, гвоздика и кардамон, а кедр, коричневый сахар и ваниль окутывают уютом. Аромат, который обнимает, как тёплое объятие — сладкий, насыщенный и невероятно соблазнительный.\n\nВерхние ноты • мандарин, апельсин, зелёные листья и коктейль из экзотических фруктов\nСредние ноты • жасмин, магнолия, корица, гвоздика и кардамон\nБазовые ноты • кедр, коричневый сахар, мускус, сено и ваниль',
    notes: [
      { name: 'Ваниль', image: '/note-vanilla.png' },
      { name: 'Корица', image: '/note-cinnamon.png' },
      { name: 'Сахар', image: '/note-sugar.png' },
    ],
  },
  {
    name: 'Curious Crafts',
    description: 'Пряный и загадочный аромат, приглашающий в восточное путешествие. Свежесть лимона и апельсина сочетается с прохладой эвкалипта, а тёплые нотки мускатного ореха и шафрана добавляют экзотическую загадочность.\n\nВерхние ноты • лимон, апельсин, эвкалипт и кориандр\nСредние ноты • шафран, фиалка, роза, мускатный орех и лаванда\nБазовые ноты • ваниль, пачули и амбровое дерево',
    notes: [
      { name: 'Лимон', image: '/note-lemon.png' },
      { name: 'Шафран', image: '/note-saffron.png' },
      { name: 'Пачули', image: '/note-patchouli.png' },
    ],
  },
  {
    name: 'By Design',
    description: 'Свежий и энергичный аромат, излучающий жизненную силу фруктов. Чёрная смородина, бергамот, хрустящее яблоко и сочный ананас создают освежающий и динамичный коктейль. Элегантность розы и жасмина добавляет утончённости, а тепло мускуса и ванили наполняет воздух уютом.\n\nВерхние ноты • чёрная смородина, бергамот, яблоко и ананас\nСредние ноты • роза и жасмин\nБазовые ноты • дубовый мох, мускус, амбра и ваниль',
    notes: [
      { name: 'Бергамот', image: '/note-bergamot.png' },
      { name: 'Роза', image: '/note-rose.png' },
      { name: 'Смородина', image: '/note-blackcurrant.png' },
    ],
  },
  {
    name: 'Fantasy',
    description: 'Мягкий фруктово-цветочный аромат, в котором персик встречается с жасмином и ванилью.',
    notes: [
      { name: 'Персик', image: '/note-peach.png' },
      { name: 'Жасмин', image: '/note-jasmine.png' },
      { name: 'Ваниль', image: '/note-vanilla.png' },
    ],
  },
];

function AddToCartButton({ product, aroma, quantity }: { product: Product; aroma?: string; quantity: number }) {
  const add = () => {
    if (product.price === null) return;
    const cart = readShopCart();
    const key = getCartLineKey(product.id, aroma);
    writeShopCart({ ...cart, [key]: (cart[key] ?? 0) + quantity });
    notifyCartAdded();
  };

  return <button type="button" className="shop-detail-add" onClick={add}><Plus size={15} /> Добавить</button>;
}

export function ProductDetailActions({ product }: { product: Product }) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [activeAromaIndex, setActiveAromaIndex] = useState(0);
  const variantProduct = product.id === 'home-diffuser-50' || product.id === 'home-diffuser-250' || product.id === 'home-spray' || product.id === 'car-diffuser' || product.id === 'car-spray' || product.id === 'car-card' || product.id === 'dashboard-care' || product.id === 'car-gift-set' || product.id === 'home-palm-wax-candle' || product.id === 'diffuser-candle-set';
  const carCardAromaNames = ['Black Grapes', 'Dore', 'Amber Dust', 'Old Million', 'Staying Alive', 'By Design', 'Ohena', 'Inoop', 'Amira', 'Morocó'];
  const availableAromaOptions = product.id === 'diffuser-candle-set'
    ? aromaOptions.filter((aroma) => aroma.name === 'Diamond')
    : product.id === 'car-gift-set'
    ? aromaOptions.filter((aroma) => aroma.name === 'Dore')
    : product.id === 'car-card'
      ? carCardAromaNames.map((name) => aromaOptions.find((aroma) => aroma.name === name)).filter((aroma): aroma is (typeof aromaOptions)[number] => Boolean(aroma))
    : product.id === 'dashboard-care'
      ? aromaOptions.filter((aroma) => aroma.name === 'Inoop')
    : product.id === 'car-spray'
      ? aromaOptions.filter((aroma) => ['Dore', 'Inoop', 'Staying Alive'].includes(aroma.name))
    : product.id === 'home-palm-wax-candle'
      ? aromaOptions.filter((aroma) => ['Diamond', 'Inoop', 'Old Million'].includes(aroma.name))
    : product.id === 'home-diffuser-50'
      ? aromaOptions.filter((aroma) => ['Dore', 'Ohena', 'Blue Nightingale', 'Diamond', 'Staying Alive', 'Pomegranate', 'Gold Mist', 'Satin Touch', 'Morocó', 'Safine', 'Inoop', 'Conegõn', 'Majesty', 'Amira'].includes(aroma.name))
    : product.id === 'home-spray'
      ? aromaOptions.filter((aroma) => ['By Design', 'Staying Alive'].includes(aroma.name))
    : product.id === 'car-diffuser'
      ? aromaOptions.filter((aroma) => ['Dore', 'Safine', 'Inoop', 'Blue Nightingale', 'Conegõn', 'Majesty', 'By Design', 'Curious Crafts'].includes(aroma.name))
      : aromaOptions.filter((aroma) => aroma.name !== 'Ohena');
  const mainQuantity = quantities.main ?? 1;
  const activeAroma = availableAromaOptions[activeAromaIndex];

  const changeQuantity = (key: string, amount: number) => {
    setQuantities((current) => ({ ...current, [key]: Math.max(1, (current[key] ?? 1) + amount) }));
  };

  return <>
    {variantProduct && <section className={`shop-aroma-options${product.id === 'car-gift-set' || product.id === 'diffuser-candle-set' ? ' shop-aroma-options--single' : ''}`} aria-labelledby="shop-aroma-options-title">
      <div className="shop-aroma-options-heading"><p className="shop-detail-section-label" id="shop-aroma-options-title">Выберите свой аромат ({availableAromaOptions.length})</p></div>
      <div className="shop-aroma-carousel">
        {activeAroma && (() => {
          const aroma = activeAroma;
          const quantity = quantities[aroma.name] ?? 1;
          return <article className={`shop-aroma-option${product.id === 'car-gift-set' || product.id === 'diffuser-candle-set' ? ' shop-aroma-option--single' : ''}`} key={aroma.name}>
            <div className="shop-aroma-option-title"><h3>{aroma.name}</h3></div>
            {aroma.notes.length > 0 && <div className="shop-aroma-note-grid" aria-label={`Ноты аромата ${aroma.name}`}>
              {aroma.notes.map((note) => <div className="shop-aroma-note-tile" key={`${aroma.name}-${note.name}`}><span>{note.name}</span>{'image' in note && note.image ? <img src={note.image} alt={note.name} loading="lazy" /> : <span className="shop-aroma-note-placeholder" aria-hidden="true" />}</div>)}
            </div>}
            {aroma.description && <details className="shop-aroma-description-details"><summary><span>Описание аромата</span><ChevronDown size={15} aria-hidden="true" /></summary><p>{aroma.description}</p></details>}
            <div className="shop-aroma-option-footer"><strong className="site-price">{formatPrice(product.price)}</strong><div className="shop-aroma-option-actions"><div className="shop-detail-quantity" aria-label={`Количество: ${aroma.name}`}><button type="button" aria-label={`Уменьшить количество ${aroma.name}`} onClick={() => changeQuantity(aroma.name, -1)}><Minus size={12} /></button><span>{quantity}</span><button type="button" aria-label={`Увеличить количество ${aroma.name}`} onClick={() => changeQuantity(aroma.name, 1)}><Plus size={12} /></button></div><AddToCartButton product={product} aroma={aroma.name} quantity={quantity} /></div></div>
          </article>;
        })()}
        {availableAromaOptions.length > 1 && <div className="shop-aroma-carousel-controls">
          <button type="button" aria-label="Предыдущий аромат" disabled={activeAromaIndex === 0} onClick={() => setActiveAromaIndex((index) => Math.max(0, index - 1))}><ChevronLeft size={18} /></button>
          <span>{activeAromaIndex + 1} / {availableAromaOptions.length}</span>
          <button type="button" aria-label="Следующий аромат" disabled={activeAromaIndex === availableAromaOptions.length - 1} onClick={() => setActiveAromaIndex((index) => Math.min(availableAromaOptions.length - 1, index + 1))}><ChevronRight size={18} /></button>
        </div>}
      </div>
    </section>}

    {!variantProduct && <div className="shop-product-detail-buy">
      <div className="shop-detail-main-price"><span>Цена</span><strong className="site-price">{formatPrice(product.price)}</strong></div>
      <div className="shop-aroma-option-actions"><div className="shop-detail-quantity" aria-label="Количество основного товара"><button type="button" aria-label="Уменьшить количество товара" onClick={() => changeQuantity('main', -1)}><Minus size={12} /></button><span>{mainQuantity}</span><button type="button" aria-label="Увеличить количество товара" onClick={() => changeQuantity('main', 1)}><Plus size={12} /></button></div><AddToCartButton product={product} aroma={product.aroma} quantity={mainQuantity} /></div>
    </div>}
    <CartToast />
  </>;
}
