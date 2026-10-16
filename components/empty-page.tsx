import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export function EmptyPage() {
  return <main className="empty-page"><SiteHeader/><div aria-hidden="true" /><SiteFooter/></main>;
}
