import { headers } from 'next/headers';
import { redirect } from '@/i18n/navigation';
import { auth } from '@/lib/auth';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect({ href: '/sign-in', locale });
  }

  return <main className="mx-auto max-w-5xl p-8">Home</main>;
}
