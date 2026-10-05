import { CFLogo } from '@/components/global/cf-logo';
import { Particles } from '@/components/ui/particles';
import { redirect } from '@/i18n/navigation';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export default async function Layout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;

  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect({ href: '/', locale });

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center gap-y-12 px-4 py-12">
        <CFLogo className="h-12" />
        {children}
      </main>
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <Particles className="absolute inset-0" color="#000" />
      </div>
    </>
  );
}
