import { testAuth } from '@/lib/auth.test';
import { User } from 'better-auth';
import { LoginResult, TestAuthOptions, TestCookie } from 'better-auth/plugins';

interface TestHelpers {
  createUser(overrides?: Partial<User> & Record<string, unknown>): Promise<User>;
  createOrganization(
    overrides?: Record<string, unknown>
  ): Promise<Record<string, unknown> | undefined>;
  saveUser(user: User): Promise<User>;
  saveOrganization(org: Record<string, unknown>): Promise<Record<string, unknown> | undefined>;
  addMember(opts: {
    userId: string;
    organizationId: string;
    role?: string;
  }): Promise<Record<string, unknown> | undefined>;
  deleteUser(userId: string): Promise<null>;
  deleteOrganization(orgId: string): Promise<null>;
  login(opts: TestAuthOptions): Promise<LoginResult>;
  getAuthHeaders(opts: TestAuthOptions): Promise<Headers>;
  getCookies(
    opts: TestAuthOptions & {
      domain?: string;
    }
  ): Promise<TestCookie[]>;
  getOTP(identifier: string): Promise<string | undefined>;
  clearOTPs(): Promise<null>;
}

async function getTestUtils() {
  const ctx = await testAuth.$context;
  return ctx.test;
}

export function registerBetterAuthTasks(on: Cypress.PluginEvents) {
  const tasks = {
    createUser: async (overrides) => {
      const testUtils = await getTestUtils();
      return testUtils.createUser(overrides);
    },
    createOrganization: async (overrides) => {
      const testUtils = await getTestUtils();
      return testUtils.createOrganization?.(overrides);
    },
    saveUser: async (user) => {
      const testUtils = await getTestUtils();
      return await testUtils.saveUser(user);
    },
    saveOrganization: async (org) => {
      const testUtils = await getTestUtils();
      return await testUtils.saveOrganization?.(org);
    },
    addMember: async (opts) => {
      const testUtils = await getTestUtils();
      return await testUtils.addMember?.(opts);
    },
    deleteUser: async (userId) => {
      const testUtils = await getTestUtils();
      await testUtils.deleteUser(userId);
      return null;
    },
    deleteOrganization: async (orgId) => {
      const testUtils = await getTestUtils();
      await testUtils.deleteOrganization?.(orgId);
      return null;
    },
    login: async (opts) => {
      const testUtils = await getTestUtils();
      return await testUtils.login(opts);
    },
    getAuthHeaders: async (opts) => {
      const testUtils = await getTestUtils();
      return await testUtils.getAuthHeaders(opts);
    },
    getCookies: async (opts) => {
      const testUtils = await getTestUtils();
      return await testUtils.getCookies(opts);
    },
    getOTP: async (identifier) => {
      const testUtils = await getTestUtils();
      return testUtils.getOTP?.(identifier);
    },
    clearOTPs: async () => {
      const testUtils = await getTestUtils();
      testUtils.clearOTPs?.();
      return null;
    }
  } satisfies TestHelpers;

  on('task', tasks);
}
