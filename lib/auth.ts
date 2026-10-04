import { betterAuth, BetterAuthOptions } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { getPrisma } from './prisma';
import { admin } from 'better-auth/plugins';

export const authOptions = {
  emailAndPassword: {
    enabled: true,
    disableSignUp: true
  },
  plugins: [admin()],
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
