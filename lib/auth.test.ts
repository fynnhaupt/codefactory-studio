import { Auth, betterAuth, BetterAuthOptions } from 'better-auth';
import { testUtils } from 'better-auth/plugins';
import { getAuthOptions } from './auth';

const BETTER_AUTH_TEST_KEY = 'better-auth-test';

const globalForBetterAuthTest = global as unknown as {
  [BETTER_AUTH_TEST_KEY]?: AuthTestInstance;
};

export function getAuthTestOptions() {
  const options = getAuthOptions();

  return {
    ...options,
    plugins: [...(options.plugins ?? []), testUtils()]
  } satisfies BetterAuthOptions;
}

export function getAuthTest() {
  const authTest =
    globalForBetterAuthTest[BETTER_AUTH_TEST_KEY] || betterAuth(getAuthTestOptions());

  if (globalForBetterAuthTest[BETTER_AUTH_TEST_KEY] === undefined) {
    globalForBetterAuthTest[BETTER_AUTH_TEST_KEY] = authTest;
  }

  return authTest;
}

export type AuthTestInstance = Auth<ReturnType<typeof getAuthTestOptions>>;
