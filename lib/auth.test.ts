import { testUtils } from 'better-auth/plugins';
import { authOptions } from './auth';
import { betterAuth } from 'better-auth';

export const testAuth = betterAuth({
  ...authOptions,
  plugins: [...authOptions.plugins, testUtils()]
});
