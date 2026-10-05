import { redirect } from '@/i18n/navigation';
import { getAuth } from '@/lib/auth';
import { headers } from 'next/headers';

export default async function Layout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;

  const session = await getAuth().api.getSession({ headers: await headers() });
  if (!session) redirect({ href: '/sign-in', locale });

  return <main>{children}</main>;
}
