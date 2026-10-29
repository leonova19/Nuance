import { Menu, X } from 'lucide-react';
import { LanguageSwitcher } from '@/components/language-switcher';
import { CartHeaderLink } from '@/components/cart-header-link';

const links = [
  ['/services', 'Услуги'],
  ['/courses', 'Курсы'],
  ['/shop', 'Магазин'],
  ['/delivery', 'Доставка'],
  ['/about', 'Обо мне'],
];

export function SiteHeader() {
  return <header className="site-header">
    <a className="wordmark" href="/" aria-label="NUANCE - на главную">NUANCE<span>Permanent · Lashes · Brows</span></a>
    <nav className="desktop-nav" aria-label="Основная навигация">{links.map(([href,label]) => <a href={href} key={href}>{label}</a>)}</nav>
    <div className="header-actions">
      <CartHeaderLink />
      <div className="desktop-language-switcher"><LanguageSwitcher/></div>
      <details className="mobile-menu">
        <summary aria-label="Открыть или закрыть меню">
          <span className="menu-open-icon"><Menu size={22}/></span>
          <span className="menu-close-icon"><X size={23}/></span>
        </summary>
        <div className="mobile-menu-panel">
          <nav aria-label="Мобильная навигация">{links.map(([href,label]) => <a href={href} key={href}>{label}</a>)}</nav>
          <div className="mobile-menu-language">
            <LanguageSwitcher/>
          </div>
        </div>
      </details>
    </div>
  </header>;
}
