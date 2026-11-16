import { getServiceGroups } from '@/lib/services/server';
import { ServicesClient } from './services-client';

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  return <ServicesClient groups={await getServiceGroups()} />;
}
