import { Menu, ShoppingBag } from 'lucide-react';
import { LanguageSwitcher } from '@/components/language-switcher';

const links = [
  ['/services', 'Услуги'],
  ['/shop', 'Магазин'],
  ['/delivery', 'Доставка'],
  ['/contacts', 'Контакты'],
  ['/about', 'Обо мне'],
];

export function SiteHeader() {
  return <header className="site-header">
    <a className="wordmark" href="/" aria-label="NUANCE — на главную">NUANCE<span>Permanent · Lashes · Brows</span></a>
    <nav className="desktop-nav" aria-label="Основная навигация">{links.map(([href,label]) => <a href={href} key={href}>{label}</a>)}</nav>
    <div className="header-actions">
      <a className="bag-link" href="/shop" aria-label="Корзина"><ShoppingBag size={18} strokeWidth={1.5}/><span>0</span></a>
      <LanguageSwitcher/>
      <details className="mobile-menu"><summary aria-label="Открыть меню"><Menu size={22}/></summary><nav>{links.map(([href,label]) => <a href={href} key={href}>{label}</a>)}</nav></details>
    </div>
  </header>;
}
