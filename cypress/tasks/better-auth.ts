/// <reference types="cypress" />

import { getAuthTest } from '@/lib/auth.test';
import { getPrisma } from '@/lib/prisma';
import { User } from 'better-auth';
import { LoginResult, TestAuthOptions, TestCookie } from 'better-auth/plugins';

export interface TestHelpers {
  betterAuthCreateUser(overrides?: Partial<User> & Record<string, unknown>): Promise<User>;
  betterAuthCreateOrganization(
    overrides?: Record<string, unknown>
  ): Promise<Record<string, unknown> | null>;
  betterAuthSaveUser(user: User): Promise<User>;
  betterAuthSetUserPassword(opts: { user: User; password: string }): Promise<null>;
  betterAuthSaveOrganization(org: Record<string, unknown>): Promise<Record<string, unknown> | null>;
  betterAuthAddMember(opts: {
    userId: string;
    organizationId: string;
    role?: string;
  }): Promise<Record<string, unknown> | null>;
  betterAuthDeleteUser(userId: string): Promise<null>;
  betterAuthDeleteOrganization(orgId: string): Promise<null>;
  betterAuthLogin(opts: TestAuthOptions): Promise<LoginResult>;
  betterAuthGetAuthHeaders(opts: TestAuthOptions): Promise<Headers>;
  betterAuthGetCookies(
    opts: TestAuthOptions & {
      domain?: string;
    }
  ): Promise<TestCookie[]>;
  betterAuthGetOTP(identifier: string): Promise<string | undefined | null>;
  betterAuthClearOTPs(): Promise<null>;
  betterAuthCleanupUsers(): Promise<null>;
}

async function getTestUtils() {
  const ctx = await getAuthTest().$context;
  return ctx.test;
}

export function registerBetterAuthTasks(on: Cypress.PluginEvents) {
  const tasks = {
    betterAuthCreateUser: async (overrides) => {
      const testUtils = await getTestUtils();
      return testUtils.createUser(overrides);
    },
    betterAuthCreateOrganization: async (overrides) => {
      const testUtils = await getTestUtils();
      if (!testUtils.createOrganization) return null;
      return testUtils.createOrganization?.(overrides);
    },
    betterAuthSaveUser: async (user) => {
      const testUtils = await getTestUtils();
      return await testUtils.saveUser(user);
    },
    betterAuthSetUserPassword: async ({ user, password }) => {
      const ctx = await getAuthTest().$context;
      const hash = await ctx.password.hash(password);

      await ctx.internalAdapter.createAccount({
        accountId: user.id,
        providerId: 'credential',
        userId: user.id,
        password: hash
      });

      return null;
    },
    betterAuthSaveOrganization: async (org) => {
      const testUtils = await getTestUtils();
      if (!testUtils.saveOrganization) return null;
      return await testUtils.saveOrganization?.(org);
    },
    betterAuthAddMember: async (opts) => {
      const testUtils = await getTestUtils();
      if (!testUtils.addMember) return null;
      return await testUtils.addMember?.(opts);
    },
    betterAuthDeleteUser: async (userId) => {
      const testUtils = await getTestUtils();
      await testUtils.deleteUser(userId);
      return null;
    },
    betterAuthDeleteOrganization: async (orgId) => {
      const testUtils = await getTestUtils();
      await testUtils.deleteOrganization?.(orgId);
      return null;
    },
    betterAuthLogin: async (opts) => {
      const testUtils = await getTestUtils();
      return await testUtils.login(opts);
    },
    betterAuthGetAuthHeaders: async (opts) => {
      const testUtils = await getTestUtils();
      return await testUtils.getAuthHeaders(opts);
    },
    betterAuthGetCookies: async (opts) => {
      const testUtils = await getTestUtils();
      return await testUtils.getCookies(opts);
    },
    betterAuthGetOTP: async (identifier) => {
      const testUtils = await getTestUtils();
      if (!testUtils.getOTP) return null;
      return testUtils.getOTP?.(identifier);
    },
    betterAuthClearOTPs: async () => {
      const testUtils = await getTestUtils();
      testUtils.clearOTPs?.();
      return null;
    },
    betterAuthCleanupUsers: async () => {
      const testUtils = await getTestUtils();

      const users = await getPrisma().user.findMany({ select: { id: true } });
      for (const { id } of users) await testUtils.deleteUser(id);

      return null;
    }
  } satisfies TestHelpers;

  on('task', tasks);
}
