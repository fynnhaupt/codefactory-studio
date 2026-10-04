import { headers } from 'next/headers';
import { redirect } from '@/i18n/navigation';
import { SignInForm } from '@/components/auth/sign-in-form';
import { auth } from '@/lib/auth';

export default async function SignInPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    redirect({ href: '/', locale });
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <SignInForm locale={locale} />
    </main>
  );
}
