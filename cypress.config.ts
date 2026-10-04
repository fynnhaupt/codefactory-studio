import { defineConfig } from 'cypress';
import { registerBetterAuthTasks } from './cypress/tasks/better-auth';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    async setupNodeEvents(on, config) {
      registerBetterAuthTasks(on);
      return config;
    }
  }
});
