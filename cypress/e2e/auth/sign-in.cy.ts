const credentials = (overrides: Record<string, unknown> = {}) =>
  cy.betterAuthCreateCredentialUser({
    user: { email: `auth-${Date.now()}@example.com`, name: 'Sign In User', ...overrides },
    password: 'correct-horse-battery'
  });

describe('sign in', () => {
  it('redirects guests to sign in and signed-in users home, preserving the session after reload', () => {
    cy.visit('/en');
    cy.location('pathname').should('eq', '/en/sign-in');

    credentials().then((user) => {
      cy.visit('/en/sign-in');
      cy.get('#email').type(user.email);
      cy.get('#password').type('correct-horse-battery');
      cy.get('button[type="submit"]').click();
      cy.location('pathname').should('eq', '/en');
      cy.reload();
      cy.location('pathname').should('eq', '/en');
      cy.visit('/en/sign-in');
      cy.location('pathname').should('eq', '/en');
    });
  });

  it('validates fields before requesting and updates field errors as values change', () => {
    cy.intercept('POST', '/api/auth/sign-in/email').as('signIn');
    cy.visit('/en/sign-in');
    cy.get('button[type="submit"]').click();
    cy.contains('Enter a valid email address.').should('be.visible');
    cy.contains('Enter your password.').should('be.visible');
    cy.get('@signIn.all').should('have.length', 0);

    cy.get('#email').type('person@example.com');
    cy.get('#password').type('password');
    cy.contains('Enter a valid email address.').should('not.exist');
    cy.contains('Enter your password.').should('not.exist');
  });

  it('prevents duplicate submissions while the request is pending', () => {
    let requests = 0;
    cy.intercept('POST', '/api/auth/sign-in/email', (request) => {
      requests += 1;
      request.reply({
        delay: 300,
        statusCode: 401,
        body: { code: 'INVALID_EMAIL_OR_PASSWORD', message: 'Invalid email or password' }
      });
    }).as('signIn');
    cy.visit('/en/sign-in');
    cy.get('#email').type('person@example.com');
    cy.get('#password').type('wrong-password');
    cy.get('form').then(($form) => {
      const form = $form[0] as HTMLFormElement;
      form.requestSubmit();
      form.requestSubmit();
    });
    cy.get('button[type="submit"]').should('be.disabled');
    cy.wait('@signIn');
    cy.then(() => expect(requests).to.eq(1));
  });

  it('shows the same invalid-credentials toast for a wrong password and an unknown email', () => {
    cy.intercept('POST', '/api/auth/sign-in/email').as('invalidAttempt');

    credentials().then((user) => {
      cy.visit('/en/sign-in');
      cy.get('#email').type(user.email);
      cy.get('#password').type('wrong-password');
      cy.get('button[type="submit"]').click();
      cy.wait('@invalidAttempt').its('response.statusCode').should('eq', 401);
      cy.contains('The email or password is incorrect.').should('be.visible');

      cy.get('[data-slot="toast-close"]').click();
      cy.contains('The email or password is incorrect.').should('not.exist');
      cy.get('#email').clear().type(`unknown-${Date.now()}@example.com`);
      cy.get('#password').clear().type('correct-horse-battery');
      cy.get('button[type="submit"]').click();
      cy.wait('@invalidAttempt').its('response.statusCode').should('eq', 401);
      cy.contains('The email or password is incorrect.').should('be.visible');
    });
  });

  it('distinguishes a network failure from invalid credentials', () => {
    cy.intercept('POST', '/api/auth/sign-in/email', { forceNetworkError: true });
    cy.visit('/en/sign-in');
    cy.get('#email').type('person@example.com');
    cy.get('#password').type('wrong-password');
    cy.get('button[type="submit"]').click();
    cy.contains("We couldn't reach the server. Check your connection and try again.").should(
      'be.visible'
    );
  });

  it('supports autofill, password visibility, and Enter submission', () => {
    cy.intercept('POST', '/api/auth/sign-in/email', {
      statusCode: 401,
      body: { code: 'INVALID_EMAIL_OR_PASSWORD', message: 'Invalid email or password' }
    });
    cy.visit('/en/sign-in');
    cy.get('#email').should('have.attr', 'autocomplete', 'email');
    cy.get('#password').should('have.attr', 'autocomplete', 'current-password');
    cy.get('#email').type('person@example.com');
    cy.get('#password').type('wrong-password');
    cy.get('button[aria-label="Show password"]').click();
    cy.get('#password').should('have.attr', 'type', 'text');
    cy.get('button[aria-label="Hide password"]').click();
    cy.get('#password').should('have.attr', 'type', 'password').type('{enter}');
    cy.contains('The email or password is incorrect.').should('be.visible');
  });

  it('rejects public sign-up while the admin create-user endpoint remains available', () => {
    cy.request({
      method: 'POST',
      url: '/api/auth/sign-up/email',
      failOnStatusCode: false,
      body: { name: 'Public User', email: 'public@example.com', password: 'correct-horse-battery' }
    }).then(({ status, body }) => {
      expect(status).to.eq(400);
      expect(body.code).to.eq('EMAIL_PASSWORD_SIGN_UP_DISABLED');
    });

    credentials({ role: 'admin', email: 'admin@example.com' }).then((admin) => {
      cy.visit('/en/sign-in');
      cy.get('#email').type(admin.email);
      cy.get('#password').type('correct-horse-battery');
      cy.get('button[type="submit"]').click();
      cy.location('pathname').should('eq', '/en');
      cy.request({
        method: 'POST',
        url: '/api/auth/admin/create-user',
        body: {
          name: 'Provisioned User',
          email: `provisioned-${Date.now()}@example.com`,
          password: 'correct-horse-battery'
        }
      })
        .its('status')
        .should('eq', 200);
    });
  });
});
