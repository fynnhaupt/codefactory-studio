'use client';

import { useForm } from 'react-hook-form';
import { useLocale, useTranslations } from 'next-intl';
import { Spinner } from '../ui/spinner';
import { GitHubIcon } from '../global/github-icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authClient } from '@/lib/auth-client';
import { getPathname } from '@/i18n/navigation';
import { toast } from '../ui/toast';
import { useSearchParamsError } from '@/hooks/global/search-params-error';

export function SignInForm() {
  const t = useTranslations('sign-in');
  const messagesT = useTranslations('messages');

  const form = useForm();
  const locale = useLocale();

  useSearchParamsError();

  const onSubmit = async () => {
    try {
      await authClient.signIn.social({
        provider: 'github',
        errorCallbackURL: getPathname({
          locale,
          href: '/sign-in'
        })
      });
    } catch {
      toast.add({
        type: 'error',
        description: messagesT('unknown-error')
      });
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Button
            type="submit"
            id="form-sign-in-submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Spinner />
            ) : (
              <>
                <GitHubIcon />
                {t('submit')}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
