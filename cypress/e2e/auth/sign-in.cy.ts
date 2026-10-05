const credentials = {
  email: 'some-name@example.com',
  name: 'Some Name',
  password: 'Some-random-password-123!'
};

function getForm() {
  return {
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

  it('redirects to github for social sign-in', () => {
    cy.visit('/en/sign-in');
    cy.get('#form-sign-in-submit').click();
    cy.url().should('include', 'github.com/login');
  });

  it('prevents submissions while a request is pending', () => {
    cy.intercept('POST', '/api/auth/sign-in/social', { delay: 4000 }).as('signIn');
    cy.visit('/en/sign-in');

    const form = getForm();
    form.submit().click().should('be.disabled');
    cy.wait('@signIn');
    form.submit().should('not.be.disabled');
  });

  it('handles network errors with a proper message', () => {
    cy.intercept('POST', '/api/auth/sign-in/social', { forceNetworkError: true }).as('signIn');
    cy.visit('/en/sign-in');

    const form = getForm();
    form.submit().click();
    cy.wait('@signIn');
    cy.contains('An unknown error occurred. Please try again.').should('be.visible');
    form.submit().should('not.be.disabled');
  });
});
