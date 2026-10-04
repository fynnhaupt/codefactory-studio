const credentials = {
  email: 'some-name@example.com',
  name: 'Some Name',
  password: 'Some-random-password-123!'
};

function getForm() {
  return {
    email: () => cy.get('#form-sign-in-email'),
    emailError: () => cy.get('#form-sign-in-email-error'),
    password: () => cy.get('#form-sign-in-password'),
    passwordError: () => cy.get('#form-sign-in-password-error'),
    rememberMe: () => cy.get('#form-sign-in-remember-me'),
    submit: () => cy.get('#form-sign-in-submit')
  };
}

describe('Sign In', () => {
  it('redirects guests to sign in', () => {
    cy.visit('/en');
    cy.location('pathname').should('eq', '/en/sign-in');
  });

  it('redirects signed-in users to dashboard', () => {
    cy.login(credentials);
    cy.visit('/en/sign-in');
    cy.location('pathname').should('eq', '/en');
  });

  it('redirects guests to dashboard after signing in, preserving the session after reload', () => {
    cy.createUser(credentials.password, {
      email: credentials.email,
      name: credentials.name
    });

    cy.visit('/en/sign-in');

    const form = getForm();
    form.email().type(credentials.email);
    form.password().type(credentials.password);
    form.submit().click();
    cy.location('pathname').should('eq', '/en');
    cy.reload();
    cy.location('pathname').should('eq', '/en');
  });

  it('validates email field', () => {
    cy.visit('/en/sign-in');

    const form = getForm();
    form.password().type(credentials.password).blur();
    form.passwordError().should('not.exist');

    form.email().type('invalid-email').blur();
    form.emailError().should('be.visible');
    form.submit().should('be.disabled');

    form.email().clear().type(credentials.email).blur();
    form.emailError().should('not.exist');
    form.submit().should('not.be.disabled');
  });

  it('validates password field', () => {
    cy.visit('/en/sign-in');

    const form = getForm();
    form.email().type(credentials.email).blur();
    form.emailError().should('not.exist');

    form.password().type('aaaaaaa').blur();
    form.passwordError().should('be.visible');
    form.submit().should('be.disabled');

    form.password().clear().type('aaaaaaaa').blur();
    form.passwordError().should('be.visible');
    form.submit().should('be.disabled');

    form.password().clear().type('AAAAAAAA').blur();
    form.passwordError().should('be.visible');
    form.submit().should('be.disabled');

    form.password().clear().type('AAAAAAAa').blur();
    form.passwordError().should('be.visible');
    form.submit().should('be.disabled');

    form.password().clear().type('AAAAAAa1').blur();
    form.passwordError().should('be.visible');
    form.submit().should('be.disabled');

    form.password().clear().type(credentials.password).blur();
    form.passwordError().should('not.exist');
    form.submit().should('not.be.disabled');
  });

  it('prevents submissions while a request is pending', () => {
    cy.intercept('POST', '/api/auth/sign-in/email').as('signIn');
    cy.visit('/en/sign-in');

    const form = getForm();
    form.email().type(credentials.email);
    form.password().type('Wrong-password-123!');
    form.submit().click().should('be.disabled');
    cy.wait('@signIn');
    form.submit().should('not.be.disabled');
  });

  it('handles network errors with a proper message', () => {
    cy.intercept('POST', '/api/auth/sign-in/email', { forceNetworkError: true }).as('signIn');
    cy.visit('/en/sign-in');

    const form = getForm();
    form.email().type(credentials.email);
    form.password().type(credentials.password);
    form.submit().click();
    cy.wait('@signIn');
    cy.contains('An unknown error occurred. Please try again.').should('be.visible');
  });
});
