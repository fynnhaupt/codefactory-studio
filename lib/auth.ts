import { betterAuth, BetterAuthOptions } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { getPrisma } from './prisma';
import { admin } from 'better-auth/plugins';
import { i18n, locales } from '@better-auth/i18n';

export const authOptions = {
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

export const auth = betterAuth(authOptions);
