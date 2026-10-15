import { SiteHeader } from '@/components/site-header';

export function EmptyPage() {
  return <main className="empty-page"><SiteHeader/><div aria-hidden="true" /></main>;
}
