describe('CityHistoryWalks admin login', () => {
  const email = Cypress.env('ADMIN_EMAIL');
  const password = Cypress.env('ADMIN_PASSWORD');

  // If credentials are not provided, skip these tests rather than failing the suite.
  const shouldRun = Boolean(email && password);

  (shouldRun ? it : it.skip)('logs in as admin and opens the dashboard', function () {
    cy.visit('/admin/login');

    cy.get('input[formcontrolname="email"]').clear({ force: true }).type(email as string, {
      force: true
    });
    cy
      .get('input[formcontrolname="password"]')
      .clear({ force: true })
      .type(password as string, { log: false, force: true });
    cy.contains('button', 'Sign in').click();

    cy.url().should('include', '/admin/dashboard');
    cy.contains('Admin · CityHistoryWalks').should('be.visible');
    cy.contains('Tours').should('be.visible');
  });
});


