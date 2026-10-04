'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from '@/components/ui/input-group';
import { authClient } from '@/lib/auth-client';
import { toast } from '@/components/ui/toast';
import { Checkbox } from '../ui/checkbox';
import { Spinner } from '../ui/spinner';
import { useParams } from 'next/navigation';

export function SignInForm() {
  const messagesT = useTranslations('messages');
  const t = useTranslations('sign-in');

  const params = useParams<{ locale: string }>();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const schema = z.object({
    email: z.email(t('email.invalid')),
    password: z
      .string()
      .trim()
      .min(8, t('password.invalid.min-length'))
      .regex(/[A-Z]/, t('password.invalid.uppercase'))
      .regex(/[a-z]/, t('password.invalid.lowercase'))
      .regex(/[0-9]/, t('password.invalid.number'))
      .regex(/[^A-Za-z0-9]/, t('password.invalid.special')),
    rememberMe: z.boolean()
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: { email: '', password: '', rememberMe: false }
  });

  const onSubmit = async ({ email, password, rememberMe }: z.infer<typeof schema>) => {
    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
        rememberMe
      });

      if (error) {
        toast.add({
          type: 'error',
          description: error.message
        });
        return;
      }

      router.replace('/', { locale: params.locale });
    } catch {
      toast.add({
        type: 'error',
        description: messagesT('unknown-error')
      });
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-sign-in-email">{t('email.label')}</FieldLabel>
                  <Input
                    {...field}
                    required
                    id="form-sign-in-email"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder={t('email.placeholder')}
                    autoComplete="email"
                  />
                  {fieldState.invalid && (
                    <FieldError id="form-sign-in-email-error" errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-sign-in-password">{t('password.label')}</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      required
                      id="form-sign-in-password"
                      type={showPassword ? 'text' : 'password'}
                      aria-invalid={fieldState.invalid}
                      placeholder={t('password.placeholder')}
                      autoComplete="current-password"
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        aria-label={t(showPassword ? 'hide-password' : 'show-password')}
                        title={t(showPassword ? 'hide-password' : 'show-password')}
                        size="icon-xs"
                        onClick={() => {
                          setShowPassword((prev) => !prev);
                        }}
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError id="form-sign-in-password-error" errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="rememberMe"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} orientation="horizontal">
                  <Checkbox
                    id="form-sign-in-remember-me"
                    name={field.name}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldLabel htmlFor="form-sign-in-remember-me" className="leading-none">
                    {t('remember-me')}
                  </FieldLabel>
                </Field>
              )}
            />
            <Button
              type="submit"
              id="form-sign-in-submit"
              className="w-full"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? <Spinner /> : t('submit')}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
