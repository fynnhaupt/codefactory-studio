import './env';
import { defineConfig } from 'cypress';
import { registerBetterAuthTasks } from './cypress/tasks/better-auth';
import { registerGithubAppTasks } from './cypress/tasks/github-app';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    async setupNodeEvents(on, config) {
      registerBetterAuthTasks(on);
      registerGithubAppTasks(on);
      return config;
    }
  }
});
