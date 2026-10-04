'use client';

import { useRef, useState, type FormEvent } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon } from '@/components/ui/input-group';
import { authClient } from '@/lib/auth-client';
import { toast } from '@/components/ui/toast';

type Props = { locale: string };
type Credentials = { email: string; password: string };

export function SignInForm({ locale }: Props) {
  const t = useTranslations('SignIn');
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const submissionLock = useRef(false);
  const schema = z.object({
    email: z.email(t('emailInvalid')),
    password: z.string().min(1, t('passwordRequired'))
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<Credentials>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: { email: '', password: '' }
  });

  const onSubmit = async ({ email, password }: Credentials) => {
    try {
      const result = await authClient.signIn.email({
        email,
        password,
        callbackURL: `/${locale}`
      });

      if (result.error) {
        const code = result.error.code?.toUpperCase();
        toast.add({
          title: t(
            code === 'INVALID_EMAIL_OR_PASSWORD' ? 'invalidCredentialsTitle' : 'requestFailedTitle'
          ),
          description: t(
            code === 'INVALID_EMAIL_OR_PASSWORD' ? 'invalidCredentials' : 'requestFailed'
          ),
          type: 'error'
        });
        return;
      }

      router.replace('/', { locale });
    } catch {
      toast.add({
        title: t('networkErrorTitle'),
        description: t('networkError'),
        type: 'error'
      });
    }
  };

  const onFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    if (submissionLock.current) {
      event.preventDefault();
      return;
    }

    submissionLock.current = true;
    try {
      await handleSubmit(onSubmit)(event);
    } finally {
      submissionLock.current = false;
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form noValidate onSubmit={onFormSubmit}>
          <FieldGroup>
            <Field data-invalid={Boolean(errors.email) || undefined}>
              <FieldLabel htmlFor="email">{t('email')}</FieldLabel>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
                {...register('email')}
              />
              {errors.email && (
                <FieldDescription id="email-error" role="alert">
                  {errors.email.message}
                </FieldDescription>
              )}
            </Field>
            <Field data-invalid={Boolean(errors.password) || undefined}>
              <FieldLabel htmlFor="password">{t('password')}</FieldLabel>
              <InputGroup>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="pr-12"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  {...register('password')}
                />
                <InputGroupAddon>
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground focus-visible:ring-ring flex size-8 items-center justify-center rounded-md focus-visible:ring-2 focus-visible:outline-none"
                    aria-label={showPassword ? t('hidePassword') : t('showPassword')}
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((visible) => !visible)}
                  >
                    {showPassword ? (
                      <EyeOff aria-hidden="true" size={18} />
                    ) : (
                      <Eye aria-hidden="true" size={18} />
                    )}
                  </button>
                </InputGroupAddon>
              </InputGroup>
              {errors.password && (
                <FieldDescription id="password-error" role="alert">
                  {errors.password.message}
                </FieldDescription>
              )}
            </Field>
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting && <LoaderCircle className="animate-spin" aria-hidden="true" />}
              {isSubmitting ? t('submitting') : t('submit')}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
