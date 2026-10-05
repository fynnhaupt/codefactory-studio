import { Auth, betterAuth, BetterAuthOptions } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { getPrisma } from './prisma';
import { admin } from 'better-auth/plugins';
import { i18n, locales } from '@better-auth/i18n';

const BETTER_AUTH_KEY = 'better-auth';

const globalForBetterAuth = global as unknown as {
  [BETTER_AUTH_KEY]?: AuthInstance;
};

export function getAuthOptions() {
  return {
    socialProviders: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!
      }
    },
    plugins: [
      admin(),
      i18n({
        translations: {
          en: locales.en
        }
      })
    ],
    database: prismaAdapter(getPrisma(), {
      provider: 'postgresql'
    }),
    advanced: {
      database: {
        joins: true
      }
    }
  } satisfies BetterAuthOptions;
}

export function getAuth() {
  const auth = globalForBetterAuth[BETTER_AUTH_KEY] || betterAuth(getAuthOptions());

  if (globalForBetterAuth[BETTER_AUTH_KEY] === undefined) {
    globalForBetterAuth[BETTER_AUTH_KEY] = auth;
  }

  return auth;
}

export type AuthInstance = Auth<ReturnType<typeof getAuthOptions>>;
