import { CFLogo } from '@/components/global/cf-logo';
import { ThemedParticles } from '@/components/global/themed-particles';
import { redirect } from '@/i18n/navigation';
import { getAuth } from '@/lib/auth';
import { headers } from 'next/headers';

export default async function Layout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;

  const session = await getAuth().api.getSession({ headers: await headers() });
  if (session) redirect({ href: '/', locale });

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center gap-y-12 px-4 py-12">
        <CFLogo className="h-12" />
        {children}
      </main>
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <ThemedParticles className="absolute inset-0" />
      </div>
    </>
  );
}
