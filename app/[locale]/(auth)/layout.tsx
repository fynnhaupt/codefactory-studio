import { redirect } from '@/i18n/navigation';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export default async function Layout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;

  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect({ href: '/', locale });

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">{children}</main>
  );
}
