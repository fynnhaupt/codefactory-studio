import { createAuthClient } from 'better-auth/react';
import { adminClient } from 'better-auth/client/plugins';
import { inferAdditionalFields } from 'better-auth/client/plugins';
import type { auth } from '@/lib/auth';

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>(), adminClient()]
});

export type Session = typeof authClient.$Infer.Session;
