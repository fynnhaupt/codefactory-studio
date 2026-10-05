/// <reference types="cypress" />

import { getGitHubApp } from '@/lib/github-app';
import type { Endpoints } from '@octokit/types';

export type InstallationsResponse = Endpoints['GET /app/installations']['response']['data'];

export interface TestHelpers {
  githubAppListInstallations(): Promise<InstallationsResponse>;
  githubAppDeleteInstallation(installationId: number): Promise<null>;
}

export function registerGitHubAppTasks(on: Cypress.PluginEvents) {
  const tasks = {
    githubAppListInstallations: async () => {
      const app = getGitHubApp();

      const installations = app.octokit.paginate.iterator(app.octokit.rest.apps.listInstallations, {
        per_page: 100
      });

      const allInstallations: InstallationsResponse = [];
      for await (const { data } of installations) allInstallations.push(...data);
      return allInstallations;
    },
    githubAppDeleteInstallation: async (installationId: number) => {
      const app = getGitHubApp();
      await app.octokit.rest.apps.deleteInstallation({ installation_id: installationId });
      return null;
    }
  } satisfies TestHelpers;

  on('task', tasks);
}
