const legalLinks = [
  ['/terms', 'Условия продажи'],
  ['/privacy', 'Политика конфиденциальности'],
];

export function SiteFooter(){
  return <footer className="compact-footer">
    <div className="footer-main">
      <a className="wordmark footer-logo" href="/">NUANCE<span>Permanent · Lashes · Brows</span></a>
      <div className="footer-info">
        <a href="https://maps.google.com/?q=J%C3%B5hvi%2C+Tartu+p%C3%B5ik+2a" target="_blank" rel="noreferrer">Jõhvi, Tartu põik 2a, Estonia</a>
        <a href="mailto:nuancesupport@gmail.com">nuancesupport@gmail.com</a>
      </div>
      <div className="footer-legal">{legalLinks.map(([href,label]) => <a href={href} key={href}>{label}</a>)}</div>
      <p className="footer-copyright">© 2026 NUANCE</p>
    </div>
  </footer>;
}
