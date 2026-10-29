import { ArrowLeft, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { ProductDetailActions } from '../product-detail-actions';
import { products } from '../products';

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find((item) => item.id === id);

  if (!product) notFound();

  return <main className="shop-product-detail-page">
    <SiteHeader />
    <section className="shop-product-detail-shell">
      <Link className="shop-product-back-link" href="/shop#catalog"><ArrowLeft size={15} /> Вернуться в магазин</Link>
      <article className="shop-product-detail">
        <div className="shop-product-detail-image"><img className={product.imageClass ?? ''} src={product.image} alt={product.name} /></div>
        <div className="shop-product-detail-info">
          <p className="shop-page-eyebrow">{product.label}</p>
          <h1>{product.name}</h1>
          {product.volume && <p className="shop-product-detail-volume">Объём · {product.volume}</p>}
          {product.description && product.id !== 'car-gift-set' && <p className="shop-product-detail-description">{product.description}</p>}
          {product.aromaNoteGroups && <section className="shop-product-notes shop-product-aroma-notes" aria-labelledby="product-notes-title">
            <p className="shop-detail-section-label" id="product-notes-title">Ноты аромата</p>
            {product.aromaNoteGroups.map((group, index) => <div className="shop-product-note-group" key={group.label ?? `notes-${index}`}>
              {group.label && <h2>{group.label}</h2>}
              <div className="shop-product-note-grid">{group.notes.map((note) => <div className="shop-aroma-note-tile" key={`${group.label ?? 'aroma'}-${note.name}`}><span>{note.name}</span>{note.image ? <img src={note.image} alt={note.name} loading="lazy" /> : <span className="shop-aroma-note-placeholder" aria-hidden="true" />}</div>)}</div>
            </div>)}
          </section>}
          {product.notes && <section className="shop-product-notes" aria-labelledby="product-notes-title">
            <p className="shop-detail-section-label" id="product-notes-title">Ноты аромата</p>
            <dl>{[
              ['Верхние ноты', product.notes.top],
              ['Ноты сердца', product.notes.heart],
              ['Базовые ноты', product.notes.base],
            ].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
          </section>}
          {product.aromaDescription && <details className="shop-product-aroma-description"><summary><span>Описание аромата</span><ChevronDown size={18} aria-hidden="true" /></summary><p>{product.aromaDescription}</p></details>}
          <ProductDetailActions product={product} />
        </div>
      </article>
      <section className="shop-product-accordions" aria-label="Информация о товаре">
        <details className="shop-product-accordion">
          <summary><span>Описание товара</span><ChevronDown size={18} aria-hidden="true" /></summary>
          <p>{product.fullDescription ?? product.description ?? (product.id === 'home-diffuser-250' ? 'Диффузор объёмом 250 мл предназначен для ароматизации помещений.' : `Товар «${product.name}» из категории «${product.label.toLowerCase()}».`)}</p>
          {product.fullDescriptionSections?.map((section, index) => <div className="shop-product-description-section" key={`${product.id}-description-${index}`}>
            {section.heading && <strong>{section.heading}</strong>}
            {section.text && <p>{section.text}</p>}
            {section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
          </div>)}
        </details>
        {product.includedItems && <details className="shop-product-accordion">
          <summary><span>Что входит в набор</span><ChevronDown size={18} aria-hidden="true" /></summary>
          <ul className="shop-product-detail-list">{product.includedItems.map((item) => <li key={item.name}><strong>{item.name}</strong><p>{item.description}</p></li>)}</ul>
        </details>}
        <details className="shop-product-accordion">
          <summary><span>Как использовать</span><ChevronDown size={18} aria-hidden="true" /></summary>
          {product.usageInstructions ? <ul className="shop-product-detail-list">{product.usageInstructions.map((item) => <li key={item.name}><strong>{item.name}</strong><p>{item.description}</p></li>)}</ul> : <p>{product.usage}</p>}
        </details>
        {product.composition && <details className="shop-product-accordion"><summary><span>Состав</span><ChevronDown size={18} aria-hidden="true" /></summary><p>{product.composition}</p></details>}
      </section>
    </section>
    <SiteFooter />
  </main>;
}
