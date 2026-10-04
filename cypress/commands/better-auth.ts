/// <reference types="cypress" />

import { User } from 'better-auth';
import { LoginResult, TestAuthOptions, TestCookie } from 'better-auth/plugins';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      createUser(
        password: string,
        overrides?: Partial<User> & Record<string, unknown>
      ): Chainable<null>;
      login(overrides?: Partial<User> & Record<string, unknown>, reload?: boolean): Chainable<null>;
      logout(reload?: boolean): Chainable<null>;
      betterAuthCreateUser(overrides?: Partial<User> & Record<string, unknown>): Chainable<User>;
      betterAuthCreateOrganization(
        overrides?: Record<string, unknown>
      ): Chainable<Record<string, unknown> | null>;
      betterAuthSaveUser(user: User): Chainable<User>;
      betterAuthSetUserPassword(opts: { user: User; password: string }): Chainable<null>;
      betterAuthSaveOrganization(
        org: Record<string, unknown>
      ): Chainable<Record<string, unknown> | null>;
      betterAuthAddMember(opts: {
        userId: string;
        organizationId: string;
        role?: string;
      }): Chainable<Record<string, unknown> | null>;
      betterAuthDeleteUser(userId: string): Chainable<null>;
      betterAuthDeleteOrganization(orgId: string): Chainable<null>;
      betterAuthLogin(opts: TestAuthOptions): Chainable<LoginResult>;
      betterAuthGetAuthHeaders(opts: TestAuthOptions): Chainable<Headers>;
      betterAuthGetCookies(
        opts: TestAuthOptions & {
          domain?: string;
        }
      ): Chainable<TestCookie[]>;
      betterAuthGetOTP(identifier: string): Chainable<string | undefined | null>;
      betterAuthClearOTPs(): Chainable<null>;
    }
  }
}

Cypress.Commands.add('createUser', (password, overrides) => {
  cy.betterAuthCreateUser(overrides).then((user) => {
    cy.betterAuthSaveUser(user);
    cy.betterAuthSetUserPassword({ user, password });
    cy.wrap(null);
  });
});

Cypress.Commands.add('login', (overrides, reload = false) => {
  cy.betterAuthCreateUser(overrides).then((user) => {
    cy.betterAuthSaveUser(user);
    cy.betterAuthGetCookies({
      userId: user.id,
      domain: 'localhost'
    }).then((cookies) => {
      const convertSameSite = (sameSite?: string) => {
        switch (sameSite?.toLowerCase()) {
          case 'strict':
            return 'strict';
          case 'none':
            return 'no_restriction';
          case 'lax':
            return 'lax';
          default:
            return undefined;
        }
      };

      for (const { name, value, ...options } of cookies) {
        const sameSite = convertSameSite(options.sameSite);
        cy.setCookie(name, value, {
          ...options,
          secure: options.secure || sameSite === 'no_restriction',
          sameSite,
          expiry: options.expires
        });
      }

      if (reload) cy.reload();
    });
  });

  return cy.wrap(null);
});

Cypress.Commands.add('logout', (reload = false) => {
  cy.clearCookie('better-auth.session_token');
  if (reload) cy.reload();
});

Cypress.Commands.add('betterAuthCreateUser', (overrides) => {
  cy.task('betterAuthCreateUser', overrides);
});

Cypress.Commands.add('betterAuthCreateOrganization', (overrides) => {
  cy.task('betterAuthCreateOrganization', overrides);
});

Cypress.Commands.add('betterAuthSaveUser', (user) => {
  cy.task('betterAuthSaveUser', user);
});

Cypress.Commands.add('betterAuthSetUserPassword', (opts) => {
  cy.task('betterAuthSetUserPassword', opts);
});

Cypress.Commands.add('betterAuthSaveOrganization', (org) => {
  cy.task('betterAuthSaveOrganization', org);
});

Cypress.Commands.add('betterAuthAddMember', (opts) => {
  cy.task('betterAuthAddMember', opts);
});

Cypress.Commands.add('betterAuthDeleteUser', (userId) => {
  cy.task('betterAuthDeleteUser', userId);
});

Cypress.Commands.add('betterAuthDeleteOrganization', (orgId) => {
  cy.task('betterAuthDeleteOrganization', orgId);
});

Cypress.Commands.add('betterAuthLogin', (opts) => {
  cy.task('betterAuthLogin', opts);
});

Cypress.Commands.add('betterAuthGetAuthHeaders', (opts) => {
  cy.task('betterAuthGetAuthHeaders', opts);
});

Cypress.Commands.add('betterAuthGetCookies', (opts) => {
  cy.task('betterAuthGetCookies', opts);
});

Cypress.Commands.add('betterAuthGetOTP', (identifier) => {
  cy.task('betterAuthGetOTP', identifier);
});

Cypress.Commands.add('betterAuthClearOTPs', () => {
  cy.task('betterAuthClearOTPs');
});

beforeEach(() => {
  cy.task('betterAuthCleanupUsers');
});

export {};
