/// <reference types="cypress" />

import type { InstallationsResponse } from '../tasks/github-app';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      githubAppListInstallations(): Chainable<InstallationsResponse>;
      githubAppDeleteInstallation(installationId: number): Chainable<null>;
    }
  }
}

Cypress.Commands.add('githubAppListInstallations', () => {
  cy.task('githubAppListInstallations');
});

Cypress.Commands.add('githubAppDeleteInstallation', (installationId: number) => {
  cy.task('githubAppDeleteInstallation', installationId);
});

beforeEach(() => {
  cy.githubAppListInstallations().then((installations) => {
    cy.log(`Found ${installations.length} installations to delete.`);
    installations.forEach(({ id }) => {
      cy.githubAppDeleteInstallation(id);
    });
  });
});

export {};
