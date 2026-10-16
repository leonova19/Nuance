const footerLinks = [
  ['/services', 'Услуги'],
  ['/shop', 'Магазин'],
  ['/delivery', 'Доставка'],
  ['/contacts', 'Контакты'],
  ['/about', 'Обо мне'],
  ['/terms', 'Условия продажи'],
  ['/privacy', 'Политика конфиденциальности'],
];

export function SiteFooter(){
  return <footer>
    <a className="wordmark footer-logo" href="/">NUANCE<span>Permanent · Lashes · Brows</span></a>
    <p>© 2026 NUANCE. Все права защищены</p>
    <div className="footer-links">{footerLinks.map(([href,label]) => <a href={href} key={href}>{label}</a>)}</div>
  </footer>;
}
