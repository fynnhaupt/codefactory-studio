import { createAuthClient } from 'better-auth/react';
import { adminClient } from 'better-auth/client/plugins';
import { inferAdditionalFields } from 'better-auth/client/plugins';
import type { AuthInstance } from '@/lib/auth';

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<AuthInstance>(), adminClient()]
});

export type Session = typeof authClient.$Infer.Session;
