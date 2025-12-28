describe('CityHistoryWalks admin tours CRUD', () => {
  const email = Cypress.env('ADMIN_EMAIL');
  const password = Cypress.env('ADMIN_PASSWORD');

  const shouldRun = Boolean(email && password);

  // With the current routing, /admin/tours is a redirect alias for /admin/dashboard.
  (shouldRun ? it : it.skip)('redirects /admin/tours to the admin dashboard after login', () => {
    // Login
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

    // Navigate to /admin/tours and verify redirect to dashboard
    cy.visit('/admin/tours');
    cy.url().should('include', '/admin/dashboard');
    cy.contains('Admin · CityHistoryWalks').should('be.visible');
  });
});


